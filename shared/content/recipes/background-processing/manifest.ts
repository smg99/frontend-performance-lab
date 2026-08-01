import type { Recipe } from '../../../schemas/recipe'

export const backgroundProcessingManifest: Recipe = {
  id: 'background-processing',
  title: 'Heavy Background Processing',
  summary: 'Strategies for preventing main thread lockups when performing heavy calculations, parsing massive JSON, or filtering large datasets on the client.',
  problem: 'JavaScript is single-threaded by default. If a function takes 500ms to calculate a physics simulation, filter a 100,000-row array, or parse a 50MB JSON payload, the entire browser tab freezes for 500ms. Clicks, scrolls, and animations completely stop.',
  symptoms: [
    'GIFs and CSS animations abruptly freeze.',
    'Typing in inputs feels laggy or ignores keystrokes.',
    'The browser displays the "Page Unresponsive" dialog.',
    'Lighthouse reports high "Total Blocking Time" (TBT).'
  ],
  rootCauses: [
    'Long tasks (any execution taking > 50ms) block the Event Loop.',
    'Processing large arrays synchronously.',
    'Complex cryptography, image processing, or data aggregation running on the main thread.'
  ],
  difficulty: 'Advanced',
  estimatedImplementationTime: '1-2 days',
  performanceImpact: 'High',
  
  prerequisites: {
    experiments: ['concurrency'],
    browserAPIs: ['web-workers'],
    concepts: ['Event Loop', 'Main Thread', 'Long Tasks', 'Structured Clone']
  },
  
  whenNotToUse: [
    'If the calculation takes less than 10-20ms. The overhead of spinning up a worker or yielding might be slower than just running it.',
    'If the task requires direct, synchronous access to the DOM (`document` or `window`).'
  ],

  decisionMatrix: [
    {
      scenario: 'You need to filter a massive dataset (e.g. 50,000 objects) without freezing the UI.',
      recommendedApproach: 'Web Workers',
      alternatives: ['Time Slicing (setTimeout)'],
      tradeoffs: 'Requires transferring data via postMessage, which has serialization costs. You cannot access the DOM.',
      why: 'Web Workers run in a completely separate OS thread. The main thread remains at 0% CPU utilization during the filter, ensuring perfect 60fps scrolling.',
      confidence: 'High'
    },
    {
      scenario: 'You need to render a complex component tree progressively, but you cannot use a Worker because it relies on the DOM.',
      recommendedApproach: 'Time Slicing (Yielding to Main Thread)',
      alternatives: ['Web Workers'],
      tradeoffs: 'The overall processing time will be slightly longer due to context switching, but the UI remains responsive.',
      why: 'By chunking the work into small batches using `setTimeout` or `requestIdleCallback`, the browser can process user inputs between chunks.',
      confidence: 'Medium'
    }
  ],

  recommendedApproaches: [
    'Offload pure computational tasks to Web Workers.',
    'Use `Transferable Objects` (like ArrayBuffers) when passing data to Workers to achieve zero-copy speed.',
    'Yield to the main thread manually using `setTimeout(0)` or `scheduler.yield()` for chunkable DOM tasks.'
  ],
  approachesToAvoid: [
    'Processing 50MB JSON strings synchronously using `JSON.parse` on the main thread.',
    'Using heavy `reduce` or `filter` chains on massive arrays directly inside a UI component render function.',
    'Sending massive deeply-nested objects back and forth to a Worker (serialization bottleneck).'
  ],
  
  implementationSteps: [
    {
      title: '1. Isolate the Pure Function',
      description: 'Extract the heavy calculation into a pure function that does not rely on closures, DOM APIs, or global state.'
    },
    {
      title: '2. Spin up the Worker',
      description: 'Create a separate `.js` file for the worker and instantiate it using `new Worker()`. Consider using libraries like `Comlink` for RPC.'
    },
    {
      title: '3. Handle Asynchrony',
      description: 'Update the UI component to display a loading state while waiting for the Worker to `postMessage` the result back.'
    }
  ],
  
  beforeAfterComparison: {
    beforeCode: `// Bad: Blocks the Main Thread for 500ms
const handleSearch = (query) => {
  setLoading(true);
  
  // Synchronous, blocks UI completely
  const results = massiveDataset.filter(item => 
    expensiveMatch(item, query)
  );
  
  setResults(results);
  setLoading(false); // User never even sees the loading spinner!
};`,
    afterCode: `// Good: Offloaded to Web Worker
const handleSearch = async (query) => {
  setLoading(true); // Spinner renders immediately
  
  // Asynchronous, runs on separate thread
  worker.postMessage({ query, dataset: massiveDataset });
  
  worker.onmessage = (e) => {
    setResults(e.data);
    setLoading(false);
  };
};`,
    explanation: 'In the before code, the synchronous execution prevents the browser from ever rendering the loading spinner. In the after code, the main thread is instantly freed, the spinner renders, and the calculation happens invisibly in the background.'
  },
  
  productionChecklist: [
    'Are you using `worker.terminate()` when the component unmounts to prevent memory leaks?',
    'Is the data being passed to the worker small enough, or are you using Transferable objects?',
    'Are you displaying a clear loading state while the background thread processes?',
    'Have you handled worker error events (`worker.onerror`)?'
  ],
  commonMistakes: [
    'Creating a new Web Worker inside a rapid event listener (like `onMouseMove`), crashing the browser with thousands of OS threads.',
    'Assuming Web Workers are a magic bullet for all performance issues. If the cost of serialization > cost of calculation, it slows you down.',
    'Trying to pass functions or DOM nodes via `postMessage` (it will throw a DataCloneError).'
  ],
  
  relatedExperiments: ['concurrency'],
  relatedBrowserAPIs: ['web-workers'],
  relatedAnalyzerRules: [],
  relatedRecipes: ['large-data-table'],
  
  interviewQuestions: [
    {
      question: 'What is the "Total Blocking Time" (TBT) metric, and how do Web Workers help improve it?',
      answer: 'TBT measures the total amount of time that the main thread was blocked for long enough (tasks > 50ms) to prevent input responsiveness. Web Workers improve TBT by taking heavy JavaScript execution completely off the main thread, executing it in a parallel OS thread, leaving the main thread 100% free to handle scrolling, clicks, and rendering.'
    }
  ],
  
  references: [
    { title: 'MDN: Using Web Workers', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers' }
  ],
  
  searchMetadata: {
    keywords: ['concurrency', 'multithreading', 'heavy calculation', 'TBT', 'blocking', 'long tasks'],
    synonyms: ['web workers', 'background tasks', 'time slicing'],
    concepts: ['event loop', 'main thread', 'serialization']
  }
}
