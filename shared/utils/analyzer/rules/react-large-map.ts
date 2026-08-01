import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
// Babel traverse needs to be accessed carefully depending on module format
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const reactLargeMap: ASTRule = {
  id: 'react-large-map',
  title: 'Large .map() without Virtualization',
  description: 'Mapping over large arrays to render JSX elements creates excessive DOM nodes.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['react'],
  supportedLanguages: ['jsx', 'tsx'],
  relatedExperiments: ['virtualization'],
  browserAPIs: [],
  impact: 'High memory usage and main thread blocking during reconciliation.',
  fix: 'Implement a virtual list using react-window or react-virtualized.',
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<Issue, 'id' | 'title' | 'description' | 'ruleId' | 'severity' | 'category' | 'impact' | 'fix' | 'relatedExperimentIds' | 'browserAPIs'>[] = []
    if (!ast) return []

    traverse(ast, {
      CallExpression(path: any) {
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.property.type === 'Identifier' &&
          path.node.callee.property.name === 'map'
        ) {
          // Check if it returns JSX
          const arg = path.node.arguments[0]
          if (arg && (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression')) {
            const body = arg.body
            if (body.type === 'JSXElement' || (body.type === 'BlockStatement' && body.body.some((s:any) => s.type === 'ReturnStatement' && s.argument?.type === 'JSXElement'))) {
              issues.push({
                lineNumbers: [path.node.loc.start.line]
              })
            }
          }
        }
      }
    })

    return issues
  }
}
