import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../tests/helpers'

describe('Rule: react-large-map', () => {
  it('detects a basic map returning JSX', () => {
    const code = loadFixture('react', 'react-large-map', 'detects-basic', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(1)
  })

  it('detects nested maps returning JSX', () => {
    const code = loadFixture('react', 'react-large-map', 'detects-nested', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(2)
  })

  it('ignores map calls that do not return JSX', () => {
    const code = loadFixture('react', 'react-large-map', 'ignores-no-jsx', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(0)
  })
})