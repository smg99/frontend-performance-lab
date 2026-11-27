import { mkdir, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname } from 'node:path'
import { performance } from 'node:perf_hooks'
import { evaluateBuildTimeBudget } from '../shared/audit/build-budget'

const limitMs = 120_000
const outputArgument = process.argv.indexOf('--out')
const outputPath =
  outputArgument >= 0 ? process.argv[outputArgument + 1] : '.fpl/build-time-report.json'

if (!outputPath || outputPath.startsWith('--')) {
  console.error('Build time audit failed: --out must be followed by a report path.')
  process.exit(1)
}

try {
  await mkdir(dirname(outputPath), { recursive: true })
  await rm(outputPath, { force: true })
} catch (error) {
  console.error(
    `Build time audit failed to prepare ${outputPath}: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exit(1)
}

const startedAt = performance.now()
const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' })
let spawnFailed = false

build.on('error', error => {
  spawnFailed = true
  console.error(`Build time audit could not start npm run build: ${error.message}`)
  process.exitCode = 1
})

build.on('close', async (code, signal) => {
  if (spawnFailed) return
  if (code !== 0) {
    console.error(
      `Build time audit did not record a duration: npm run build exited with ${signal ? `signal ${signal}` : `code ${code}`}.`
    )
    process.exitCode = code ?? 1
    return
  }

  const durationMs = Math.round(performance.now() - startedAt)
  const report = {
    ...evaluateBuildTimeBudget(durationMs, limitMs),
    command: 'npm run build',
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      ci: Boolean(process.env.CI),
      commit: process.env.GITHUB_SHA ?? null
    }
  }

  try {
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  } catch (error) {
    console.error(
      `Build time audit failed to write ${outputPath}: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exitCode = 1
    return
  }

  console.log(JSON.stringify(report, null, 2))
  if (!report.passed) {
    console.error(`Build time budget exceeded: ${durationMs} ms > ${limitMs} ms.`)
    process.exitCode = 1
  }
})
