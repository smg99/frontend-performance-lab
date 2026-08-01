import type { ExperimentManifest, ExperimentDifficulty } from '@schemas/index'
import { getAllExperiments } from '@registry/index'

export interface SearchFilters {
  query?: string
  type?: 'experiment' | 'recipe' | 'browser-api'
  tags?: string[]
  difficulty?: ExperimentDifficulty
  browserAPI?: string
  limit?: number
}

/**
 * Searches and ranks experiments based on the provided filters.
 * Implements a simple ranking algorithm where exact title matches score higher
 * than description or tag matches.
 */
export const searchExperiments = (filters: SearchFilters): ExperimentManifest[] => {
  const all = getAllExperiments()

  const results = all
    .map(exp => {
      let score = 0
      let isMatch = true

      // 1. Difficulty Filter (Exact)
      if (filters.difficulty && exp.difficulty !== filters.difficulty) {
        isMatch = false
      }

      // 2. Browser API Filter (Exact)
      if (filters.browserAPI && !exp.browserAPIs.includes(filters.browserAPI)) {
        isMatch = false
      }

      // 3. Tag Filter (Subset)
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => exp.tags.includes(tag))
        if (!hasAllTags) isMatch = false
      }

      // 4. Keyword Query (Fuzzy / Partial match)
      if (filters.query) {
        const q = filters.query.toLowerCase()
        const titleMatch = exp.title.toLowerCase().includes(q)
        const descMatch = exp.description.toLowerCase().includes(q)
        const tagMatch = exp.tags.some(t => t.toLowerCase().includes(q))
        
        if (titleMatch) score += 10
        if (descMatch) score += 5
        if (tagMatch) score += 3

        if (!titleMatch && !descMatch && !tagMatch) {
          isMatch = false
        }
      }

      return { experiment: exp, score, isMatch }
    })
    .filter(result => result.isMatch)
    .sort((a, b) => b.score - a.score) // Rank descending
    .map(result => result.experiment)

  if (filters.limit && filters.limit > 0) {
    return results.slice(0, filters.limit)
  }

  return results
}
