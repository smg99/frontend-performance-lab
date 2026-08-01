/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'

export const vueLargeVFor: ASTRule = {
  id: 'vue-large-v-for',
  title: 'Large v-for without Virtualization',
  description:
    'Rendering large lists directly into the DOM can cause severe layout and rendering bottlenecks.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['vue', 'nuxt'],
  supportedLanguages: ['vue'],
  relatedExperiments: ['virtualization', 'rendering'],
  browserAPIs: ['intersection-observer'],
  relatedRecipes: ['large-data-table', 'infinite-scroll'],
  impact: 'Freezes the main thread during initial render and updates.',
  fix: 'Use a virtual scroller (e.g. vue-virtual-scroller) to only render visible items.',
  browserImpact: {
    cpu: true,
    memory: true,
    rendering: true,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened:
      'A large number of DOM nodes are being generated simultaneously within a single v-for directive.',
    whyBrowserBehavesThisWay:
      'Browsers must recalculate styles, layout, and paint for every new DOM node. Thousands of nodes overwhelm the main thread, causing severe Frame Rate drops and memory pressure.',
    pipelineInvolved: ['DOM', 'Style', 'Layout', 'Paint', 'Composite']
  },
  autoFix: {
    badCode: '<div v-for="item in 10000" :key="item.id">\n  <HeavyCard :data="item" />\n</div>',
    recommendedCode:
      '<VirtualScroller :items="items" :item-size="100" v-slot="{ item }">\n  <HeavyCard :data="item" />\n</VirtualScroller>',
    whyFaster:
      'Virtualization only renders the ~10 nodes visible in the viewport, completely bypassing style and layout costs for the other 9,990 nodes.'
  },
  confidence: {
    score: 85,
    reasoning: 'The AST clearly shows a v-for directive without a virtualization wrapper.',
    limitations: 'Static analysis cannot determine the exact array length at runtime.',
    falsePositiveRisk: 'Medium'
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

    // Quick heuristic over AST template:
    // @vue/compiler-sfc provides descriptor.template.ast
    if (!ast || !ast.template || !ast.template.ast) return []

    // Simplistic AST traversal for v-for
    const traverse = (node: any) => {
      if (node.type === 1) {
        // Element
        const hasVFor = node.props.some((p: any) => p.name === 'for')
        // In a real production environment, we'd cross-reference with JS script bindings to see if the array is large.
        // For MVP, we flag any un-virtualized v-for on a heavy component (stubbed logic).
        if (hasVFor && node.tag !== 'VirtualScroller') {
          issues.push({
            lineNumbers: [node.loc.start.line]
          })
        }
      }
      if (node.children) {
        node.children.forEach(traverse)
      }
    }

    traverse(ast.template.ast)
    return issues
  }
}
