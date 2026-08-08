/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

const LAYOUT_READ_PROPERTIES = new Set([
  'offsetWidth',
  'offsetHeight',
  'offsetTop',
  'offsetLeft',
  'clientWidth',
  'clientHeight',
  'clientTop',
  'clientLeft',
  'scrollWidth',
  'scrollHeight',
  'scrollTop',
  'scrollLeft'
])

const LAYOUT_READ_METHODS = new Set(['getBoundingClientRect', 'getClientRects', 'getComputedStyle'])

function isInsideRaf(path: any): boolean {
  let curr = path
  while (curr) {
    if (curr.node.type === 'CallExpression') {
      const callee = curr.node.callee
      if (
        callee.type === 'Identifier' &&
        (callee.name === 'requestAnimationFrame' || callee.name === 'nextTick')
      ) {
        return true
      }
      if (
        callee.type === 'MemberExpression' &&
        callee.property.type === 'Identifier' &&
        (callee.property.name === 'requestAnimationFrame' || callee.property.name === 'nextTick')
      ) {
        return true
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

function getElementName(node: any): string {
  if (!node) return 'element'
  if (node.type === 'Identifier') return node.name
  if (node.type === 'MemberExpression') {
    const obj = getElementName(node.object)
    const prop = getElementName(node.property)
    return `${obj}.${prop}`
  }
  if (node.type === 'CallExpression') {
    if (
      node.callee.type === 'MemberExpression' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'getElementById'
    ) {
      const arg = node.arguments[0]
      if (arg && arg.type === 'StringLiteral') return `'#${arg.value}'`
    }
    return 'element'
  }
  return 'element'
}

function getLayoutRead(node: any): { prop: string; element: string } | null {
  if (!node) return null
  let found: { prop: string; element: string } | null = null

  function walk(n: any) {
    if (!n || found) return
    if (n.type === 'MemberExpression' && n.property) {
      const propName = n.property.name || n.property.value
      if (LAYOUT_READ_PROPERTIES.has(propName)) {
        found = { prop: propName, element: getElementName(n.object) }
        return
      }
    }
    if (n.type === 'CallExpression' && n.callee) {
      if (n.callee.type === 'MemberExpression' && n.callee.property) {
        const methodName = n.callee.property.name || n.callee.property.value
        if (LAYOUT_READ_METHODS.has(methodName)) {
          found = { prop: methodName, element: getElementName(n.callee.object) }
          return
        }
      } else if (n.callee.type === 'Identifier' && LAYOUT_READ_METHODS.has(n.callee.name)) {
        found = { prop: n.callee.name, element: getElementName(n.arguments[0]) }
        return
      }
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
  return found
}

function isStyleWrite(node: any): { element: string } | null {
  if (!node) return null
  if (node.type === 'AssignmentExpression') {
    let curr = node.left
    while (curr && curr.type === 'MemberExpression') {
      const propName = curr.property?.name || curr.property?.value
      if (propName === 'style' || propName === 'className') {
        return { element: getElementName(curr.object) }
      }
      curr = curr.object
    }
  }
  return null
}

export const domLayoutThrashing: ASTRule = {
  id: 'dom-layout-thrashing',
  title: 'Layout Thrashing',
  description: 'Interleaving DOM reads and writes forces synchronous layout recalculation.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['vanilla', 'vue', 'react', 'nuxt'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['rendering'],
  browserAPIs: ['request-animation-frame'],
  relatedRecipes: ['dashboard-rendering'],
  impact: 'Forces synchronous reflows, killing frame rates (jank).',
  fix: 'Batch DOM reads together, and defer DOM writes using requestAnimationFrame.',
  browserImpact: {
    cpu: true,
    memory: false,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'A style property is being mutated directly in the DOM, potentially interleaving with a DOM read.',
    whyBrowserBehavesThisWay:
      'When you read a layout property (like offsetHeight) after modifying styles, the browser is forced to pause JavaScript execution and recalculate the entire page layout synchronously to give you the correct value. This is called Forced Synchronous Layout.',
    pipelineInvolved: ['Style', 'Layout', 'Paint']
  },
  autoFix: {
    badCode: 'element.style.width = element.clientWidth + 10 + "px";',
    recommendedCode:
      'const width = element.clientWidth;\nrequestAnimationFrame(() => {\n  element.style.width = width + 10 + "px";\n});',
    whyFaster:
      "requestAnimationFrame defers the style mutation until right before the browser's next paint cycle, preventing any interleaved reads from triggering synchronous recalculations."
  },
  confidence: {
    score: 90,
    reason:
      'Statically matches interleaved DOM layout reads and style writes outside requestAnimationFrame.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    if (!ast) return []

    traverse(ast, {
      JSXElement() {}, // No-op scope handler
      // 1. Inline Assignment Read-Write: element.style.width = element.clientWidth + 'px'
      AssignmentExpression(path: any) {
        if (isInsideRaf(path)) return
        const write = isStyleWrite(path.node)
        if (write) {
          const inlineRead = getLayoutRead(path.node.right)
          if (inlineRead) {
            const line = path.node.loc?.start.line || 1
            issues.push({
              lineNumbers: [line],
              description: `Layout thrashing: style assignment on '${write.element}' interleaves layout read '${inlineRead.prop}' outside requestAnimationFrame.`
            })
          }
        }
      },
      // 2. Loop Read & Write Thrashing
      ForStatement(path: any) {
        checkLoop(path)
      },
      ForOfStatement(path: any) {
        checkLoop(path)
      },
      ForInStatement(path: any) {
        checkLoop(path)
      },
      WhileStatement(path: any) {
        checkLoop(path)
      },
      DoWhileStatement(path: any) {
        checkLoop(path)
      },
      // 3. Sequential Write -> Read Forced Reflow in BlockStatement / Program
      BlockStatement(path: any) {
        checkSequentialWriteRead(path)
      },
      Program(path: any) {
        checkSequentialWriteRead(path)
      }
    })

    function checkLoop(path: any) {
      if (isInsideRaf(path)) return
      let loopWrite: { element: string; line: number } | null = null
      let loopRead: { prop: string; line: number } | null = null

      path.traverse({
        AssignmentExpression(subPath: any) {
          if (isInsideRaf(subPath)) return
          const write = isStyleWrite(subPath.node)
          if (write && !loopWrite) {
            loopWrite = { element: write.element, line: subPath.node.loc?.start.line || 1 }
          }
        },
        MemberExpression(subPath: any) {
          if (isInsideRaf(subPath)) return
          const propName = subPath.node.property?.name || subPath.node.property?.value
          if (LAYOUT_READ_PROPERTIES.has(propName) && !loopRead) {
            loopRead = { prop: propName, line: subPath.node.loc?.start.line || 1 }
          }
        },
        CallExpression(subPath: any) {
          if (isInsideRaf(subPath)) return
          const callee = subPath.node.callee
          if (callee.type === 'MemberExpression') {
            const methodName = callee.property?.name || callee.property?.value
            if (LAYOUT_READ_METHODS.has(methodName) && !loopRead) {
              loopRead = { prop: methodName, line: subPath.node.loc?.start.line || 1 }
            }
          }
        }
      })

      if (loopWrite && loopRead) {
        const line = (loopWrite as any).line || (loopRead as any).line
        issues.push({
          lineNumbers: [line],
          description: `Layout thrashing: interleaved DOM layout read ('${(loopRead as any).prop}') and style write on '${(loopWrite as any).element}' inside loop.`
        })
      }
    }

    function checkSequentialWriteRead(path: any) {
      if (isInsideRaf(path) || isInsideLoop(path)) return
      const stmts = path.node.body
      if (!Array.isArray(stmts)) return

      let lastWrite: { element: string; line: number } | null = null

      for (const stmt of stmts) {
        // Skip loop statements because checkLoop handles loops separately
        if (
          [
            'ForStatement',
            'ForOfStatement',
            'ForInStatement',
            'WhileStatement',
            'DoWhileStatement'
          ].includes(stmt.type)
        ) {
          continue
        }

        let stmtWrite: { element: string; line: number } | null = null
        let stmtRead: { prop: string; line: number } | null = null

        traverse(
          stmt,
          {
            AssignmentExpression(subPath: any) {
              if (isInsideRaf(subPath)) return
              const write = isStyleWrite(subPath.node)
              if (write && !stmtWrite) {
                stmtWrite = { element: write.element, line: subPath.node.loc?.start.line || 1 }
              }
            },
            MemberExpression(subPath: any) {
              if (isInsideRaf(subPath)) return
              const propName = subPath.node.property?.name || subPath.node.property?.value
              if (LAYOUT_READ_PROPERTIES.has(propName) && !stmtRead) {
                stmtRead = { prop: propName, line: subPath.node.loc?.start.line || 1 }
              }
            },
            CallExpression(subPath: any) {
              if (isInsideRaf(subPath)) return
              const callee = subPath.node.callee
              if (callee.type === 'MemberExpression') {
                const methodName = callee.property?.name || callee.property?.value
                if (LAYOUT_READ_METHODS.has(methodName) && !stmtRead) {
                  stmtRead = { prop: methodName, line: subPath.node.loc?.start.line || 1 }
                }
              }
            }
          },
          path.scope,
          path
        )

        // Write THEN Read in sequence -> Forced reflow!
        if (lastWrite && stmtRead) {
          issues.push({
            lineNumbers: [stmtRead.line],
            description: `Forced reflow: DOM style write on '${lastWrite.element}' followed by synchronous layout read '${stmtRead.prop}'.`
          })
          lastWrite = null
        }

        if (stmtWrite) {
          lastWrite = stmtWrite
        }
      }
    }

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
