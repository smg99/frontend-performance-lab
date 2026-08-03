import type { DiagnosticDefinition } from '../types'

export const networkBatching: DiagnosticDefinition = {
  id: 'network-batching',
  title: 'Network Request Batching',
  category: 'Performance',
  severity: 'medium',
  confidence: 'medium',
  summary:
    'Multiple unbatched network requests are made in sequence within the same block.',
  why: 'Sequential or unbatched parallel network requests increase overall latency due to connection overhead and waterfall loading.',
  impact:
    'Slower time to interactive and increased network overhead.',
  howToVerify:
    'Check the Network tab for multiple API requests fired in quick succession. Look for waterfall patterns.',
  recommendedFix:
    'Use `Promise.all` to fetch data concurrently, or combine the requests into a single endpoint on the backend (e.g., using GraphQL or a BFF).',
  references: [
    'https://web.dev/promises-all/'
  ],
  framework: 'universal',
  ruleVersion: '1.0.0'
}
