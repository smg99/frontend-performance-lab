import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { getConfiguredEngine } from './rules/index'

const FIXTURE_ROOT = path.join(__dirname, 'test-fixtures')

const engine = getConfiguredEngine()

function loadFixtures(category: string) {
  const categoryPath = path.join(FIXTURE_ROOT, category)
  if (!fs.existsSync(categoryPath)) return []

  return fs.readdirSync(categoryPath).map(name => {
    const dir = path.join(categoryPath, name)
    const files = fs.readdirSync(dir)
    const sourceFile = files.find(f => f.startsWith('source.'))!
    const expectedFile = files.find(f => f === 'expected-report.json')!

    return {
      name,
      code: fs.readFileSync(path.join(dir, sourceFile), 'utf-8'),
      expected: JSON.parse(fs.readFileSync(path.join(dir, expectedFile), 'utf-8'))
    }
  })
}

describe('Analyzer Engine E2E Validation', () => {
  describe('Good vs Bad Paired Assertions', () => {
    const badFixtures = loadFixtures('bad')
    const goodFixtures = loadFixtures('good')

    for (const fixture of badFixtures) {
      it(`[BAD] flags correct issues in ${fixture.name}`, () => {
        const report = engine.analyze([
          {
            filename: fixture.expected.context.filename,
            code: fixture.code,
            language: fixture.expected.context.language,
            framework: fixture.expected.context.framework
          }
        ])

        expect(report.issues.length).toBe(fixture.expected.expectedIssueCount)
        const detectedRules = report.issues.map(i => i.ruleId).sort()
        const expectedRules = [...fixture.expected.expectedRuleIds].sort()
        expect(detectedRules).toEqual(expectedRules)

        // Snapshot testing: lock down the report structure (ignoring dynamic IDs)
        const sanitizedReport = {
          ...report,
          issues: report.issues.map(i => ({ ...i, id: 'mock-id' })),
          checklist: report.checklist.map(c => ({ ...c, id: 'mock-id' }))
        }
        expect(sanitizedReport).toMatchSnapshot()
      })
    }

    for (const fixture of goodFixtures) {
      it(`[GOOD] guarantees ZERO false positives in ${fixture.name}`, () => {
        const report = engine.analyze([
          {
            filename: fixture.expected.context.filename,
            code: fixture.code,
            language: fixture.expected.context.language,
            framework: fixture.expected.context.framework
          }
        ])

        expect(report.issues.length).toBe(0)
        expect(report.overallScore).toBe('A+')
      })
    }
  })

  describe('Edge Cases (Graceful Degradation)', () => {
    const edgeCases = loadFixtures('edge-cases')
    for (const fixture of edgeCases) {
      it(`handles ${fixture.name} without fatal crashes`, () => {
        expect(() => {
          engine.analyze([
            {
              filename: fixture.expected.context.filename,
              code: fixture.code,
              language: fixture.expected.context.language,
              framework: fixture.expected.context.framework
            }
          ])
        }).not.toThrow()
      })
    }
  })

  describe('Real World Robustness', () => {
    const realWorld = loadFixtures('real-world')
    for (const fixture of realWorld) {
      it(`accurately analyzes production-like code: ${fixture.name}`, () => {
        const report = engine.analyze([
          {
            filename: fixture.expected.context.filename,
            code: fixture.code,
            language: fixture.expected.context.language,
            framework: fixture.expected.context.framework
          }
        ])
        expect(report.issues.length).toBe(fixture.expected.expectedIssueCount)
      })
    }
  })

  describe('Performance SLAs', () => {
    const perfFixtures = loadFixtures('performance')
    for (const fixture of perfFixtures) {
      it(`parses and analyzes ${fixture.name} within SLA`, () => {
        const start = performance.now()
        engine.analyze([
          {
            filename: fixture.expected.context.filename,
            code: fixture.code,
            language: fixture.expected.context.language,
            framework: fixture.expected.context.framework
          }
        ])
        const elapsed = performance.now() - start

        // Assert it doesn't take longer than 500ms even for 5000 LOC.
        // This is a strict threshold to protect the UI UX.
        expect(elapsed).toBeLessThan(500)
      })
    }
  })
})
