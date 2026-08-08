import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: vue-large-v-for', () => {
  it('detects a basic v-for without virtualization', () => {
    const code = loadFixture('vue', 'vue-large-v-for', 'detects-basic', 'vue')
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe("Unvirtualized v-for on 'items'")
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

  it('ignores small inline array literals (<= 10 items)', () => {
    const code = `
      <template>
        <div v-for="item in ['Home', 'About', 'Contact']" :key="item">{{ item }}</div>
      </template>
    `
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(0)
  })

  it('ignores small static numeric ranges (<= 10)', () => {
    const code = `
      <template>
        <div v-for="n in 5" :key="n">{{ n }}</div>
      </template>
    `
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(0)
  })

  it('flags large static numeric ranges (> 10)', () => {
    const code = `
      <template>
        <div v-for="n in 1000" :key="n">{{ n }}</div>
      </template>
    `
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe("Unvirtualized v-for on '1000'")
  })

  it('ignores static array variables defined in script setup', () => {
    const code = `
      <script setup>
      const TABS = ['Overview', 'Details', 'Settings']
      </script>
      <template>
        <button v-for="tab in TABS" :key="tab">{{ tab }}</button>
      </template>
    `
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'vue-large-v-for')
    expect(issues.length).toBe(0)
  })
})
