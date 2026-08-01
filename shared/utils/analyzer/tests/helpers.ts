import fs from 'fs'
import path from 'path'
import { getConfiguredEngine } from '../rules/index'

const FIXTURE_ROOT = path.join(__dirname, 'fixtures')
const engine = getConfiguredEngine()

/**
 * Executes the analyzer with the full engine, but we will assert on the output of specific rules.
 */
export function runAnalyzer(code: string, language: string, framework: string) {
  return engine.analyze([{
    filename: `test.${language}`,
    code,
    language,
    framework
  }])
}

/**
 * Loads a fixture from the specified path
 */
export function loadFixture(language: string, ruleName: string, scenario: string, extension: string): string {
  const fixturePath = path.join(FIXTURE_ROOT, language, ruleName, `${scenario}.${extension}`)
  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture not found: ${fixturePath}`)
  }
  return fs.readFileSync(fixturePath, 'utf-8')
}
