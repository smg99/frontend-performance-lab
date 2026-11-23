import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { auditHtmlAccessibility, type AccessibilityReport } from '../shared/audit/accessibility'

const serverEntry = '.output/server/index.mjs'
if (!existsSync(serverEntry)) {
  console.error(
    `Accessibility audit failed: ${serverEntry} is unavailable. Run npm run build first.`
  )
  process.exit(1)
}

const port = 32123
const server = spawn(process.execPath, [serverEntry], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: 'ignore'
})

const routes = [
  '/',
  '/about',
  '/recipes',
  '/browser-apis',
  '/mcp',
  '/playground',
  '/tools/performance-review'
]
const reports: AccessibilityReport[] = []

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, {
        signal: AbortSignal.timeout(1000)
      })
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error('The built server did not become ready within four seconds.')
}

try {
  await waitForServer()
  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) throw new Error(`Route ${route} returned HTTP ${response.status}.`)
    reports.push(auditHtmlAccessibility({ path: route, html: await response.text() }))
  }
} catch (error) {
  console.error(
    `Accessibility audit failed: ${error instanceof Error ? error.message : String(error)}`
  )
  server.kill('SIGTERM')
  process.exit(1)
}

server.kill('SIGTERM')
const violations = reports.flatMap(report => report.violations)
console.log(
  JSON.stringify(
    {
      passed: violations.length === 0,
      checked: reports.length,
      routes,
      violations,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        ci: Boolean(process.env.CI),
        commit: process.env.GITHUB_SHA ?? null
      }
    },
    null,
    2
  )
)

if (violations.length > 0) process.exit(1)
