import type { DiagnosticDefinition } from '../types'

export const jsxDynamicLayoutStyle: DiagnosticDefinition = {
  id: 'jsx-dynamic-layout-style',
  title: 'Dynamic Layout Property in JSX Style',
  category: 'Rendering',
  severity: 'high',
  confidence: 'medium',
  summary:
    'Binding dynamic variables to layout-triggering inline styles causes severe rendering performance issues.',
  why: 'The browser rendering pipeline consists of Layout -> Paint -> Composite. Changing properties like `width` or `top` forces the browser to recalculate the geometry of the entire page and repaint pixels on the main CPU thread. This cannot be hardware-accelerated by the GPU.',
  impact:
    'Forces synchronous Layout and Paint on every render tick, causing jank, dropped frames, and high CPU usage.',
  howToVerify:
    'Open Chrome DevTools Performance panel, record an interaction that changes the dynamic state, and look for long green "Paint" and purple "Layout" events blocking the main thread.',
  recommendedFix:
    'Animate composite-only properties like transform (e.g., `translateY`) and opacity instead.',
  references: [
    'https://web.dev/articles/animations-guide',
    'https://developer.mozilla.org/en-US/docs/Glossary/Reflow',
    'https://csstriggers.com/'
  ],
  framework: 'react',
  ruleVersion: '1.0.0'
}
