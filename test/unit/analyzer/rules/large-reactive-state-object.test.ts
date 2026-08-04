import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

// Helper: generates a ref({ ... }) call with N top-level props (above the 30-prop threshold)
function makeLargeObject(n: number, wrapper = 'ref') {
  const props = Array.from({ length: n }, (_, i) => `  p${i}: ${i}`).join(',\n')
  return `import { ${wrapper} } from 'vue'\nconst state = ${wrapper}({\n${props}\n})`
}

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

  it('does not flag a small object (under threshold)', () => {
    const code = `import { ref } from 'vue'\nconst state = ref({ a: 1, b: 2 })`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(0)
  })

  it('detects large array literal passed to ref', () => {
    const elements = Array.from({ length: 31 }, (_, i) => i).join(', ')
    const code = `import { ref } from 'vue'\nconst state = ref([${elements}])`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('does not flag a small array (under threshold)', () => {
    const code = `import { ref } from 'vue'\nconst state = ref([1, 2, 3])`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(0)
  })

  it('detects an imported identifier passed to ref', () => {
    const code = `import { ref } from 'vue'\nimport bigData from './data'\nconst state = ref(bigData)`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('does not flag identifier ending with _shallow', () => {
    const code = `import { ref } from 'vue'\nimport bigData_shallow from './data'\nconst state = ref(bigData_shallow)`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(0)
  })

  it('counts nested object properties recursively', () => {
    // 15 top-level + 16 nested = 31 total, above threshold of 30
    const nested = Array.from({ length: 16 }, (_, i) => `    n${i}: ${i}`).join(',\n')
    const topLevel = Array.from({ length: 15 }, (_, i) => `  p${i}: ${i}`).join(',\n')
    const code = `import { ref } from 'vue'\nconst state = ref({\n${topLevel},\n  nested: {\n${nested}\n  }\n})`
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('does not flag shallowReactive usage', () => {
    const code = makeLargeObject(31, 'shallowReactive')
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

  it('detects large array passed to useState', () => {
    const elements = Array.from({ length: 31 }, (_, i) => i).join(', ')
    const code = `import { useState } from 'react'\nconst [s, setS] = useState([${elements}])`
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('detects imported identifier passed to useState', () => {
    const code = `import { useState } from 'react'\nimport bigData from './data'\nconst [s, setS] = useState(bigData)`
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(1)
  })

  it('does not flag small object passed to useState', () => {
    const code = `import { useState } from 'react'\nconst [s, setS] = useState({ a: 1 })`
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'large-reactive-state-object')
    expect(issues.length).toBe(0)
  })
})
