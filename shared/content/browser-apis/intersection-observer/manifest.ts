import type { BrowserAPI } from '../../../schemas/browser-api'

export const intersectionObserverManifest: BrowserAPI = {
  id: 'intersection-observer',
  name: 'IntersectionObserver',
  description: 'An API that provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document viewport.',
  category: 'Observers',
  browserSupport: 'Global 97%+',
  baseline: 'Widely available',
  difficulty: 'Intermediate',
  searchMetadata: {
    keywords: ['IntersectionObserver', 'visibility', 'viewport'],
    synonyms: ['lazy loading', 'infinite scrolling', 'virtual scrolling'],
    concepts: ['asynchronous', 'rendering', 'performance', 'scroll events']
  },
  whenToUse: [
    'Lazy loading images or heavy components.',
    'Implementing infinite scrolling interfaces.',
    'Reporting visibility of advertisements.',
    'Triggering animations when elements scroll into view.'
  ],
  whenNotToUse: [
    'Tracking precise pixel-by-pixel scrolling (use passive scroll listeners).',
    'Detecting overlaps of elements that do not involve the viewport/scroll container.'
  ],
  advantages: [
    'Completely asynchronous; it does not run on the main thread during scroll events.',
    'Eliminates the need for expensive getBoundingClientRect() calls inside scroll event listeners.',
    'Highly customizable using rootMargin to preload content before it enters the viewport.'
  ],
  limitations: [
    'Cannot detect if an element is obscured by another visually (e.g. z-index overlap or opacity: 0).',
    'Callbacks are fired asynchronously, meaning there is a slight delay (not frame-perfect for synchronized parallax).'
  ],
  performanceImpact: 'High',
  commonMistakes: [
    'Failing to unobserve or disconnect the observer after the element is loaded, causing memory leaks.',
    'Creating a new IntersectionObserver instance for every single list item instead of sharing one instance with multiple targets.',
    'Doing heavy DOM manipulation inside the observer callback without batching.'
  ],
  bestPractices: [
    'Use a single Observer instance and call .observe() on multiple DOM nodes to save memory.',
    'Always disconnect() the observer in the component unmount lifecycle.',
    'Use rootMargin (e.g. "200px") to start loading resources slightly before the user scrolls to them.'
  ],
  examples: [
    {
      title: 'Lazy Loading Images Efficiently',
      code: `const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      obs.unobserve(img); // Stop observing once loaded
    }
  });
}, { rootMargin: '100px' });

document.querySelectorAll('img.lazy').forEach(img => observer.observe(img));`,
      explanation: 'This creates a single observer that tracks multiple images. As soon as an image is within 100px of the viewport, its actual source is loaded, and it is unobserved to free memory.'
    }
  ],
  relatedExperiments: ['virtualization', 'rendering'],
  relatedRecipes: [],
  relatedBrowserAPIs: ['MutationObserver', 'ResizeObserver'],
  interviewQuestions: [
    {
      question: 'Why is IntersectionObserver better for performance than listening to the "scroll" event?',
      answer: 'Listening to the scroll event fires synchronously on the main thread multiple times per frame. To check visibility, developers had to call getBoundingClientRect(), forcing synchronous layout recalculations (thrashing). IntersectionObserver calculates this asynchronously off the main thread.'
    }
  ],
  references: [
    { title: 'MDN: Intersection Observer API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API' },
    { title: 'Trust is Good, Observation is Better', url: 'https://web.dev/intersectionobserver/' }
  ]
}
