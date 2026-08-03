import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: largeReactiveStateObject (Vue)', () => {
  it('detects large object literal passed to ref', () => {
    const code = loadFixture('vue', 'large-reactive-state-object', 'object_literal', 'js')
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('does not flag shallowRef usage', () => {
    const code = `import { shallowRef } from 'vue';\nconst state = shallowRef({ a: 1, b: 2, c: 3 });`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(0)
  })
})

describe('Rule: largeReactiveStateObject (React)', () => {
  it('detects large object literal passed to useState', () => {
    const code = loadFixture('react', 'large-reactive-state-object', 'object_literal', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('does not flag useRef usage', () => {
    const code = `import { useRef } from 'react';\nconst data = useRef({ a: 1, b: 2, c: 3 });`
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(0)
  })
})
