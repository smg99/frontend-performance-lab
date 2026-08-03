import type { DiagnosticDefinition } from '../types'

export const largeReactiveStateObject: DiagnosticDefinition = {
  id: 'large-reactive-state-object',
  title: 'Large Reactive State Object Initialization',
  category: 'Performance',
  severity: 'high',
  confidence: 'high',
  summary:
    'Initializing Vue ref/reactive or React useState with a large object/array causes deep proxying/copying and hurts startup performance.',
  why: 'Framework reactivity systems walk every property of the initial value to create proxies (Vue) or clone (React). Large immutable structures dramatically increase TBT and memory usage.',
  impact:
    'Higher Total Blocking Time on page load, increased memory consumption, slower First Input Delay.',
  howToVerify:
    'Run Chrome DevTools Performance, look for long Main thread tasks during page initialization; compare with/without shallow wrappers.',
  recommendedFix:
    'Wrap large immutable data with shallowRef/shallowReactive (Vue) or useRef (React), or lazy‑load the data.',
  references: [
    'https://vuejs.org/api/reactivity-core.html#shallowref',
    'https://vuejs.org/api/reactivity-core.html#shallowreactive',
    'https://react.dev/reference/react/useRef',
    'https://react.dev/reference/react/useState'
  ],
  framework: 'universal',
  ruleVersion: '1.0.0'
}
