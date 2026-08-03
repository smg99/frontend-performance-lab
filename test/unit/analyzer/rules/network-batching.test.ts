import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: networkBatching', () => {
  it('detects multiple unbatched fetches in the same block', () => {
    const code = loadFixture('react', 'network-batching', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(1)
  })

  it('does not flag single fetch', () => {
    const code = `
      async function fetchUser() {
        return await fetch('/api/user');
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(0)
  })
})
