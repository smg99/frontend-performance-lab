import type { DiagnosticDefinition } from '../types'

export const passiveEventListenerMissing: DiagnosticDefinition = {
  id: 'passive-event-listener-missing',
  title: 'Missing Passive Event Listener',
  category: 'Rendering',
  severity: 'high',
  confidence: 'high',
  summary:
    'A continuous interaction event (like touchstart or wheel) listener was attached without { passive: true }.',
  why: "When the browser encounters a touch or wheel listener, the Compositor thread must block and wait for the Main Thread JS to finish executing, just in case `event.preventDefault()` is called to cancel the scroll. Marking it passive guarantees the scroll won't be cancelled, unlocking 60fps scrolling.",
  impact: 'Severe scroll jank and input latency on mobile devices due to main thread blocking.',
  howToVerify:
    'Open Chrome DevTools > Performance. In the "Rendering" drawer, enable "Scrolling performance issues". Elements with non-passive listeners will be highlighted in teal.',
  recommendedFix: 'Add `{ passive: true }` as the third argument to `addEventListener`.',
  references: [
    'https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners/',
    'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners'
  ],
  framework: 'vanilla',
  ruleVersion: '1.0.0'
}
