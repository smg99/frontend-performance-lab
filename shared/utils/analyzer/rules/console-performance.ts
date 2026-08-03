import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'

export const consolePerformance: ASTRule = {
  id: 'console-performance',
  title: 'Production Console Logging',
  description: 'Detects synchronous console logging which can block the main thread and leak memory in production.',
  severity: 'Warning',
  category: 'CPU',
  frameworks: ['react', 'vue', 'svelte', 'js'],
  supportedLanguages: ['js', 'jsx', 'ts', 'tsx', 'vue', 'svelte'],
  impact: 'Synchronous console.log statements pause the JS thread and hold onto memory references, causing memory leaks and dropping frames.',
  fix: 'Remove console statements or use a build-time plugin (like terser drop_console) to strip them in production.',
  browserImpact: {
    cpu: true,
    memory: true,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened: 'A console.* statement was found in the source code.',
    whyBrowserBehavesThisWay: 'The browser devtools must serialize objects passed to console.log, which blocks the main thread. Even if DevTools is closed, the browser keeps a reference to the logged objects, preventing garbage collection.',
    pipelineInvolved: ['DOM']
  },
  autoFix: {
    badCode: 'console.log("data", massiveObject);',
    recommendedCode: '/* removed */',
    whyFaster: 'Removing synchronous blocking calls frees up the main thread and allows the JS engine to garbage collect memory immediately.'
  },
  confidence: {
    score: 100,
    reason: 'AST definitively identifies console.* method calls.',
    falsePositiveRisk: 'Low'
  },
  relatedExperiments: [],
  browserAPIs: [],
  relatedRecipes: [],
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<Issue, 'id' | 'title' | 'description' | 'ruleId' | 'severity' | 'category' | 'impact' | 'fix' | 'estimatedImprovement' | 'timeToFix' | 'browserImpact' | 'explanation' | 'autoFix' | 'confidence' | 'relatedExperimentIds' | 'browserAPIs' | 'relatedRecipes' | 'interviewQuestions'>[] = []

    traverse(ast, {
      CallExpression(path: any) {
        const callee = path.node.callee
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'console'
        ) {
          issues.push({
            lineNumbers: [path.node.loc?.start.line].filter(Boolean) as number[]
          })
        }
      }
    })

    return issues
  },
  fixer: (ast: any, context: AnalyzerContext, issues: Issue[]) => {
    let mutated = false

    traverse(ast, {
      CallExpression(path: any) {
        const callee = path.node.callee
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'console'
        ) {
          // If the console.log is a standalone statement, remove it entirely
          if (path.parentPath.isExpressionStatement()) {
            path.parentPath.remove()
          } else {
            // Otherwise, replace it with undefined (e.g. if used inside an expression)
            path.replaceWith({ type: 'Identifier', name: 'undefined' })
          }
          mutated = true
        }
      }
    })

    return mutated
  }
}
