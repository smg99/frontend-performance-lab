import { describe, it, expect } from 'vitest'
import { AnalyzerEngine } from '../../../shared/utils/analyzer/engine'
import type { ASTRule } from '../../../shared/schemas/analyzer'

describe('AnalyzerEngine Registration', () => {
  it('throws an error when registering a duplicate rule ID', () => {
    const engine = new AnalyzerEngine()

    const rule: ASTRule = {
      id: 'test-duplicate-rule',
      title: 'Test Rule',
      description: 'Test description',
      severity: 'Warning',
      category: 'Performance',
      impact: 'Medium',
      confidence: {
        score: 80,
        reason: 'Static reason',
        falsePositiveRisk: 'Medium'
      },
      supportedLanguages: ['tsx'],
      frameworks: ['react'],
      targetFrameworks: ['react'],
      visitor: () => []
    }

    // First registration should succeed
    expect(() => engine.registerRule(rule)).not.toThrow()

    // Second registration with the same ID should throw
    expect(() => engine.registerRule(rule)).toThrow(
      'Rule ID "test-duplicate-rule" is already registered.'
    )
  })

  it('throws an error when a plugin registers a duplicate rule ID', () => {
    const engine = new AnalyzerEngine()

    const rule1: ASTRule = {
      id: 'test-plugin-rule',
      title: 'Test Plugin Rule',
      description: 'Test description',
      severity: 'Warning',
      category: 'Performance',
      impact: 'Medium',
      confidence: {
        score: 80,
        reason: 'Static reason',
        falsePositiveRisk: 'Medium'
      },
      supportedLanguages: ['tsx'],
      frameworks: ['react'],
      targetFrameworks: ['react'],
      visitor: () => []
    }

    engine.registerPlugin({
      name: 'test-plugin',
      version: '1.0.0',
      rules: [rule1]
    })

    // Registering the plugin again should throw because the rule is already registered
    expect(() =>
      engine.registerPlugin({
        name: 'test-plugin',
        version: '1.0.0',
        rules: [rule1]
      })
    ).toThrow('Rule ID "test-plugin-rule" is already registered.')
  })
})
