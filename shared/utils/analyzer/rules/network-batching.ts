/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

function isNetworkRequestCall(node: any): boolean {
  if (!node || node.type !== 'CallExpression') return false
  const callee = node.callee
  if (callee.type === 'Identifier' && ['fetch', 'axios', '$fetch'].includes(callee.name)) {
    return true
  }
  if (callee.type === 'MemberExpression') {
    const objName = callee.object?.name
    if (objName === 'axios' || objName === '$fetch') return true
  }
  return false
}

function getRequestEndpoint(node: any): string {
  if (!node || !node.arguments || node.arguments.length === 0) return 'endpoint'
  const arg = node.arguments[0]
  if (arg.type === 'StringLiteral' || arg.type === 'Literal') return arg.value
  if (arg.type === 'TemplateLiteral') {
    return arg.quasis.map((q: any) => q.value.raw).join('${...}')
  }
  if (arg.type === 'Identifier') return arg.name
  if (arg.type === 'BinaryExpression') {
    return 'dynamic URL'
  }
  return 'endpoint'
}

function isInsidePromiseAll(path: any): boolean {
  let curr = path
  while (curr) {
    if (curr.node.type === 'CallExpression') {
      const callee = curr.node.callee
      if (callee.type === 'MemberExpression' && callee.object?.name === 'Promise') {
        const propName = callee.property?.name || callee.property?.value
        if (propName === 'all' || propName === 'allSettled') {
          return true
        }
      }
    }
    curr = curr.parentPath
  }
  return false
}

function isInsideLoop(path: any): boolean {
  let curr = path
  while (curr) {
    if (
      [
        'ForStatement',
        'ForOfStatement',
        'ForInStatement',
        'WhileStatement',
        'DoWhileStatement'
      ].includes(curr.node.type)
    ) {
      return true
    }
    curr = curr.parentPath
  }
  return false
}

function getAssignedVarNames(stmtNode: any): Set<string> {
  const vars = new Set<string>()
  if (!stmtNode) return vars

  let initNode: any = null
  if (stmtNode.type === 'VariableDeclaration') {
    for (const decl of stmtNode.declarations) {
      initNode = decl.init
      extractNames(decl.id)
    }
  } else if (
    stmtNode.type === 'ExpressionStatement' &&
    stmtNode.expression.type === 'AssignmentExpression'
  ) {
    initNode = stmtNode.expression.right
    extractNames(stmtNode.expression.left)
  }

  function extractNames(idNode: any) {
    if (!idNode) return
    if (idNode.type === 'Identifier') {
      vars.add(idNode.name)
    } else if (idNode.type === 'ObjectPattern') {
      for (const prop of idNode.properties) {
        if (prop.type === 'Property') extractNames(prop.value)
      }
    } else if (idNode.type === 'ArrayPattern') {
      for (const elem of idNode.elements) {
        if (elem) extractNames(elem)
      }
    }
  }

  return vars
}

function getReferencedIdentifiers(node: any): Set<string> {
  const refs = new Set<string>()
  function walk(n: any) {
    if (!n) return
    if (n.type === 'Identifier') {
      refs.add(n.name)
    }
    for (const key in n) {
      if (key === 'parent' || key === 'tokens') continue
      const child = n[key]
      if (child && typeof child === 'object') {
        if (Array.isArray(child)) {
          for (const item of child) {
            if (item && typeof item === 'object' && item.type) walk(item)
          }
        } else if (child.type) {
          walk(child)
        }
      }
    }
  }
  walk(node)
  return refs
}

export const networkBatching: ASTRule = {
  id: 'network-batching',
  title: 'Network Request Batching',
  description:
    'Making multiple sequential or unbatched network requests can degrade performance and increase network overhead.',
  severity: 'Warning',
  browserImpact: { rendering: false, memory: false, cpu: false, cwv: false },
  category: 'Performance',
  frameworks: ['vanilla', 'react', 'vue', 'js'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['performance'],
  browserAPIs: ['fetch'],
  impact: 'Increases network latency and time to interactive.',
  fix: 'Use `Promise.all` to batch requests or combine them on the backend via GraphQL or a dedicated endpoint.',
  confidence: {
    score: 85,
    reason:
      'Detects unbatched parallelizable network requests or requests inside loops outside Promise.all.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    if (!ast) return []

    traverse(ast, {
      CallExpression(path: any) {
        if (!isNetworkRequestCall(path.node)) return
        if (isInsidePromiseAll(path)) return

        // 1. Check if request is inside a loop (N+1 Waterfall)
        if (isInsideLoop(path)) {
          const endpoint = getRequestEndpoint(path.node)
          const line = path.node.loc?.start.line || 1
          issues.push({
            lineNumbers: [line],
            description: `Network request '${endpoint}' inside loop causes sequential N+1 network waterfall.`
          })
        }
      },

      // 2. Inspect BlockStatement for multiple independent unbatched requests
      BlockStatement(path: any) {
        if (isInsidePromiseAll(path) || isInsideLoop(path)) return
        const stmts = path.node.body
        if (!Array.isArray(stmts)) return

        const requests: Array<{
          endpoint: string
          line: number
          assignedVars: Set<string>
          argRefs: Set<string>
        }> = []

        for (const stmt of stmts) {
          let reqNode: any = null
          traverse(
            stmt,
            {
              CallExpression(subPath: any) {
                if (
                  isNetworkRequestCall(subPath.node) &&
                  !isInsidePromiseAll(subPath) &&
                  !isInsideLoop(subPath)
                ) {
                  reqNode = subPath.node
                }
              }
            },
            path.scope,
            path
          )

          if (reqNode) {
            const endpoint = getRequestEndpoint(reqNode)
            const line = reqNode.loc?.start.line || 1
            const assignedVars = getAssignedVarNames(stmt)
            const argRefs = getReferencedIdentifiers(reqNode.arguments)
            requests.push({ endpoint, line, assignedVars, argRefs })
          }
        }

        if (requests.length >= 2) {
          // Filter out requests that depend on previous assigned variables
          const previousDeclaredVars = new Set<string>()
          const independentRequests: Array<{ endpoint: string; line: number }> = []

          for (const req of requests) {
            let isDependent = false
            for (const ref of req.argRefs) {
              if (previousDeclaredVars.has(ref)) {
                isDependent = true
                break
              }
            }
            if (!isDependent) {
              independentRequests.push({ endpoint: req.endpoint, line: req.line })
            }
            for (const v of req.assignedVars) {
              previousDeclaredVars.add(v)
            }
          }

          if (independentRequests.length >= 2) {
            const ep1 = independentRequests[0].endpoint
            const ep2 = independentRequests[1].endpoint
            const line = independentRequests[0].line
            issues.push({
              lineNumbers: [line],
              description: `Multiple independent network requests ('${ep1}', '${ep2}') executed sequentially instead of in parallel with Promise.all.`
            })
          }
        }
      }
    })

    // Deduplicate issues by line and description
    const uniqueMap = new Map<string, RuleVisitorResult>()
    for (const issue of issues) {
      const key = `${issue.lineNumbers.join(',')}:${issue.description}`
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, issue)
      }
    }

    return Array.from(uniqueMap.values())
  }
}
