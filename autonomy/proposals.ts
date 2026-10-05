import { createHash } from 'node:crypto'
import { z } from 'zod'
import type { DiscoveryCandidate, DiscoveryRun } from './discovery'

export const proposalKinds = ['metadata', 'browser-api', 'recipe', 'experiment'] as const
export type ProposalKind = (typeof proposalKinds)[number]

const citationSchema = z.object({
  claim: z.string().min(12),
  evidenceUrl: z.string().url().startsWith('https://'),
  confidence: z.enum(['high', 'medium', 'low'])
})

const baseDraftSchema = z.object({
  kind: z.enum(proposalKinds),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(6),
  summary: z.string().min(30),
  tags: z.array(z.string().min(2)).min(1),
  citations: z.array(citationSchema).min(1),
  uncertainty: z.array(z.string().min(8)).min(1)
})

const draftSchemas = {
  metadata: baseDraftSchema.extend({
    kind: z.literal('metadata'),
    targetEntityId: z.string().min(1)
  }),
  'browser-api': baseDraftSchema.extend({
    kind: z.literal('browser-api'),
    apiName: z.string().min(2),
    compatibilityQuestions: z.array(z.string()).min(1)
  }),
  recipe: baseDraftSchema.extend({
    kind: z.literal('recipe'),
    prerequisites: z.array(z.string()),
    validationPlan: z.array(z.string()).min(1)
  }),
  experiment: baseDraftSchema.extend({
    kind: z.literal('experiment'),
    hypothesis: z.string().min(20),
    metrics: z.array(z.string()).min(1)
  })
} as const

export type ProposalDraft = z.infer<(typeof draftSchemas)[ProposalKind]>

export interface ProposalContext {
  existingIds: string[]
  existingTitles: string[]
}

export interface DraftPullRequestPayload {
  idempotencyKey: string
  branchName: string
  title: string
  body: string
  files: { path: string; content: string }[]
  labels: string[]
  draft: true
}

export function createDraftPullRequestsFromDiscovery(
  discoveryRun: DiscoveryRun,
  buildDraft: (candidate: DiscoveryCandidate) => unknown,
  context: ProposalContext
): DraftPullRequestPayload[] {
  if (discoveryRun.candidates.length === 0) return []

  return discoveryRun.candidates.map(candidate =>
    createDraftPullRequest(candidate, buildDraft(candidate), context)
  )
}

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function normalized(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function createDraftPullRequest(
  candidate: DiscoveryCandidate,
  untrustedDraft: unknown,
  context: ProposalContext
): DraftPullRequestPayload {
  const kind = z.object({ kind: z.enum(proposalKinds) }).parse(untrustedDraft).kind
  const draft = draftSchemas[kind].parse(untrustedDraft) as ProposalDraft
  if (context.existingIds.includes(draft.id)) throw new Error(`duplicate content id: ${draft.id}`)
  if (context.existingTitles.some(title => normalized(title) === normalized(draft.title)))
    throw new Error(`duplicate content title: ${draft.title}`)
  if (normalized(draft.summary) === normalized(candidate.evidenceTitle))
    throw new Error('draft summary is source-paraphrase-only')
  for (const citation of draft.citations) {
    if (citation.evidenceUrl !== candidate.evidenceUrl)
      throw new Error(`unsupported claim without candidate evidence: ${citation.claim}`)
  }

  const idempotencyKey = digest(`${candidate.id}:${kind}:${draft.id}`)
  const proposalPath = `autonomy/proposals/${kind}/${draft.id}.json`
  const content = `${JSON.stringify({ candidate, draft, idempotencyKey }, null, 2)}\n`
  const body = [
    '## Evidence',
    `- [${candidate.evidenceTitle}](${candidate.evidenceUrl})`,
    `- Evidence hash: \`${candidate.evidenceHash}\``,
    '',
    '## Claims',
    ...draft.citations.map(
      item => `- ${item.claim} (${item.confidence}; [source](${item.evidenceUrl}))`
    ),
    '',
    '## Uncertainty',
    ...draft.uncertainty.map(item => `- ${item}`),
    '',
    '## Validation',
    '- [ ] Human verifies every claim against the cited evidence.',
    '- [ ] Content, relationship, link and originality checks pass.',
    '- [ ] Preview is reviewed before promotion.',
    '',
    '## Rollback',
    `Delete \`${proposalPath}\`; this draft does not modify published content.`
  ].join('\n')

  return {
    idempotencyKey,
    branchName: `autonomy/proposal-${idempotencyKey.slice(0, 12)}`,
    title: `draft(${kind}): ${draft.title}`,
    body,
    files: [{ path: proposalPath, content }],
    labels: ['autonomy', 'human-review-required'],
    draft: true
  }
}
