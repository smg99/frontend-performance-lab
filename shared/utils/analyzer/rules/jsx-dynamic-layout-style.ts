/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const jsxDynamicLayoutStyle: ASTRule = {
  id: 'jsx-dynamic-layout-style',
  title: 'Dynamic Layout Property in JSX Style',
  description:
    'Binding dynamic variables to layout-triggering inline styles causes severe rendering performance issues.',
  severity: 'High',
  category: 'Rendering',
  frameworks: ['react'],
  supportedLanguages: ['jsx', 'tsx'],
  relatedExperiments: ['rendering'],
  browserAPIs: [],
  impact:
    'Forces synchronous Layout and Paint on every render tick, bypassing hardware acceleration.',
  fix: 'Animate composite-only properties like transform and opacity instead.',
  browserImpact: {
    cpu: true,
    memory: false,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'An inline style object is binding a non-literal (dynamic) value to a property that triggers layout calculation (e.g., width, height, top, left, margin).',
    whyBrowserBehavesThisWay:
      'The browser rendering pipeline consists of Layout -> Paint -> Composite. Changing properties like `width` or `top` forces the browser to recalculate the geometry of the entire page (Layout) and repaint pixels on the main CPU thread. This cannot be hardware-accelerated by the GPU and leads to dropped frames and jank, especially on mobile devices.',
    pipelineInvolved: ['Layout', 'Paint']
  },
  autoFix: {
    badCode: '<div style={{ top: scrollY + "px" }} />',
    recommendedCode: '<div style={{ transform: `translateY(${scrollY}px)` }} />',
    whyFaster:
      'The `transform` property is handled exclusively by the Compositor thread using the GPU. It does not trigger Layout or Paint, allowing buttery smooth 60fps animations completely independent of the main thread.'
  },
  confidence: {
    score: 85,
    reason:
      'Detected a JSX inline style object where a layout-triggering property is assigned a dynamic value (Identifier, TemplateLiteral, or BinaryExpression).',
    falsePositiveRisk: 'Medium'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []

    const layoutProperties = new Set([
      'width',
      'height',
      'top',
      'bottom',
      'left',
      'right',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'margin',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'padding'
    ])

    traverse(ast, {
      JSXAttribute(path: any) {
        if (path.node.name && path.node.name.name === 'style') {
          const value = path.node.value
          if (
            value &&
            value.type === 'JSXExpressionContainer' &&
            value.expression.type === 'ObjectExpression'
          ) {
            const properties = value.expression.properties
            for (const prop of properties) {
              if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
                const keyName = prop.key.name

                if (layoutProperties.has(keyName)) {
                  const propValue = prop.value

                  // If the value is a literal, it's static and safe (e.g. { width: '100px' })
                  // If it is dynamic (Identifier, BinaryExpression, CallExpression, TemplateLiteral), it's a risk.
                  const isDynamic = !['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(
                    propValue.type
                  )

                  if (isDynamic) {
                    issues.push({
                      lineNumbers: [prop.loc?.start.line || path.node.loc?.start.line || 1]
                    })
                    // Report once per style object to avoid spamming
                    break
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
