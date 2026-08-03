import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: vue-large-v-for', () => {
  it('detects a basic v-for without virtualization', () => {
    const code = loadFixture('vue', 'vue-large-v-for', 'detects-basic', 'vue')
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(1)
  })

  it('detects a nested v-for', () => {
    const code = loadFixture('vue', 'vue-large-v-for', 'detects-nested', 'vue')
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(1)
  })

  it('detects a v-for rendering a component', () => {
    const code = loadFixture('vue', 'vue-large-v-for', 'detects-component', 'vue')
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(1)
  })

  it('ignores a virtualized v-for', () => {
    const code = loadFixture('vue', 'vue-large-v-for', 'ignores-virtualized', 'vue')
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(0)
  })

  it('handles script setup appropriately', () => {
    const code = loadFixture('vue', 'vue-large-v-for', 'handles-script-setup', 'vue')
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(1)
  })
})
