import fs from 'node:fs'
import path from 'node:path'
import { discoverySources } from '../autonomy/sources'
import { runDiscovery, type DiscoveryState } from '../autonomy/discovery'
import { formatDiscoveryReport } from '../autonomy/discovery-report'

const outputDirectory = path.resolve('artifacts/autonomy')
const statePath = path.join(outputDirectory, 'discovery-state.json')
const emptyState: DiscoveryState = { sources: {}, seenCandidateIds: [] }
const previousState = fs.existsSync(statePath)
  ? JSON.parse(fs.readFileSync(statePath, 'utf8'))
  : emptyState

const result = await runDiscovery(discoverySources, previousState)
fs.mkdirSync(outputDirectory, { recursive: true })
fs.writeFileSync(statePath, `${JSON.stringify(result.state, null, 2)}\n`)
fs.writeFileSync(
  path.join(outputDirectory, 'discovery-report.json'),
  `${JSON.stringify(result, null, 2)}\n`
)
const report = formatDiscoveryReport(result)
fs.writeFileSync(path.join(outputDirectory, 'discovery-report.md'), report)

console.log(report.split('\n').slice(0, 5).join('\n'))
if (result.errors.length === result.checkedSources) process.exitCode = 1
