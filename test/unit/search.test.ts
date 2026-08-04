import { describe, it, expect } from 'vitest'
import { searchPlatform, searchExperiments } from '../../shared/utils/search/index'

describe('searchPlatform', () => {
  // ─── no query (browse mode) ────────────────────────────────────────────────

  describe('no query', () => {
    it('returns all experiments when type=experiment and no query', () => {
      const results = searchPlatform({ type: 'experiment' })
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.type === 'experiment')).toBe(true)
    })

    it('returns all browser-apis when type=browser-api and no query', () => {
      const results = searchPlatform({ type: 'browser-api' })
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.type === 'browser-api')).toBe(true)
    })

    it('returns all recipes when type=recipe and no query', () => {
      const results = searchPlatform({ type: 'recipe' })
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.type === 'recipe')).toBe(true)
    })

    it('returns all global actions when type=action and no query', () => {
      const results = searchPlatform({ type: 'action' })
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.type === 'action')).toBe(true)
    })

    it('returns mixed results across all types when type=all and no query', () => {
      const results = searchPlatform({ type: 'all' })
      const types = new Set(results.map(r => r.type))
      expect(types.size).toBeGreaterThan(1)
    })

    it('does NOT include actions when no query and type is not explicitly action/all', () => {
      const results = searchPlatform({ type: 'experiment' })
      expect(results.every(r => r.type !== 'action')).toBe(true)
    })
  })

  // ─── query matching ────────────────────────────────────────────────────────

  describe('query matching', () => {
    it('finds browser-apis matching a query term', () => {
      const results = searchPlatform({ query: 'observer', type: 'browser-api' })
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.type === 'browser-api')).toBe(true)
    })

    it('assigns a higher score to exact title matches', () => {
      const results = searchPlatform({ query: 'virtualization', type: 'experiment' })
      const exact = results.find(
        r => r.type === 'experiment' && r.item.title.toLowerCase() === 'virtualization'
      )
      const partial = results.find(
        r =>
          r.type === 'experiment' &&
          r.item.title.toLowerCase() !== 'virtualization' &&
          r.item.title.toLowerCase().includes('virtualization')
      )
      if (exact && partial) {
        expect(exact.score).toBeGreaterThan(partial.score)
      }
    })

    it('returns empty array for a nonsense query', () => {
      const results = searchPlatform({ query: 'xyzzy-no-match-abcdef' })
      expect(results).toHaveLength(0)
    })

    it('is case-insensitive', () => {
      const lower = searchPlatform({ query: 'intersection observer', type: 'browser-api' })
      const upper = searchPlatform({ query: 'INTERSECTION OBSERVER', type: 'browser-api' })
      expect(lower.length).toBe(upper.length)
    })

    it('matches actions by keyword', () => {
      const results = searchPlatform({ query: 'scan', type: 'action' })
      expect(results.some(r => r.type === 'action' && r.item.id === 'analyze')).toBe(true)
    })

    it('matches actions by title partial match', () => {
      const results = searchPlatform({ query: 'mcp', type: 'action' })
      expect(results.some(r => r.type === 'action' && r.item.id === 'mcp')).toBe(true)
    })

    it('results are sorted by score descending', () => {
      const results = searchPlatform({ query: 'performance' })
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
      }
    })
  })

  // ─── filters ──────────────────────────────────────────────────────────────

  describe('filters', () => {
    it('filters experiments by difficulty', () => {
      const results = searchPlatform({ type: 'experiment', difficulty: 'Beginner' })
      expect(results.every(r => r.type === 'experiment' && r.item.difficulty === 'Beginner')).toBe(
        true
      )
    })

    it('filters browser-apis by difficulty', () => {
      const results = searchPlatform({ type: 'browser-api', difficulty: 'Advanced' })
      expect(results.every(r => r.type === 'browser-api' && r.item.difficulty === 'Advanced')).toBe(
        true
      )
    })

    it('filters experiments by tags', () => {
      // Get a known tag from real data
      const allExps = searchPlatform({ type: 'experiment' })
      if (allExps.length === 0) return
      const firstExp = allExps[0].item
      if (!('tags' in firstExp) || firstExp.tags.length === 0) return

      const tag = firstExp.tags[0]
      const filtered = searchPlatform({ type: 'experiment', tags: [tag] })
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(r => r.type === 'experiment' && r.item.tags.includes(tag))).toBe(true)
    })

    it('respects the limit option', () => {
      const results = searchPlatform({ type: 'all', limit: 3 })
      expect(results.length).toBeLessThanOrEqual(3)
    })

    it('limit of 0 returns all results', () => {
      const withLimit = searchPlatform({ type: 'experiment', limit: 0 })
      const withoutLimit = searchPlatform({ type: 'experiment' })
      expect(withLimit.length).toBe(withoutLimit.length)
    })
  })

  // ─── searchExperiments compat shim ────────────────────────────────────────

  describe('searchExperiments (compat)', () => {
    it('returns ExperimentManifest items directly', () => {
      const results = searchExperiments({ type: 'experiment' })
      expect(Array.isArray(results)).toBe(true)
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('id')
        expect(results[0]).toHaveProperty('title')
      }
    })

    it('filters by query and returns unwrapped items', () => {
      const results = searchExperiments({ query: 'virtual' })
      expect(results.length).toBeGreaterThanOrEqual(0)
      // Items should be plain manifests, not wrapped { type, item, score }
      if (results.length > 0) {
        expect(results[0]).not.toHaveProperty('score')
      }
    })
  })
})
