import type { BrowserAPI } from '../../../schemas/browser-api'

export const requestAnimationFrameManifest: BrowserAPI = {
  id: 'request-animation-frame',
  name: 'requestAnimationFrame',
  description: 'A method that tells the browser you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint.',
  category: 'Rendering',
  browserSupport: 'Global 98%+',
  baseline: 'Widely available',
  difficulty: 'Beginner',
  usageStats: {
    popularity: 95
  },
  searchMetadata: {
    keywords: ['requestAnimationFrame', 'raf', 'animation', 'rendering'],
    synonyms: ['paint loop', 'frame sync'],
    concepts: ['repaint', 'layout thrashing', 'jank', 'main thread']
  },
  whenToUse: [
    'Animating DOM elements with JavaScript.',
    'Batching DOM reads and writes to prevent Layout Thrashing.',
    'Throttling high-frequency events (like scroll or mousemove).'
  ],
  whenNotToUse: [
    'For simple animations where CSS transitions or @keyframes are sufficient.',
    'Executing heavy computational logic that blocks the main thread.',
    'For asynchronous tasks that do not involve visual updates (use setTimeout or Web Workers instead).'
  ],
  advantages: [
    'Synchronizes automatically with the display refresh rate (usually 60fps).',
    'Pauses automatically when the user switches tabs, saving battery and CPU.',
    'Groups multiple DOM manipulations into a single repaint.'
  ],
  limitations: [
    'Executes strictly on the Main Thread. If the thread is blocked, rAF will be delayed (jank).',
    'Not suitable for exact millisecond-precise timing (unlike Web Audio API).'
  ],
  performanceImpact: 'High',
  commonMistakes: [
    'Reading layout properties (offsetWidth) immediately after writing to them inside the same rAF callback.',
    'Failing to cancel the animation frame using cancelAnimationFrame when the component unmounts.',
    'Doing heavy JSON parsing or array mapping inside the rAF callback, causing frame drops.'
  ],
  bestPractices: [
    'Keep the callback execution time under 10ms to hit 60fps budgets.',
    'Separate state calculation from DOM updates. Calculate first, then schedule the DOM write inside rAF.',
    'Use cancelAnimationFrame to clean up memory on unmount.'
  ],
  examples: [
    {
      title: 'Fixing Layout Thrashing',
      code: `// Bad: Causes synchronous layout
const w = box.offsetWidth;
box.style.width = w + 10 + 'px';

// Good: Read now, write in next frame
const w = box.offsetWidth;
requestAnimationFrame(() => {
  box.style.width = w + 10 + 'px';
});`,
      explanation: 'By deferring the style mutation to the next frame, the browser avoids recalculating the layout synchronously, preserving a smooth 60fps.'
    }
  ],
  relatedExperiments: ['rendering', 'concurrency'],
  relatedRecipes: [],
  relatedBrowserAPIs: ['requestIdleCallback', 'PerformanceObserver'],
  interviewQuestions: [
    {
      question: 'What is the primary difference between setTimeout and requestAnimationFrame for animations?',
      answer: 'setTimeout executes arbitrarily based on the Event Loop timer, often falling out of sync with the monitor refresh rate, causing visual stutter. requestAnimationFrame is synchronized by the browser to execute immediately before the next repaint, guaranteeing smoothness and automatically pausing in inactive tabs.'
    }
  ],
  references: [
    { title: 'MDN: window.requestAnimationFrame()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame' },
    { title: 'Avoid Large, Complex Layouts and Layout Thrashing', url: 'https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/' }
  ]
}
