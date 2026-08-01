import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'

export const vueLargeVFor: ASTRule = {
  id: 'vue-large-v-for',
  title: 'Large v-for without Virtualization',
  description: 'Rendering large lists directly into the DOM can cause severe layout and rendering bottlenecks.',
  severity: 'Critical',
  category: 'Rendering',
  frameworks: ['vue', 'nuxt'],
  supportedLanguages: ['vue'],
  relatedExperiments: ['virtualization', 'rendering'],
  browserAPIs: ['intersection-observer'],
  impact: 'Freezes the main thread during initial render and updates.',
  fix: 'Use a virtual scroller (e.g. vue-virtual-scroller) to only render visible items.',
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<Issue, 'id' | 'title' | 'description' | 'ruleId' | 'severity' | 'category' | 'impact' | 'fix' | 'relatedExperimentIds' | 'browserAPIs'>[] = []
    
    // Quick heuristic over AST template:
    // @vue/compiler-sfc provides descriptor.template.ast
    if (!ast || !ast.template || !ast.template.ast) return []
    
    // Simplistic AST traversal for v-for
    const traverse = (node: any) => {
      if (node.type === 1) { // Element
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
