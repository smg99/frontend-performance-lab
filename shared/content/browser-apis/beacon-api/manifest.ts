import type { BrowserAPI } from '../../../schemas/browser-api'

export const beaconApiManifest: BrowserAPI = {
  id: 'beacon-api',
  name: 'navigator.sendBeacon',
  description:
    'Allows asynchronous, low‑priority data transmission to a server without blocking page unload.',
  category: 'Network',
  browserSupport: 'Global 95%+',
  baseline: 'Widely available',
  difficulty: 'Beginner',
  usageStats: { popularity: 70 },
  searchMetadata: {
    keywords: ['sendBeacon', 'beacon', 'network', 'analytics'],
    synonyms: [],
    concepts: ['background data', 'unload event']
  },
  whenToUse: [
    'Sending analytics or logging data during page unload.',
    'Transmitting small payloads without affecting navigation performance.'
  ],
  whenNotToUse: [
    'Sending large amounts of data (use fetch or XHR).',
    'Critical data that must be guaranteed to arrive (beacon is best‑effort).'
  ],
  advantages: [
    'Does not block the unload event.',
    'Runs even when the page is being closed or navigated away.'
  ],
  limitations: [
    'Payload size is limited (typically < 64KB).',
    'No response handling; fire‑and‑forget.'
  ],
  performanceImpact: 'Low',
  commonMistakes: [
    'Assuming the server receives the data reliably.',
    'Sending JSON without serialization (must be string/Blob).'
  ],
  bestPractices: [
    'Serialize payload to a string or Blob.',
    'Use for analytics, session reporting, or graceful degradation.'
  ],
  examples: [
    {
      title: 'Send analytics on page hide',
      code: `window.addEventListener('pagehide', () => {
  const data = JSON.stringify({ time: Date.now(), event: 'pagehide' })
  navigator.sendBeacon('/log', data)
})`,
      explanation: 'Data is sent in the background as the page is being unloaded.'
    }
  ],
  relatedExperiments: [],
  relatedRecipes: [],
  relatedBrowserAPIs: [],
  interviewQuestions: [
    {
      question: 'What guarantees does sendBeacon provide compared to fetch during page unload?',
      answer:
        'sendBeacon is designed to be non‑blocking and to attempt delivery even when the page is being closed, whereas fetch may be aborted if the page unloads.'
    }
  ],
  references: [
    {
      title: 'MDN: Navigator.sendBeacon',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon'
    }
  ]
}
