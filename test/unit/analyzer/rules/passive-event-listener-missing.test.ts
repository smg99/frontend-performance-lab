import { describe, it, expect } from 'vitest'
import { passiveEventListenerMissing } from '../../../../shared/utils/analyzer/rules/passive-event-listener-missing'
import { parseBabel } from '../../../../shared/utils/analyzer/parsers/babel'
import type { AnalyzerContext } from '../../../../shared/schemas/analyzer'
import fs from 'fs'
import path from 'path'

describe('Rule: passive-event-listener-missing', () => {
  const loadFixture = (filename: string) => {
    return fs.readFileSync(
      path.join(
        __dirname,
        '../../../../shared/utils/analyzer/tests/fixtures/vanilla/passive-event-listener',
        filename
      ),
      'utf-8'
    )
  }

  const createContext = (code: string): AnalyzerContext => ({
    code,
    language: 'js',
    framework: 'vanilla',
    filePath: 'test.js'
  })

  it('detects a blocking event listener without options', () => {
    const code = loadFixture('detects-missing-passive.js')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(1)
  })

  it('detects a blocking event listener with passive: false', () => {
    const code = loadFixture('detects-false-passive.js')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(1)
  })

  it('ignores a blocking event listener with passive: true', () => {
    const code = loadFixture('ignores-with-passive.js')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })
})
