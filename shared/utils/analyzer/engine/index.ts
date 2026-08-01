/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type {
  AnalyzerContext,
  ASTRule,
  Issue,
  ReviewReport,
  OptimizationChecklist,
  PerformanceMetrics
} from '../../../schemas/analyzer'
import { parseVue } from '../parsers/vue'
import { parseBabel } from '../parsers/babel'

export class AnalyzerEngine {
  private rules: ASTRule[] = []

  public registerRule(rule: ASTRule) {
    this.rules.push(rule)
  }

  private parseCode(context: AnalyzerContext) {
    if (context.language === 'vue') return parseVue(context.code)
    if (['js', 'jsx', 'ts', 'tsx'].includes(context.language)) {
      return parseBabel(context.code, context.language === 'tsx')
    }
    return { ast: null }
  }

  public analyze(contexts: AnalyzerContext[]): ReviewReport {
    const allIssues: Issue[] = []

    for (const ctx of contexts) {
      const { ast } = this.parseCode(ctx)
      if (!ast) continue

      // Run applicable rules
      for (const rule of this.rules) {
        if (
          rule.supportedLanguages.includes(ctx.language) &&
          rule.frameworks.includes(ctx.framework)
        ) {
          const rawIssues = rule.visitor(ast, ctx)

          for (const raw of rawIssues) {
            allIssues.push({
              id: `${rule.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              title: rule.title,
              description: rule.description,
              ruleId: rule.id,
              severity: rule.severity,
              category: rule.category,
              impact: rule.impact,
              fix: rule.fix,
              relatedExperimentIds: rule.relatedExperiments,
              browserAPIs: rule.browserAPIs,
              relatedRecipes: rule.relatedRecipes,
              lineNumbers: raw.lineNumbers
            })
          }
        }
      }
    }

    // Generate Scores based on severities
    let deduction = 0
    let rendering = 100
    let memory = 100
    let cpu = 100
    let cwv = 100

    allIssues.forEach(i => {
      const p = i.severity === 'Critical' ? 20 : i.severity === 'Warning' ? 10 : 2
      deduction += p
      if (i.category === 'Rendering') rendering -= p
      if (i.category === 'Memory') memory -= p
      if (i.category === 'CPU') cpu -= p
      if (i.category === 'CWV') cwv -= p
    })

    const finalScore = Math.max(0, 100 - deduction)
    const grade =
      finalScore >= 95
        ? 'A+'
        : finalScore >= 90
          ? 'A'
          : finalScore >= 80
            ? 'B'
            : finalScore >= 70
              ? 'C'
              : finalScore >= 60
                ? 'D'
                : 'F'

    const checklist: OptimizationChecklist[] = Array.from(new Set(allIssues.map(i => i.fix))).map(
      fix => ({
        id: Math.random().toString(),
        title: fix,
        completed: false
      })
    )

    return {
      overallScore: grade as any,
      issues: allIssues,
      suggestions: [],
      metrics: {
        Rendering: Math.max(0, rendering),
        Memory: Math.max(0, memory),
        CPU: Math.max(0, cpu),
        CWV: Math.max(0, cwv)
      },
      checklist,
      analyzedFiles: contexts.length
    }
  }
}
