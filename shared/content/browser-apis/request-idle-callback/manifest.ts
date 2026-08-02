import type { BrowserAPI } from '../../../schemas/browser-api'

export const requestIdleCallbackManifest: BrowserAPI = {
  id: 'request-idle-callback',
  name: 'requestIdleCallback',
  description:
    'An API that schedules low-priority work to run during browser idle periods, keeping the main thread available for user interactions and animations while still completing background tasks.',
  category: 'Concurrency',
  browserSupport:
    'Chrome 47+, Firefox 55+, Edge 79+. Safari: Not supported (use polyfill or setTimeout fallback).',
  baseline: 'Newly available',
  difficulty: 'Intermediate',

  searchMetadata: {
    keywords: ['idle', 'background task', 'main thread', 'scheduling', 'non-blocking'],
    synonyms: ['idle scheduling', 'background work', 'deferred task'],
    concepts: ['Main Thread', 'Event Loop', 'Task Scheduling', 'Input Responsiveness']
  },

  whenToUse: [
    'Prefetching or preloading data that the user has not yet requested.',
    'Logging, analytics, and telemetry that do not need to be sent immediately.',
    'Parsing or processing large datasets in the background without blocking user input.',
    'Saving draft state or syncing to localStorage without delaying the current interaction.',
    'Running cleanup tasks (e.g. clearing expired cache entries) after the critical path.'
  ],

  whenNotToUse: [
    'For work that must complete before the next render or user interaction.',
    'For animations — use requestAnimationFrame instead.',
    'For time-sensitive operations — idle callbacks may be delayed indefinitely on busy pages.',
    'As a general replacement for async/await — it is only for genuinely deferrable background work.',
    'In Safari without a polyfill — requestIdleCallback is not supported.'
  ],

  advantages: [
    'Browser-coordinated: the browser decides the best time to run the callback, respecting frame budget.',
    'Provides a `deadline` object telling you how much time remains before the next frame.',
    'The `timeout` option ensures the callback runs eventually, even if idle time is scarce.',
    'Keeps UI interactions at 60fps while still making background progress.'
  ],

  limitations: [
    'Not supported in Safari — requires a polyfill (e.g. `setTimeout(() => fn(), 1)`).',
    'Idle time is not guaranteed — on very busy pages, idle callbacks may wait a long time.',
    'The deadline is a hint, not a hard limit — the callback can still exceed it if not coded carefully.',
    'Should not be used for anything that touches the DOM — DOM changes trigger layout.'
  ],

  performanceImpact: 'Medium',

  commonMistakes: [
    'Performing DOM reads or writes inside an idle callback — this triggers layout and defeats the purpose.',
    'Not checking deadline.timeRemaining() inside long loops — allows the callback to run over budget.',
    'Not providing a timeout option — the callback may never run on a CPU-busy page.',
    'Using it in Safari without a fallback — causes a runtime error.'
  ],

  bestPractices: [
    'Always check deadline.timeRemaining() > 0 inside loops to yield control back to the browser.',
    'Break large tasks into chunks and use requestIdleCallback recursively to process them incrementally.',
    'Always provide a `timeout` option (e.g. 2000ms) to ensure work eventually completes.',
    'Use a Safari-safe wrapper: `const rIC = window.requestIdleCallback ?? (fn => setTimeout(fn, 1))`.',
    'Avoid any DOM interaction inside idle callbacks — only pure computation and I/O.'
  ],

  examples: [
    {
      title: 'Chunked background processing',
      code: `// Process a large array during idle periods
function processInChunks(items, processFn) {
  let index = 0

  function processChunk(deadline) {
    // Keep working while there is idle time and items remaining
    while (deadline.timeRemaining() > 0 && index < items.length) {
      processFn(items[index])
      index++
    }

    // If not done, schedule the next chunk
    if (index < items.length) {
      requestIdleCallback(processChunk, { timeout: 2000 })
    }
  }

  requestIdleCallback(processChunk, { timeout: 2000 })
}`,
      explanation:
        'Processes items incrementally across multiple idle periods. The deadline check ensures we never over-budget a single frame. The timeout ensures processing completes within 2 seconds even on busy pages.'
    },
    {
      title: 'Safari-safe polyfill wrapper',
      code: `// Safe cross-browser wrapper
const scheduleIdleWork = (callback, options) => {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(callback, options)
  }
  // Safari fallback: setTimeout approximation
  const start = Date.now()
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    })
  }, 1)
}`,
      explanation:
        'Wraps requestIdleCallback with a Safari-compatible fallback that mimics the deadline API using a 50ms approximation.'
    }
  ],

  relatedExperiments: ['concurrency'],
  relatedRecipes: ['background-processing'],
  relatedBrowserAPIs: ['request-animation-frame', 'web-workers'],

  interviewQuestions: [
    {
      question: 'What is requestIdleCallback and when would you use it?',
      answer:
        'requestIdleCallback schedules a callback to run during browser idle periods — when the main thread has finished processing the current frame and has spare capacity before the next one. You use it for low-priority background work that should not compete with user interactions: analytics, prefetching, localStorage syncing, or processing large datasets in chunks. The callback receives a deadline object with a timeRemaining() method, which you should check in loops to avoid exceeding the frame budget.'
    },
    {
      question: 'What is the difference between requestIdleCallback and requestAnimationFrame?',
      answer:
        'requestAnimationFrame (rAF) fires at the start of every frame (typically 60fps) and is intended for work that must happen in sync with rendering — animations, DOM updates. requestIdleCallback fires only when the browser has spare time after all high-priority work is done — it is for non-urgent background tasks. rAF guarantees a callback every frame; rIC may not fire at all on a busy page unless you set a timeout.'
    }
  ],

  references: [
    {
      title: 'requestIdleCallback — MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback'
    },
    {
      title: 'Using requestIdleCallback — web.dev',
      url: 'https://web.dev/articles/using-requestidlecallback'
    }
  ]
}
