import path from 'node:path'
import { prepareProposalPayloads } from '../autonomy/prepare-proposals'
import { formatProposalPayloadReport } from '../autonomy/proposal-report'
import { getAllBrowserAPIs, getAllExperiments, getAllRecipes } from '../shared/registry'

const outputDirectory = path.resolve('artifacts/autonomy')
const payloadsPath = path.join(outputDirectory, 'proposal-payloads.json')
const existingContent = [...getAllExperiments(), ...getAllBrowserAPIs(), ...getAllRecipes()]
const payloads = prepareProposalPayloads(outputDirectory, {
  existingIds: existingContent.map(item => item.id),
  existingTitles: existingContent.map(item => ('title' in item ? item.title : item.name))
})
console.log(formatProposalPayloadReport(payloads))
console.log(`Payload file: ${payloadsPath}`)
