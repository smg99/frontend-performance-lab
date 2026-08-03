import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { mcpCore, detectFrameworkAndLanguage } from '../../shared/mcp/core'

describe('Analyzer Quality Sprint: Benchmark Suite', () => {
  const fixturesDir = path.join(__dirname, '../fixtures')

  describe('Vue Test Cases', () => {
    const vueDir = path.join(fixturesDir, 'vue')
    const files = fs.existsSync(vueDir) ? fs.readdirSync(vueDir) : []

    files.forEach(file => {
      it('Audits ' + file + ' correctly', async () => {
        const sourceCode = fs.readFileSync(path.join(vueDir, file), 'utf-8')

        // 1. Verify Framework Detection
        const detected = detectFrameworkAndLanguage(sourceCode)
        expect(detected.framework).toBe('vue')

        // 2. Analyzer never crashes
        const result = await mcpCore.performance_audit({ sourceCode })
        const payload = JSON.parse(result.content[0].text)

        // 3. Score Range & Issues
        expect(payload.score).toBeLessThan(100)
        expect(payload.issues.length).toBeGreaterThan(0)

        // Check for specific expected issue IDs based on the fixture
        const issueIds = payload.issues.map((i: { id: string }) => i.id)
        expect(issueIds.some((id: string) => id.includes('vue-large-v-for'))).toBe(true)
      })
    })
  })

  describe('React Test Cases', () => {
    const reactDir = path.join(fixturesDir, 'react')
    const files = fs.existsSync(reactDir) ? fs.readdirSync(reactDir) : []

    files.forEach(file => {
      it('Audits ' + file + ' correctly', async () => {
        const sourceCode = fs.readFileSync(path.join(reactDir, file), 'utf-8')

        const detected = detectFrameworkAndLanguage(sourceCode)
        expect(detected.framework).toBe('react')

        const result = await mcpCore.performance_audit({ sourceCode })
        const payload = JSON.parse(result.content[0].text)

        expect(payload.score).toBeLessThan(100)
        expect(payload.issues.length).toBeGreaterThan(0)

        const issueIds = payload.issues.map((i: { id: string }) => i.id)
        expect(issueIds.some((id: string) => id.includes('react-large-map'))).toBe(true)
      })
    })
  })

  describe('Malformed File Resiliency', () => {
    const errDir = path.join(fixturesDir, 'malformed')
    const files = fs.existsSync(errDir) ? fs.readdirSync(errDir) : []

    files.forEach(file => {
      it('Gracefully handles ' + file + ' without crashing', async () => {
        const sourceCode = fs.readFileSync(path.join(errDir, file), 'utf-8')

        const result = await mcpCore.performance_audit({ sourceCode })
        const payload = JSON.parse(result.content[0].text)

        // Analyzer must not crash, should fallback to 100 with no issues
        expect(payload.score).toBe(100)
        expect(payload.issues).toEqual([])
      })
    })
  })

  describe('Clean Baseline Verification', () => {
    const cleanDir = path.join(fixturesDir, 'clean')
    const files = fs.existsSync(cleanDir) ? fs.readdirSync(cleanDir) : []

    files.forEach(file => {
      it('Finds no false positives in ' + file, async () => {
        const sourceCode = fs.readFileSync(path.join(cleanDir, file), 'utf-8')

        const result = await mcpCore.performance_audit({ sourceCode })
        const payload = JSON.parse(result.content[0].text)

        expect(payload.score).toBe(100)
        expect(payload.issues).toEqual([])
      })
    })
  })
})
