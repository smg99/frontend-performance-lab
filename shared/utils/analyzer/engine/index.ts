/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type {
  AnalyzerContext,
  ASTRule,
  FPLPlugin,
  Issue,
  ReviewReport,
  OptimizationChecklist,
  PerformanceMetrics,
  PerformanceEstimates
} from '../../../schemas/analyzer'
import { parseVue } from '../parsers/vue'
import { parseBabel } from '../parsers/babel'
import { parseSvelte } from '../parsers/svelte'
import _generate from '@babel/generator'
const generate = typeof _generate === 'function' ? _generate : (_generate as any).default

export class AnalyzerEngine {
  private rules: ASTRule[] = []

  public registerRule(rule: ASTRule) {
    if (this.rules.some(r => r.id === rule.id)) {
      throw new Error(`Rule ID "${rule.id}" is already registered.`)
    }
    this.rules.push(rule)
  }

  public registerPlugin(plugin: FPLPlugin) {
    if (plugin.rules && Array.isArray(plugin.rules)) {
      plugin.rules.forEach(rule => this.registerRule(rule))
    }
  }

  private parseCode(context: AnalyzerContext) {
    try {
      if (context.language === 'vue') return parseVue(context.code)
      if (context.language === 'svelte') return parseSvelte(context.code)
      if (['js', 'jsx', 'ts', 'tsx'].includes(context.language)) {
        return parseBabel(context.code, context.language === 'tsx')
      }
    } catch (e) {
      // Graceful fallback for malformed files
      return { ast: null }
    }
    return { ast: null }
  }

  public analyze(contexts: AnalyzerContext[], options?: { autoFix?: boolean }): ReviewReport {
    const allIssues: Issue[] = []
    const warnings: string[] = []

    for (const ctx of contexts) {
      const { ast } = this.parseCode(ctx)
      if (!ast) continue

      let fileMutated = false

      // Run applicable rules
      for (const rule of this.rules) {
        if (
          rule.supportedLanguages.includes(ctx.language) &&
          rule.frameworks.includes(ctx.framework)
        ) {
          try {
            const rawIssues = rule.visitor(ast, ctx)

            for (const raw of rawIssues) {
              allIssues.push({
                id: `${rule.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                title: rule.title,
                description: raw.description ?? rule.description,
                ruleId: rule.id,
                filename: ctx.filename,
                severity: rule.severity,
                category: rule.category,
                impact: rule.impact,
                fix: rule.fix,
                browserImpact: rule.browserImpact,
                explanation: rule.explanation,
                autoFix: rule.autoFix,
                confidence: {
                  ...rule.confidence,
                  ...raw.confidence
                },
                estimatedImprovement: rule.estimatedImprovement || 'Unknown',
                timeToFix: rule.timeToFix || '~5 mins',
                relatedExperimentIds: rule.relatedExperiments,
                browserAPIs: rule.browserAPIs,
                relatedRecipes: rule.relatedRecipes,
                interviewQuestions: rule.interviewQuestions,
                lineNumbers: raw.lineNumbers
              })
            }

            if (options?.autoFix && rule.fixer) {
              const ruleMutated = rule.fixer(ast, ctx, rawIssues as any)
              if (ruleMutated) fileMutated = true
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            warnings.push(
              `Rule execution failed: Rule '${rule.id}' crashed while analyzing ${ctx.filename} (${errorMessage})`
            )
          }
        }
      }

      if (fileMutated && options?.autoFix) {
        try {
          const output = generate(ast, {}, ctx.code)
          ctx.code = output.code
        } catch (e) {
          console.error(`AutoFix code generation failed for ${ctx.filename}:`, e)
        }
      }
    }

    // Generate Weighted Scores
    let deduction = 0
    let rendering = 100
    let memory = 100
    let cpu = 100
    let cwv = 100

    let totalConfidence = 0
    let totalTime = 0
    let hasMemory = false
    let hasRendering = false

    allIssues.forEach(i => {
      // Weight logic: Critical -30, High -20, Medium -10, Low -5, Info 0
      const p =
        i.severity === 'Critical'
          ? 30
          : i.severity === 'High'
            ? 20
            : i.severity === 'Medium'
              ? 10
              : i.severity === 'Warning'
                ? 10
                : i.severity === 'Low'
                  ? 5
                  : 0
      deduction += p

      if (i.browserImpact?.rendering) rendering -= p
      if (i.browserImpact?.memory) {
        memory -= p
        hasMemory = true
      }
      if (i.browserImpact?.cpu) cpu -= p
      if (i.browserImpact?.cwv) cwv -= p

      totalConfidence += i.confidence.score
      totalTime += 5 // ~5 mins per fix
      if (i.browserImpact.rendering) hasRendering = true
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
      (fix, index) => ({
        id: `fix-${index}`,
        title: fix,
        completed: false
      })
    )

    const confidenceScore = allIssues.length ? Math.round(totalConfidence / allIssues.length) : 100

    const estimates: PerformanceEstimates = {
      performanceGain:
        allIssues.length > 0
          ? deduction > 40
            ? 'High (+40% FPS)'
            : 'Moderate (+15% FPS)'
          : 'Optimal',
      memoryReduction: hasMemory ? '~25% footprint reduction' : 'Minimal',
      renderingImprovement: hasRendering ? 'Eliminates layout thrashing' : 'Minimal',
      timeToFix: allIssues.length > 0 ? `< ${Math.max(5, totalTime)} mins` : '0 mins'
    }

    // Deterministic hash based on rule IDs and line numbers
    const hashPayload = allIssues.map(i => `${i.ruleId}-${i.lineNumbers?.join(',')}`).join('|')
    const reportHash =
      typeof btoa === 'function'
        ? btoa(hashPayload || 'clean')
        : Buffer.from(hashPayload || 'clean').toString('base64')

    return {
      reportHash,
      overallScore: grade as any,
      performanceScore: finalScore,
      confidenceScore,
      estimates,
      issues: allIssues,
      suggestions: [],
      warnings: warnings.length > 0 ? warnings : undefined,
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
