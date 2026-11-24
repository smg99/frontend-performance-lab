import { readFile, writeFile, mkdir } from 'node:fs/promises'
import {
  reconcileAuditFindings,
  type AuditFinding,
  type StoredAuditReport
} from '../shared/audit/regression'

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const currentPath = argument('--current')
const previousPath = argument('--previous')
const outputPath = argument('--out') ?? '.fpl/audit-regression-report.json'

if (!currentPath) {
  console.error('Audit regression failed: --current <findings.json> is required.')
  process.exit(1)
}

let current: AuditFinding[]
let previous: StoredAuditReport | null = null

try {
  current = JSON.parse(await readFile(currentPath, 'utf8')) as AuditFinding[]
  if (previousPath) {
    try {
      previous = JSON.parse(await readFile(previousPath, 'utf8')) as StoredAuditReport
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
} catch (error) {
  console.error(
    `Audit regression failed: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exit(1)
}

const report = reconcileAuditFindings(current, previous)
await mkdir(outputPath.substring(0, outputPath.lastIndexOf('/') + 1) || '.', { recursive: true })
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        ci: Boolean(process.env.CI),
        commit: process.env.GITHUB_SHA ?? null
      },
      ...report
    },
    null,
    2
  )}\n`,
  'utf8'
)

console.log(
  `Audit regression report: ${report.summary.active} active, ${report.summary.recovered} recovered, ${report.summary.added} added.`
)
