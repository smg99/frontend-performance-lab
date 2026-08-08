/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

function isInsideDeferral(path: any): boolean {
  let curr = path
  while (curr) {
    if (curr.node.type === 'CallExpression') {
      const callee = curr.node.callee
      if (callee.type === 'Identifier') {
        if (
          [
            'setTimeout',
            'setInterval',
            'requestIdleCallback',
            'requestAnimationFrame',
            'setImmediate'
          ].includes(callee.name)
        ) {
          return true
        }
      }
      if (callee.type === 'MemberExpression') {
        const propName = callee.property?.name || callee.property?.value
        if (
          ['setTimeout', 'requestIdleCallback', 'requestAnimationFrame', 'yield'].includes(propName)
        ) {
          return true
        }
      }
    }
    if (curr.node.type === 'NewExpression') {
      const callee = curr.node.callee
      if (callee.type === 'Identifier' && callee.name === 'Worker') {
        return true
      }
    }
    curr = curr.parentPath
  }
  return false
}

function isStartupHook(path: any): { isHook: boolean; fnArgIndex: number } {
  const node = path.node

  if (node.type === 'CallExpression') {
    const callee = node.callee
    if (
      callee.type === 'Identifier' &&
      ['useEffect', 'useLayoutEffect', 'onMounted', 'onBeforeMount'].includes(callee.name)
    ) {
      if (
        node.arguments.length > 0 &&
        (node.arguments[0].type === 'ArrowFunctionExpression' ||
          node.arguments[0].type === 'FunctionExpression')
      ) {
        return { isHook: true, fnArgIndex: 0 }
      }
    }

    if (
      callee.type === 'MemberExpression' &&
      callee.property &&
      (callee.property.name === 'addEventListener' || callee.property.value === 'addEventListener')
    ) {
      const args = node.arguments
      if (args.length >= 2) {
        const eventName =
          args[0].type === 'StringLiteral' || args[0].type === 'Literal' ? args[0].value : null
        if (
          eventName &&
          ['load', 'DOMContentLoaded'].includes(eventName) &&
          (args[1].type === 'ArrowFunctionExpression' || args[1].type === 'FunctionExpression')
        ) {
          return { isHook: true, fnArgIndex: 1 }
        }
      }
    }
  }

  return { isHook: false, fnArgIndex: -1 }
}

export const heavyJsOnload: ASTRule = {
  id: 'heavy-js-onload',
  title: 'Main-Thread Heavy JS',
  description:
    'Heavy JavaScript execution blocks the main thread, leading to poor interaction responsiveness (INP) and slow loading (TBT).',
  severity: 'Warning',
  browserImpact: { rendering: false, memory: true, cpu: true, cwv: false },
  category: 'Performance',
  frameworks: ['vanilla', 'react', 'vue', 'js'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['performance'],
  browserAPIs: [],
  impact: 'Increases Total Blocking Time and hurts Interaction to Next Paint.',
  fix: 'Offload heavy computation to a Web Worker, or yield to the main thread using `setTimeout` or `scheduler.yield()`.',
  confidence: {
    score: 85,
    reason:
      'Detects nested loops, heavy statement counts, or expensive APIs during startup hooks without deferral.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    if (!ast) return []

    const isLoopType = (type: string) =>
      [
        'ForStatement',
        'ForOfStatement',
        'ForInStatement',
        'WhileStatement',
        'DoWhileStatement'
      ].includes(type)

    traverse(ast, {
      CallExpression(path: any) {
        const { isHook, fnArgIndex } = isStartupHook(path)
        if (!isHook || fnArgIndex < 0) return

        let statementCount = 0
        let maxLoopDepth = 0
        let currentLoopDepth = 0
        let hasHeavyApiInLoop = false

        const fnPath = path.get(`arguments.${fnArgIndex}`)
        if (!fnPath || typeof fnPath.traverse !== 'function') return

        fnPath.traverse({
          Statement(childPath: any) {
            if (isInsideDeferral(childPath)) return
            statementCount++
          },
          CallExpression(childPath: any) {
            if (isInsideDeferral(childPath)) return
            const callee = childPath.node.callee
            let isHeavyApi = false

            if (callee.type === 'MemberExpression') {
              const objName = callee.object?.name
              const propName = callee.property?.name || callee.property?.value
              if (
                (objName === 'JSON' && (propName === 'parse' || propName === 'stringify')) ||
                propName === 'sort'
              ) {
                isHeavyApi = true
              }
            }

            if (isHeavyApi) {
              let inLoop = false
              let curr = childPath
              while (curr) {
                if (isLoopType(curr.node.type)) {
                  inLoop = true
                  break
                }
                curr = curr.parentPath
              }
              if (inLoop) {
                hasHeavyApiInLoop = true
              }
            }
          },
          enter(childPath: any) {
            if (isInsideDeferral(childPath)) return
            if (isLoopType(childPath.node.type)) {
              currentLoopDepth++
              if (currentLoopDepth > maxLoopDepth) {
                maxLoopDepth = currentLoopDepth
              }
            }
          },
          exit(childPath: any) {
            if (isInsideDeferral(childPath)) return
            if (isLoopType(childPath.node.type)) {
              currentLoopDepth--
            }
          }
        })

        let reason: string | null = null

        if (maxLoopDepth >= 2) {
          reason = 'nested loops'
        } else if (hasHeavyApiInLoop) {
          reason = 'heavy API call in loop'
        } else if (statementCount >= 35) {
          reason = `high statement count (${statementCount})`
        }

        if (reason) {
          const line = path.node.loc?.start.line || 1
          issues.push({
            lineNumbers: [line],
            description: `Heavy synchronous JavaScript execution during startup (${reason}) blocks the main thread.`
          })
        }
      }
    })

    return issues
  }
}
