import { describe, it, expect } from 'vitest'
import { AnalyzerEngine } from '../../../shared/utils/analyzer/engine'
import type { ASTRule, RuleVisitorResult } from '../../../shared/schemas/analyzer'

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
  function simulateMerge(rawResult: RuleVisitorResult) {
    // We override the rule temporarily for testing purposes
    staticRule.visitor = () => [rawResult]
    mockEngine.registerRule(staticRule)
    const report = mockEngine.analyze([
      {
        filename: 'test.tsx',
        code: 'console.log()',
        language: 'tsx',
        framework: 'react'
      }
    ])
    mockEngine['rules'] = []
    return report.issues[0]
  }

  it('preserves static metadata when no overrides are provided', () => {
    const issue = simulateMerge({ lineNumbers: [10] })
    expect(issue.description).toBe('Static description')
    expect(issue.confidence.score).toBe(80)
    expect(issue.confidence.reason).toBe('Static reason')
    expect(issue.confidence.falsePositiveRisk).toBe('Medium')
  })

  it('overrides description when dynamic description is provided', () => {
    const issue = simulateMerge({
      lineNumbers: [10],
      description: 'Dynamic description'
    })
    expect(issue.description).toBe('Dynamic description')
    expect(issue.confidence.score).toBe(80)
    expect(issue.confidence.reason).toBe('Static reason')
  })

  it('merges partial confidence correctly', () => {
    const issue = simulateMerge({
      lineNumbers: [10],
      confidence: { score: 95 }
    })
    expect(issue.description).toBe('Static description')
    expect(issue.confidence.score).toBe(95)
    expect(issue.confidence.reason).toBe('Static reason')
    expect(issue.confidence.falsePositiveRisk).toBe('Medium')
  })

  it('handles score of 0 correctly', () => {
    const issue = simulateMerge({
      lineNumbers: [10],
      confidence: { score: 0 }
    })
    expect(issue.confidence.score).toBe(0)
  })

  it('merges complete dynamic confidence correctly', () => {
    const issue = simulateMerge({
      lineNumbers: [10],
      confidence: {
        score: 100,
        reason: 'Dynamic reason',
        falsePositiveRisk: 'Low'
      }
    })
    expect(issue.description).toBe('Static description')
    expect(issue.confidence.score).toBe(100)
    expect(issue.confidence.reason).toBe('Dynamic reason')
    expect(issue.confidence.falsePositiveRisk).toBe('Low')
  })

  it('handles both description and confidence overrides together', () => {
    const issue = simulateMerge({
      lineNumbers: [10],
      description: 'Dynamic description',
      confidence: { score: 99 }
    })
    expect(issue.description).toBe('Dynamic description')
    expect(issue.confidence.score).toBe(99)
    expect(issue.confidence.reason).toBe('Static reason')
  })

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
