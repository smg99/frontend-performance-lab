/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

function getUnstableAllocationType(node: any): string | null {
  if (!node) return null
  switch (node.type) {
    case 'ObjectExpression':
      return 'object'
    case 'ArrayExpression':
      return 'array'
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return 'function'
    case 'NewExpression':
      return 'instance'
    default:
      return null
  }
}

export const reactUnmemoizedContextProvider: ASTRule = {
  id: 'react-unmemoized-context-provider',
  title: 'Unmemoized React Context Provider',
  description:
    'Passing inline objects, arrays, or functions to a Context Provider forces all consumers to re-render every time the Provider renders.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['react'],
  supportedLanguages: ['jsx', 'tsx'],
  relatedExperiments: ['rendering', 'reactivity'],
  browserAPIs: [],
  impact:
    'Unnecessary and cascading re-renders across the entire React component tree beneath the provider.',
  fix: 'Wrap the context value in a useMemo hook.',
  browserImpact: {
    cpu: true,
    memory: false,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'A React Context Provider is receiving a dynamically allocated object, array, or function directly in its `value` prop.',
    whyBrowserBehavesThisWay:
      'React checks Context value equality using Object.is(). An inline object literal `{}` or function `() => {}` creates a new reference on every single render cycle. This instantly invalidates the memoization of all components consuming this context, forcing a cascading re-render of potentially the entire application.',
    pipelineInvolved: ['DOM']
  },
  autoFix: {
    badCode: '<AuthContext.Provider value={{ user, login }}>',
    recommendedCode:
      'const value = useMemo(() => ({ user, login }), [user, login]);\n<AuthContext.Provider value={value}>',
    whyFaster:
      'By using `useMemo`, the object reference is preserved across renders as long as the dependencies do not change. Consumers will only re-render when actual data changes, rather than on every parent render tick.'
  },
  confidence: {
    score: 95,
    reason:
      'Detected inline allocation or unmemoized local variable passed to Context.Provider value prop.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []

    traverse(ast, {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const nameNode = openingElement.name

        // Check if it's a Context.Provider
        if (nameNode.type === 'JSXMemberExpression' && nameNode.property.name === 'Provider') {
          // Find the value prop
          const valueAttr = openingElement.attributes.find(
            (attr: any) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'value'
          )

          if (valueAttr && valueAttr.value && valueAttr.value.type === 'JSXExpressionContainer') {
            const expression = valueAttr.value.expression
            const line = openingElement.loc?.start.line || 1

            // 1. Direct inline allocation (e.g. value={{ ... }}, value={[ ... ]}, value={() => ...})
            const inlineAllocType = getUnstableAllocationType(expression)
            if (inlineAllocType) {
              issues.push({
                lineNumbers: [line],
                description: `Context.Provider receives a newly-created ${inlineAllocType} value during render.`
              })
              return
            }

            // 2. Variable binding lookup (e.g. const val = { ... }; <Context.Provider value={val} />)
            if (expression.type === 'Identifier') {
              const varName = expression.name
              const binding = path.scope.getBinding(varName)

              // Only inspect variables declared inside local component/function scope (not module/outer scope)
              if (binding && binding.scope && binding.scope.block.type !== 'Program') {
                if (
                  binding.path &&
                  binding.path.node &&
                  binding.path.node.type === 'VariableDeclarator'
                ) {
                  const initNode = binding.path.node.init
                  const varAllocType = getUnstableAllocationType(initNode)

                  if (varAllocType) {
                    issues.push({
                      lineNumbers: [line],
                      description: `Context.Provider receives unmemoized local variable '${varName}' during render.`
                    })
                  }
                }
              }
            }
          }
        }
      }
    })

    return issues
  }
}
