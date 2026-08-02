import type { Recipe } from '../../../schemas/recipe'

export const memoryEventListenerManifest: Recipe = {
  id: 'memory-event-listener',
  title: 'Preventing Memory Leaks from Event Listeners',
  summary:
    'How to safely add and remove event listeners in Vue and React components to prevent memory leaks that accumulate over the lifetime of a single-page application.',
  problem:
    'In single-page applications, components mount and unmount repeatedly. If a component attaches a global event listener (on window, document, or a shared emitter) but never removes it on unmount, the listener and its closure — including references to the entire component tree — persist in memory indefinitely. Over time, this causes memory to grow without bound.',
  symptoms: [
    'Browser tab memory usage grows steadily as users navigate the application.',
    'Chrome DevTools Memory panel shows increasing heap size across navigation cycles.',
    'Taking a heap snapshot reveals many detached DOM nodes or closures.',
    'Application becomes sluggish after extended use without a page refresh.',
    'The same callback fires multiple times (once per mount) after navigating to a page repeatedly.'
  ],
  rootCauses: [
    'addEventListener on global objects (window, document) holds a reference to the callback closure.',
    'The closure captures variables from the component scope, preventing garbage collection of the entire component.',
    "Vue/React's unmount lifecycle is not used to clean up the listener.",
    'Anonymous functions passed to addEventListener cannot be removed because removeEventListener requires the exact same function reference.'
  ],
  difficulty: 'Beginner',
  estimatedImplementationTime: '15–30 minutes per component',
  performanceImpact: 'High',

  prerequisites: {
    experiments: ['memory-vitals'],
    browserAPIs: ['web-workers'],
    concepts: ['JavaScript Garbage Collection', 'Closure', 'Component Lifecycle']
  },

  whenNotToUse: [
    "When the listener is attached to a component's own root element — Vue and React clean these up automatically on unmount.",
    "When using a framework-managed event system (e.g., Vue's `@click` template syntax) — these are handled by the framework.",
    'When the listener is intentionally global and persistent (e.g., a keyboard shortcut at the app level).'
  ],

  decisionMatrix: [
    {
      scenario: 'Component attaches a listener to window or document on mount.',
      recommendedApproach: 'Store function reference and remove in onUnmounted / useEffect cleanup',
      alternatives: ['VueUse useEventListener', '@vueuse/core useEventListener'],
      tradeoffs:
        'Manual cleanup requires discipline and is easy to forget. Using a composable automates it.',
      why: 'The listener must be removed with the exact same function reference used to add it. Storing it in a variable enables this.',
      confidence: 'High'
    },
    {
      scenario: 'Many components use window.addEventListener for the same event type.',
      recommendedApproach: 'Centralize in a shared composable or store (e.g., Pinia)',
      alternatives: ['Each component managing its own listener'],
      tradeoffs:
        'Centralization adds a layer of abstraction but prevents duplicate listeners accumulating.',
      why: 'Attaching N listeners for the same event (one per component instance) multiplies the processing cost per event.',
      confidence: 'High'
    }
  ],

  recommendedApproaches: [
    'Store the listener function in a variable so it can be passed to removeEventListener.',
    'In Vue: use onUnmounted() to call removeEventListener with the stored reference.',
    'In React: return a cleanup function from useEffect that calls removeEventListener.',
    'Use @vueuse/core useEventListener composable — it handles cleanup automatically.',
    'Use AbortController to remove multiple listeners at once.'
  ],
  approachesToAvoid: [
    'Passing an anonymous function to addEventListener — you cannot remove an anonymous function later.',
    'Using onBeforeUnmount instead of onUnmounted to clean up — the DOM still exists in onBeforeUnmount, but the cleanup may be skipped if the component errors.',
    "Attaching listeners in the template's `mounted` lifecycle without a corresponding `beforeUnmount`/`unmounted` cleanup."
  ],

  implementationSteps: [
    {
      title: '1. Identify the leak pattern',
      description:
        'Search for window.addEventListener or document.addEventListener calls inside component setup(), onMounted(), or componentDidMount(). If there is no corresponding removeEventListener, it is a leak.'
    },
    {
      title: '2. Store the function reference',
      description:
        'Extract the callback into a named const before calling addEventListener. You must pass the exact same reference to removeEventListener.'
    },
    {
      title: '3. Add cleanup in the unmount lifecycle',
      description:
        'Vue: call removeEventListener inside onUnmounted(). React: return a cleanup function from useEffect. Svelte: use onDestroy().'
    },
    {
      title: '4. Verify with DevTools Memory panel',
      description:
        "Open Chrome DevTools → Memory → take a heap snapshot. Navigate to the component, navigate away, take another snapshot. The component should not appear in the second snapshot's retainer tree."
    }
  ],

  beforeAfterComparison: {
    beforeCode: `<!-- Vue: Bad — anonymous function leaks on every mount -->
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Leaks: anonymous function can never be removed
  window.addEventListener('resize', () => {
    console.log('resized')
  })
})
// No cleanup — the listener persists after unmount
</script>`,
    afterCode: `<!-- Vue: Good — named reference, cleaned up on unmount -->
<script setup>
import { onMounted, onUnmounted } from 'vue'

// Store reference so we can remove the exact same function
const handleResize = () => {
  console.log('resized')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<!-- Even better: use @vueuse/core (handles cleanup automatically) -->
<script setup>
import { useEventListener } from '@vueuse/core'

useEventListener(window, 'resize', () => {
  console.log('resized')
})
// No manual cleanup needed — automatically removed on unmount
</script>`,
    explanation:
      'The before code passes an anonymous function that cannot be referenced later, so removeEventListener can never match it. The after code stores a named reference — allowing exact matching — and removes it in onUnmounted. The @vueuse/core pattern is the recommended approach as it eliminates manual lifecycle management entirely.'
  },

  productionChecklist: [
    'Verified that every window.addEventListener has a corresponding removeEventListener with the same function reference.',
    'Confirmed cleanup runs in onUnmounted (Vue) or useEffect return function (React), not just onBeforeUnmount.',
    'Tested by navigating to the component 3+ times and confirming memory does not grow in DevTools.',
    'Checked that anonymous functions are not used with addEventListener.',
    'Considered using @vueuse/core useEventListener or React Query event utilities to automate cleanup.'
  ],
  commonMistakes: [
    'Removing the listener in onBeforeUnmount instead of onUnmounted — cleanup may not run if the component throws during teardown.',
    'Wrapping the handler in a new arrow function inside removeEventListener — this creates a new reference that does not match the original.',
    'Forgetting that MutationObserver, IntersectionObserver, and ResizeObserver also need to be disconnected on unmount.',
    'Attaching listeners to a parent element that persists beyond the component (e.g., document.body) without cleaning up.'
  ],

  relatedExperiments: ['memory-vitals'],
  relatedBrowserAPIs: ['web-workers'],
  relatedAnalyzerRules: ['memory-event-listener'],
  relatedRecipes: ['large-data-table'],

  interviewQuestions: [
    {
      question: 'How do event listeners cause memory leaks in single-page applications?',
      answer:
        "When a component attaches a listener to a global object (window, document) and fails to remove it on unmount, the listener's closure prevents garbage collection. The closure holds references to the component's state, props, and potentially the entire component tree. In an SPA where components mount and unmount repeatedly, these retained closures accumulate indefinitely, growing heap memory over the session."
    },
    {
      question: 'Why does removeEventListener require the exact same function reference?',
      answer:
        'The browser identifies listeners by object identity (===), not by function equivalence. Two arrow functions with identical bodies are different objects. If you pass an anonymous function to addEventListener, there is no reference to pass to removeEventListener, so the listener can never be removed. The solution is to store the function in a variable before calling addEventListener.'
    }
  ],

  references: [
    {
      title: 'Memory management — MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management'
    },
    {
      title: 'Fix memory problems — Chrome DevTools',
      url: 'https://developer.chrome.com/docs/devtools/memory-problems/'
    },
    {
      title: 'useEventListener — VueUse',
      url: 'https://vueuse.org/core/useEventListener/'
    }
  ],

  searchMetadata: {
    keywords: [
      'memory leak',
      'event listener',
      'removeEventListener',
      'addEventListener',
      'onUnmounted'
    ],
    synonyms: ['memory growth', 'heap leak', 'retained closure', 'detached DOM'],
    concepts: ['JavaScript Garbage Collection', 'component lifecycle', 'closure capture']
  }
}
