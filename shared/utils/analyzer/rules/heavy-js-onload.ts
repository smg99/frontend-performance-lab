/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

/**
 * Main-Thread Heavy JS
 * Warns about functions with heavy logic (e.g. deep nesting > 4 or high statement count) running during load (like in useEffect or immediately invoked).
 */
export const heavyJsOnload: ASTRule = {
  id: 'heavy-js-onload',
  title: 'Main-Thread Heavy JS',
  description:
    'Heavy JavaScript execution blocks the main thread, leading to poor interaction responsiveness (INP) and slow loading (TBT).',
  severity: 'Warning',
  browserImpact: { rendering: false, memory: true, cpu: true, cwv: false },
  category: 'Performance',
  frameworks: ['react', 'vue', 'js'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['performance'],
  browserAPIs: [],
  impact: 'Increases Total Blocking Time and hurts Interaction to Next Paint.',
  fix: 'Offload heavy computation to a Web Worker, or yield to the main thread using `setTimeout` or `scheduler.yield()`.',
  confidence: {
    score: 60,
    reason:
      'Detects loops or deep nesting in functions called in useEffect or globally. Static analysis of execution cost is imprecise.',
    falsePositiveRisk: 'High'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    traverse(ast, {
      CallExpression(path: any) {
        const callee = path.node.callee
        // Specifically look for useEffect or onMounted hooks running heavy tasks
        if (
          callee.type === 'Identifier' &&
          (callee.name === 'useEffect' || callee.name === 'onMounted')
        ) {
          const args = path.node.arguments
          if (
            args.length > 0 &&
            (args[0].type === 'ArrowFunctionExpression' || args[0].type === 'FunctionExpression')
          ) {
            let statementCount = 0
            let maxNesting = 0
            let currentDepth = 0

            path.traverse({
              enter(childPath: any) {
                if (childPath.isStatement()) statementCount++
                if (
                  childPath.isBlockStatement() ||
                  childPath.isIfStatement() ||
                  childPath.isForStatement() ||
                  childPath.isWhileStatement()
                ) {
                  currentDepth++
                  if (currentDepth > maxNesting) maxNesting = currentDepth
                }
              },
              exit(childPath: any) {
                if (
                  childPath.isBlockStatement() ||
                  childPath.isIfStatement() ||
                  childPath.isForStatement() ||
                  childPath.isWhileStatement()
                ) {
                  currentDepth--
                }
              }
            })

            if (statementCount > 50 || maxNesting > 4) {
              issues.push({ lineNumbers: [path.node.loc.start.line] })
            }
          }
        }
      }
    })
    return issues
  }
}
