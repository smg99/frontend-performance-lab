import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { mergeLighthouseTrend } from '../shared/audit/trends'

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const currentPath = argument('--current')
const previousPath = argument('--previous')
const outputPath = argument('--out') ?? '.fpl/lighthouse-trend.json'
const runId = argument('--run-id')

if (!currentPath || !runId) {
  console.error(
    'Lighthouse trend failed: --current <report.json> and --run-id <workflow-run-id> are required.'
  )
  process.exit(1)
}

try {
  const current: unknown = JSON.parse(await readFile(currentPath, 'utf8'))
  let previous: unknown = null
  if (previousPath) {
    try {
      previous = JSON.parse(await readFile(previousPath, 'utf8'))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }

  const history = mergeLighthouseTrend(current, previous, runId)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(history, null, 2)}\n`, 'utf8')
  console.log(
    `Lighthouse trend history written to ${outputPath} (${history.reports.length} measured runs).`
  )
} catch (error) {
  console.error(
    `Lighthouse trend failed: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exit(1)
}
