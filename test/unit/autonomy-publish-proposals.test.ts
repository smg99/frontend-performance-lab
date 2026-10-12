import { describe, expect, it } from 'vitest'
import { createDraftPullRequest } from '../../autonomy/proposals'
import {
  publishProposalPayloads,
  type ProposalGitHubClient
} from '../../autonomy/publish-proposals'

const candidate = {
  id: 'web-dev-feed:entry:hash',
  sourceId: 'web-dev-feed',
  sourceFeedUrl: 'https://web.dev/feed.xml',
  evidenceUrl: 'https://web.dev/articles/example',
  evidenceTitle: 'Measuring a new rendering metric',
  publisher: 'Google web.dev',
  evidenceType: 'vendor-guidance' as const,
  publishedAt: '2026-09-20',
  matchedTopics: ['performance'],
  relevanceScore: 40,
  evidenceHash: 'evidence-hash',
  sourceContentHash: 'source-hash',
  discoveredAt: '2026-09-20T00:00:00.000Z',
  reason: 'new-entry' as const
}

const draft = {
  kind: 'experiment' as const,
  id: 'rendering-measurement',
  title: 'Rendering measurement',
  summary: 'A controlled lab exercise comparing repeatable rendering workloads.',
  tags: ['rendering', 'measurement'],
  citations: [
    {
      claim: 'The metric can be captured during rendering tests.',
      evidenceUrl: candidate.evidenceUrl,
      confidence: 'medium' as const
    }
  ],
  uncertainty: ['Browser support and stable thresholds still require verification.'],
  hypothesis: 'The metric identifies rendering delays that existing aggregate metrics obscure.',
  metrics: ['new rendering metric', 'LCP']
}

const context = { existingIds: [], existingTitles: [] }
const payload = createDraftPullRequest(candidate, draft, context)
const repository = { nameWithOwner: 'smg99/frontend-performance-lab', defaultBranch: 'main' }

function githubClient(
  overrides: Partial<ProposalGitHubClient> = {}
): ProposalGitHubClient & { calls: { method: string; endpoint: string; body?: unknown }[] } {
  const calls: { method: string; endpoint: string; body?: unknown }[] = []
  const client: ProposalGitHubClient = {
    request: async <T>(method: 'GET' | 'POST', endpoint: string, body?: unknown) => {
      calls.push({ method, endpoint, body })

      if (endpoint.includes('/pulls?state=all&head=')) return [] as T
      if (endpoint.endsWith(`/git/matching-refs/heads/${payload.branchName}`)) return [] as T
      if (endpoint.endsWith('/git/ref/heads/main')) return { object: { sha: 'base-commit' } } as T
      if (endpoint.endsWith('/git/commits/base-commit')) return { tree: { sha: 'base-tree' } } as T
      if (endpoint.endsWith('/git/trees')) return { sha: 'proposal-tree' } as T
      if (endpoint.endsWith('/git/commits') && method === 'POST')
        return { sha: 'proposal-commit' } as T
      if (endpoint.endsWith('/git/refs') && method === 'POST') return {} as T
      if (endpoint.endsWith('/pulls') && method === 'POST')
        return {
          number: 42,
          html_url: 'https://github.com/smg99/frontend-performance-lab/pull/42'
        } as T
      if (endpoint.endsWith('/issues/42/labels') && method === 'POST') return [] as T

      throw new Error(`unexpected GitHub request: ${method} ${endpoint}`)
    },
    ...overrides
  }

  return Object.assign(client, { calls })
}

describe('autonomous proposal publishing', () => {
  it('creates a GitHub draft pull request from a validated payload', async () => {
    const client = githubClient()

    const results = await publishProposalPayloads([payload], repository, context, client)

    expect(results).toEqual([
      {
        branchName: payload.branchName,
        pullRequestUrl: 'https://github.com/smg99/frontend-performance-lab/pull/42',
        status: 'created'
      }
    ])
    expect(client.calls).toContainEqual({
      method: 'POST',
      endpoint: 'repos/smg99/frontend-performance-lab/pulls',
      body: {
        title: payload.title,
        head: payload.branchName,
        base: 'main',
        body: payload.body,
        draft: true
      }
    })
    expect(client.calls).toContainEqual({
      method: 'POST',
      endpoint: 'repos/smg99/frontend-performance-lab/issues/42/labels',
      body: { labels: payload.labels }
    })
    expect(client.calls.findIndex(call => call.endpoint.endsWith('/git/refs'))).toBeLessThan(
      client.calls.findIndex(call => call.endpoint.endsWith('/pulls'))
    )
  })

  it('reuses an existing pull request without creating another branch or pull request', async () => {
    const client = githubClient({
      request: async <T>(method: 'GET' | 'POST', endpoint: string, body?: unknown) => {
        client.calls.push({ method, endpoint, body })
        if (endpoint.includes('/pulls?state=all&head='))
          return [
            {
              number: 42,
              html_url: 'https://github.com/smg99/frontend-performance-lab/pull/42',
              state: 'open'
            }
          ] as T
        if (endpoint.endsWith('/issues/42/labels') && method === 'POST') return [] as T
        throw new Error(`unexpected GitHub request: ${method} ${endpoint}`)
      }
    })

    const results = await publishProposalPayloads([payload], repository, context, client)

    expect(results[0].status).toBe('already-exists')
    expect(client.calls.some(call => call.endpoint.endsWith('/git/refs'))).toBe(false)
    expect(
      client.calls.some(call => call.endpoint.endsWith('/pulls') && call.method === 'POST')
    ).toBe(false)
    expect(client.calls).toContainEqual({
      method: 'POST',
      endpoint: 'repos/smg99/frontend-performance-lab/issues/42/labels',
      body: { labels: payload.labels }
    })
  })

  it('rejects malformed payloads before making GitHub requests', async () => {
    const client = githubClient()

    await expect(
      publishProposalPayloads(
        [{ ...payload, files: [{ path: '../outside.json', content: 'nope' }] }],
        repository,
        context,
        client
      )
    ).rejects.toThrow()
    expect(client.calls).toHaveLength(0)
  })

  it('refuses to reuse an idempotent branch if its content does not match the payload', async () => {
    const client = githubClient({
      request: async <T>(method: 'GET' | 'POST', endpoint: string, body?: unknown) => {
        client.calls.push({ method, endpoint, body })
        if (endpoint.includes('/pulls?state=all&head=')) return [] as T
        if (endpoint.endsWith(`/git/matching-refs/heads/${payload.branchName}`))
          return [
            {
              ref: `refs/heads/${payload.branchName}`,
              object: { sha: 'other-commit' }
            }
          ] as T
        if (endpoint.endsWith('/git/commits/other-commit'))
          return { tree: { sha: 'different-tree' }, parents: [{ sha: 'parent-commit' }] } as T
        if (endpoint.includes('/compare/main...parent-commit')) return { ahead_by: 0 } as T
        if (endpoint.endsWith('/git/commits/parent-commit'))
          return { tree: { sha: 'parent-tree' } } as T
        if (endpoint.endsWith('/git/trees')) return { sha: 'proposal-tree' } as T
        throw new Error(`unexpected GitHub request: ${method} ${endpoint}`)
      }
    })

    await expect(publishProposalPayloads([payload], repository, context, client)).rejects.toThrow(
      'existing proposal branch has different content'
    )
    expect(client.calls.some(call => call.endpoint.endsWith('/git/refs'))).toBe(false)
    expect(
      client.calls.some(call => call.endpoint.endsWith('/pulls') && call.method === 'POST')
    ).toBe(false)
  })

  it('opens a PR from an exact matching branch left by an interrupted run', async () => {
    const client = githubClient({
      request: async <T>(method: 'GET' | 'POST', endpoint: string, body?: unknown) => {
        client.calls.push({ method, endpoint, body })
        if (endpoint.includes('/pulls?state=all&head=')) return [] as T
        if (endpoint.endsWith(`/git/matching-refs/heads/${payload.branchName}`))
          return [
            {
              ref: `refs/heads/${payload.branchName}`,
              object: { sha: 'existing-commit' }
            }
          ] as T
        if (endpoint.endsWith('/git/commits/existing-commit'))
          return { tree: { sha: 'proposal-tree' }, parents: [{ sha: 'parent-commit' }] } as T
        if (endpoint.includes('/compare/main...parent-commit')) return { ahead_by: 0 } as T
        if (endpoint.endsWith('/git/commits/parent-commit'))
          return { tree: { sha: 'parent-tree' } } as T
        if (endpoint.endsWith('/git/trees')) return { sha: 'proposal-tree' } as T
        if (endpoint.endsWith('/pulls') && method === 'POST')
          return {
            number: 43,
            html_url: 'https://github.com/smg99/frontend-performance-lab/pull/43'
          } as T
        if (endpoint.endsWith('/issues/43/labels') && method === 'POST') return [] as T
        throw new Error(`unexpected GitHub request: ${method} ${endpoint}`)
      }
    })

    const results = await publishProposalPayloads([payload], repository, context, client)

    expect(results[0]).toMatchObject({
      status: 'created',
      pullRequestUrl: 'https://github.com/smg99/frontend-performance-lab/pull/43'
    })
    expect(client.calls.some(call => call.endpoint.endsWith('/git/refs'))).toBe(false)
    expect(
      client.calls.some(call => call.endpoint.endsWith('/git/commits') && call.method === 'POST')
    ).toBe(false)
  })

  it('rejects evidence on a host outside the configured source allowlist', async () => {
    const externalCandidate = {
      ...candidate,
      evidenceUrl: 'https://unapproved.example/performance-claim'
    }
    const externalPayload = createDraftPullRequest(
      externalCandidate,
      {
        ...draft,
        citations: [{ ...draft.citations[0], evidenceUrl: externalCandidate.evidenceUrl }]
      },
      context
    )
    const client = githubClient()

    await expect(
      publishProposalPayloads([externalPayload], repository, context, client)
    ).rejects.toThrow('proposal evidence is not allowlisted')
    expect(client.calls).toHaveLength(0)
  })
})
