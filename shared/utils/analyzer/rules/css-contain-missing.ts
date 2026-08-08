/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

/**
 * CSS `contain` Missing
 * Flags large container elements (like <div> or <section>) that have many children but lack the CSS `contain` property,
 * which can lead to expensive layout recalculations.
 */
export const cssContainMissing: ASTRule = {
  id: 'css-contain-missing',
  title: 'CSS `contain` Optimization Missing',
  description:
    'Large elements with many children can cause expensive global style and layout calculations if not isolated with CSS `contain`.',
  severity: 'Warning',
  browserImpact: { rendering: true, memory: false, cpu: true, cwv: false },
  category: 'Performance',
  frameworks: ['react', 'vue'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx', 'html'],
  relatedExperiments: ['performance'],
  browserAPIs: [],
  impact: 'Increases layout thrashing and rendering time on complex pages.',
  fix: 'Add `contain: content` (or strict/layout) to the parent element CSS or style attribute.',
  confidence: {
    score: 75,
    reason:
      'Detects JSX elements with >30 children without inline contain styles. Cannot perfectly check external CSS.',
    falsePositiveRisk: 'Medium'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    traverse(ast, {
      JSXElement(path: any) {
        const children = path.node.children
        if (children && children.length > 30) {
          // Check inline styles for "contain"
          let hasContain = false
          const opening = path.node.openingElement
          for (const attr of opening.attributes) {
            if (
              attr.name &&
              attr.name.name === 'style' &&
              attr.value &&
              attr.value.expression &&
              attr.value.expression.type === 'ObjectExpression'
            ) {
              for (const prop of attr.value.expression.properties) {
                if (prop.key && prop.key.name === 'contain') {
                  hasContain = true
                }
              }
            }
          }
          if (!hasContain) {
            issues.push({ lineNumbers: [opening.loc.start.line] })
          }
        }
      }
    })
    return issues
  }
}
