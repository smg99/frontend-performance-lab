import type { LighthouseRouteSummary } from './lighthouse'

export interface LighthouseTrendReport extends Record<string, unknown> {
  measuredAt: string
  environment: Record<string, unknown>
  routes: LighthouseRouteSummary[]
}

export interface LighthouseTrendEntry {
  runId: string
  report: LighthouseTrendReport
}

export interface LighthouseTrendHistory {
  version: 1
  reports: LighthouseTrendEntry[]
}

const MAX_TREND_REPORTS = 90

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function parseReport(value: unknown): LighthouseTrendReport | null {
  if (!isRecord(value) || typeof value.measuredAt !== 'string') return null
  if (!Number.isFinite(Date.parse(value.measuredAt))) return null
  if (!isRecord(value.environment) || !Array.isArray(value.routes) || value.routes.length === 0) {
    return null
  }
  if (
    !value.routes.every(
      route =>
        isRecord(route) &&
        typeof route.path === 'string' &&
        typeof route.url === 'string' &&
        isRecord(route.categories) &&
        isRecord(route.metrics)
    )
  ) {
    return null
  }
  return value as LighthouseTrendReport
}

function parseHistory(value: unknown): LighthouseTrendHistory | null {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.reports)) return null

  const seenRunIds = new Set<string>()
  const reports: LighthouseTrendEntry[] = []
  for (const entry of value.reports) {
    if (!isRecord(entry) || typeof entry.runId !== 'string' || !entry.runId.trim()) return null
    const report = parseReport(entry.report)
    if (!report || seenRunIds.has(entry.runId)) return null
    seenRunIds.add(entry.runId)
    reports.push({ runId: entry.runId, report })
  }
  return { version: 1, reports }
}

export function mergeLighthouseTrend(
  current: unknown,
  previous: unknown,
  runId: string
): LighthouseTrendHistory {
  const currentReport = parseReport(current)
  if (!currentReport) throw new Error('Current Lighthouse report is malformed.')
  if (!runId.trim()) throw new Error('Lighthouse workflow run ID must not be empty.')

  const previousHistory = previous === null ? null : parseHistory(previous)
  if (previous !== null && !previousHistory) {
    throw new Error('Previous Lighthouse trend history is malformed.')
  }

  const reportsByRunId = new Map(
    (previousHistory?.reports ?? []).map(entry => [entry.runId, entry])
  )
  reportsByRunId.set(runId, { runId, report: currentReport })

  const reports = [...reportsByRunId.values()].sort(
    (left, right) =>
      Date.parse(left.report.measuredAt) - Date.parse(right.report.measuredAt) ||
      left.runId.localeCompare(right.runId)
  )

  return {
    version: 1,
    reports: reports.slice(-MAX_TREND_REPORTS)
  }
}
