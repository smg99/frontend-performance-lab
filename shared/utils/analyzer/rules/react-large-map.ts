/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
// Babel traverse needs to be accessed carefully depending on module format
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const reactLargeMap: ASTRule = {
  id: 'react-large-map',
  title: 'Large .map() without Virtualization',
  description: 'Mapping over large arrays to render JSX elements creates excessive DOM nodes.',
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
    whatHappened: 'A large array is being mapped directly to JSX elements without virtualization.',
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
    score: 80,
    reason: 'Detected an Array.map returning JSX inside a component render block.',
    falsePositiveRisk: 'Medium'
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
              issues.push({
                lineNumbers: [path.node.loc.start.line]
              })
            }
          }
        }
      }
    })

    return issues
  }
}
