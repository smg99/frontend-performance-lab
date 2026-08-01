import type { ReferenceLink } from './experiment'

export interface BrowserAPI {
  id: string
  name: string
  category: string
  description: string
  browserSupport: string // e.g. "95% global" or "Chrome 80+, Safari 14+"
  performanceImpact: 'Low' | 'Medium' | 'High'
  bestPractices: string[]
  commonMistakes: string[]
  examples: {
    title: string
    code: string
    explanation: string
  }[]
  references: ReferenceLink[]
  relatedExperiments: string[]
}
