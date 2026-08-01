import type { ExperimentManifest, ExperimentDifficulty } from '@schemas/index'
import type { BrowserAPI } from '@schemas/browser-api'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'

export interface SearchFilters {
  query?: string
  type?: 'experiment' | 'recipe' | 'browser-api' | 'all'
  tags?: string[]
  difficulty?: ExperimentDifficulty | BrowserAPI['difficulty']
  browserAPI?: string
  limit?: number
}

export type SearchResultItem = 
  | { type: 'experiment', item: ExperimentManifest, score: number }
  | { type: 'browser-api', item: BrowserAPI, score: number }

export const searchPlatform = (filters: SearchFilters): SearchResultItem[] => {
  const results: SearchResultItem[] = []
  const query = filters.query?.toLowerCase() || ''

  // 1. Search Experiments
  if (!filters.type || filters.type === 'all' || filters.type === 'experiment') {
    const experiments = getAllExperiments()
    for (const exp of experiments) {
      let isMatch = true
      let score = 0

      if (filters.difficulty && exp.difficulty !== filters.difficulty) isMatch = false
      if (filters.browserAPI && !exp.browserAPIs.includes(filters.browserAPI)) isMatch = false
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => exp.tags.includes(tag))
        if (!hasAllTags) isMatch = false
      }

      if (query) {
        const titleMatch = exp.title.toLowerCase().includes(query)
        const descMatch = exp.description.toLowerCase().includes(query)
        const tagMatch = exp.tags.some(t => t.toLowerCase().includes(query))
        
        if (titleMatch) score += 10
        if (descMatch) score += 5
        if (tagMatch) score += 3

        if (!titleMatch && !descMatch && !tagMatch) isMatch = false
      }

      if (isMatch) results.push({ type: 'experiment', item: exp, score })
    }
  }

  // 2. Search Browser APIs
  if (!filters.type || filters.type === 'all' || filters.type === 'browser-api') {
    const apis = getAllBrowserAPIs()
    for (const api of apis) {
      let isMatch = true
      let score = 0

      if (filters.difficulty && api.difficulty !== filters.difficulty) isMatch = false
      // tags / browserAPI filter mostly apply to experiments, so we can loosely ignore or strict match them.
      
      if (query) {
        const titleMatch = api.name.toLowerCase().includes(query)
        const descMatch = api.description.toLowerCase().includes(query)
        const keywordsMatch = api.searchMetadata.keywords.some(k => k.toLowerCase().includes(query))
        const synonymsMatch = api.searchMetadata.synonyms.some(s => s.toLowerCase().includes(query))
        const conceptsMatch = api.searchMetadata.concepts.some(c => c.toLowerCase().includes(query))
        
        if (titleMatch) score += 15
        if (keywordsMatch) score += 10
        if (synonymsMatch) score += 8
        if (conceptsMatch) score += 6
        if (descMatch) score += 4

        if (!titleMatch && !descMatch && !keywordsMatch && !synonymsMatch && !conceptsMatch) {
          isMatch = false
        }
      }

      if (isMatch) results.push({ type: 'browser-api', item: api, score })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  if (filters.limit && filters.limit > 0) {
    return results.slice(0, filters.limit)
  }

  return results
}

// Keep backward compatibility for existing UI
export const searchExperiments = (filters: SearchFilters): ExperimentManifest[] => {
  return searchPlatform({ ...filters, type: 'experiment' })
    .map(r => r.item as ExperimentManifest)
}
