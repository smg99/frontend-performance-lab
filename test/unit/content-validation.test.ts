import { describe, expect, it } from 'vitest'
import { validateContent, type ContentSnapshot } from '../../shared/validation/content'

const emptySnapshot = (): ContentSnapshot => ({
  analyzerRules: [],
  browserAPIs: {},
  experiments: {},
  recipes: {}
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
})
