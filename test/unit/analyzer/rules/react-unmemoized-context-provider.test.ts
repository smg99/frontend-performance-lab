import { describe, it, expect } from 'vitest'
import { reactUnmemoizedContextProvider } from '../../../../shared/utils/analyzer/rules/react-unmemoized-context-provider'
import { parseBabel } from '../../../../shared/utils/analyzer/parsers/babel'
import type { AnalyzerContext } from '../../../../shared/schemas/analyzer'
import fs from 'fs'
import path from 'path'

describe('Rule: react-unmemoized-context-provider', () => {
  const loadFixture = (filename: string) => {
    return fs.readFileSync(
      path.join(
        __dirname,
        '../../../../shared/utils/analyzer/tests/fixtures/react/react-unmemoized-context',
        filename
      ),
      'utf-8'
    )
  }

  const createContext = (code: string): AnalyzerContext => ({
    code,
    language: 'jsx',
    framework: 'react',
    filePath: 'test.jsx'
  })

  it('detects inline object passed to Context.Provider', () => {
    const code = loadFixture('detects-object.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(6)
  })

  it('detects inline function passed to Context.Provider', () => {
    const code = loadFixture('detects-function.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(6)
  })

  it('ignores properly memoized values passed to Context.Provider', () => {
    const code = loadFixture('ignores-memoized.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })
})
