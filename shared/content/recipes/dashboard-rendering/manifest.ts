import type { Recipe } from '../../../schemas/recipe'

export const dashboardRenderingManifest: Recipe = {
  id: 'dashboard-rendering',
  title: 'Dashboard Rendering & Layout Thrashing',
  summary: 'Architectural strategies for rendering complex dashboards containing multiple charts, widgets, and data grids without causing layout thrashing or stuttering animations.',
  problem: 'Dashboards pack high-density information (charts, grids, stats) into a single view. When multiple widgets render, fetch data, and resize simultaneously, they frequently read from and write to the DOM concurrently. This triggers severe layout thrashing and jank.',
  symptoms: [
    'Resizing the browser window causes extreme stuttering and freezing.',
    'Initial load sequence looks "glitchy" as widgets jump around during rendering.',
    'Animations (like sidebar toggles) drop frames heavily when charts are present.'
  ],
  rootCauses: [
    'Widgets individually measuring their own DOM containers (e.g. `offsetWidth`) immediately followed by another widget updating its `style.width`.',
    'Canvas/SVG charting libraries forcing synchronous recalculations.',
    'Uncontrolled render cascades where one widget loading triggers layout shifts in others.'
  ],
  difficulty: 'Advanced',
  estimatedImplementationTime: '1-3 days',
  performanceImpact: 'High',
  
  prerequisites: {
    experiments: ['rendering'],
    browserAPIs: ['request-animation-frame', 'intersection-observer'],
    concepts: ['Layout Thrashing', 'Event Loop', 'Repaint']
  },
  
  whenNotToUse: [
    'If the dashboard consists of strictly static content or text-only cards.',
    'If the layout uses fixed CSS grid sizes where widgets never resize dynamically.'
  ],

  decisionMatrix: [
    {
      scenario: 'Widgets need to redraw/recalculate when the browser resizes.',
      recommendedApproach: 'ResizeObserver + requestAnimationFrame Debouncing',
      alternatives: ['window.addEventListener("resize")'],
      tradeoffs: 'Requires careful cleanup of observers when widgets unmount.',
      why: 'Listening to `window.resize` fires synchronously. `ResizeObserver` specifically tracks the element and groups measurements, and `requestAnimationFrame` ensures the redraw is synchronized with the display.',
      confidence: 'High'
    },
    {
      scenario: 'A dashboard contains 20+ heavy charts, but only 4 are visible on screen.',
      recommendedApproach: 'IntersectionObserver Lazy Loading',
      alternatives: ['Load all concurrently'],
      tradeoffs: 'Scrolling fast might show a blank space briefly before the chart initializes.',
      why: 'Initializing 20 canvas charts blocks the main thread completely. Only rendering what is in the viewport keeps the initial load instant.',
      confidence: 'High'
    }
  ],

  recommendedApproaches: [
    'Batch DOM reads and writes centrally (e.g., using `fastdom`).',
    'Use `ResizeObserver` for widget resizing, not `window.resize`.',
    'Lazy-load offscreen widgets using `IntersectionObserver`.',
    'Reserve layout space using CSS `aspect-ratio` or fixed height placeholders to prevent Cumulative Layout Shift (CLS).'
  ],
  approachesToAvoid: [
    'Interleaving DOM reads (`clientHeight`) and writes (`style.height`) in a `forEach` loop across widgets.',
    'Relying purely on JavaScript for grid layout calculations (use CSS Grid instead).',
    'Animating layout properties like `width` or `margin` (animate `transform` instead).'
  ],
  
  implementationSteps: [
    {
      title: '1. Establish CSS Layout',
      description: 'Use a strict CSS Grid architecture with min/max constraints so widgets never rely on JS to calculate their initial size.'
    },
    {
      title: '2. Prevent Layout Shifts',
      description: 'Set `aspect-ratio` or minimum heights on widget skeleton loaders so the surrounding layout is completely stable before data arrives.'
    },
    {
      title: '3. Decouple Reads and Writes',
      description: 'Audit charting libraries and custom resize hooks. Ensure all reads (getBoundingClientRect) happen first, and all writes (canvas resizing) happen inside `requestAnimationFrame`.'
    }
  ],
  
  beforeAfterComparison: {
    beforeCode: `// Bad: Causes Layout Thrashing across multiple widgets
widgets.forEach(widget => {
  // READ
  const width = widget.element.offsetWidth; 
  // WRITE
  widget.chart.resize(width); 
});`,
    afterCode: `// Good: Batches Reads and Writes
// Phase 1: All Reads
const measurements = widgets.map(widget => ({
  widget,
  width: widget.element.offsetWidth
}));

// Phase 2: All Writes grouped in the next frame
requestAnimationFrame(() => {
  measurements.forEach(({ widget, width }) => {
    widget.chart.resize(width);
  });
});`,
    explanation: 'The before code interleaves reads and writes, forcing the browser to synchronously recalculate the layout for every widget. The after code batches all reads first, then defers all writes to the next frame.'
  },
  
  productionChecklist: [
    'Are you using CSS Grid for the macro-layout instead of JS calculation?',
    'Are all `ResizeObserver` instances disconnected when the widget unmounts?',
    'Is `transform` used for all sidebar/drawer animations instead of `width`?',
    'Are offscreen widgets delayed via IntersectionObserver?'
  ],
  commonMistakes: [
    'Using an external charting library that internally triggers layout thrashing, ruining your own optimizations.',
    'Forgetting to debounce or throttle the ResizeObserver callback.',
    'Failing to reserve height for widgets, causing massive CLS when they render.'
  ],
  
  relatedExperiments: ['rendering', 'reactivity'],
  relatedBrowserAPIs: ['request-animation-frame', 'intersection-observer'],
  relatedAnalyzerRules: ['layout-thrashing'],
  relatedRecipes: ['large-data-table', 'lazy-image-gallery'],
  
  interviewQuestions: [
    {
      question: 'What is Layout Thrashing (Forced Synchronous Layout) and how do you prevent it in a complex dashboard?',
      answer: 'Layout thrashing occurs when JavaScript reads a layout property (like offsetWidth) immediately after mutating the DOM (like changing style.width), forcing the browser to synchronously calculate the layout before the frame paints. It is prevented by batching all DOM reads together, followed by all DOM writes together, often synchronized via requestAnimationFrame.'
    }
  ],
  
  references: [
    { title: 'Avoid Large, Complex Layouts and Layout Thrashing', url: 'https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/' }
  ],
  
  searchMetadata: {
    keywords: ['dashboard', 'charts', 'widgets', 'layout thrashing', 'CLS'],
    synonyms: ['grid layout', 'heavy ui', 'forced synchronous layout'],
    concepts: ['DOM layout', 'repaint', 'resize event']
  }
}
