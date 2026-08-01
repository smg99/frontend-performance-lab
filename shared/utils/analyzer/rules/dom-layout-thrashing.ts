import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const domLayoutThrashing: ASTRule = {
  id: 'dom-layout-thrashing',
  title: 'Layout Thrashing',
  description: 'Interleaving DOM reads and writes forces synchronous layout recalculation.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['vanilla', 'vue', 'react', 'nuxt'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['rendering'],
  browserAPIs: ['requestAnimationFrame'],
  impact: 'Forces synchronous reflows, killing frame rates (jank).',
  fix: 'Batch DOM reads together, and defer DOM writes using requestAnimationFrame.',
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<Issue, 'id' | 'title' | 'description' | 'ruleId' | 'severity' | 'category' | 'impact' | 'fix' | 'relatedExperimentIds' | 'browserAPIs'>[] = []
    if (!ast) return []

    traverse(ast, {
      MemberExpression(path: any) {
        if (
          path.node.property.type === 'Identifier' &&
          ['offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'getClientRects', 'getBoundingClientRect'].includes(path.node.property.name)
        ) {
          // If this read happens in the same block as a style write, flag it.
          // For MVP, we flag just the expensive reads as warnings.
          issues.push({
            lineNumbers: [path.node.loc?.start.line || 1]
          })
        }
      }
    })

    return issues
  }
}
