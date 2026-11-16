import path from 'node:path'
import { prepareProposalPayloads } from '../autonomy/prepare-proposals'
import { formatProposalPayloadReport } from '../autonomy/proposal-report'
import { getAllBrowserAPIs, getAllExperiments, getAllRecipes } from '../shared/registry'

const outputDirectory = path.resolve('artifacts/autonomy')
const payloadsPath = path.join(outputDirectory, 'proposal-payloads.json')
const existingContent = [...getAllExperiments(), ...getAllBrowserAPIs(), ...getAllRecipes()]
const args = process.argv.slice(2)
let generatedCandidateId: string | undefined
if (args.length > 0) {
  if (args.length !== 2 || args[0] !== '--generate' || !args[1]?.trim()) {
    throw new Error(
      'Usage: npm run autonomy:prepare-proposals [-- --generate <discovery-candidate-id>]'
    )
  }
  generatedCandidateId = args[1]
}
const payloads = prepareProposalPayloads(
  outputDirectory,
  {
    existingIds: existingContent.map(item => item.id),
    existingTitles: existingContent.map(item => ('title' in item ? item.title : item.name))
  },
  generatedCandidateId ? { generatedCandidateId } : undefined
)
console.log(formatProposalPayloadReport(payloads))
console.log(`Payload file: ${payloadsPath}`)
