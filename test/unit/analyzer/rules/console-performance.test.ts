import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'
import { consolePerformance } from '../../../../shared/utils/analyzer/rules/console-performance'
import { parseBabel } from '../../../../shared/utils/analyzer/parsers/babel'
import type { AnalyzerContext, Issue } from '../../../../shared/schemas/analyzer'

const makeContext = (code: string): AnalyzerContext => ({
  code,
  language: 'js',
  framework: 'js',
  filePath: 'test.js'
})

describe('Rule: console-performance', () => {
  // ─── visitor ────────────────────────────────────────────────────────────────

  describe('visitor', () => {
    it('detects console.log on the correct line', () => {
      const code = loadFixture('javascript', 'console-performance', 'detects-console-calls', 'js')
      const report = runAnalyzer(code, 'js', 'js')
      const issues = report.issues.filter(i => i.ruleId === 'console-performance')
      expect(issues).toHaveLength(3)
    })

    it('detects console.warn and console.error as issues', () => {
      const code = loadFixture('javascript', 'console-performance', 'detects-console-calls', 'js')
      const { ast } = parseBabel(code, false)
      const context = makeContext(code)
      const issues = consolePerformance.visitor(ast, context)
      expect(issues).toHaveLength(3)
      expect(issues[0].lineNumbers).toContain(1)
      expect(issues[1].lineNumbers).toContain(2)
      expect(issues[2].lineNumbers).toContain(3)
    })

    it('returns no issues when there are no console calls', () => {
      const code = loadFixture('javascript', 'console-performance', 'ignores-no-console', 'js')
      const report = runAnalyzer(code, 'js', 'js')
      const issues = report.issues.filter(i => i.ruleId === 'console-performance')
      expect(issues).toHaveLength(0)
    })

    it('detects console.log used inside an expression', () => {
      const code = loadFixture(
        'javascript',
        'console-performance',
        'detects-console-in-expression',
        'js'
      )
      const { ast } = parseBabel(code, false)
      const context = makeContext(code)
      const issues = consolePerformance.visitor(ast, context)
      expect(issues).toHaveLength(1)
      expect(issues[0].lineNumbers).toContain(1)
    })
  })

  // ─── fixer ──────────────────────────────────────────────────────────────────

  describe('fixer', () => {
    it('removes standalone console.log statements and returns true', () => {
      const code = `console.log('hello')\nconst x = 1`
      const { ast } = parseBabel(code, false)
      const context = makeContext(code)
      const mutated = consolePerformance.fixer!(ast, context, [] as unknown as Issue[])
      expect(mutated).toBe(true)
    })

    it('replaces console.log used in an expression with undefined', () => {
      const code = `const x = console.log('side-effect') || 'fallback'`
      const { ast } = parseBabel(code, false)
      const context = makeContext(code)
      const mutated = consolePerformance.fixer!(ast, context, [] as unknown as Issue[])
      expect(mutated).toBe(true)
    })

    it('returns false when there are no console calls to fix', () => {
      const code = `function add(a, b) { return a + b }`
      const { ast } = parseBabel(code, false)
      const context = makeContext(code)
      const mutated = consolePerformance.fixer!(ast, context, [] as unknown as Issue[])
      expect(mutated).toBe(false)
    })
  })

  // ─── metadata ───────────────────────────────────────────────────────────────

  describe('metadata', () => {
    it('has the correct rule id', () => {
      expect(consolePerformance.id).toBe('console-performance')
    })

    it('reports severity as Warning', () => {
      expect(consolePerformance.severity).toBe('Warning')
    })

    it('targets js and react frameworks', () => {
      expect(consolePerformance.frameworks).toContain('react')
      expect(consolePerformance.frameworks).toContain('js')
    })
  })
})
