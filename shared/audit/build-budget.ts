export type BuildAssetKind = 'javascript' | 'stylesheet'

export interface BuildAsset {
  path: string
  kind: BuildAssetKind
  bytes: number
  gzipBytes: number
}

export interface BuildBudget {
  javascriptBytes?: number
  javascriptGzipBytes?: number
  stylesheetBytes?: number
  stylesheetGzipBytes?: number
}

export interface BuildBudgetFailure {
  metric: keyof BuildBudget
  actual: number
  limit: number
}

export interface BuildBudgetReport {
  passed: boolean
  totals: Partial<Record<BuildAssetKind, { files: number; bytes: number; gzipBytes: number }>>
  failures: BuildBudgetFailure[]
}

export interface BuildTimeBudgetReport {
  passed: boolean
  durationMs: number
  limitMs: number
}

export function evaluateBuildTimeBudget(
  durationMs: number,
  limitMs: number
): BuildTimeBudgetReport {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    throw new RangeError('Build duration must be a finite non-negative number.')
  }
  if (!Number.isFinite(limitMs) || limitMs < 0) {
    throw new RangeError('Build time limit must be a finite non-negative number.')
  }

  return { passed: durationMs <= limitMs, durationMs, limitMs }
}

export function sumBuildAssets(assets: BuildAsset[]): BuildBudgetReport['totals'] {
  const totals: BuildBudgetReport['totals'] = {}

  for (const asset of assets) {
    const current = totals[asset.kind] ?? { files: 0, bytes: 0, gzipBytes: 0 }
    current.files += 1
    current.bytes += asset.bytes
    current.gzipBytes += asset.gzipBytes
    totals[asset.kind] = current
  }

  return totals
}

export function evaluateBuildBudget(assets: BuildAsset[], budget: BuildBudget): BuildBudgetReport {
  const totals = sumBuildAssets(assets)
  const failures: BuildBudgetFailure[] = []
  const javascript = totals.javascript ?? { files: 0, bytes: 0, gzipBytes: 0 }
  const stylesheet = totals.stylesheet ?? { files: 0, bytes: 0, gzipBytes: 0 }

  const checks: Array<[keyof BuildBudget, number, number | undefined]> = [
    ['javascriptBytes', javascript.bytes, budget.javascriptBytes],
    ['javascriptGzipBytes', javascript.gzipBytes, budget.javascriptGzipBytes],
    ['stylesheetBytes', stylesheet.bytes, budget.stylesheetBytes],
    ['stylesheetGzipBytes', stylesheet.gzipBytes, budget.stylesheetGzipBytes]
  ]

  for (const [metric, actual, limit] of checks) {
    if (limit !== undefined && actual > limit) failures.push({ metric, actual, limit })
  }

  return { passed: failures.length === 0, totals, failures }
}
