import type { EvidenceType, FreshnessPolicy, ProvenanceRegistry } from '../schemas/provenance'

export const freshnessPolicyDays: FreshnessPolicy = {
  'official-documentation': 180,
  'web-standard': 365,
  'vendor-guidance': 120,
  'maintainer-guidance': 180,
  'community-reference': 90
}

const verifiedAt = '2026-09-20T00:00:00.000Z'

function source(canonicalUrl: string, publisher: string, evidenceType: EvidenceType) {
  return { canonicalUrl, publisher, evidenceType, retrievedAt: verifiedAt, verifiedAt }
}

export const provenanceRegistry: ProvenanceRegistry = {
  'experiment:virtualization': source(
    'https://vueuse.org/core/useVirtualList/',
    'VueUse',
    'maintainer-guidance'
  ),
  'experiment:reactivity': source(
    'https://vuejs.org/guide/extras/reactivity-in-depth.html',
    'Vue.js',
    'official-documentation'
  ),
  'experiment:concurrency': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API',
    'MDN Web Docs',
    'official-documentation'
  ),
  'experiment:rendering': source('https://csstriggers.com/', 'CSS Triggers', 'community-reference'),
  'experiment:memory-vitals': source('https://web.dev/vitals/', 'web.dev', 'vendor-guidance'),
  'browser-api:request-animation-frame': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:intersection-observer': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:web-workers': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:resize-observer': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:request-idle-callback': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:mutation-observer': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:performance-observer': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver',
    'MDN Web Docs',
    'official-documentation'
  ),
  'browser-api:view-transitions': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API',
    'MDN Web Docs',
    'official-documentation'
  ),
  'recipe:large-data-table': source(
    'https://www.patterns.dev/posts/virtual-lists',
    'Patterns.dev',
    'community-reference'
  ),
  'recipe:dashboard-rendering': source(
    'https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/',
    'web.dev',
    'vendor-guidance'
  ),
  'recipe:background-processing': source(
    'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers',
    'MDN Web Docs',
    'official-documentation'
  ),
  'recipe:dom-layout-thrashing': source(
    'https://gist.github.com/paulirish/5d52fb081b3570c81e3a',
    'Paul Irish',
    'maintainer-guidance'
  ),
  'recipe:memory-event-listener': source(
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management',
    'MDN Web Docs',
    'official-documentation'
  )
}

export function getKnowledgeProvenance(kind: 'experiment' | 'browser-api' | 'recipe', id: string) {
  return provenanceRegistry[`${kind}:${id}`]
}
