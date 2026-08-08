import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: dom-layout-thrashing', () => {
  it('detects style mutations causing thrashing', () => {
    const code = loadFixture('javascript', 'dom-layout-thrashing', 'detects-basic', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Layout thrashing: style assignment on 'element' interleaves layout read 'clientWidth' outside requestAnimationFrame."
    )
  })

  it('ignores style mutations inside requestAnimationFrame', () => {
    const code = loadFixture('javascript', 'dom-layout-thrashing', 'ignores-raf', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(0)
  })

  it('detects forced reflow when style write is followed by layout read', () => {
    const code = `
      function update() {
        element.style.width = '100px'
        const width = element.offsetWidth
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Forced reflow: DOM style write on 'element' followed by synchronous layout read 'offsetWidth'."
    )
  })

  it('ignores batched read followed by write outside loops', () => {
    const code = `
      function update() {
        const width = element.offsetWidth
        const height = element.offsetHeight
        element.style.width = width + 'px'
        element.style.height = height + 'px'
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(0)
  })

  it('ignores read-only operations', () => {
    const code = `
      function read() {
        const width = element.offsetWidth
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(0)
  })

  it('ignores write-only operations', () => {
    const code = `
      function write() {
        element.style.width = '100px'
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(0)
  })

  it('detects write followed by read across different elements', () => {
    const code = `
      function update() {
        header.style.height = '100px'
        const footerHeight = footer.offsetHeight
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Forced reflow: DOM style write on 'header' followed by synchronous layout read 'offsetHeight'."
    )
  })

  it('detects layout thrashing inside loops', () => {
    const code = `
      function updateAll() {
        for (const item of items) {
          item.style.width = '100px'
          const width = item.offsetWidth
        }
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Layout thrashing: interleaved DOM layout read ('offsetWidth') and style write on 'item' inside loop."
    )
  })

  it('detects forced reflow with getBoundingClientRect()', () => {
    const code = `
      function update() {
        element.style.width = '100px'
        const rect = element.getBoundingClientRect()
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Forced reflow: DOM style write on 'element' followed by synchronous layout read 'getBoundingClientRect'."
    )
  })

  it('reports multiple independent forced reflow sequences', () => {
    const code = `
      function update() {
        element1.style.width = '100px'
        const w1 = element1.offsetWidth
        element2.style.height = '50px'
        const h2 = element2.offsetHeight
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'dom-layout-thrashing')
    expect(issues.length).toBe(2)
  })
})
