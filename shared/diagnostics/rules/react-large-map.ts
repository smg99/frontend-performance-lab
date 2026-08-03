import type { DiagnosticDefinition } from '../types'

export const reactLargeMap: DiagnosticDefinition = {
  id: 'react-large-map',
  title: 'Massive Array Map Render Without Virtualization',
  category: 'Rendering Performance',
  severity: 'high',
  confidence: 'medium',
  summary: 'A massive array is being mapped directly into the DOM without virtualization.',
  why: 'Rendering thousands of React Fiber nodes and corresponding DOM elements blocks the main thread. React reconciliation becomes incredibly expensive during state updates, causing noticeable UI freezing.',
  impact:
    'Extremely slow initial render, frozen UI on re-renders, high TBT (Total Blocking Time), and increased memory usage.',
  howToVerify:
    'Check the DOM node count. If it exceeds 1,500 nodes or the React Profiler shows long render times for the list component, virtualization is required.',
  recommendedFix:
    'Implement windowing/virtualization using a library like @tanstack/react-virtual or react-window. This ensures only visible items are mounted to the DOM.',
  references: [
    'https://react.dev/learn/rendering-lists',
    'https://web.dev/articles/virtualize-long-lists'
  ],
  framework: 'react',
  ruleVersion: '1.0'
}
