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
    expect(issues[0].description).toBe(
      "Missing { passive: true } on 'touchstart' event listener forces main-thread blocking during scroll."
    )
  })

  it('detects a blocking event listener with passive: false', () => {
    const code = loadFixture('detects-false-passive.js')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].lineNumbers).toContain(1)
    expect(issues[0].description).toBe(
      "Missing { passive: true } on 'touchmove' event listener forces main-thread blocking during scroll."
    )
  })

  it('ignores a blocking event listener with passive: true', () => {
    const code = loadFixture('ignores-with-passive.js')
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('detects boolean capture argument as missing passive: true', () => {
    const code = `
      el.addEventListener('touchstart', handler, true)
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].description).toBe(
      "Missing { passive: true } on 'touchstart' event listener forces main-thread blocking during scroll."
    )
  })

  it('resolves options variable with known passive: true', () => {
    const code = `
      const options = { passive: true }
      el.addEventListener('touchstart', handler, options)
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('reports unknown options variable with conservative warning', () => {
    const code = `
      const options = getOptions()
      el.addEventListener('touchstart', handler, options)
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].description).toBe(
      "Event listener for 'touchstart' uses unverified options that may lack { passive: true }."
    )
  })

  it('ignores non-scroll-blocking event types', () => {
    const code = `
      el.addEventListener('click', handler)
      el.addEventListener('keydown', handler)
      el.addEventListener('scroll', handler)
      el.addEventListener('resize', handler)
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('ignores dynamic event names conservately', () => {
    const code = `
      el.addEventListener(eventName, handler)
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(0)
  })

  it('detects missing passive on touchend event listeners', () => {
    const code = `
      el.addEventListener('touchend', handler)
    `
    const { ast } = parseBabel(code, true)
    const context = createContext(code)

    const issues = passiveEventListenerMissing.visitor(ast, context)
    expect(issues).toHaveLength(1)
    expect(issues[0].description).toBe(
      "Missing { passive: true } on 'touchend' event listener forces main-thread blocking during scroll."
    )
  })
})
