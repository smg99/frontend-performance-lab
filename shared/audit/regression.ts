export type AuditFindingStatus = 'open' | 'recovered'

export interface AuditFinding {
  key: string
  audit: string
  rule: string
  location: string
  detail: string
}

export interface ReconciledAuditFinding extends AuditFinding {
  status: AuditFindingStatus
}

export interface StoredAuditReport {
  findings: ReconciledAuditFinding[]
}

export interface AuditRegressionReport {
  findings: ReconciledAuditFinding[]
  summary: {
    active: number
    recovered: number
    added: number
  }
}

export function reconcileAuditFindings(
  current: AuditFinding[],
  previous: StoredAuditReport | null
): AuditRegressionReport {
  const unique = new Map<string, AuditFinding>()
  for (const finding of current) {
    if (!unique.has(finding.key)) unique.set(finding.key, finding)
  }

  const previousByKey = new Map(
    (previous?.findings ?? [])
      .filter(finding => finding.status !== 'recovered')
      .map(finding => [finding.key, finding])
  )

  const findings: ReconciledAuditFinding[] = []
  let added = 0

  for (const finding of [...unique.values()].sort(compareFindings)) {
    if (!previousByKey.has(finding.key)) added += 1
    findings.push({ ...finding, status: 'open' })
  }

  let recovered = 0
  for (const finding of (previous?.findings ?? []).filter(item => item.status !== 'recovered')) {
    if (!unique.has(finding.key)) {
      recovered += 1
      findings.push({ ...finding, status: 'recovered' })
    }
  }

  findings.sort(compareFindings)
  const active = findings.filter(finding => finding.status === 'open').length

  return {
    findings,
    summary: { active, recovered, added }
  }
}

function compareFindings(left: AuditFinding, right: AuditFinding): number {
  return (
    left.audit.localeCompare(right.audit) ||
    left.rule.localeCompare(right.rule) ||
    left.location.localeCompare(right.location) ||
    left.key.localeCompare(right.key)
  )
}
