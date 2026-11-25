import { describe, expect, it } from 'vitest'
import { summarizeLighthouseResult } from '../../shared/audit/lighthouse'

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
