import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { discoveryCandidateSchema } from './discovery'
import {
  createDraftPullRequestsFromAuthoredDrafts,
  type DraftPullRequestPayload,
  type ProposalContext
} from './proposals'

const discoveryReportSchema = z.object({
  candidates: z.array(discoveryCandidateSchema)
})

export function prepareProposalPayloads(
  outputDirectory: string,
  context: ProposalContext
): DraftPullRequestPayload[] {
  const payloadsPath = path.join(outputDirectory, 'proposal-payloads.json')

  try {
    fs.unlinkSync(payloadsPath)
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error
  }

  const discoveryPath = path.join(outputDirectory, 'discovery-report.json')
  const authoredDraftsPath = path.join(outputDirectory, 'proposal-drafts.json')
  const discoveryReport = discoveryReportSchema.parse(
    JSON.parse(fs.readFileSync(discoveryPath, 'utf8'))
  )
  const authoredDrafts: unknown = JSON.parse(fs.readFileSync(authoredDraftsPath, 'utf8'))
  const payloads = createDraftPullRequestsFromAuthoredDrafts(
    discoveryReport.candidates,
    authoredDrafts,
    context
  )

  fs.mkdirSync(outputDirectory, { recursive: true })
  fs.writeFileSync(payloadsPath, `${JSON.stringify(payloads, null, 2)}\n`)
  return payloads
}
