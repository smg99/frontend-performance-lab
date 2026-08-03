import { describe, it, expect } from 'vitest'
import { jsxDynamicLayoutStyle } from '../../../../shared/utils/analyzer/rules/jsx-dynamic-layout-style'
import { parseBabel } from '../../../../shared/utils/analyzer/parsers/babel'
import type { AnalyzerContext } from '../../../../shared/schemas/analyzer'
import fs from 'fs'
import path from 'path'

describe('Rule: jsx-dynamic-layout-style', () => {
  const loadFixture = (filename: string) => {
    return fs.readFileSync(
      path.join(
        __dirname,
        '../../../../shared/utils/analyzer/tests/fixtures/react/jsx-dynamic-layout-style',
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

  it('detects dynamic top property in inline style', () => {
    const code = loadFixture('detects-dynamic-width.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = jsxDynamicLayoutStyle.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(5)
  })

  it('ignores static literal values in layout properties', () => {
    const code = loadFixture('ignores-static-width.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = jsxDynamicLayoutStyle.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('ignores dynamic values in non-layout properties like transform', () => {
    const code = loadFixture('ignores-transform.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = jsxDynamicLayoutStyle.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })
})
