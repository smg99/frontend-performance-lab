import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: memory-event-listener', () => {
  it('detects a global addEventListener with no removeEventListener', () => {
    const code = loadFixture('javascript', 'memory-event-listener', 'detects-basic', 'js')
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Global 'resize' event listener on 'window' may persist without cleanup."
    )
  })

  it('ignores when removeEventListener is present with matching reference', () => {
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

  it('flags when removeEventListener references a different handler', () => {
    const code = `
      function mount() {
        window.addEventListener('resize', handleA)
        window.removeEventListener('resize', handleB)
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(1)
  })

  it('flags anonymous function listeners as suspicious even if removeEventListener call exists', () => {
    const code = `
      function mount() {
        window.addEventListener('resize', () => {})
        window.removeEventListener('resize', () => {})
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(1)
  })

  it('handles React useEffect lifecycle cleanup correctly', () => {
    const code = `
      import { useEffect } from 'react'
      export default function App() {
        useEffect(() => {
          const handle = () => {}
          window.addEventListener('resize', handle)
          return () => window.removeEventListener('resize', handle)
        }, [])
        return <div>App</div>
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(0)
  })

  it('handles Vue onMounted / onUnmounted lifecycle cleanup correctly', () => {
    const code = `
      import { onMounted, onUnmounted } from 'vue'
      export default {
        setup() {
          const handle = () => {}
          onMounted(() => window.addEventListener('resize', handle))
          onUnmounted(() => window.removeEventListener('resize', handle))
        }
      }
    `
    const report = runAnalyzer(code, 'js', 'vue')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(0)
  })

  it('flags when removeEventListener uses a different event type', () => {
    const code = `
      function mount() {
        window.addEventListener('resize', handle)
        window.removeEventListener('click', handle)
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(1)
  })

  it('flags when removeEventListener targets a different object', () => {
    const code = `
      function mount() {
        window.addEventListener('resize', handle)
        document.removeEventListener('resize', handle)
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(1)
  })

  it('ignores addEventListener calls with once: true or signal options', () => {
    const code = `
      function mount() {
        window.addEventListener('resize', handle, { once: true })
        document.addEventListener('click', handle, { signal: controller.signal })
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'memory-event-listener')
    expect(issues.length).toBe(0)
  })
})
