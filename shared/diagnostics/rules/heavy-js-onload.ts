import type { DiagnosticDefinition } from '../types'

export const heavyJsOnload: DiagnosticDefinition = {
  id: 'heavy-js-onload',
  title: 'Main-Thread Heavy JS',
  category: 'Performance',
  severity: 'high',
  confidence: 'medium',
  summary:
    'A function executed on load (like in `useEffect` or `onMounted`) contains heavy logic, deep nesting, or too many statements.',
  why: 'Long, synchronous JavaScript execution blocks the main thread, delaying rendering and making the page unresponsive to user interactions (hurts INP).',
  impact:
    'Poor Interaction to Next Paint (INP) and high Total Blocking Time (TBT).',
  howToVerify:
    'Record a performance profile during page load and look for long tasks (> 50ms) originating from the flagged component.',
  recommendedFix:
    'Yield to the main thread periodically using `setTimeout` or `scheduler.yield()`, or offload computation to a Web Worker.',
  references: [
    'https://web.dev/optimize-long-tasks/'
  ],
  framework: 'universal',
  ruleVersion: '1.0.0'
}
