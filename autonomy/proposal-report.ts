import { z } from 'zod'
import type { DraftPullRequestPayload } from './proposals'

const proposalContentSchema = z.object({
  candidate: z.object({
    id: z.string().min(1),
    evidenceUrl: z.string().url(),
    evidenceHash: z.string().min(1)
  }),
  draft: z.object({ title: z.string().min(1) })
})

function oneLine(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

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
          const { candidate } = proposalContentSchema.parse(JSON.parse(file.content))
          return [
            `- ${oneLine(payload.title)}`,
            `  - Candidate: ${candidate.id}`,
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
