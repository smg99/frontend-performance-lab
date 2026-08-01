/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

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
    score: 65,
    reasoning:
      'Detected direct assignment to a .style property outside of a requestAnimationFrame callback.',
    limitations: 'Static analysis cannot always determine if a layout read is interleaved nearby.',
    falsePositiveRisk: 'High'
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
      | 'relatedExperimentIds'
      | 'browserAPIs'
      | 'relatedRecipes'
      | 'interviewQuestions'
    >[] = []
    if (!ast) return []

    traverse(ast, {
      AssignmentExpression(path: any) {
        let isStyle = false
        let c = path.node.left
        while (c && c.type === 'MemberExpression') {
          if (c.property && c.property.name === 'style') {
            isStyle = true
            break
          }
          c = c.object
        }
        if (isStyle) {
          // Flag style assignments unless they are inside requestAnimationFrame
          let inRaf = false
          let curr = path
          while (curr) {
            if (
              curr.node.type === 'CallExpression' &&
              curr.node.callee.name === 'requestAnimationFrame'
            ) {
              inRaf = true
              break
            }
            curr = curr.parentPath
          }
          if (!inRaf) {
            issues.push({
              lineNumbers: [path.node.loc?.start.line || 1]
            })
          }
        }
      }
    })

    return issues
  }
}
