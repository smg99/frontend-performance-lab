import { z } from 'zod'
import { escapeMarkdown, type DraftPullRequestPayload } from './proposals'

const proposalContentSchema = z.object({
  candidate: z.object({
    id: z.string().min(1),
    evidenceUrl: z.string().url(),
    publisher: z.string().min(1),
    evidenceType: z.enum(['official-documentation', 'vendor-guidance', 'maintainer-guidance']),
    publishedAt: z.string().optional(),
    discoveredAt: z.string().datetime(),
    evidenceHash: z.string().min(1)
  }),
  draft: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    citations: z
      .array(
        z.object({
          claim: z.string().min(1),
          evidenceUrl: z.string().url(),
          confidence: z.enum(['high', 'medium', 'low'])
        })
      )
      .min(1),
    uncertainty: z.array(z.string().min(1)).min(1)
  })
})

export function formatProposalPayloadReport(payloads: DraftPullRequestPayload[]) {
  const lines = [
    '# Prepared proposal payloads',
    '',
    `- Prepared proposals: ${payloads.length}`,
    '',
    '## Review before publishing',
    '',
    ...(payloads.length
      ? payloads.flatMap(payload => {
          const file = payload.files[0]
          if (!file) throw new Error(`proposal payload has no content file: ${payload.title}`)
          const { candidate, draft } = proposalContentSchema.parse(JSON.parse(file.content))
          return [
            `- ${escapeMarkdown(payload.title)}`,
            `  - Summary: ${escapeMarkdown(draft.summary)}`,
            '  - Claims:',
            ...draft.citations.map(
              citation =>
                `    - [${citation.confidence}] ${escapeMarkdown(citation.claim)} (evidence: ${citation.evidenceUrl})`
            ),
            '  - Uncertainty:',
            ...draft.uncertainty.map(item => `    - ${escapeMarkdown(item)}`),
            `  - Candidate: ${candidate.id}`,
            `  - Publisher: ${escapeMarkdown(candidate.publisher)}`,
            `  - Evidence type: ${candidate.evidenceType}`,
            `  - Published: ${escapeMarkdown(candidate.publishedAt ?? 'not provided')}`,
            `  - Discovered: ${candidate.discoveredAt}`,
            `  - Evidence: ${candidate.evidenceUrl}`,
            `  - Evidence hash: ${candidate.evidenceHash}`,
            `  - Payload: ${file.path}`
          ]
        })
      : ['- No review-only proposals were prepared.']),
    ''
  ]

  return lines.join('\n')
}
