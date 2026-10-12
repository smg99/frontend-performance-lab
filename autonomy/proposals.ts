import { createHash } from 'node:crypto'
import { z } from 'zod'
import { discoveryCandidateSchema, type DiscoveryCandidate, type DiscoveryRun } from './discovery'

export const proposalKinds = ['metadata', 'browser-api', 'recipe', 'experiment'] as const
export type ProposalKind = (typeof proposalKinds)[number]

const citationSchema = z.strictObject({
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
  metadata: baseDraftSchema
    .extend({
      kind: z.literal('metadata'),
      targetEntityId: z.string().min(1)
    })
    .strict(),
  'browser-api': baseDraftSchema
    .extend({
      kind: z.literal('browser-api'),
      apiName: z.string().min(2),
      compatibilityQuestions: z.array(z.string()).min(1)
    })
    .strict(),
  recipe: baseDraftSchema
    .extend({
      kind: z.literal('recipe'),
      prerequisites: z.array(z.string()),
      validationPlan: z.array(z.string()).min(1)
    })
    .strict(),
  experiment: baseDraftSchema
    .extend({
      kind: z.literal('experiment'),
      hypothesis: z.string().min(20),
      metrics: z.array(z.string()).min(1)
    })
    .strict()
} as const

export type ProposalDraft = z.infer<(typeof draftSchemas)[ProposalKind]>

export interface ProposalContext {
  existingIds: string[]
  existingTitles: string[]
}

const authoredDraftSchema = z.strictObject({
  candidateId: z.string().min(1),
  draft: z.unknown()
})

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
  return createDraftPullRequestsFromCandidates(discoveryRun.candidates, buildDraft, context)
}

function createDraftPullRequestsFromCandidates(
  candidates: DiscoveryCandidate[],
  buildDraft: (candidate: DiscoveryCandidate) => unknown,
  context: ProposalContext
): DraftPullRequestPayload[] {
  if (candidates.length === 0) return []
  const batchContext: ProposalContext = {
    existingIds: [...context.existingIds],
    existingTitles: [...context.existingTitles]
  }

  return candidates.map(candidate => {
    const draft = validateDraft(candidate, buildDraft(candidate), batchContext, context.existingIds)
    batchContext.existingIds.push(draft.id)
    batchContext.existingTitles.push(draft.title)
    return createDraftPullRequestPayload(candidate, draft)
  })
}

export function createDraftPullRequestsFromAuthoredDrafts(
  candidates: DiscoveryCandidate[],
  untrustedAuthoredDrafts: unknown,
  context: ProposalContext
): DraftPullRequestPayload[] {
  const authoredDrafts = z.array(authoredDraftSchema).parse(untrustedAuthoredDrafts)
  const candidatesById = new Map<string, DiscoveryCandidate>()
  for (const candidate of candidates.map(candidate => discoveryCandidateSchema.parse(candidate))) {
    if (candidatesById.has(candidate.id))
      throw new Error(`duplicate discovery candidate id: ${candidate.id}`)
    candidatesById.set(candidate.id, candidate)
  }

  const draftsByCandidateId = new Map<string, unknown>()
  const selectedCandidates: DiscoveryCandidate[] = []
  for (const authored of authoredDrafts) {
    if (draftsByCandidateId.has(authored.candidateId))
      throw new Error(`duplicate authored candidate: ${authored.candidateId}`)
    const candidate = candidatesById.get(authored.candidateId)
    if (!candidate) throw new Error(`unknown discovery candidate: ${authored.candidateId}`)
    draftsByCandidateId.set(authored.candidateId, authored.draft)
    selectedCandidates.push(candidate)
  }

  return createDraftPullRequestsFromCandidates(
    selectedCandidates,
    candidate => draftsByCandidateId.get(candidate.id),
    context
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
  return createDraftPullRequestPayload(candidate, validateDraft(candidate, untrustedDraft, context))
}

function validateDraft(
  candidate: DiscoveryCandidate,
  untrustedDraft: unknown,
  context: ProposalContext,
  registeredEntityIds: string[] = context.existingIds
): ProposalDraft {
  const kind = z.object({ kind: z.enum(proposalKinds) }).parse(untrustedDraft).kind
  const draft = draftSchemas[kind].parse(untrustedDraft) as ProposalDraft
  if (context.existingIds.includes(draft.id)) throw new Error(`duplicate content id: ${draft.id}`)
  if (context.existingTitles.some(title => normalized(title) === normalized(draft.title)))
    throw new Error(`duplicate content title: ${draft.title}`)
  if (draft.kind === 'metadata' && !registeredEntityIds.includes(draft.targetEntityId))
    throw new Error(`unknown metadata target: ${draft.targetEntityId}`)
  if (normalized(draft.summary) === normalized(candidate.evidenceTitle))
    throw new Error('draft summary is source-paraphrase-only')
  for (const citation of draft.citations) {
    if (citation.evidenceUrl !== candidate.evidenceUrl)
      throw new Error(`unsupported claim without candidate evidence: ${citation.claim}`)
  }
  return draft
}

function createDraftPullRequestPayload(
  candidate: DiscoveryCandidate,
  draft: ProposalDraft
): DraftPullRequestPayload {
  const kind = draft.kind
  const idempotencyKey = digest(`${candidate.id}:${kind}:${draft.id}`)
  const proposalPath = `autonomy/proposals/${kind}/${draft.id}.json`
  const content = `${JSON.stringify({ candidate, draft, idempotencyKey }, null, 2)}\n`
  const body = [
    '## Description',
    `This draft proposes ${draft.title} as a review-only ${kind} knowledge update.`,
    `Motivation and context: ${draft.summary}`,
    'Fixes # (none; autonomous proposal)',
    'Dependencies: none.',
    '',
    '## Type of change',
    '- [ ] Bug fix (non-breaking change which fixes an issue)',
    '- [ ] New AST Rule (non-breaking change which adds new performance checks)',
    '- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)',
    '- [x] Documentation update',
    '',
    '## How Has This Been Tested?',
    '- Proposal schemas, citations, evidence and duplicate checks passed during payload preparation.',
    '',
    '- [ ] I have added benchmark fixtures in `test/fixtures/` for this rule.',
    '- [ ] `npm run test` passes completely.',
    '- [ ] I have verified this locally against a real repository.',
    '',
    '## Checklist:',
    '- [ ] My code follows the `PROJECT_PRINCIPLES.md` (no heuristic guessing).',
    '- [ ] I have performed a self-review of my own code.',
    '- [ ] I have commented my code, particularly in hard-to-understand AST traversals.',
    '- [ ] I have made corresponding changes to the documentation.',
    '- [ ] My changes generate no new ESLint warnings.',
    '',
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
