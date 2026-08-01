import type { ExperimentManifest } from '@schemas/index'
import { examples } from './examples'
import { references } from './references'

const manifest: ExperimentManifest = {
  id: 'concurrency',
  version: '1.0.0',
  status: 'stable',
  lastUpdated: new Date().toISOString(),
  title: 'Concurrency & Event Loop',
  description: 'Understand how JavaScript\'s single-threaded event loop processes tasks.',
  difficulty: 'Advanced',
  estimatedReadingTime: 15,
  tags: ['concurrency', 'event-loop', 'workers', 'performance'],
  topics: ['concurrency'],
  browserAPIs: ['Worker', 'setTimeout', 'requestIdleCallback'],
  relationships: [],
  sections: [
    {
      id: 'what-is-it',
      title: 'What is it?',
      type: 'concept',
      order: 1,
      content: 'JavaScript is single-threaded. This means it can only execute one piece of code at a time. Concurrency in JS is achieved via the Event Loop, which schedules tasks (macrotasks) and microtasks.'
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      type: 'concept',
      order: 2,
      content: 'When a synchronous block of code takes too long (e.g. a massive `for` loop), it blocks the main thread. The browser cannot render, and user interactions (clicks, scrolling) are queued and delayed. To fix this, heavy work must be chunked (yielded back to the event loop) or moved off the main thread entirely using Web Workers.'
    },
    {
      id: 'recommendation',
      title: 'Recommendation',
      type: 'recommendation',
      order: 3,
      content: {
        approach: 'Use Web Workers for heavy mathematical computations or data parsing.',
        reasoning: 'Web Workers run in a completely separate OS thread. They cannot access the DOM, but they guarantee the main UI thread remains unblocked at 60 FPS.'
      }
    },
    ...examples
  ],
  benchmarks: [],
  references
}

export default manifest
