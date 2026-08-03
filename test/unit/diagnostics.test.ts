import { describe, it, expect } from 'vitest'
import { DiagnosticsMapper, DiagnosticsRegistry } from '../../shared/diagnostics/mapper'

describe('DiagnosticsMapper', () => {
  it('maps known rules correctly', () => {
    const raw = [{ id: 'dom-layout-thrashing', line: 42, severity: 'high' }]
    const enriched = DiagnosticsMapper.enrich(raw)

    expect(enriched.length).toBe(1)
    expect(enriched[0].id).toBe('dom-layout-thrashing')
    expect(enriched[0].title).toBe('Forced Synchronous Layout (Layout Thrashing)')
    expect(enriched[0].category).toBe('DOM Performance')
    expect(enriched[0].severity).toBe('high')
    expect(enriched[0].confidence).toBe('high')
    expect(enriched[0].summary).toBeTruthy()
    expect(enriched[0].why).toBeTruthy()
    expect(enriched[0].impact).toBeTruthy()
    expect(enriched[0].howToVerify).toBeTruthy()
    expect(enriched[0].recommendedFix).toBeTruthy()
    expect(Array.isArray(enriched[0].references)).toBe(true)
    expect(enriched[0].references.length).toBeGreaterThan(0)
    expect(enriched[0].line).toBe(42)
  })

  it('degrades gracefully for unknown rules', () => {
    const raw = [{ id: 'some-unknown-rule', line: 10 }]
    const enriched = DiagnosticsMapper.enrich(raw)

    expect(enriched.length).toBe(1)
    expect(enriched[0].id).toBe('some-unknown-rule')
    expect(enriched[0].title).toBe('Unknown Violation: some-unknown-rule')
    expect(enriched[0].category).toBe('Unknown')
    expect(enriched[0].severity).toBe('medium')
    expect(enriched[0].confidence).toBe('low')
    expect(Array.isArray(enriched[0].references)).toBe(true)
    expect(enriched[0].line).toBe(10)
  })

  it('verifies that all registered rules have required fields', () => {
    const rules = Object.values(DiagnosticsRegistry)
    expect(rules.length).toBeGreaterThan(0)

    for (const rule of rules) {
      expect(rule.id).toBeTruthy()
      expect(rule.title).toBeTruthy()
      expect(rule.category).toBeTruthy()
      expect(rule.severity).toBeTruthy()
      expect(['high', 'medium', 'low']).toContain(rule.confidence)
      expect(rule.summary).toBeTruthy()
      expect(rule.why).toBeTruthy()
      expect(rule.impact).toBeTruthy()
      expect(rule.howToVerify).toBeTruthy()
      expect(rule.recommendedFix).toBeTruthy()
      expect(Array.isArray(rule.references)).toBe(true)
      expect(rule.framework).toBeTruthy()
      expect(rule.ruleVersion).toBeTruthy()
    }
  })
})
