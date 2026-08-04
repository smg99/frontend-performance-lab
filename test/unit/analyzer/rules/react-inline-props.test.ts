import { describe, it, expect } from 'vitest'
import { reactInlineProps } from '../../../../shared/utils/analyzer/rules/react-inline-props'
import { parseBabel } from '../../../../shared/utils/analyzer/parsers/babel'

describe('React Inline Props Rule', () => {
  it('should detect inline object prop to custom component', () => {
    const code = `
      import React from 'react'
      const Parent = () => {
        return <Child data={{ foo: 'bar' }} />
      }
    `
    const { ast } = parseBabel(code, true)
    const issues = reactInlineProps.visitor(ast, {
      filename: 'test.tsx',
      code,
      language: 'tsx',
      framework: 'react'
    })
    expect(issues.length).toBe(1)
  })

  it('should detect inline function prop to custom component', () => {
    const code = `
      import React from 'react'
      const Parent = () => {
        return <Child onClick={() => console.log('hello')} />
      }
    `
    const { ast } = parseBabel(code, true)
    const issues = reactInlineProps.visitor(ast, {
      filename: 'test.tsx',
      code,
      language: 'tsx',
      framework: 'react'
    })
    expect(issues.length).toBe(1)
  })

  it('should NOT detect inline props on native HTML elements', () => {
    const code = `
      import React from 'react'
      const Parent = () => {
        return <div style={{ color: 'red' }} onClick={() => console.log('hi')} />
      }
    `
    const { ast } = parseBabel(code, true)
    const issues = reactInlineProps.visitor(ast, {
      filename: 'test.tsx',
      code,
      language: 'tsx',
      framework: 'react'
    })
    expect(issues.length).toBe(0)
  })

  it('should NOT detect variable references', () => {
    const code = `
      import React, { useMemo } from 'react'
      const Parent = () => {
        const data = useMemo(() => ({ foo: 'bar' }), [])
        return <Child data={data} />
      }
    `
    const { ast } = parseBabel(code, true)
    const issues = reactInlineProps.visitor(ast, {
      filename: 'test.tsx',
      code,
      language: 'tsx',
      framework: 'react'
    })
    expect(issues.length).toBe(0)
  })
})
