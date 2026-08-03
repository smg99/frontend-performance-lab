import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: blockingCss', () => {
  it('detects missing media=print on link rel=stylesheet', () => {
    const code = loadFixture('react', 'blocking-css', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'blocking-css')
    // 1 stylesheet is blocking, 1 is media=print, 1 is icon
    expect(issues.length).toBe(1)
  })

  it('does not flag if no stylesheets exist', () => {
    const code = `
      export default function Head() {
        return (
          <head>
            <link rel="icon" href="favicon.ico" />
          </head>
        )
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'blocking-css')
    expect(issues.length).toBe(0)
  })
})
