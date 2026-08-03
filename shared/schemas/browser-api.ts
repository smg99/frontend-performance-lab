import type { ReferenceLink } from './experiment'

export interface BrowserAPI {
  id: string
  name: string
  description: string
  category: 'Rendering' | 'Memory' | 'Network' | 'Concurrency' | 'Storage' | 'Observers'
  browserSupport: string
  baseline: 'Newly available' | 'Widely available' | 'Limited'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  usageStats: {
    popularity: number // 0-100 scale
  }
  searchMetadata: {
    keywords: string[]
    synonyms: string[]
    concepts: string[]
  }
  whenToUse: string[]
  whenNotToUse: string[]
  advantages: string[]
  limitations: string[]
  performanceImpact: 'Low' | 'Medium' | 'High'
  commonMistakes: string[]
  bestPractices: string[]
  examples: {
    title: string
    code: string
    explanation: string
  }[]
  relatedExperiments: string[]
  relatedRecipes: string[]
  relatedBrowserAPIs: string[]
  interviewQuestions: {
    question: string
    answer: string
  }[]
  references: ReferenceLink[]
}
