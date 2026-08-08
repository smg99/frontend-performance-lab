/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
// Babel traverse needs to be accessed carefully depending on module format
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

const MAX_STATIC_LIST_SIZE = 10

function isSmallStaticArray(node: any, scope: any): boolean {
  if (!node) return false

  // Direct array literal: ['a', 'b', 'c']
  if (node.type === 'ArrayExpression') {
    return node.elements.length <= MAX_STATIC_LIST_SIZE
  }

  // Bounded array slice: items.slice(0, 5)
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'slice'
  ) {
    const sliceArgs = node.arguments
    if (sliceArgs.length >= 2 && sliceArgs[1].type === 'NumericLiteral') {
      const limit = sliceArgs[1].value
      const start = sliceArgs[0].type === 'NumericLiteral' ? sliceArgs[0].value : 0
      if (typeof limit === 'number' && limit - start <= MAX_STATIC_LIST_SIZE) {
        return true
      }
    }
  }

  // Identifier scope binding check: const TABS = ['a', 'b', 'c']
  if (node.type === 'Identifier' && scope) {
    const binding = scope.getBinding(node.name)
    if (binding && binding.path) {
      const initNode = binding.path.node?.init
      if (initNode && initNode.type === 'ArrayExpression') {
        return initNode.elements.length <= MAX_STATIC_LIST_SIZE
      }
    }
  }

  return false
}

function getArrayLabel(node: any): string {
  if (!node) return 'array'
  if (node.type === 'Identifier') return node.name
  if (node.type === 'MemberExpression') {
    const objName = node.object.name || (node.object.property ? node.object.property.name : 'data')
    const propName = node.property.name || 'items'
    return `${objName}.${propName}`
  }
  if (node.type === 'ArrayExpression') return 'array literal'
  return 'array'
}

export const reactLargeMap: ASTRule = {
  id: 'react-large-map',
  title: 'Large .map() without Virtualization',
  description:
    'Mapping over large or dynamic arrays to render JSX elements creates excessive DOM nodes.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['react'],
  supportedLanguages: ['jsx', 'tsx'],
  relatedExperiments: ['virtualization', 'rendering'],
  browserAPIs: ['intersection-observer'],
  relatedRecipes: ['large-data-table', 'dashboard-rendering'],
  impact: 'High memory usage and main thread blocking during reconciliation.',
  fix: 'Implement a virtual list using react-window or react-virtualized.',
  browserImpact: {
    cpu: true,
    memory: true,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'A large or unbounded array is being mapped directly to JSX elements without virtualization.',
    whyBrowserBehavesThisWay:
      'React will create a Fiber node and a DOM node for every element. Mapping over thousands of items blocks the main thread during reconciliation and overwhelms the browser layout engine.',
    pipelineInvolved: ['DOM', 'Style', 'Layout', 'Paint', 'Composite']
  },
  autoFix: {
    badCode: 'items.map(item => <HeavyCard key={item.id} data={item} />)',
    recommendedCode:
      '<FixedSizeList height={400} itemCount={items.length} itemSize={100}>\n  {({ index, style }) => <div style={style}><HeavyCard data={items[index]} /></div>}\n</FixedSizeList>',
    whyFaster:
      'Virtualization drastically reduces the DOM node count to only what is visible, bypassing the massive memory allocation and Layout thrashing associated with large DOM trees.'
  },
  confidence: {
    score: 85,
    reason:
      'Detected an Array.map returning JSX on a dynamic or large array (ignoring small static lists <= 10 items).',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    if (!ast) return []

    traverse(ast, {
      CallExpression(path: any) {
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.property.type === 'Identifier' &&
          path.node.callee.property.name === 'map'
        ) {
          // Skip small static lists (array literals <= 10 items, small slices, bounded static variables)
          if (isSmallStaticArray(path.node.callee.object, path.scope)) {
            return
          }

          // Check if it returns JSX
          const arg = path.node.arguments[0]
          if (
            arg &&
            (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression')
          ) {
            const body = arg.body
            if (
              body.type === 'JSXElement' ||
              (body.type === 'BlockStatement' &&
                body.body.some(
                  (s: any) => s.type === 'ReturnStatement' && s.argument?.type === 'JSXElement'
                ))
            ) {
              const label = getArrayLabel(path.node.callee.object)
              issues.push({
                lineNumbers: [path.node.loc.start.line],
                description: `Unvirtualized .map() on '${label}' returning JSX`
              })
            }
          }
        }
      }
    })

    return issues
  }
}
