import type { Recipe } from '../../../schemas/recipe'

export const domLayoutThrashingManifest: Recipe = {
  id: 'dom-layout-thrashing',
  title: 'Fixing DOM Layout Thrashing',
  summary:
    'Eliminate forced synchronous layouts by batching DOM reads and writes using requestAnimationFrame, preventing the browser from recalculating layout on every loop iteration.',
  problem:
    'Layout thrashing occurs when JavaScript alternately reads and writes to the DOM in a tight loop. Each read after a write forces the browser to immediately recalculate layout (a "reflow"), blocking the main thread. A loop of 100 elements can trigger 100 forced synchronous layouts instead of 1.',
  symptoms: [
    'Janky animations or scroll behavior even on simple pages.',
    'Chrome DevTools Performance panel shows repeated purple "Layout" bars within a single frame.',
    'Lighthouse flags "Reduce JavaScript execution time".',
    'FPS drops to single digits when updating multiple elements simultaneously.',
    '"Forced reflow while executing JavaScript" warning in browser DevTools.'
  ],
  rootCauses: [
    'Reading layout properties (offsetHeight, getBoundingClientRect, scrollTop) immediately after a DOM write invalidates the layout cache.',
    'The browser must flush pending style changes and recalculate layout synchronously before returning the value.',
    'This happens per-iteration in a loop, multiplying the cost linearly.'
  ],
  difficulty: 'Beginner',
  estimatedImplementationTime: '30 minutes – 2 hours',
  performanceImpact: 'High',

  prerequisites: {
    experiments: ['rendering'],
    browserAPIs: ['request-animation-frame'],
    concepts: ['Critical Rendering Path', 'Forced Synchronous Layout', 'Main Thread']
  },

  whenNotToUse: [
    'When a single one-time DOM measurement is required at page load — a single read is never thrashing.',
    'When the element count is very small (< 10) and performance impact is negligible.',
    'When the rAF deferral delay (up to 16ms) breaks a required synchronous user interaction.'
  ],

  decisionMatrix: [
    {
      scenario: 'Updating position/size of many elements in a loop based on their current layout.',
      recommendedApproach: 'Read-then-write batching with requestAnimationFrame',
      alternatives: ['CSS Transitions', 'Web Animations API'],
      tradeoffs:
        'Requires splitting code into two phases (read all, then write all). Minor refactoring needed.',
      why: 'Batching all reads before all writes ensures the browser only recalculates layout once per frame, not once per element.',
      confidence: 'High'
    },
    {
      scenario: 'Animating a property that does not trigger layout (opacity, transform).',
      recommendedApproach: 'CSS transitions or Web Animations API',
      alternatives: ['requestAnimationFrame loop'],
      tradeoffs:
        'Not all properties can be animated on the compositor thread. Width, height, top, left still trigger layout.',
      why: 'Compositor-thread animations bypass the main thread entirely, resulting in zero layout cost.',
      confidence: 'High'
    }
  ],

  recommendedApproaches: [
    'Batch all DOM reads first, store results in variables, then perform all DOM writes.',
    'Wrap write operations in requestAnimationFrame to defer them to the next paint cycle.',
    'Use CSS transforms (translateX/Y) instead of top/left for position-based animations.',
    'Use `will-change: transform` for elements that animate frequently.'
  ],
  approachesToAvoid: [
    'Reading layout properties (offsetWidth, getBoundingClientRect) inside the same loop iteration that writes to the DOM.',
    'Using setInterval for animations — it does not synchronize with the paint cycle.',
    'Animating layout-triggering CSS properties (width, height, margin) when transform can be used instead.'
  ],

  implementationSteps: [
    {
      title: '1. Identify the thrashing pattern',
      description:
        'Look for alternating reads and writes in the same loop: `el.style.height = el.offsetHeight + "px"`. The offsetHeight read after the style.height write is the trigger.'
    },
    {
      title: '2. Separate reads from writes',
      description:
        'First, iterate over all elements and store the read values in an array. Then, in a second loop, apply all write operations using the pre-stored values.'
    },
    {
      title: '3. Defer writes to requestAnimationFrame',
      description:
        'Wrap the write loop in requestAnimationFrame(). This ensures writes happen at the start of the next frame, after all reads are complete.'
    },
    {
      title: '4. Verify with DevTools',
      description:
        'Open Chrome DevTools → Performance tab → Record. After the fix, you should see a single Layout block per frame instead of one per element.'
    }
  ],

  beforeAfterComparison: {
    beforeCode: `// Bad: alternating read/write causes layout thrashing
function updateElementHeights(elements) {
  elements.forEach(el => {
    // READ: forces browser to calculate layout immediately
    const height = el.offsetHeight;

    // WRITE: invalidates layout cache for ALL elements
    el.style.height = (height + 10) + 'px';
    // Next READ in the next iteration triggers another full reflow
  });
}`,
    afterCode: `// Good: batch all reads first, then all writes in rAF
function updateElementHeights(elements) {
  // PHASE 1: Read all values (triggers exactly 1 layout calculation)
  const heights = elements.map(el => el.offsetHeight);

  // PHASE 2: Write all values in the next frame (0 forced layouts)
  requestAnimationFrame(() => {
    elements.forEach((el, i) => {
      el.style.height = (heights[i] + 10) + 'px';
    });
  });
}`,
    explanation:
      'The before code triggers one forced layout per element (O(N) layouts). The after code reads all values in a single layout pass, then batches all writes into the next animation frame — exactly 1 layout recalculation regardless of element count.'
  },

  productionChecklist: [
    'Verified with Chrome DevTools Performance panel that "Layout" bars are no longer repeated per element.',
    'Tested that visual output is identical before and after the fix.',
    'Confirmed no visible delay from the rAF deferral (imperceptible at 60fps).',
    'Checked that CSS alternatives (transform, opacity) were considered first.',
    'Ensured `will-change` is removed after animation completes to avoid memory overhead.'
  ],
  commonMistakes: [
    'Reading a layout property inside the requestAnimationFrame callback after a write — this still causes thrashing within the frame.',
    'Using setTimeout(fn, 0) instead of requestAnimationFrame — setTimeout does not align with the paint cycle.',
    'Forgetting that getBoundingClientRect(), getComputedStyle(), and scrollTop all trigger layout, not just offsetHeight.'
  ],

  relatedExperiments: ['rendering'],
  relatedBrowserAPIs: ['request-animation-frame'],
  relatedAnalyzerRules: ['dom-layout-thrashing'],
  relatedRecipes: ['large-data-table', 'dashboard-rendering'],

  interviewQuestions: [
    {
      question: 'What is layout thrashing and how do you fix it?',
      answer:
        'Layout thrashing (forced synchronous layout) occurs when JavaScript reads layout properties like offsetHeight or getBoundingClientRect after writing to the DOM in the same synchronous block. Each read forces the browser to flush pending style changes and recalculate layout immediately. The fix is to separate reads from writes: perform all reads first (store in variables), then perform all writes — ideally inside requestAnimationFrame to synchronize with the paint cycle.'
    },
    {
      question: 'Which CSS properties trigger layout and which only trigger compositing?',
      answer:
        'Layout-triggering properties: width, height, top, left, margin, padding, border, font-size. Compositor-only properties: transform, opacity, filter. For animations, always prefer transform and opacity — they run on the compositor thread and never block the main thread.'
    }
  ],

  references: [
    {
      title: 'What forces layout/reflow — gist by Paul Irish',
      url: 'https://gist.github.com/paulirish/5d52fb081b3570c81e3a'
    },
    {
      title: 'Avoid large, complex layouts and layout thrashing — web.dev',
      url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing'
    }
  ],

  searchMetadata: {
    keywords: [
      'layout thrashing',
      'forced reflow',
      'offsetHeight',
      'getBoundingClientRect',
      'reflow'
    ],
    synonyms: ['forced synchronous layout', 'FSL', 'layout invalidation'],
    concepts: ['Critical Rendering Path', 'main thread blocking', 'frame budget']
  }
}
