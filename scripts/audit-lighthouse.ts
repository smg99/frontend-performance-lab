import { execFileSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { chromium } from 'playwright'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { AUDIT_ROUTES } from '../shared/audit/routes'
import { summarizeLighthouseResult } from '../shared/audit/lighthouse'

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const outputPath = argument('--out') ?? '.fpl/lighthouse-report.json'
const port = 32124
const baseUrl = `http://127.0.0.1:${port}`
const serverEntry = '.output/server/index.mjs'
const categories = ['performance', 'accessibility', 'best-practices', 'seo'] as const
const measurementSettings = { formFactor: 'mobile', throttlingMethod: 'simulate' } as const

if (!existsSync(serverEntry)) {
  console.error(`Lighthouse audit failed: ${serverEntry} is unavailable. Run npm run build first.`)
  process.exit(1)
}

const chromePath = process.env.CHROME_PATH ?? chromium.executablePath()
if (!existsSync(chromePath)) {
  console.error(
    `Lighthouse audit failed: Chromium is unavailable at ${chromePath}. Run npx playwright install chromium first.`
  )
  process.exit(1)
}

const server = spawn(process.execPath, [serverEntry], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: 'ignore'
})
let chrome: Awaited<ReturnType<typeof launch>> | undefined
const routeReports: ReturnType<typeof summarizeLighthouseResult>[] = []

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(1000) })
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error('The production server did not become ready within four seconds.')
}

try {
  const lighthousePackage = JSON.parse(
    await readFile(new URL('../node_modules/lighthouse/package.json', import.meta.url), 'utf8')
  ) as { version?: unknown }
  if (typeof lighthousePackage.version !== 'string' || !lighthousePackage.version.trim()) {
    throw new Error('The installed Lighthouse package has no version metadata.')
  }
  const chromeVersion = execFileSync(chromePath, ['--version'], { encoding: 'utf8' }).trim()
  if (!chromeVersion) throw new Error('Chromium returned no version metadata.')

  await waitForServer()
  chrome = await launch({
    chromePath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  })

  for (const path of AUDIT_ROUTES) {
    const url = `${baseUrl}${path}`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw new Error(`Route ${path} returned HTTP ${response.status}.`)

    const result = await lighthouse(url, {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: [...categories],
      ...measurementSettings
    })
    if (!result) throw new Error(`Lighthouse returned no result for ${path}.`)

    routeReports.push(summarizeLighthouseResult(path, url, result.lhr))
  }

  const report = {
    measuredAt: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      ci: Boolean(process.env.CI),
      commit: process.env.GITHUB_SHA ?? null,
      lighthouse: lighthousePackage.version,
      chrome: chromeVersion
    },
    measurementSettings: { ...measurementSettings, categories },
    categoryScoreScale: '0-to-1',
    routes: routeReports
  }
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.log(`Lighthouse audit report written to ${outputPath}.`)
} catch (error) {
  console.error(
    `Lighthouse audit failed: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exitCode = 1
} finally {
  chrome?.kill()
  server.kill('SIGTERM')
}
