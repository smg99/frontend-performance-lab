/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

function getTargetName(node: any): string | null {
  if (!node) return null
  if (node.type === 'Identifier') return node.name
  if (node.type === 'MemberExpression') {
    const obj = getTargetName(node.object)
    const prop = getTargetName(node.property)
    return obj && prop ? `${obj}.${prop}` : null
  }
  if (node.type === 'ThisExpression') return 'this'
  return null
}

function getEventTypeName(node: any): string {
  if (!node) return 'event'
  if (node.type === 'StringLiteral') return node.value
  if (node.type === 'Identifier') return node.name
  return 'event'
}

function getHandlerKey(node: any): { key: string | null; isAnonymous: boolean } {
  if (!node) return { key: null, isAnonymous: true }
  if (node.type === 'Identifier') {
    return { key: node.name, isAnonymous: false }
  }
  if (node.type === 'MemberExpression') {
    const key = getTargetName(node)
    return { key, isAnonymous: false }
  }
  return { key: null, isAnonymous: true }
}

function isAutoCleanedOptions(optionsNode: any): boolean {
  if (!optionsNode || optionsNode.type !== 'ObjectExpression') return false
  for (const prop of optionsNode.properties) {
    if (prop.type === 'ObjectProperty') {
      const propKey = prop.key.name || prop.key.value
      if (propKey === 'once' && prop.value.type === 'BooleanLiteral' && prop.value.value === true) {
        return true
      }
      if (propKey === 'signal') {
        return true
      }
    }
  }
  return false
}

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
    reason:
      'Statically matches target, event type, and handler reference across add/removeEventListener calls.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    if (!ast) return []

    const addCalls: Array<{
      target: string
      eventType: string
      handlerKey: string | null
      isAnonymous: boolean
      isAutoCleaned: boolean
      line: number
    }> = []

    const removeCalls: Array<{
      target: string
      eventType: string
      handlerKey: string | null
    }> = []

    traverse(ast, {
      CallExpression(path: any) {
        const callee = path.node.callee
        if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
          const methodName = callee.property.name
          const target = getTargetName(callee.object)

          if (target && ['window', 'document', 'body'].includes(target)) {
            const args = path.node.arguments
            const eventType = getEventTypeName(args[0])
            const { key: handlerKey, isAnonymous } = getHandlerKey(args[1])

            if (methodName === 'addEventListener') {
              const isAutoCleaned = isAutoCleanedOptions(args[2])
              addCalls.push({
                target,
                eventType,
                handlerKey,
                isAnonymous,
                isAutoCleaned,
                line: path.node.loc?.start.line || 1
              })
            } else if (methodName === 'removeEventListener') {
              removeCalls.push({
                target,
                eventType,
                handlerKey
              })
            }
          }
        }
      }
    })

    for (const add of addCalls) {
      if (add.isAutoCleaned) continue

      if (add.isAnonymous) {
        issues.push({
          lineNumbers: [add.line],
          description: `Global '${add.eventType}' event listener on '${add.target}' may persist without cleanup.`
        })
        continue
      }

      const hasMatch = removeCalls.some(
        rem =>
          rem.target === add.target &&
          rem.eventType === add.eventType &&
          rem.handlerKey === add.handlerKey
      )

      if (!hasMatch) {
        issues.push({
          lineNumbers: [add.line],
          description: `Global '${add.eventType}' event listener on '${add.target}' may persist without cleanup.`
        })
      }
    }

    return issues
  }
}
