import type { ReferenceLink } from './experiment'

export interface RecipeCodeExample {
  title: string
  framework: 'vanilla' | 'vue' | 'react' | 'angular'
  language: 'javascript' | 'typescript'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  goodCode: string
  badCode?: string
  explanation: string
  performanceNotes: string
}

export interface Recipe {
  id: string
  title: string
  problem: string
  recommendedTechniques: string[]
  browserAPIs: string[]
  relatedExperiments: string[]
  codeExamples: RecipeCodeExample[]
  references?: ReferenceLink[]
}
