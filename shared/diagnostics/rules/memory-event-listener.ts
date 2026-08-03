import type { DiagnosticDefinition } from '../types'

export const memoryEventListener: DiagnosticDefinition = {
  id: 'memory-event-listener',
  title: 'Uncleaned Event Listener (Memory Leak)',
  category: 'Memory Management',
  severity: 'high',
  confidence: 'high',
  summary:
    'Global event listeners are attached but not explicitly removed during component teardown.',
  why: 'When a component mounts and attaches listeners to global objects (window, document, body) but forgets to remove them on unmount, the component cannot be garbage collected. This retains detached DOM nodes and exponentially degrades performance over time as listeners pile up.',
  impact:
    'Continually increasing memory usage resulting in an Out of Memory (OOM) browser crash and progressively slower interactions.',
  howToVerify:
    'Record a memory allocation timeline in Chrome DevTools. Look for detached DOM nodes or repeatedly increasing heap size after mounting and unmounting the component.',
  recommendedFix:
    'Always return a cleanup function in useEffect (React) or use onUnmounted (Vue) to call removeEventListener with the exact same function reference.',
  references: [
    'https://web.dev/articles/memory-problems',
    'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener'
  ],
  framework: 'vanilla',
  ruleVersion: '1.0'
}
