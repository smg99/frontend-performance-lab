import { describe, it, expect } from 'vitest'
import { PerformanceReportBuilder } from '../../shared/reporting/builder'
import type { EnrichedDiagnostic } from '../../shared/diagnostics/types'

describe('PerformanceReportBuilder', () => {
  it('generates a clean empty report for 100 score', () => {
    const report = PerformanceReportBuilder.build([], { score: 100, filename: 'Test.vue' })
    expect(report).toContain('Overall Score: **100 / 100**')
    expect(report).toContain('This component is highly optimized.')
    expect(report).toContain('Zero architectural anti-patterns detected.')
    expect(report).not.toContain('Critical Issues')
  })

  it('groups and sorts multiple issues correctly', () => {
    const issues: EnrichedDiagnostic[] = [
      {
        id: 'low-1',
        title: 'Low Title',
        category: 'Cat',
        severity: 'low',
        confidence: 'low',
        summary: 'Sum',
        why: 'Why',
        impact: 'Imp',
        howToVerify: 'How',
        recommendedFix: 'Fix',
        references: [],
        framework: 'vue',
        ruleVersion: '1',
        line: 10
      },
      {
        id: 'crit-2',
        title: 'Crit 2 Title',
        category: 'Cat',
        severity: 'critical',
        confidence: 'high',
        summary: 'Sum',
        why: 'Why',
        impact: 'Imp',
        howToVerify: 'How',
        recommendedFix: 'Fix',
        references: [],
        framework: 'vue',
        ruleVersion: '1',
        line: 20
      },
      {
        id: 'crit-1',
        title: 'Crit 1 Title',
        category: 'Cat',
        severity: 'critical',
        confidence: 'high',
        summary: 'Sum',
        why: 'Why',
        impact: 'Imp',
        howToVerify: 'How',
        recommendedFix: 'Fix',
        references: [],
        framework: 'vue',
        ruleVersion: '1',
        line: 5
      }
    ]

    const report = PerformanceReportBuilder.build(issues, { score: 50, filename: 'Test.vue' })
    expect(report).toContain('Overall Score: **50 / 100**')
    expect(report).toContain(
      'We detected 3 area(s) for improvement, including 2 critical and 0 high-severity'
    )
    expect(report).toContain('## Critical Issues')
    expect(report).toContain('## Low Priority')
    expect(report).not.toContain('## High Priority')
    expect(report).not.toContain('## Medium Priority')

    // Check deterministic sorting by line number (Line 5 should appear before Line 20)
    const crit1Idx = report.indexOf('Crit 1 Title')
    const crit2Idx = report.indexOf('Crit 2 Title')
    expect(crit1Idx).toBeLessThan(crit2Idx)
  })
})
