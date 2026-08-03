export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface DiagnosticDefinition {
  id: string
  title: string
  category: string
  severity: string
  confidence: ConfidenceLevel
  summary: string
  why: string
  impact: string
  howToVerify: string
  recommendedFix: string
  references: string[]
  framework: string
  ruleVersion: string
}

export interface EnrichedDiagnostic extends DiagnosticDefinition {
  line: number
}
