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
      AssignmentExpression(path: any) {
        let isStyle = false;
        let c = path.node.left;
        while (c && c.type === 'MemberExpression') {
          if (c.property && c.property.name === 'style') {
            isStyle = true;
            break;
          }
          c = c.object;
        }
        if (isStyle) {
          // Flag style assignments unless they are inside requestAnimationFrame
          let inRaf = false;
          let curr = path;
          while (curr) {
            if (curr.node.type === 'CallExpression' && curr.node.callee.name === 'requestAnimationFrame') {
              inRaf = true;
              break;
            }
            curr = curr.parentPath;
          }
          if (!inRaf) {
            issues.push({
              lineNumbers: [path.node.loc?.start.line || 1]
            })
          }
        }
      }
    })

    return issues
  }
}
