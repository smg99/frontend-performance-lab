/* eslint-disable @typescript-eslint/no-explicit-any */
export type PerformanceScoreCategory = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
export type Severity = 'Critical' | 'Warning' | 'Suggestion'
export type RuleCategory = 'Rendering' | 'Memory' | 'CPU' | 'Network' | 'CWV'

export interface Issue {
  id: string
  title: string
  description: string
  ruleId: string
  severity: Severity
  category: RuleCategory
  lineNumbers?: number[]
  impact: string
  fix: string
  relatedExperimentIds?: string[]
  browserAPIs?: string[]
  relatedRecipes?: string[]
}

export interface OptimizationChecklist {
  id: string
  title: string
  completed: boolean
}

export interface Suggestion {
  title: string
  description: string
}

export interface PerformanceMetrics {
  Rendering: number
  Memory: number
  CPU: number
  CWV: number
}

export interface ReviewReport {
  overallScore: PerformanceScoreCategory
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: PerformanceMetrics
  checklist: OptimizationChecklist[]
  analyzedFiles: number
}

// ---------------------------------------------------------
// Engine Types (Internal to Server)
// ---------------------------------------------------------

export interface AnalyzerContext {
  filename: string
  code: string
  language: string
  framework: string
}

export interface ASTRule {
  id: string
  title: string
  description: string
  severity: Severity
  category: RuleCategory
  frameworks: string[]
  supportedLanguages: string[]
  relatedExperiments: string[]
  browserAPIs: string[]
  relatedRecipes: string[]
  impact: string
  fix: string
  // The specific parser type will depend on the language, so we use any for the raw AST
  visitor: (
    ast: any,
    context: AnalyzerContext
  ) => Omit<
    Issue,
    | 'id'
    | 'title'
    | 'description'
    | 'ruleId'
    | 'severity'
    | 'category'
    | 'impact'
    | 'fix'
    | 'relatedExperimentIds'
    | 'browserAPIs'
    | 'relatedRecipes'
  >[]
}
