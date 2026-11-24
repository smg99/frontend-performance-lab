import { describe, expect, it } from 'vitest'
import {
  reconcileAuditFindings,
  type AuditFinding,
  type StoredAuditReport
} from '../../shared/audit/regression'

const buildFinding: AuditFinding = {
  key: 'build-budget:javascriptBytes:_nuxt',
  audit: 'build-budget',
  rule: 'javascriptBytes',
  location: '_nuxt',
  detail: 'JavaScript bundle exceeded its configured budget.'
}

const accessibilityFinding: AuditFinding = {
  key: 'accessibility:document-title:/broken',
  audit: 'accessibility',
  rule: 'document-title',
  location: '/broken',
  detail: 'The document must include a non-empty title.'
}

describe('audit regression reconciliation', () => {
  it('deduplicates seeded findings and marks them open', () => {
    const report = reconcileAuditFindings([buildFinding, buildFinding], null)

    expect(report.summary).toEqual({ active: 1, recovered: 0, added: 1 })
    expect(report.findings).toEqual([{ ...buildFinding, status: 'open' }])
  })

  it('reuses an existing open finding and does not create noise', () => {
    const previous: StoredAuditReport = {
      findings: [{ ...buildFinding, status: 'open' }]
    }

    const report = reconcileAuditFindings([buildFinding], previous)

    expect(report.summary).toEqual({ active: 1, recovered: 0, added: 0 })
    expect(report.findings[0].status).toBe('open')
  })

  it('recovers findings that disappear and keeps the recovered finding actionable history', () => {
    const previous: StoredAuditReport = {
      findings: [
        { ...buildFinding, status: 'open' },
        { ...accessibilityFinding, status: 'open' }
      ]
    }

    const report = reconcileAuditFindings([buildFinding], previous)

    expect(report.summary).toEqual({ active: 1, recovered: 1, added: 0 })
    expect(report.findings.find(finding => finding.key === buildFinding.key)?.status).toBe('open')
    expect(report.findings.find(finding => finding.key === accessibilityFinding.key)?.status).toBe(
      'recovered'
    )
  })

  it('sorts findings deterministically by audit, rule and location', () => {
    const report = reconcileAuditFindings([buildFinding, accessibilityFinding], null)

    expect(report.findings.map(finding => finding.key)).toEqual([
      'accessibility:document-title:/broken',
      'build-budget:javascriptBytes:_nuxt'
    ])
  })
})
