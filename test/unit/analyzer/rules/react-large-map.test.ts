import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: react-large-map', () => {
  it('detects a basic map returning JSX', () => {
    const code = loadFixture('react', 'react-large-map', 'detects-basic', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe("Unvirtualized .map() on 'items' returning JSX")
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

  it('ignores small inline array literals (<= 10 items)', () => {
    const code = `
      export default function Tabs() {
        return (
          <div>
            {['Home', 'About', 'Contact'].map(tab => (
              <button key={tab}>{tab}</button>
            ))}
          </div>
        )
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(0)
  })

  it('ignores small static array variables defined in scope', () => {
    const code = `
      const NAV_ITEMS = ['Overview', 'Details', 'Settings'];

      export default function Nav() {
        return (
          <nav>
            {NAV_ITEMS.map(item => (
              <a key={item} href="#">{item}</a>
            ))}
          </nav>
        )
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(0)
  })

  it('ignores bounded array slices (e.g. .slice(0, 5))', () => {
    const code = `
      export default function RecentItems({ items }) {
        return (
          <ul>
            {items.slice(0, 5).map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'react-large-map')
    expect(issues.length).toBe(0)
  })
})
