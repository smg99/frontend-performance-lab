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
  browserImpact: {
    cpu: false,
    memory: true,
    rendering: false,
    network: false,
    cwv: false
  },
  explanation: {
    whatHappened:
      'An event listener is attached to a global object (window or document) but no corresponding removeEventListener was found in the same file.',
    whyBrowserBehavesThisWay:
      'Global objects persist for the lifetime of the page. If a component attaches a listener to `window` and is unmounted, the `window` still holds a reference to the listener function (which often closes over the component scope), preventing Garbage Collection.',
    pipelineInvolved: []
  },
  autoFix: {
    badCode: 'window.addEventListener("resize", handleResize);',
    recommendedCode:
      'onMounted(() => window.addEventListener("resize", handleResize));\nonUnmounted(() => window.removeEventListener("resize", handleResize));',
    whyFaster:
      'Explicitly removing listeners breaks the reference cycle, allowing the V8 Garbage Collector to instantly free the memory associated with the destroyed component.'
  },
  confidence: {
    score: 90,
    reasoning:
      'Found an addEventListener on window/document without any removeEventListener in the same AST.',
    limitations:
      'The removeEventListener might be abstracted away in a custom hook or utility function.',
    falsePositiveRisk: 'Medium'
  },
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
      | 'browserImpact'
      | 'explanation'
      | 'autoFix'
      | 'confidence'
      | 'relatedExperimentIds'
      | 'browserAPIs'
      | 'relatedRecipes'
      | 'interviewQuestions'
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
