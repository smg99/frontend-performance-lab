/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

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
    score: 100,
    reasoning:
      'Detected an inline Object, Array, or Function passed directly to the `value` prop of a JSX element ending in `.Provider`.',
    limitations:
      'Does not check if the value is derived from a custom hook that returns a new object.',
    falsePositiveRisk: 'Low'
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
      | 'estimatedImprovement'
      | 'timeToFix'
      | 'relatedExperimentIds'
      | 'browserAPIs'
      | 'relatedRecipes'
      | 'interviewQuestions'
    >[] = []

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

            // If the expression is an Object, Array, ArrowFunction, Function, or NewExpression
            const isUnmemoized = [
              'ObjectExpression',
              'ArrayExpression',
              'ArrowFunctionExpression',
              'FunctionExpression',
              'NewExpression'
            ].includes(expression.type)

            if (isUnmemoized) {
              issues.push({
                lineNumbers: [openingElement.loc?.start.line || 1]
              })
            }
          }
        }
      }
    })

    return issues
  }
}
