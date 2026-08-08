/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

export const imgMissingDimensions: ASTRule = {
  id: 'img-missing-dimensions',
  title: 'Image Missing Intrinsic Dimensions',
  description:
    '<img> elements missing explicit width or height attributes can cause Cumulative Layout Shift (CLS).',
  severity: 'Warning',
  category: 'Rendering',
  frameworks: ['react', 'vue'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx', 'vue'],
  relatedExperiments: ['rendering'],
  browserAPIs: [],
  relatedRecipes: [],
  impact: 'Prevents Cumulative Layout Shift (CLS) by allowing browsers to reserve layout space.',
  fix: 'Add an explicit `width` or `height` attribute to <img> elements.',
  browserImpact: {
    cpu: false,
    memory: false,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened: 'An <img> element was rendered without explicit width or height dimensions.',
    whyBrowserBehavesThisWay:
      'Browsers need intrinsic dimensions to calculate aspect ratios and allocate DOM layout space before image assets finish downloading. Without explicit width or height, the browser must adjust surrounding page geometry after the image loads, causing unwanted layout shifts.',
    pipelineInvolved: ['Layout', 'Paint']
  },
  autoFix: {
    badCode: '<img src="hero.jpg" alt="Hero" />',
    recommendedCode: '<img src="hero.jpg" width="800" height="600" alt="Hero" />',
    whyFaster:
      'Providing intrinsic dimensions enables immediate aspect ratio calculation, eliminating layout shifts.'
  },
  confidence: {
    score: 90,
    reason: 'AST traversal identifies <img> elements lacking both width and height attributes.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []

    if (['js', 'ts', 'jsx', 'tsx'].includes(context.language)) {
      traverse(ast, {
        JSXOpeningElement(path: any) {
          const nameNode = path.node.name
          const name = nameNode && nameNode.name ? nameNode.name : null
          if (name === 'img') {
            const hasWidthOrHeight = path.node.attributes.some((attr: any) => {
              if (attr.type === 'JSXAttribute' && attr.name && attr.name.name) {
                const attrName = attr.name.name
                return attrName === 'width' || attrName === 'height'
              }
              return false
            })

            if (!hasWidthOrHeight) {
              issues.push({
                lineNumbers: [path.node.loc?.start.line || 1]
              })
            }
          }
        }
      })
    } else if (context.language === 'vue') {
      if (!ast || !ast.template || !ast.template.ast) return []

      const traverseVue = (node: any) => {
        if (node.type === 1 && node.tag === 'img') {
          const hasWidthOrHeight = node.props.some((p: any) => {
            if (p.name === 'width' || p.name === 'height') return true
            if (
              p.name === 'bind' &&
              p.arg &&
              (p.arg.content === 'width' || p.arg.content === 'height')
            ) {
              return true
            }
            return false
          })

          if (!hasWidthOrHeight) {
            issues.push({
              lineNumbers: [node.loc?.start.line || 1]
            })
          }
        }
        if (node.children) {
          node.children.forEach(traverseVue)
        }
      }

      traverseVue(ast.template.ast)
    }

    return issues
  }
}
