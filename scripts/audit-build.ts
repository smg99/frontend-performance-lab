import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { join, relative } from 'node:path'
import { evaluateBuildBudget, type BuildAsset } from '../shared/audit/build-budget'

const budget = {
  javascriptBytes: 2 * 1024 * 1024,
  javascriptGzipBytes: 700 * 1024,
  stylesheetBytes: 500 * 1024,
  stylesheetGzipBytes: 150 * 1024
}

async function collectFiles(directory: string): Promise<string[]> {
  const files: string[] = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await collectFiles(path)))
    else files.push(path)
  }
  return files
}

const root = '.output/public'
let paths: string[]
try {
  paths = await collectFiles(root)
} catch (error) {
  console.error(`Build audit failed: ${root} is unavailable. Run npm run build first.`, error)
  process.exit(1)
}

const assets: BuildAsset[] = []
for (const path of paths) {
  if (!/\.(?:js|mjs)$/.test(path) && !/\.css$/.test(path)) continue
  const content = await readFile(path)
  assets.push({
    path: relative(root, path).replaceAll('\\', '/'),
    kind: /\.css$/.test(path) ? 'stylesheet' : 'javascript',
    bytes: content.byteLength,
    gzipBytes: gzipSync(content).byteLength
  })
}

const report = evaluateBuildBudget(assets, budget)
console.log(
  JSON.stringify(
    {
      passed: report.passed,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        ci: Boolean(process.env.CI),
        commit: process.env.GITHUB_SHA ?? null
      },
      budget,
      totals: report.totals,
      failures: report.failures
    },
    null,
    2
  )
)

if (!report.passed) process.exit(1)
