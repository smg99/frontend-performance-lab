import type { DiagnosticDefinition } from '../types'

export const vueLargeVFor: DiagnosticDefinition = {
  id: 'vue-large-v-for',
  title: 'Massive v-for Render Without Virtualization',
  category: 'Rendering Performance',
  severity: 'high',
  confidence: 'medium',
  summary: 'A massive v-for list is being rendered directly into the DOM without virtualization.',
  why: 'Rendering thousands of DOM nodes at once freezes the browser main thread and massively increases TBT (Total Blocking Time). Vue has to track reactivity for all items simultaneously, ballooning memory usage.',
  impact:
    'Significant initial render delay, frozen UI during list updates, and high memory consumption.',
  howToVerify:
    'Check the DOM node count in Chrome DevTools. If it exceeds 1,500 nodes and causes noticeable stutter when scrolling, virtualization is needed.',
  recommendedFix:
    'Implement list virtualization using a library like @vueuse/core (useVirtualList) or vue-virtual-scroller to only render elements currently visible in the viewport.',
  references: [
    'https://vuejs.org/guide/best-practices/performance.html#virtualize-large-lists',
    'https://web.dev/articles/virtualize-long-lists'
  ],
  framework: 'vue',
  ruleVersion: '1.0'
}
