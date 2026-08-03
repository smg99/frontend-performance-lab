import type { BrowserAPI } from '../../../schemas/browser-api'

export const performanceObserverManifest: BrowserAPI = {
  id: 'performance-observer',
  name: 'PerformanceObserver',
  description: 'An interface to observe performance measurement events and receive notifications of new performance entries (like LCP, CLS, or Long Tasks).',
  category: 'Observers',
  browserSupport: '96%',
  baseline: 'Widely available',
  difficulty: 'Advanced',
  usageStats: { popularity: 60 },
  searchMetadata: {
    keywords: ['metrics', 'cwv', 'lcp', 'cls', 'fid', 'inp', 'long tasks'],
    synonyms: ['Core Web Vitals', 'Performance API'],
    concepts: ['RUM (Real User Monitoring)', 'Telemetry']
  },
  whenToUse: [
    'Building custom telemetry and RUM solutions.',
    'Measuring Core Web Vitals directly from users in production.',
    'Detecting Long Tasks that block the main thread and harm INP.'
  ],
  whenNotToUse: [
    'When a high-level library like `web-vitals` solves your problem with less code.',
    'Running intensive data-processing inside the observer callback itself.'
  ],
  advantages: [
    'Non-blocking, asynchronous delivery of performance metrics.',
    'Able to access buffered historical entries (e.g., LCP elements painted before the script loaded).'
  ],
  limitations: [
    'Not all entry types are supported in all browsers (e.g., `largest-contentful-paint` is heavily Chromium-driven).',
    'High-frequency events like `resource` timing can flood the observer if not filtered.'
  ],
  performanceImpact: 'Low',
  commonMistakes: [
    'Not using the `buffered: true` flag, causing missed metrics from before the observer initialized.',
    'Sending a network request for every single entry instead of batching them.'
  ],
  bestPractices: [
    'Always batch telemetry metrics using `requestIdleCallback` or `sendBeacon` to avoid hurting the user experience you are trying to measure.'
  ],
  examples: [
    {
      title: 'Good: Measuring Long Tasks',
      code: `const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Main thread blocked for:', entry.duration, 'ms');
  }
});
observer.observe({ type: 'longtask', buffered: true });`,
      explanation: 'Uses PerformanceObserver to detect tasks exceeding 50ms without polling.'
    }
  ],
  relatedExperiments: [],
  relatedRecipes: [],
  relatedBrowserAPIs: ['request-idle-callback'],
  interviewQuestions: [
    {
      question: 'How do you retrieve performance events that happened before the JavaScript executed?',
      answer: 'By passing `{ buffered: true }` in the `.observe()` options. The browser maintains a performance buffer of past events.'
    }
  ],
  references: [
    {
      title: 'MDN Web Docs: PerformanceObserver',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver'
    }
  ]
}
