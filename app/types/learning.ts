export interface Tradeoffs {
  advantages: string[]
  disadvantages: string[]
  whenNotToUse: string[]
  alternatives: string[]
}

export interface DecisionMatrixRow {
  situation: string
  recommended: string
  alternative: string
  avoid: string
}

export interface PerformanceImpact {
  rendering: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
  memory: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
  cpu: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
  complexity: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
  bundleSize: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
  developerExperience: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
  maintainability: 'Low' | 'Medium' | 'High' | 'Minimal' | 'Moderate' | 'Significant'
}

export interface InterviewQuestion {
  question: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  answer: string
  relatedTopics?: string[]
}

export interface CommonMistake {
  problem: string
  impact: string
  fix: string
  badCode?: string
  goodCode?: string
}

export interface ReferenceLink {
  title: string
  description: string
  url: string
  category: 'Vue Docs' | 'MDN' | 'web.dev' | 'Chrome Developers' | 'TypeScript Handbook' | 'Other'
}

export interface LearningSummaryData {
  title: string
  whatIsIt: string
  howItWorks: string
  recommendation: {
    approach: string
    reasoning: string
    codeSample?: string
  }
  tradeoffs?: Tradeoffs
  decisionMatrix?: DecisionMatrixRow[]
  realWorldExamples?: string[]
  performanceImpact?: PerformanceImpact
  interviewQuestions?: InterviewQuestion[]
  commonMistakes?: CommonMistake[]
  proTips?: string[]
  references?: ReferenceLink[]
}
