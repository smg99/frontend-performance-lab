import { describe, expect, it } from 'vitest'
import { getConfiguredEngine } from '../../../shared/utils/analyzer/rules'

describe('AnalyzerEngine report integrity', () => {
  it('produces deterministic issue IDs for identical input', () => {
    const contexts = [
      {
        code: 'items.map(item => <div>{item}</div>)',
        filename: 'List.jsx',
        framework: 'react',
        language: 'jsx'
      }
    ]

    const first = getConfiguredEngine().analyze(contexts)
    const second = getConfiguredEngine().analyze(contexts)

    expect(first.issues.length).toBeGreaterThan(0)
    expect(first.issues.map(issue => issue.id)).toEqual(second.issues.map(issue => issue.id))
    expect(first.reportHash).toBe(second.reportHash)
  })

  it('labels impact estimates as unmeasured', () => {
    const report = getConfiguredEngine().analyze([
      {
        code: 'items.map(item => <div>{item}</div>)',
        filename: 'List.jsx',
        framework: 'react',
        language: 'jsx'
      }
    ])

    expect(report.estimates.performanceGain).toContain('unmeasured')
    expect(report.estimates.renderingImprovement).toContain('unmeasured')
    expect(report.estimates.timeToFix).toContain('Heuristic')
  })
})
