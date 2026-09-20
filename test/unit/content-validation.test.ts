import { describe, expect, it } from 'vitest'
import { validateContent, type ContentSnapshot } from '../../shared/validation/content'
import { freshnessPolicyDays } from '../../shared/content/provenance'

const emptySnapshot = (): ContentSnapshot => ({
  analyzerRules: [],
  browserAPIs: {},
  experiments: {},
  recipes: {},
  provenance: {},
  freshnessPolicy: freshnessPolicyDays
})

describe('content validation', () => {
  it('accepts an empty but structurally valid snapshot', () => {
    expect(validateContent(emptySnapshot()).errors).toEqual([])
  })

  it('rejects an invalid manifest instead of reporting success', () => {
    const snapshot = emptySnapshot()
    snapshot.experiments.invalid = { id: 'different-id' } as never

    const result = validateContent(snapshot)

    expect(result.errors.some(error => error.includes('does not match manifest id'))).toBe(true)
    expect(result.errors.some(error => error.includes('title'))).toBe(true)
  })

  it('rejects unresolved relationships', () => {
    const snapshot = emptySnapshot()
    snapshot.recipes.example = {
      id: 'example',
      prerequisites: { experiments: ['missing'], browserAPIs: [], concepts: [] },
      relatedExperiments: [],
      relatedBrowserAPIs: [],
      relatedAnalyzerRules: [],
      relatedRecipes: []
    } as never

    const result = validateContent(snapshot)

    expect(result.errors).toContain('recipe "example" references unknown experiment "missing"')
  })

  it('rejects stale provenance', () => {
    const snapshot = emptySnapshot()
    snapshot.experiments.example = {
      id: 'example',
      version: '1.0.0',
      status: 'stable',
      lastUpdated: '2025-01-01T00:00:00.000Z',
      title: 'Example',
      description: 'Example content',
      difficulty: 'Beginner',
      estimatedReadingTime: 1,
      tags: [],
      topics: [],
      browserAPIs: [],
      relationships: [],
      sections: [{ id: 'intro', title: 'Intro', type: 'concept', order: 0, content: 'x' }],
      benchmarks: [],
      references: [{ title: 'MDN', url: 'https://developer.mozilla.org/' }]
    }
    snapshot.provenance['experiment:example'] = {
      canonicalUrl: 'https://developer.mozilla.org/',
      publisher: 'MDN Web Docs',
      evidenceType: 'official-documentation',
      retrievedAt: '2025-01-01T00:00:00.000Z',
      verifiedAt: '2025-01-01T00:00:00.000Z'
    }

    const result = validateContent(snapshot, new Date('2026-09-20T00:00:00.000Z'))

    expect(result.errors.some(error => error.includes('stale provenance'))).toBe(true)
  })
})
