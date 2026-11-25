const CATEGORY_IDS = ['performance', 'accessibility', 'best-practices', 'seo'] as const
const METRIC_IDS = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'speed-index',
  'total-blocking-time',
  'cumulative-layout-shift'
] as const

type CategoryId = (typeof CATEGORY_IDS)[number]
type MetricId = (typeof METRIC_IDS)[number]

export interface LighthouseRouteSummary {
  path: string
  url: string
  categories: Record<CategoryId, number | null>
  metrics: Record<MetricId, { value: number | null; unit: string | null }>
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

export function summarizeLighthouseResult(
  path: string,
  url: string,
  result: unknown
): LighthouseRouteSummary {
  const lighthouseResult = record(result)
  const categoryResults = record(lighthouseResult.categories)
  const auditResults = record(lighthouseResult.audits)

  const categories = Object.fromEntries(
    CATEGORY_IDS.map(id => [id, finiteNumber(record(categoryResults[id]).score)])
  ) as Record<CategoryId, number | null>

  const metrics = Object.fromEntries(
    METRIC_IDS.map(id => {
      const metric = record(auditResults[id])
      return [
        id,
        {
          value: finiteNumber(metric.numericValue),
          unit: text(metric.numericUnit)
        }
      ]
    })
  ) as Record<MetricId, { value: number | null; unit: string | null }>

  return { path, url, categories, metrics }
}
