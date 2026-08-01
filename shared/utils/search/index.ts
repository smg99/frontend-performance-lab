import type { ExperimentManifest, ExperimentDifficulty } from '@schemas/index'
import type { BrowserAPI } from '@schemas/browser-api'
import type { Recipe } from '@schemas/recipe'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'
import { getAllRecipes } from '@registry/recipes'

export interface SearchFilters {
  query?: string
  type?: 'experiment' | 'recipe' | 'browser-api' | 'action' | 'all'
  tags?: string[]
  difficulty?: ExperimentDifficulty | BrowserAPI['difficulty'] | Recipe['difficulty']
  browserAPI?: string
  limit?: number
}

export interface PlatformAction {
  id: string
  title: string
  description: string
  href: string
  keywords: string[]
}

const GLOBAL_ACTIONS: PlatformAction[] = [
  {
    id: 'analyze',
    title: 'Analyze Code',
    description: 'Run the AST performance analyzer on your codebase',
    href: '/tools/performance-review',
    keywords: ['scan', 'lint', 'performance', 'ast']
  },
  {
    id: 'design-system',
    title: 'Design System',
    description: 'Explore UI primitives and tokens',
    href: '/design-system',
    keywords: ['ui', 'components', 'tokens', 'styling']
  },
  {
    id: 'about',
    title: 'About Platform',
    description: 'Learn about the Frontend Performance Lab',
    href: '/about',
    keywords: ['info', 'docs', 'readme']
  }
]

export type SearchResultItem =
  | { type: 'experiment'; item: ExperimentManifest; score: number }
  | { type: 'browser-api'; item: BrowserAPI; score: number }
  | { type: 'recipe'; item: Recipe; score: number }
  | { type: 'action'; item: PlatformAction; score: number }

export const searchPlatform = (filters: SearchFilters): SearchResultItem[] => {
  const results: SearchResultItem[] = []
  const query = filters.query?.toLowerCase().trim() || ''

  // Intelligent Ranking Weights
  const WEIGHT_EXACT = 100
  const WEIGHT_TITLE = 50
  const WEIGHT_SYNONYM = 30
  const WEIGHT_KEYWORD = 20
  const WEIGHT_CONCEPT = 10
  const WEIGHT_DESC = 5

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
        const titleLower = exp.title.toLowerCase()
        const descLower = exp.description.toLowerCase()

        if (titleLower === query) score += WEIGHT_EXACT
        else if (titleLower.includes(query)) score += WEIGHT_TITLE

        if (exp.tags.some(t => t.toLowerCase() === query)) score += WEIGHT_KEYWORD
        else if (exp.tags.some(t => t.toLowerCase().includes(query))) score += WEIGHT_CONCEPT

        if (descLower.includes(query)) score += WEIGHT_DESC

        if (score === 0) isMatch = false
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

      if (query) {
        const titleLower = api.name.toLowerCase()
        const descLower = api.description.toLowerCase()

        if (titleLower === query) score += WEIGHT_EXACT
        else if (titleLower.includes(query)) score += WEIGHT_TITLE

        if (api.searchMetadata.synonyms.some(s => s.toLowerCase().includes(query)))
          score += WEIGHT_SYNONYM
        if (api.searchMetadata.keywords.some(k => k.toLowerCase().includes(query)))
          score += WEIGHT_KEYWORD
        if (api.searchMetadata.concepts.some(c => c.toLowerCase().includes(query)))
          score += WEIGHT_CONCEPT
        if (descLower.includes(query)) score += WEIGHT_DESC

        if (score === 0) isMatch = false
      }

      if (isMatch) results.push({ type: 'browser-api', item: api, score })
    }
  }

  // 3. Search Recipes
  if (!filters.type || filters.type === 'all' || filters.type === 'recipe') {
    const recipes = getAllRecipes()
    for (const recipe of recipes) {
      let isMatch = true
      let score = 0

      if (filters.difficulty && recipe.difficulty !== filters.difficulty) isMatch = false
      if (filters.browserAPI && !recipe.relatedBrowserAPIs.includes(filters.browserAPI))
        isMatch = false

      if (query) {
        const titleLower = recipe.title.toLowerCase()
        const problemLower = recipe.problem.toLowerCase()

        if (titleLower === query) score += WEIGHT_EXACT
        else if (titleLower.includes(query)) score += WEIGHT_TITLE

        if (recipe.searchMetadata.synonyms.some(s => s.toLowerCase().includes(query)))
          score += WEIGHT_SYNONYM
        if (recipe.searchMetadata.keywords.some(k => k.toLowerCase().includes(query)))
          score += WEIGHT_KEYWORD
        if (recipe.searchMetadata.concepts.some(c => c.toLowerCase().includes(query)))
          score += WEIGHT_CONCEPT
        if (problemLower.includes(query)) score += WEIGHT_DESC

        if (score === 0) isMatch = false
      }

      if (isMatch) results.push({ type: 'recipe', item: recipe, score })
    }
  }

  // 4. Search Actions
  if (!filters.type || filters.type === 'all' || filters.type === 'action') {
    for (const action of GLOBAL_ACTIONS) {
      let score = 0

      if (query) {
        const titleLower = action.title.toLowerCase()
        const descLower = action.description.toLowerCase()

        if (titleLower === query) score += WEIGHT_EXACT
        else if (titleLower.includes(query)) score += WEIGHT_TITLE

        if (action.keywords.some(k => k.toLowerCase().includes(query))) score += WEIGHT_KEYWORD
        if (descLower.includes(query)) score += WEIGHT_DESC

        if (score > 0) results.push({ type: 'action', item: action, score })
      } else {
        // If no query, actions aren't typically displayed unless requested explicitly
        if (filters.type === 'action' || filters.type === 'all') {
          results.push({ type: 'action', item: action, score: 0 })
        }
      }
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
  return searchPlatform({ ...filters, type: 'experiment' }).map(r => r.item as ExperimentManifest)
}
