/* eslint-disable @typescript-eslint/no-explicit-any */
export type PerformanceScoreCategory = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
export type RuleCategory = 'Rendering' | 'Memory' | 'CPU' | 'Network' | 'CWV'
export type PipelineStage = 'DOM' | 'Style' | 'Layout' | 'Paint' | 'Composite'

export interface BrowserImpact {
  cpu: boolean
  memory: boolean
  rendering: boolean
  network: boolean
  cwv: boolean
}

export interface BrowserExplanation {
  whatHappened: string
  whyBrowserBehavesThisWay: string
  pipelineInvolved: PipelineStage[]
}

export interface AutoFix {
  badCode: string
  recommendedCode: string
  whyFaster: string
}

export interface RuleConfidence {
  score: number
  reasoning: string
  limitations: string
  falsePositiveRisk: 'Low' | 'Medium' | 'High'
}

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

  // New V2 Properties
  browserImpact: BrowserImpact
  explanation: BrowserExplanation
  autoFix: AutoFix
  confidence: RuleConfidence

  relatedExperimentIds?: string[]
  browserAPIs?: string[]
  relatedRecipes?: string[]
  interviewQuestions?: { question: string; answer: string }[]
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

export interface PerformanceEstimates {
  performanceGain: string
  memoryReduction: string
  renderingImprovement: string
  timeToFix: string
}

export interface ReviewReport {
  reportHash: string
  overallScore: PerformanceScoreCategory
  performanceScore: number
  confidenceScore: number
  estimates: PerformanceEstimates
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: PerformanceMetrics
  checklist: OptimizationChecklist[]
  analyzedFiles: number
}

// ---------------------------------------------------------
// Extension Interfaces (Do not implement logic for these)
// ---------------------------------------------------------

export interface LLMReviewEngineExtension {
  generateReview(report: ReviewReport): Promise<string>
  suggestCustomFix(issue: Issue): Promise<string>
}

export interface GitHubPullRequestReviewExtension {
  postReviewComments(report: ReviewReport, prNumber: number): Promise<void>
  generatePRSummary(report: ReviewReport): string
}

export interface IDEExtension {
  highlightIssues(issues: Issue[]): void
  applyAutoFix(issueId: string): void
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

  impact: string
  fix: string

  // New V2 Properties
  browserImpact: BrowserImpact
  explanation: BrowserExplanation
  autoFix: AutoFix
  confidence: RuleConfidence

  relatedExperiments: string[]
  browserAPIs: string[]
  relatedRecipes: string[]
  interviewQuestions?: { question: string; answer: string }[]

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
    | 'browserImpact'
    | 'explanation'
    | 'autoFix'
    | 'confidence'
    | 'relatedExperimentIds'
    | 'browserAPIs'
    | 'relatedRecipes'
    | 'interviewQuestions'
  >[]
}
