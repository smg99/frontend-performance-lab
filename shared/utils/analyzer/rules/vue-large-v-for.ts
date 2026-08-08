/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'

const MAX_STATIC_LIST_SIZE = 10

function isSmallStaticVueFor(expr: string, scriptContent?: string): boolean {
  if (!expr) return false
  const trimmed = expr.trim()

  // Case 1: Numeric range iteration, e.g. "5" or "10" (v-for="n in 5")
  if (/^\d+$/.test(trimmed)) {
    const count = parseInt(trimmed, 10)
    return count <= MAX_STATIC_LIST_SIZE
  }

  // Case 2: Inline array literal, e.g. "['Home', 'About', 'Contact']" or "[1, 2, 3]"
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const elements = trimmed
      .slice(1, -1)
      .split(',')
      .filter(s => s.trim().length > 0)
    return elements.length <= MAX_STATIC_LIST_SIZE
  }

  // Case 3: Bounded slice, e.g. "items.slice(0, 5)"
  const sliceMatch = trimmed.match(/\.slice\s*\(\s*\d+\s*,\s*(\d+)\s*\)/)
  if (sliceMatch && sliceMatch[1]) {
    const limit = parseInt(sliceMatch[1], 10)
    return limit <= MAX_STATIC_LIST_SIZE
  }

  // Case 4: Script static array definition lookup, e.g. const NAV_ITEMS = ['a', 'b', 'c']
  if (scriptContent && /^[a-zA-Z_$][\w_$]*$/.test(trimmed)) {
    const regex = new RegExp(
      `(?:const|let|var)\\s+${trimmed}\\s*=\\s*(?:ref\\s*\\(\\s*)?\\[([^\\]]*)\\]`
    )
    const match = scriptContent.match(regex)
    if (match && match[1] !== undefined) {
      const items = match[1].split(',').filter(s => s.trim().length > 0)
      if (items.length > 0 && items.length <= MAX_STATIC_LIST_SIZE) {
        return true
      }
    }
  }

  return false
}

function getVForExpr(prop: any): string {
  if (prop.forParseResult && prop.forParseResult.source) {
    return prop.forParseResult.source.content || ''
  }
  if (prop.exp && prop.exp.content) {
    return prop.exp.content
  }
  if (prop.value && typeof prop.value === 'string') {
    return prop.value
  }
  if (prop.value && prop.value.content) {
    return prop.value.content
  }
  return ''
}

export const vueLargeVFor: ASTRule = {
  id: 'vue-large-v-for',
  title: 'Large v-for without Virtualization',
  description:
    'Rendering large or dynamic lists directly into the DOM can cause severe layout and rendering bottlenecks.',
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
      'A large or unbounded array is being iterated over with v-for without virtualization.',
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
    reason:
      'Detected a v-for directive on a dynamic or large collection (ignoring small static lists <= 10 items).',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []

    if (!ast || !ast.template || !ast.template.ast) return []

    const scriptContent = (ast.script?.content || '') + '\n' + (ast.scriptSetup?.content || '')

    const traverse = (node: any) => {
      if (node.type === 1) {
        // Element
        const forProp = node.props.find((p: any) => p.name === 'for' || p.name === 'v-for')
        if (forProp && !['VirtualScroller', 'RecycleScroller', 'VirtualList'].includes(node.tag)) {
          const expr = getVForExpr(forProp)
          if (!isSmallStaticVueFor(expr, scriptContent)) {
            issues.push({
              lineNumbers: [node.loc.start.line],
              description: expr
                ? `Unvirtualized v-for on '${expr}'`
                : 'Unvirtualized v-for on dynamic collection'
            })
          }
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
