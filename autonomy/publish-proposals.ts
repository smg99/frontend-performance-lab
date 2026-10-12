import { isDeepStrictEqual } from 'node:util'
import { z } from 'zod'
import { discoveryCandidateSchema } from './discovery'
import { createDraftPullRequest, type ProposalContext } from './proposals'
import { discoverySources } from './sources'

const proposalPayloadSchema = z.strictObject({
  idempotencyKey: z.string().regex(/^[a-f0-9]{64}$/),
  branchName: z.string().regex(/^autonomy\/proposal-[a-f0-9]{12}$/),
  title: z.string().min(1),
  body: z.string().min(1),
  files: z
    .array(
      z.strictObject({
        path: z.string().min(1),
        content: z.string()
      })
    )
    .length(1),
  labels: z.array(z.string().min(1)).min(1),
  draft: z.literal(true)
})

export interface ProposalGitHubClient {
  request<T>(method: 'GET' | 'POST', endpoint: string, body?: unknown): Promise<T>
}

export interface ProposalRepository {
  nameWithOwner: string
  defaultBranch: string
}

export interface PublishedProposal {
  branchName: string
  pullRequestUrl: string
  status: 'created' | 'already-exists'
}

const shaSchema = z.string().min(1)

export async function publishProposalPayloads(
  untrustedPayloads: unknown,
  repository: ProposalRepository,
  context: ProposalContext,
  client: ProposalGitHubClient
): Promise<PublishedProposal[]> {
  const [owner, repo] = repository.nameWithOwner.split('/')
  if (!owner || !repo || repository.nameWithOwner.split('/').length !== 2)
    throw new Error(`invalid repository name: ${repository.nameWithOwner}`)
  if (
    !/^[A-Za-z0-9._/-]+$/.test(repository.defaultBranch) ||
    repository.defaultBranch.startsWith('/') ||
    repository.defaultBranch.endsWith('/') ||
    repository.defaultBranch.includes('..') ||
    repository.defaultBranch.includes('//')
  )
    throw new Error(`unsupported default branch name: ${repository.defaultBranch}`)

  const payloads = z.array(proposalPayloadSchema).parse(untrustedPayloads)
  const validatedPayloads = payloads.map(payload => {
    if (payload.branchName !== `autonomy/proposal-${payload.idempotencyKey.slice(0, 12)}`)
      throw new Error(`branch does not match idempotency key: ${payload.branchName}`)

    const content = z
      .object({
        candidate: z.unknown(),
        draft: z.unknown(),
        idempotencyKey: z.string()
      })
      .parse(JSON.parse(payload.files[0].content))
    const candidate = discoveryCandidateSchema.parse(content.candidate)
    const source = discoverySources.find(item => item.id === candidate.sourceId)
    if (
      !source ||
      candidate.sourceFeedUrl !== source.url ||
      candidate.publisher !== source.publisher ||
      candidate.evidenceType !== source.evidenceType ||
      !source.evidenceHosts.includes(new URL(candidate.evidenceUrl).hostname)
    )
      throw new Error(`proposal evidence is not allowlisted: ${candidate.id}`)
    if (content.idempotencyKey !== payload.idempotencyKey)
      throw new Error(`proposal content idempotency key mismatch: ${payload.branchName}`)
    const expected = createDraftPullRequest(candidate, content.draft, context)
    if (!isDeepStrictEqual(expected, payload))
      throw new Error(`proposal payload does not match validated content: ${payload.branchName}`)
    return payload
  })

  const results: PublishedProposal[] = []
  for (const payload of validatedPayloads) {
    const existingPullRequests = z
      .array(
        z.object({
          number: z.number().int().positive(),
          html_url: z.string().url(),
          state: z.enum(['open', 'closed'])
        })
      )
      .parse(
        await client.request(
          'GET',
          `repos/${repository.nameWithOwner}/pulls?state=all&head=${encodeURIComponent(`${owner}:${payload.branchName}`)}`
        )
      )
    if (existingPullRequests.length > 1)
      throw new Error(`multiple pull requests already use branch ${payload.branchName}`)

    const existingPullRequest = existingPullRequests[0]
    if (existingPullRequest) {
      if (existingPullRequest.state === 'open') {
        await client.request(
          'POST',
          `repos/${repository.nameWithOwner}/issues/${existingPullRequest.number}/labels`,
          { labels: payload.labels }
        )
      }
      results.push({
        branchName: payload.branchName,
        pullRequestUrl: existingPullRequest.html_url,
        status: 'already-exists'
      })
      continue
    }

    const branchRef = z
      .array(
        z.object({
          ref: z.string(),
          object: z.object({ sha: shaSchema })
        })
      )
      .parse(
        await client.request(
          'GET',
          `repos/${repository.nameWithOwner}/git/matching-refs/heads/${payload.branchName}`
        )
      )
      .find(ref => ref.ref === `refs/heads/${payload.branchName}`)

    let baseTreeSha: string
    if (branchRef) {
      const existingCommit = z
        .object({
          tree: z.object({ sha: shaSchema }),
          parents: z.array(z.object({ sha: shaSchema }))
        })
        .parse(
          await client.request(
            'GET',
            `repos/${repository.nameWithOwner}/git/commits/${branchRef.object.sha}`
          )
        )
      if (!existingCommit.parents[0])
        throw new Error(`existing proposal branch has no parent: ${payload.branchName}`)
      const parentCommitSha = existingCommit.parents[0].sha
      const comparison = z
        .object({ ahead_by: z.number().int().nonnegative() })
        .parse(
          await client.request(
            'GET',
            `repos/${repository.nameWithOwner}/compare/${encodeURIComponent(repository.defaultBranch)}...${parentCommitSha}`
          )
        )
      if (comparison.ahead_by !== 0)
        throw new Error(
          `existing proposal branch is not based on the default branch: ${payload.branchName}`
        )
      baseTreeSha = z
        .object({ tree: z.object({ sha: shaSchema }) })
        .parse(
          await client.request(
            'GET',
            `repos/${repository.nameWithOwner}/git/commits/${parentCommitSha}`
          )
        ).tree.sha
      const expectedTreeSha = z.object({ sha: shaSchema }).parse(
        await client.request('POST', `repos/${repository.nameWithOwner}/git/trees`, {
          base_tree: baseTreeSha,
          tree: payload.files.map(file => ({
            path: file.path,
            mode: '100644',
            type: 'blob',
            content: file.content
          }))
        })
      ).sha
      if (expectedTreeSha !== existingCommit.tree.sha)
        throw new Error(`existing proposal branch has different content: ${payload.branchName}`)
    } else {
      const parentCommitSha = z
        .object({ object: z.object({ sha: shaSchema }) })
        .parse(
          await client.request(
            'GET',
            `repos/${repository.nameWithOwner}/git/ref/heads/${repository.defaultBranch}`
          )
        ).object.sha
      baseTreeSha = z
        .object({ tree: z.object({ sha: shaSchema }) })
        .parse(
          await client.request(
            'GET',
            `repos/${repository.nameWithOwner}/git/commits/${parentCommitSha}`
          )
        ).tree.sha
      const treeSha = z.object({ sha: shaSchema }).parse(
        await client.request('POST', `repos/${repository.nameWithOwner}/git/trees`, {
          base_tree: baseTreeSha,
          tree: payload.files.map(file => ({
            path: file.path,
            mode: '100644',
            type: 'blob',
            content: file.content
          }))
        })
      ).sha
      const commitSha = z.object({ sha: shaSchema }).parse(
        await client.request('POST', `repos/${repository.nameWithOwner}/git/commits`, {
          message: payload.title,
          tree: treeSha,
          parents: [parentCommitSha]
        })
      ).sha
      await client.request('POST', `repos/${repository.nameWithOwner}/git/refs`, {
        ref: `refs/heads/${payload.branchName}`,
        sha: commitSha
      })
    }

    const pullRequest = z
      .object({
        number: z.number().int().positive(),
        html_url: z.string().url()
      })
      .parse(
        await client.request('POST', `repos/${repository.nameWithOwner}/pulls`, {
          title: payload.title,
          head: payload.branchName,
          base: repository.defaultBranch,
          body: payload.body,
          draft: true
        })
      )
    await client.request(
      'POST',
      `repos/${repository.nameWithOwner}/issues/${pullRequest.number}/labels`,
      { labels: payload.labels }
    )
    results.push({
      branchName: payload.branchName,
      pullRequestUrl: pullRequest.html_url,
      status: 'created'
    })
  }

  return results
}
