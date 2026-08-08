import { describe, it, expect } from 'vitest'
import { runAnalyzer } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: imgMissingDimensions', () => {
  it('flags React JSX img tags missing both width and height', () => {
    const code = `
      export default function Hero() {
        return <img src="hero.jpg" alt="Hero Banner" />
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'img-missing-dimensions')
    expect(issues.length).toBe(1)
  })

  it('does NOT flag React JSX img tags with explicit width attribute', () => {
    const code = `
      export default function Hero() {
        return <img src="hero.jpg" width="800" alt="Hero Banner" />
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'img-missing-dimensions')
    expect(issues.length).toBe(0)
  })

  it('does NOT flag React JSX img tags with explicit height attribute', () => {
    const code = `
      export default function Hero() {
        return <img src="hero.jpg" height={600} alt="Hero Banner" />
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'img-missing-dimensions')
    expect(issues.length).toBe(0)
  })

  it('does NOT flag React JSX img tags with both width and height attributes', () => {
    const code = `
      export default function Hero() {
        return <img src="hero.jpg" width={800} height={600} alt="Hero Banner" />
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'img-missing-dimensions')
    expect(issues.length).toBe(0)
  })

  it('flags Vue img tags missing both width and height', () => {
    const code = `
      <template>
        <img src="hero.jpg" alt="Hero Banner" />
      </template>
    `
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'img-missing-dimensions')
    expect(issues.length).toBe(1)
  })

  it('does NOT flag Vue img tags with static or dynamic width/height', () => {
    const code = `
      <template>
        <div>
          <img src="1.jpg" width="800" />
          <img src="2.jpg" :height="600" />
          <img src="3.jpg" :width="imgWidth" :height="imgHeight" />
        </div>
      </template>
    `
    const report = runAnalyzer(code, 'vue', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'img-missing-dimensions')
    expect(issues.length).toBe(0)
  })
})
