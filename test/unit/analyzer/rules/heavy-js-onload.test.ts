import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: heavyJsOnload', () => {
  it('detects deep nesting in useEffect', () => {
    const code = loadFixture('react', 'heavy-js-onload', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(1)
  })

  it('does not flag simple useEffect', () => {
    const code = `
      import { useEffect } from 'react';
      export default function Dashboard() {
        useEffect(() => {
          console.log('loaded');
        }, []);
        return <div>Dashboard</div>;
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(0)
  })
})
