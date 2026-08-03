import type { DiagnosticDefinition } from '../types'

export const domLayoutThrashing: DiagnosticDefinition = {
  id: 'dom-layout-thrashing',
  title: 'Forced Synchronous Layout (Layout Thrashing)',
  category: 'DOM Performance',
  severity: 'high',
  confidence: 'high',
  summary:
    'Interleaving DOM reads and writes forces the browser to synchronously recalculate the layout.',
  why: 'When you write to the DOM and then immediately read layout geometry (like offsetHeight or clientWidth), the browser must pause JavaScript execution, calculate all styles, and perform a full layout pass. Doing this repeatedly (e.g. in a loop or scroll event) destroys framerate.',
  impact: 'Causes severe stuttering, dropped frames, and high CPU usage. Main thread gets blocked.',
  howToVerify:
    'Open Chrome DevTools Performance panel, record a trace while interacting, and look for "Forced reflow" warnings (red triangles) in the Main track.',
  recommendedFix:
    'Batch your DOM reads before your DOM writes. Alternatively, use requestAnimationFrame to schedule writes for the next frame.',
  references: [
    'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing',
    'https://gist.github.com/paulirish/5d52fb081b3570c81e3a'
  ],
  framework: 'vanilla',
  ruleVersion: '1.0'
}
