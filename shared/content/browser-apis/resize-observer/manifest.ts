import type { BrowserAPI } from '../../../schemas/browser-api'

export const resizeObserverManifest: BrowserAPI = {
  id: 'resize-observer',
  name: 'ResizeObserver',
  description:
    'An API that lets you efficiently observe changes to the size of elements, replacing the unreliable window.resize event for element-level layout tracking.',
  category: 'Observers',
  browserSupport: 'Chrome 64+, Firefox 69+, Safari 13.1+, Edge 79+',
  baseline: 'Widely available',
  difficulty: 'Beginner',

  searchMetadata: {
    keywords: ['resize', 'element size', 'layout change', 'responsive', 'container query polyfill'],
    synonyms: ['element resize listener', 'size observer', 'dimension tracking'],
    concepts: ['Layout', 'Responsive Design', 'Observer Pattern']
  },

  whenToUse: [
    'When you need to react to an individual element resizing (not the window).',
    'When building components that adapt their layout to their container width (container queries).',
    'When implementing charts, editors, or canvas elements that must rerender when their container changes size.',
    'When replacing window.addEventListener("resize") for element-level tracking.'
  ],

  whenNotToUse: [
    'When you only need to track window/viewport size — use window.resize or the CSS `vw`/`vh` units instead.',
    'When you need to react to CSS property changes other than size — use MutationObserver.',
    'When polling the size once at mount time is sufficient — just read offsetWidth/offsetHeight directly.'
  ],

  advantages: [
    "Does not fire on every window resize — only when the observed element's content or border box actually changes.",
    'More accurate than window.resize for element-level tracking.',
    'Non-blocking: callbacks are invoked asynchronously, similar to IntersectionObserver.',
    'Provides both contentRect and borderBoxSize, so you can choose what to measure.',
    'Zero dependency on debouncing — the browser coalesces multiple resize events automatically.'
  ],

  limitations: [
    'Callbacks fire asynchronously so there is one frame of delay before your component can react.',
    'Does not observe CSS-only size changes (e.g. `display: none`) in all browsers consistently.',
    'In older Safari versions, only contentRect is available (not borderBoxSize).',
    'The observer must be explicitly disconnected on component unmount to avoid memory leaks.'
  ],

  performanceImpact: 'Low',

  commonMistakes: [
    'Forgetting to call observer.disconnect() on component unmount — causes a memory leak.',
    'Reading layout properties (offsetWidth) inside the callback without batching — can cause layout thrashing.',
    'Observing too many elements simultaneously — prefer observing a common ancestor.',
    'Using window.addEventListener("resize") as a fallback inside the callback — double-handling events.'
  ],

  bestPractices: [
    'Always disconnect the observer in the component unmount lifecycle (onUnmounted in Vue, useEffect cleanup in React).',
    'Use the `contentBoxSize` entry when available for consistent cross-browser results.',
    'Debounce expensive work triggered by the callback (e.g. complex layout recalculations).',
    'Observe the container element, not individual child elements, to minimize observer count.'
  ],

  examples: [
    {
      title: 'Basic Vue usage with cleanup',
      code: `<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const containerWidth = ref(0)
let observer = null

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
    }
  })
  observer.observe(containerRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="containerRef">
    Container is {{ containerWidth }}px wide
  </div>
</template>`,
      explanation:
        'Observe a single element for size changes. The observer is disconnected on unmount to prevent a memory leak.'
    },
    {
      title: 'Using @vueuse/core useResizeObserver (recommended)',
      code: `<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const containerRef = ref(null)
const containerWidth = ref(0)

useResizeObserver(containerRef, (entries) => {
  containerWidth.value = entries[0].contentRect.width
})
// Cleanup is handled automatically by VueUse
</script>`,
      explanation:
        'The VueUse useResizeObserver composable wraps the API and handles disconnection automatically when the component unmounts.'
    }
  ],

  relatedExperiments: ['rendering', 'reactivity'],
  relatedRecipes: ['dashboard-rendering'],
  relatedBrowserAPIs: ['intersection-observer', 'request-animation-frame'],

  interviewQuestions: [
    {
      question:
        'Why should you use ResizeObserver instead of window.addEventListener("resize") for element tracking?',
      answer:
        "window.resize fires for every viewport change regardless of whether a specific element changed size — and it fires on every pixel of window resize, requiring debouncing. ResizeObserver fires only when the observed element's actual size changes, is automatically coalesced by the browser, and works correctly when an element resizes due to content changes (not just window resize). It is also element-scoped, so you can observe any element in the DOM, not just the viewport."
    }
  ],

  references: [
    {
      title: 'ResizeObserver — MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver'
    },
    {
      title: 'useResizeObserver — VueUse',
      url: 'https://vueuse.org/core/useResizeObserver/'
    }
  ]
}
