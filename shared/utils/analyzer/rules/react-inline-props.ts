import _traverse, { type NodePath } from '@babel/traverse'
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const reactInlineProps: ASTRule = {
  id: 'react-inline-props',
  title: 'Inline Object/Function Props',
  description: 'Detects inline objects, arrays, and functions passed to custom React components.',
  severity: 'Medium',
  category: 'Rendering',
  frameworks: ['react'],
  supportedLanguages: ['js', 'jsx', 'ts', 'tsx'],
  impact:
    'Inline objects, arrays, or functions create a new reference on every render, defeating React.memo() equality checks and forcing child components to re-render.',
  fix: 'Extract the object/array outside the component, or wrap the function/value in useMemo or useCallback.',
  browserImpact: {
    cpu: true,
    memory: true,
    rendering: true,
    network: false,
    cwv: false
  },
  explanation: {
    whatHappened:
      'An inline object `{}` or inline function `() => {}` was passed as a prop to a custom component.',
    whyBrowserBehavesThisWay:
      'React checks prop equality by reference (===). Inline structures create a new reference in memory every time the parent renders, making the child think its props changed.',
    pipelineInvolved: ['DOM']
  },
  autoFix: {
    badCode: '<MyComponent data={{ key: "value" }} onClick={() => doSomething()} />',
    recommendedCode:
      'const data = useMemo(() => ({ key: "value" }), []);\\nconst onClick = useCallback(() => doSomething(), []);\\n<MyComponent data={data} onClick={onClick} />',
    whyFaster:
      'Memoization preserves the memory reference between renders, allowing React to safely skip re-rendering the child component.'
  },
  confidence: {
    score: 95,
    reasoning:
      'AST definitively identifies inline objects, arrays, and functions inside JSX attributes.',
    limitations:
      'Cannot detect if the child component is actually wrapped in React.memo (unless analyzing cross-file).',
    falsePositiveRisk: 'Low'
  },
  relatedExperiments: [],
  browserAPIs: [],
  relatedRecipes: [],
  visitor: (ast: object, context: AnalyzerContext) => {
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
      | 'estimatedImprovement'
      | 'timeToFix'
      | 'browserImpact'
      | 'explanation'
      | 'autoFix'
      | 'confidence'
      | 'relatedExperimentIds'
      | 'browserAPIs'
      | 'relatedRecipes'
      | 'interviewQuestions'
    >[] = []

    traverse(ast, {
      JSXOpeningElement(path: NodePath) {
        // Native DOM elements start with lowercase (div, span).
        // Custom components usually start with Uppercase.
        const nameNode = path.node.name
        if (!nameNode || nameNode.type !== 'JSXIdentifier') return
        const componentName = nameNode.name

        // Skip native HTML elements
        if (/^[a-z]/.test(componentName)) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        path.node.attributes.forEach((attr: any) => {
          if (
            attr.type !== 'JSXAttribute' ||
            !attr.value ||
            attr.value.type !== 'JSXExpressionContainer'
          ) {
            return
          }

          const expr = attr.value.expression

          if (
            expr.type === 'ObjectExpression' ||
            expr.type === 'ArrayExpression' ||
            expr.type === 'ArrowFunctionExpression' ||
            expr.type === 'FunctionExpression'
          ) {
            issues.push({
              lineNumbers: [attr.loc?.start.line].filter(Boolean) as number[]
            })
          }
        })
      }
    })

    return issues
  }
}
