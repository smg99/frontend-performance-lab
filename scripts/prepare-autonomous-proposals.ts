import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { discoveryCandidateSchema } from '../autonomy/discovery'
import { createDraftPullRequestsFromAuthoredDrafts } from '../autonomy/proposals'
import { getAllBrowserAPIs, getAllExperiments, getAllRecipes } from '../shared/registry'

const outputDirectory = path.resolve('artifacts/autonomy')
const discoveryPath = path.join(outputDirectory, 'discovery-report.json')
const authoredDraftsPath = path.join(outputDirectory, 'proposal-drafts.json')
const payloadsPath = path.join(outputDirectory, 'proposal-payloads.json')

const discoveryReportSchema = z.object({
  candidates: z.array(discoveryCandidateSchema)
})

const discoveryReport = discoveryReportSchema.parse(
  JSON.parse(fs.readFileSync(discoveryPath, 'utf8'))
)
const authoredDrafts: unknown = JSON.parse(fs.readFileSync(authoredDraftsPath, 'utf8'))
const existingContent = [...getAllExperiments(), ...getAllBrowserAPIs(), ...getAllRecipes()]
const payloads = createDraftPullRequestsFromAuthoredDrafts(
  discoveryReport.candidates,
  authoredDrafts,
  {
    existingIds: existingContent.map(item => item.id),
    existingTitles: existingContent.map(item => ('title' in item ? item.title : item.name))
  }
)

fs.mkdirSync(outputDirectory, { recursive: true })
fs.writeFileSync(payloadsPath, `${JSON.stringify(payloads, null, 2)}\n`)
console.log(`Prepared ${payloads.length} review-only proposal payload(s): ${payloadsPath}`)
