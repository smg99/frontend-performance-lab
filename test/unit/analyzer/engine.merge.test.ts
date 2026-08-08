import { describe, it, expect } from 'vitest'
import { AnalyzerEngine } from '../../../shared/utils/analyzer/engine'
import type { ASTRule } from '../../../shared/schemas/analyzer'
import { RuleVisitorResult } from '../../../shared/schemas/analyzer'

describe('AnalyzerEngine Metadata Merge', () => {
  const mockEngine = new AnalyzerEngine()
  const staticRule: ASTRule = {
    id: 'test-rule',
    title: 'Test Rule',
    description: 'Static description',
    severity: 'Warning',
    category: 'Performance',
    impact: 'Medium',
    confidence: {
      score: 80,
      reason: 'Static reason',
      falsePositiveRisk: 'Medium'
    },
    supportedLanguages: ['tsx', 'jsx', 'ts', 'js'],
    frameworks: ['react'],
    targetFrameworks: ['react'],
    browserImpact: {
      rendering: true,
      memory: false,
      network: false
    },
    visitor: () => []
  }

  it('catches rule visitor exceptions and adds a warning without crashing', () => {
    mockEngine['rules'] = []
    const crashingRule = {
      ...staticRule,
      visitor: () => {
        throw new Error('Simulated rule failure')
      }
    }
    mockEngine.registerRule(crashingRule)
    const report = mockEngine.analyze([
      {
        filename: 'crash.tsx',
        code: 'console.log()',
        language: 'tsx',
        framework: 'react'
      }
    ])
    mockEngine['rules'] = []

    expect(report.issues.length).toBe(0)
    expect(report.warnings.length).toBeGreaterThan(0)
    expect(report.warnings[0]).toContain("Rule execution failed: Rule 'test-rule' crashed")
    expect(report.warnings[0]).toContain('Simulated rule failure')
  })
})
