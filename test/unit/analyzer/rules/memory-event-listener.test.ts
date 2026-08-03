import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: memory-event-listener', () => {
  it('detects a global addEventListener with no removeEventListener', () => {
    const code = loadFixture('javascript', 'memory-event-listener', 'detects-basic', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(1)
  })

  it('ignores when removeEventListener is present', () => {
    const code = loadFixture('javascript', 'memory-event-listener', 'ignores-with-remove', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(0)
  })

  it('ignores non-global event listeners', () => {
    const code = loadFixture('javascript', 'memory-event-listener', 'ignores-non-global', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(0)
  })
})
