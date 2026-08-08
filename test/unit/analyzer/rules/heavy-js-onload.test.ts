import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: heavyJsOnload', () => {
  it('detects deep nesting in useEffect', () => {
    const code = loadFixture('react', 'heavy-js-onload', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      'Heavy synchronous JavaScript execution during startup (nested loops) blocks the main thread.'
    )
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

  it('detects heavy work in window load event listener', () => {
    const code = `
      window.addEventListener('load', () => {
        for (let i = 0; i < 100; i++) {
          for (let j = 0; j < 100; j++) {
            console.log(i, j);
          }
        }
      });
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      'Heavy synchronous JavaScript execution during startup (nested loops) blocks the main thread.'
    )
  })

  it('ignores heavy work deferred inside requestIdleCallback or setTimeout', () => {
    const code = `
      import { useEffect } from 'react';
      export default function App() {
        useEffect(() => {
          requestIdleCallback(() => {
            for (let i = 0; i < 100; i++) {
              for (let j = 0; j < 100; j++) {
                console.log(i, j);
              }
            }
          });
        }, []);
        return <div>App</div>;
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(0)
  })

  it('detects heavy API calls inside loops during startup', () => {
    const code = `
      import { onMounted } from 'vue';
      onMounted(() => {
        const rawItems = ['{}', '{}'];
        for (const item of rawItems) {
          const parsed = JSON.parse(item);
        }
      });
    `
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      'Heavy synchronous JavaScript execution during startup (heavy API call in loop) blocks the main thread.'
    )
  })

  it('detects high statement count in startup hook', () => {
    const stmts = Array.from({ length: 40 }, (_, i) => `let x${i} = ${i};`).join('\n')
    const code = `
      useEffect(() => {
        ${stmts}
      }, []);
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'heavy-js-onload')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toContain(
      'Heavy synchronous JavaScript execution during startup (high statement count (41)) blocks the main thread.'
    )
  })
})
