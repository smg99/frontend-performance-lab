import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: cssContainMissing', () => {
  it('detects missing css contain when > 30 children exist', () => {
    const code = loadFixture('react', 'css-contain-missing', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'css-contain-missing')
    expect(issues.length).toBe(1)
  })

  it('does not flag if less than 30 children are present', () => {
    const code = `
      export default function SmallList() {
        return (
          <div>
            <p>1</p><p>2</p><p>3</p>
          </div>
        )
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'css-contain-missing')
    expect(issues.length).toBe(0)
  })
})
