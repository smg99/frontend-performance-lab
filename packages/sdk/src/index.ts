import type { ASTRule, FPLPlugin } from '../../../shared/schemas/analyzer.js'

export type {
  ASTRule,
  FPLPlugin,
  AnalyzerContext,
  Issue,
  Severity,
  RuleCategory,
  BrowserImpact,
  BrowserExplanation,
  AutoFix,
  RuleConfidence,
  RuleVisitorResult
} from '../../../shared/schemas/analyzer.js'

/**
 * Define an FPL Plugin securely with type-checking.
 * @param plugin The plugin definition
 * @returns The structured FPLPlugin object
 */
export function definePlugin(plugin: FPLPlugin): FPLPlugin {
  return plugin
}

/**
 * Define a custom Analyzer AST Rule.
 * @param rule The rule definition
 * @returns The structured ASTRule object
 */
export function defineRule(rule: ASTRule): ASTRule {
  return rule
}
