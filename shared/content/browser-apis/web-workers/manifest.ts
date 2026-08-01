import type { BrowserAPI } from '../../../schemas/browser-api'

export const webWorkersManifest: BrowserAPI = {
  id: 'web-workers',
  name: 'Web Workers',
  description: 'An API that enables executing JavaScript in background threads. The worker thread can perform tasks without interfering with the user interface.',
  category: 'Concurrency',
  browserSupport: 'Global 99%+',
  baseline: 'Widely available',
  difficulty: 'Advanced',
  searchMetadata: {
    keywords: ['Web Workers', 'threads', 'multithreading'],
    synonyms: ['background worker', 'concurrency'],
    concepts: ['main thread', 'blocking', 'message passing', 'postMessage']
  },
  whenToUse: [
    'Parsing or manipulating massive JSON datasets.',
    'Client-side image processing, video encoding, or audio manipulation.',
    'Complex mathematical calculations (e.g. cryptography, physics engines).',
    'Formatting large rich-text documents.'
  ],
  whenNotToUse: [
    'When the task involves manipulating the DOM directly.',
    'When the overhead of serializing/deserializing data via postMessage exceeds the cost of just running the task on the main thread.',
    'For simple UI state updates.'
  ],
  advantages: [
    'Keeps the Main Thread completely free, ensuring 60fps animations and immediate user interaction regardless of workload.',
    'Supports fetching resources via XMLHttpRequest or fetch natively.',
    'Can utilize multi-core processors effectively in the browser.'
  ],
  limitations: [
    'Absolutely zero access to the DOM or the window object.',
    'Data passed between the main thread and workers must be copied (Structured Clone Algorithm), which can be slow for massive objects unless using Transferable Objects.',
    'Harder to debug and coordinate state across threads.'
  ],
  performanceImpact: 'High',
  commonMistakes: [
    'Passing massive nested objects back and forth via postMessage, causing serialization bottlenecks on the main thread.',
    'Spinning up dozens of workers. Workers are heavy OS-level threads; usually, a small pool matching the CPU core count is optimal.',
    'Failing to call worker.terminate() when the worker is no longer needed, causing memory leaks.'
  ],
  bestPractices: [
    'Use Transferable Objects (like ArrayBuffer or ImageBitmap) to instantly transfer ownership of data with zero-copy overhead.',
    'Use libraries like Comlink to abstract postMessage into simple Promise-based function calls.',
    'Initialize workers early in the application lifecycle if you know they will be needed.'
  ],
  examples: [
    {
      title: 'Offloading Heavy Processing',
      code: `// main.js
const worker = new Worker('worker.js');
worker.postMessage({ type: 'PROCESS_DATA', payload: massiveArray });

worker.onmessage = (e) => {
  console.log('Processed data received:', e.data);
};

// worker.js
self.onmessage = (e) => {
  if (e.data.type === 'PROCESS_DATA') {
    const result = heavyCalculation(e.data.payload);
    self.postMessage(result);
  }
};`,
      explanation: 'The heavyCalculation function completely freezes the worker thread, but the main thread remains untouched. The UI remains perfectly responsive.'
    }
  ],
  relatedExperiments: ['concurrency', 'memory-vitals'],
  relatedRecipes: [],
  relatedBrowserAPIs: ['MessageChannel', 'OffscreenCanvas'],
  interviewQuestions: [
    {
      question: 'What is the cost of using postMessage to send a 50MB JSON object to a Web Worker, and how can it be optimized?',
      answer: 'By default, postMessage uses the Structured Clone algorithm, which synchronously copies the 50MB object on the main thread, causing jank. To optimize, you can convert the data into an ArrayBuffer and pass it as a Transferable Object, which transfers ownership to the worker with zero-copy overhead.'
    }
  ],
  references: [
    { title: 'MDN: Web Workers API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers' },
    { title: 'Use web workers to run JavaScript off the browser\'s main thread', url: 'https://web.dev/workers-basics/' }
  ]
}
