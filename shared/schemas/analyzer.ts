// shared/schemas/analyzer.ts (Updated for Phase 2 compatibility)

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
  reason: string
  filename?: string
  lineNumbers?: number[]
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
  estimatedImprovement?: string
  timeToFix?: string
  filename?: string

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
  warnings?: string[]
  metrics: PerformanceMetrics
  checklist: OptimizationChecklist[]
  analyzedFiles: number
}

// ---------------------------------------------------------
// PHASE 2: Cross-File Analysis Architecture Extensions
// (These are prepared interfaces but not yet fully implemented)
// ---------------------------------------------------------
export interface ProjectGraphNode {
  filename: string
  exports: string[]
  imports: { source: string; names: string[] }[]
  size: number
}

export interface ProjectGraph {
  nodes: Map<string, ProjectGraphNode>
  cycles: string[][]
}

export interface AnalyzerContext {
  filename: string
  code: string
  language: string
  framework: string
}

export interface RuleVisitorResult {
  lineNumbers?: number[]
  description?: string
  confidence?: Partial<RuleConfidence>
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
  estimatedImprovement?: string
  timeToFix?: string

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
    context: AnalyzerContext,
    projectGraph?: ProjectGraph // Phase 2 Extension
  ) => RuleVisitorResult[]

  fixer?: (ast: any, context: AnalyzerContext, issues: Issue[]) => boolean
}

export interface FPLPlugin {
  id: string
  name: string
  version: string
  rules: ASTRule[]
}
