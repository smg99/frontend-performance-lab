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
    expect(issues[0].description).toBe(
      'Context.Provider receives a newly-created object value during render.'
    )
  })

  it('detects inline function passed to Context.Provider', () => {
    const code = loadFixture('detects-function.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(6)
    expect(issues[0].description).toBe(
      'Context.Provider receives a newly-created function value during render.'
    )
  })

  it('detects inline array passed to Context.Provider', () => {
    const code = `
      export const App = ({ a, b }) => (
        <Ctx.Provider value={[a, b]} />
      )
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].description).toBe(
      'Context.Provider receives a newly-created array value during render.'
    )
  })

  it('detects unmemoized local object variable passed to Context.Provider', () => {
    const code = `
      export const App = ({ user }) => {
        const val = { user, theme: 'dark' }
        return <Ctx.Provider value={val} />
      }
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].description).toBe(
      "Context.Provider receives unmemoized local variable 'val' during render."
    )
  })

  it('ignores properly memoized values passed to Context.Provider', () => {
    const code = loadFixture('ignores-memoized.jsx')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('ignores inline useMemo and useCallback hook calls', () => {
    const code = `
      export const App = ({ user, fn }) => (
        <Ctx.Provider value={useMemo(() => ({ user }), [user])} />
      )
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('ignores local useCallback bindings', () => {
    const code = `
      export const App = ({ fetchData }) => {
        const refresh = useCallback(() => fetchData(), [fetchData])
        return <Ctx.Provider value={refresh} />
      }
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('ignores outer module-scope constant identifiers', () => {
    const code = `
      const GLOBAL_THEME = { mode: 'dark' }
      export const App = () => (
        <Ctx.Provider value={GLOBAL_THEME} />
      )
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('ignores local call expressions, member expressions, and conditional values', () => {
    const code = `
      export const App = (props) => {
        const val1 = getContextValue()
        const val2 = props.contextValue
        const val3 = props.isDark ? themeA : themeB
        return (
          <>
            <Ctx1.Provider value={val1} />
            <Ctx2.Provider value={val2} />
            <Ctx3.Provider value={val3} />
          </>
        )
      }
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('evaluates multiple Providers independently', () => {
    const code = `
      export const App = ({ user }) => {
        const memoizedVal = useMemo(() => ({ user }), [user])
        return (
          <Ctx1.Provider value={{ inline: true }}>
            <Ctx2.Provider value={memoizedVal}>
              <Ctx3.Provider value={[1, 2]} />
            </Ctx2.Provider>
          </Ctx1.Provider>
        )
      }
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(2)
  })

  it('ignores non-Provider JSX elements', () => {
    const code = `
      export const App = ({ user }) => (
        <MyComponent value={{ user }} />
      )
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = reactUnmemoizedContextProvider.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })
})
