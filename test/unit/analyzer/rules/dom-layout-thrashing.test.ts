import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../tests/helpers'

describe('Rule: dom-layout-thrashing', () => {
  it('detects style mutations causing thrashing', () => {
    const code = loadFixture('javascript', 'dom-layout-thrashing', 'detects-basic', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(1)
  })

  it('ignores style mutations inside requestAnimationFrame', () => {
    const code = loadFixture('javascript', 'dom-layout-thrashing', 'ignores-raf', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(0)
  })
})
