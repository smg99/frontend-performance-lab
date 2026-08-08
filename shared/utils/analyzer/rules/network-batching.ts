/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

/**
 * Network Request Batching
 * Warns when multiple `fetch` or `axios` calls are made within the same synchronous block.
 */
export const networkBatching: ASTRule = {
  id: 'network-batching',
  title: 'Network Request Batching',
  description:
    'Making multiple sequential or unbatched network requests can degrade performance and increase network overhead.',
  severity: 'Warning',
  browserImpact: { rendering: false, memory: false, cpu: false, cwv: false }, // Could affect LCP if requests are blocking
  category: 'Performance',
  frameworks: ['react', 'vue', 'js'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['performance'],
  browserAPIs: ['fetch'],
  impact: 'Increases network latency and time to interactive.',
  fix: 'Use `Promise.all` to batch requests or combine them on the backend via GraphQL or a dedicated endpoint.',
  confidence: {
    score: 70,
    reason:
      'Detects BlockStatements containing multiple CallExpressions for fetch or axios. False positives may occur if logically separate.',
    falsePositiveRisk: 'High'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    traverse(ast, {
      BlockStatement(path: any) {
        let fetchCount = 0
        let startLine = 0

        path.traverse({
          CallExpression(childPath: any) {
            const callee = childPath.node.callee
            if (callee.type === 'Identifier' && callee.name === 'fetch') {
              fetchCount++
              if (fetchCount === 1) startLine = childPath.node.loc.start.line
            } else if (callee.type === 'MemberExpression' && callee.object.name === 'axios') {
              fetchCount++
              if (fetchCount === 1) startLine = childPath.node.loc.start.line
            } else if (callee.type === 'Identifier' && callee.name === 'axios') {
              fetchCount++
              if (fetchCount === 1) startLine = childPath.node.loc.start.line
            }
          }
        })

        if (fetchCount >= 3) {
          issues.push({ lineNumbers: [startLine || path.node.loc.start.line] })
          path.skip() // Prevent counting within nested blocks twice for the same logical block
        }
      }
    })
    return issues
  }
}
