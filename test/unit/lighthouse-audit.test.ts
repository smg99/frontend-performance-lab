import { describe, expect, it } from 'vitest'
import { summarizeLighthouseResult } from '../../shared/audit/lighthouse'
import { mergeLighthouseTrend, type LighthouseTrendHistory } from '../../shared/audit/trends'

describe('Lighthouse audit summary', () => {
  it('preserves measured route category scores and metric values', () => {
    const report = summarizeLighthouseResult('/recipes', 'http://localhost/recipes', {
      categories: {
        performance: { score: 0.94 },
        accessibility: { score: 0.88 },
        'best-practices': { score: 1 },
        seo: { score: 0.91 }
      },
      audits: {
        'first-contentful-paint': { numericValue: 812, numericUnit: 'millisecond' },
        'largest-contentful-paint': { numericValue: 1264, numericUnit: 'millisecond' },
        'speed-index': { numericValue: 1042, numericUnit: 'millisecond' },
        'total-blocking-time': { numericValue: 0, numericUnit: 'millisecond' },
        'cumulative-layout-shift': { numericValue: 0.01, numericUnit: 'unitless' }
      }
    })

    expect(report).toEqual({
      path: '/recipes',
      url: 'http://localhost/recipes',
      categories: {
        performance: 0.94,
        accessibility: 0.88,
        'best-practices': 1,
        seo: 0.91
      },
      metrics: {
        'first-contentful-paint': { value: 812, unit: 'millisecond' },
        'largest-contentful-paint': { value: 1264, unit: 'millisecond' },
        'speed-index': { value: 1042, unit: 'millisecond' },
        'total-blocking-time': { value: 0, unit: 'millisecond' },
        'cumulative-layout-shift': { value: 0.01, unit: 'unitless' }
      }
    })
  })

  describe('Lighthouse trend history', () => {
    const report = (measuredAt: string, commit: string) => ({
      measuredAt,
      environment: { commit },
      routes: [
        {
          path: '/',
          url: 'https://example.test/',
          categories: {
            performance: null,
            accessibility: null,
            'best-practices': null,
            seo: null
          },
          metrics: {
            'first-contentful-paint': { value: null, unit: null },
            'largest-contentful-paint': { value: null, unit: null },
            'speed-index': { value: null, unit: null },
            'total-blocking-time': { value: null, unit: null },
            'cumulative-layout-shift': { value: null, unit: null }
          }
        }
      ]
    })

    it('starts a history containing the measured report and run identifier', () => {
      expect(
        mergeLighthouseTrend(report('2026-11-26T01:00:00.000Z', 'abc123'), null, 'run-1')
      ).toEqual({
        version: 1,
        reports: [
          {
            runId: 'run-1',
            report: report('2026-11-26T01:00:00.000Z', 'abc123')
          }
        ]
      })
    })

    it('keeps reports in chronological order and replaces a repeated workflow run', () => {
      const previous: LighthouseTrendHistory = {
        version: 1,
        reports: [
          { runId: 'run-2', report: report('2026-11-25T01:00:00.000Z', 'second') },
          { runId: 'run-1', report: report('2026-11-24T01:00:00.000Z', 'first') }
        ]
      }

      const history = mergeLighthouseTrend(
        report('2026-11-26T01:00:00.000Z', 'retry'),
        previous,
        'run-2'
      )

      expect(history.reports.map(entry => entry.runId)).toEqual(['run-1', 'run-2'])
      expect(history.reports[1].report.environment.commit).toBe('retry')
    })

    it('retains only the latest 90 unique measured runs', () => {
      const previous: LighthouseTrendHistory = {
        version: 1,
        reports: Array.from({ length: 90 }, (_, index) => {
          return {
            runId: `run-${index}`,
            report: report(new Date(Date.UTC(2026, 6, index + 1)).toISOString(), `commit-${index}`)
          }
        })
      }

      const history = mergeLighthouseTrend(
        report('2026-11-26T00:00:00.000Z', 'new'),
        previous,
        'new-run'
      )

      expect(history.reports).toHaveLength(90)
      expect(history.reports[0].runId).toBe('run-1')
      expect(history.reports.at(-1)?.runId).toBe('new-run')
    })

    it('rejects malformed current reports and prior history rather than hiding gaps', () => {
      expect(() => mergeLighthouseTrend({ measuredAt: 'invalid' }, null, 'run-1')).toThrow(
        'Current Lighthouse report is malformed'
      )
      expect(() =>
        mergeLighthouseTrend(
          report('2026-11-26T00:00:00.000Z', 'new'),
          { version: 2, reports: [] },
          'run-1'
        )
      ).toThrow('Previous Lighthouse trend history is malformed')
    })
  })

  it('represents missing or invalid measurements as null instead of inventing values', () => {
    const report = summarizeLighthouseResult('/', 'http://localhost/', {
      categories: {
        performance: { score: Number.NaN },
        accessibility: {},
        'best-practices': { score: 0.5 },
        seo: { score: 0.7 }
      },
      audits: {
        'first-contentful-paint': { numericValue: Number.POSITIVE_INFINITY },
        'cumulative-layout-shift': { numericValue: 0.02 }
      }
    })

    expect(report.categories.performance).toBeNull()
    expect(report.categories.accessibility).toBeNull()
    expect(report.metrics['first-contentful-paint']).toEqual({ value: null, unit: null })
    expect(report.metrics['cumulative-layout-shift']).toEqual({
      value: 0.02,
      unit: null
    })
  })
})
