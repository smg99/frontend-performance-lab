import { describe, expect, it } from 'vitest'
import {
  evaluateBuildBudget,
  sumBuildAssets,
  type BuildAsset
} from '../../shared/audit/build-budget'

const assets: BuildAsset[] = [
  { path: '_nuxt/app.js', kind: 'javascript', bytes: 600_000, gzipBytes: 180_000 },
  { path: '_nuxt/vendor.js', kind: 'javascript', bytes: 400_000, gzipBytes: 120_000 },
  { path: '_nuxt/app.css', kind: 'stylesheet', bytes: 150_000, gzipBytes: 30_000 }
]

describe('build bundle budget', () => {
  it('sums raw and gzip asset sizes by kind', () => {
    expect(sumBuildAssets(assets)).toEqual({
      javascript: { files: 2, bytes: 1_000_000, gzipBytes: 300_000 },
      stylesheet: { files: 1, bytes: 150_000, gzipBytes: 30_000 }
    })
  })

  it('passes when every configured limit is respected', () => {
    const report = evaluateBuildBudget(assets, {
      javascriptBytes: 1_000_000,
      javascriptGzipBytes: 300_000,
      stylesheetBytes: 150_000
    })

    expect(report.passed).toBe(true)
    expect(report.failures).toEqual([])
  })

  it('reports each exceeded deterministic budget', () => {
    const report = evaluateBuildBudget(assets, {
      javascriptBytes: 900_000,
      javascriptGzipBytes: 250_000,
      stylesheetBytes: 100_000
    })

    expect(report.passed).toBe(false)
    expect(report.failures.map(failure => failure.metric)).toEqual([
      'javascriptBytes',
      'javascriptGzipBytes',
      'stylesheetBytes'
    ])
  })

  it('includes actual values and limits in failures', () => {
    const report = evaluateBuildBudget(assets, { javascriptBytes: 900_000 })

    expect(report.failures[0]).toEqual({
      metric: 'javascriptBytes',
      actual: 1_000_000,
      limit: 900_000
    })
  })
})
