import fs from 'node:fs'
import path from 'node:path'
import { discoverySources } from '../autonomy/sources'
import { runDiscovery, type DiscoveryState } from '../autonomy/discovery'

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

const lines = [
  '# Autonomous discovery report',
  '',
  `- Sources checked: ${result.checkedSources}`,
  `- New candidates: ${result.candidates.length}`,
  `- Source errors: ${result.errors.length}`,
  '',
  '## Candidates',
  '',
  ...(result.candidates.length
    ? result.candidates.map(
        candidate =>
          `- [${candidate.evidenceTitle}](${candidate.evidenceUrl}) — ${candidate.publisher}; score ${candidate.relevanceScore}; ${candidate.matchedTopics.join(', ') || 'no topic match'}; evidence \`${candidate.evidenceHash}\``
      )
    : ['- No new candidates.']),
  '',
  '## Errors',
  '',
  ...(result.errors.length
    ? result.errors.map(error => `- ${error.sourceId}: ${error.message}`)
    : ['- None.'])
]
fs.writeFileSync(path.join(outputDirectory, 'discovery-report.md'), `${lines.join('\n')}\n`)

console.log(lines.slice(0, 5).join('\n'))
if (result.errors.length === result.checkedSources) process.exitCode = 1
