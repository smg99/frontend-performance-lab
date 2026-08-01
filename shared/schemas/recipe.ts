import type { ReferenceLink } from './experiment'

export interface Recipe {
  id: string
  title: string
  summary: string
  problem: string
  symptoms: string[]
  rootCauses: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedImplementationTime: string
  performanceImpact: 'Low' | 'Medium' | 'High'
  
  prerequisites: {
    experiments: string[]
    browserAPIs: string[]
    concepts: string[]
  }
  
  whenNotToUse: string[]

  decisionMatrix: {
    scenario: string
    recommendedApproach: string
    alternatives: string[]
    tradeoffs: string
    why: string
    confidence: 'Low' | 'Medium' | 'High'
  }[]

  recommendedApproaches: string[]
  approachesToAvoid: string[]
  
  implementationSteps: {
    title: string
    description: string
  }[]
  
  beforeAfterComparison: {
    beforeCode: string
    afterCode: string
    explanation: string
  }
  
  productionChecklist: string[]
  commonMistakes: string[]
  
  relatedExperiments: string[]
  relatedBrowserAPIs: string[]
  relatedAnalyzerRules: string[]
  relatedRecipes: string[]
  
  interviewQuestions: {
    question: string
    answer: string
  }[]
  
  references: ReferenceLink[]
  
  searchMetadata: {
    keywords: string[]
    synonyms: string[]
    concepts: string[]
  }
}
