const fs = require('fs');
const path = require('path');

const RULES_ROOT = path.join(__dirname, 'shared/utils/analyzer/rules');

const tests = {
  'vue-large-v-for.test.ts': `
import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../tests/helpers'

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
  `,
  'react-large-map.test.ts': `
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
    expect(issues.length).toBe(1) // Or more depending on how the visitor runs
  })

  it('ignores map calls that do not return JSX', () => {
    const code = loadFixture('react', 'react-large-map', 'ignores-no-jsx', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(0)
  })
})
  `,
  'dom-layout-thrashing.test.ts': `
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
  `,
  'memory-event-listener.test.ts': `
import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../tests/helpers'

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
  `
};

for (const [filename, content] of Object.entries(tests)) {
  fs.writeFileSync(path.join(RULES_ROOT, filename), content.trim());
}
console.log("Test files generated.");
