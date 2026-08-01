/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const memoryEventListener: ASTRule = {
  id: 'memory-event-listener',
  title: 'Global Event Listener Leak',
  description:
    'Adding listeners to global objects (window, document) without removing them causes memory leaks.',
  severity: 'Critical',
  category: 'Memory',
  frameworks: ['vanilla', 'vue', 'react'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['memory-vitals'],
  browserAPIs: ['addEventListener', 'removeEventListener'],
  impact: 'Garbage collector cannot destroy the component, leading to OOM crashes over time.',
  fix: 'Always call removeEventListener in the component unmount/destroy hook.',
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<
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
    >[] = []
    if (!ast) return []

    // MVP Heuristic: Flag global addEventListener inside a component file if no removeEventListener is found
    let hasAdd = false
    let hasRemove = false
    let line = 1

    traverse(ast, {
      CallExpression(path: any) {
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.property.type === 'Identifier'
        ) {
          if (path.node.callee.property.name === 'addEventListener') {
            const obj = path.node.callee.object
            if (obj.type === 'Identifier' && ['window', 'document', 'body'].includes(obj.name)) {
              hasAdd = true
              line = path.node.loc?.start.line || 1
            }
          }
          if (path.node.callee.property.name === 'removeEventListener') {
            hasRemove = true
          }
        }
      }
    })

    if (hasAdd && !hasRemove) {
      issues.push({ lineNumbers: [line] })
    }

    return issues
  }
}
