import type { BrowserAPI } from '../../../schemas/browser-api'

export const mutationObserverManifest: BrowserAPI = {
  id: 'mutation-observer',
  name: 'MutationObserver',
  description: 'Provides the ability to watch for changes being made to the DOM tree.',
  category: 'Observers',
  browserSupport: '99%',
  baseline: 'Widely available',
  difficulty: 'Intermediate',
  usageStats: { popularity: 85 },
  searchMetadata: {
    keywords: ['dom', 'mutation', 'observe', 'watch'],
    synonyms: ['MutationEvents', 'DOMNodeInserted'],
    concepts: ['React ref updates', 'Third-party script injection']
  },
  whenToUse: [
    'Monitoring a third-party widget for inserted nodes.',
    'Implementing custom polyfills or custom elements.',
    'Tracking text changes inside contenteditable elements.'
  ],
  whenNotToUse: [
    'When React or Vue state could just be used instead.',
    'When you just need to know if an element entered the viewport (use IntersectionObserver).'
  ],
  advantages: [
    'Batched asynchronous updates (does not block the main thread like legacy MutationEvents).',
    'Configurable to watch attributes, text content, or child lists.'
  ],
  limitations: [
    'Can cause infinite loops if the observer callback mutates the observed DOM.',
    'Heavy memory overhead if observing document.body with `subtree: true`.'
  ],
  performanceImpact: 'High',
  commonMistakes: [
    'Leaving observers running after component unmount.',
    'Observing the entire document subtree without filtering.'
  ],
  bestPractices: [
    'Always call `observer.disconnect()` when the component unmounts.',
    'Use the narrowest possible observation target.'
  ],
  examples: [
    {
      title: 'Good: Observing a specific container',
      code: `const target = document.getElementById('my-list');
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
    }
  }
});
observer.observe(target, { childList: true });`,
      explanation: 'Observes only the specific container and disconnects later.'
    }
  ],
  relatedExperiments: [],
  relatedRecipes: [],
  relatedBrowserAPIs: ['resize-observer', 'intersection-observer'],
  interviewQuestions: [
    {
      question: 'Why are MutationEvents deprecated in favor of MutationObserver?',
      answer: 'MutationEvents were synchronous, firing for every single change and causing massive performance degradation. MutationObserver batches DOM changes and fires asynchronously via microtasks, avoiding layout thrashing.'
    }
  ],
  references: [
    {
      title: 'MDN Web Docs: MutationObserver',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver'
    }
  ]
}
