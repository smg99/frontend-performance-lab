import type { BrowserAPI } from '../../../schemas/browser-api'

export const viewTransitionsManifest: BrowserAPI = {
  id: 'view-transitions',
  name: 'View Transitions API',
  description:
    'Enables smooth, app-like visual transitions between different states of the DOM, including between entirely different documents (Multi-Page Apps).',
  category: 'Rendering',
  browserSupport: '75%',
  baseline: 'Limited',
  difficulty: 'Intermediate',
  usageStats: { popularity: 45 },
  searchMetadata: {
    keywords: ['animation', 'transition', 'SPA', 'MPA', 'crossfade'],
    synonyms: ['document.startViewTransition'],
    concepts: ['Shared Element Transitions', 'Micro-interactions']
  },
  whenToUse: [
    'Creating seamless navigation between pages in an SPA.',
    'Animating elements that change their position in the DOM.',
    'Implementing dark/light mode toggle animations.'
  ],
  whenNotToUse: [
    'If you need support for older iOS devices (fallback gracefully).',
    'For highly complex, physics-based canvas animations.'
  ],
  advantages: [
    'Massively simplifies the code needed for cross-fades and morphing.',
    'Runs natively in the browser compositor, providing excellent 60fps performance.',
    'Reduces the need for heavy JavaScript animation libraries (like Framer Motion).'
  ],
  limitations: [
    'Currently limited support in older Safari and Firefox (though it degrades gracefully to instant updates).',
    'Can cause accessibility issues if users have `prefers-reduced-motion` enabled and it is ignored.'
  ],
  performanceImpact: 'Low',
  commonMistakes: [
    'Forgetting to assign unique `view-transition-name` CSS properties to multiple moving elements on the same page.',
    'Not checking for `document.startViewTransition` support and throwing an error.'
  ],
  bestPractices: [
    'Always use feature detection: `if (!document.startViewTransition) { updateDOM(); return; }`.',
    'Wrap state updates in the callback: `document.startViewTransition(() => updateState())`.'
  ],
  examples: [
    {
      title: 'Good: Feature-detected transition',
      code: `function toggleTheme() {
  if (!document.startViewTransition) {
    document.body.classList.toggle('dark');
    return;
  }
  document.startViewTransition(() => {
    document.body.classList.toggle('dark');
  });
}`,
      explanation: 'Safely falls back to instant DOM updates if the browser lacks support.'
    }
  ],
  relatedExperiments: [],
  relatedRecipes: [],
  relatedBrowserAPIs: [],
  interviewQuestions: [
    {
      question: 'How does the View Transitions API actually work under the hood?',
      answer:
        'It takes a screenshot (rasterized image) of the old state, pauses rendering, executes your callback to update the DOM, takes a screenshot of the new state, and then natively crossfades or transforms between those two images.'
    }
  ],
  references: [
    {
      title: 'MDN Web Docs: View Transitions API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API'
    }
  ]
}
