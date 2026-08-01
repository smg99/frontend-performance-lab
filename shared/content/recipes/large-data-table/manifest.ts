import type { Recipe } from '../../../schemas/recipe'

export const largeDataTableManifest: Recipe = {
  id: 'large-data-table',
  title: 'Large Data Table Performance',
  summary: 'Architectural strategies for rendering thousands of rows in a data table without freezing the browser or exhausting memory.',
  problem: 'When rendering a table with thousands of rows (e.g., an analytics dashboard or user directory), the browser must create tens of thousands of DOM nodes. This completely freezes the main thread, delays interactivity, and consumes massive amounts of RAM.',
  symptoms: [
    'The page completely freezes for 1-5 seconds when navigating to the table.',
    'Scrolling feels extremely sluggish and unresponsive.',
    'Hover effects and tooltips are severely delayed.',
    'Lighthouse reports "Avoid an excessive DOM size".'
  ],
  rootCauses: [
    'Creating DOM nodes is computationally expensive.',
    'Each DOM node requires memory for styles, event listeners, and layout boxes.',
    'React/Vue must diff massive component trees during updates, which is an O(N) operation where N is the number of nodes.'
  ],
  difficulty: 'Intermediate',
  estimatedImplementationTime: '2-4 hours',
  performanceImpact: 'High',
  
  prerequisites: {
    experiments: ['virtualization'],
    browserAPIs: ['intersection-observer'],
    concepts: ['DOM node cost', 'Reconciliation overhead']
  },
  
  whenNotToUse: [
    'If the table always displays less than 100 rows.',
    'If the table rows have highly unpredictable heights that change dynamically based on network requests, making virtualization mathematically complex.',
    'If SEO requires all rows to be present in the HTML payload for crawlers (use server-side pagination instead).'
  ],

  decisionMatrix: [
    {
      scenario: 'Table has 5,000+ rows and users need to scroll quickly through them.',
      recommendedApproach: 'Virtualization (Windowing)',
      alternatives: ['Pagination', 'Infinite Scroll'],
      tradeoffs: 'Breaks native browser "Find in Page" (Ctrl+F) because unrendered rows do not exist in the DOM.',
      why: 'Virtualization only renders the rows visible in the viewport plus a small buffer. It provides a seamless scrolling experience while keeping DOM count strictly bounded.',
      confidence: 'High'
    },
    {
      scenario: 'Users need to browse large datasets but also rely heavily on "Find in Page".',
      recommendedApproach: 'Pagination',
      alternatives: ['Virtualization'],
      tradeoffs: 'UX friction; users have to explicitly click to see more data. However, native browser search works perfectly for the current page.',
      why: 'Pagination restricts the DOM size naturally and avoids the complexity of scrolling math.',
      confidence: 'Medium'
    }
  ],

  recommendedApproaches: [
    'Use a Virtualization library (`react-window`, `vue-virtual-scroller`).',
    'Delegate heavy sorting and filtering to Web Workers.',
    'Use CSS `content-visibility: auto` for off-screen rows (if virtualization is not possible).'
  ],
  approachesToAvoid: [
    'Rendering thousands of rows using a raw `.map()` or `v-for`.',
    'Attaching individual event listeners to every cell. Use event delegation on the `<tbody>`.',
    'Triggering state updates in the parent component that force the entire table to re-render unnecessarily.'
  ],
  
  implementationSteps: [
    {
      title: '1. Establish Fixed Heights',
      description: 'Ensure each row has a predictable height. This is critical for the virtualization engine to calculate scroll positions instantly without measuring the DOM.'
    },
    {
      title: '2. Implement the Scroller Component',
      description: 'Replace your `<table>` or `<ul>` with a VirtualScroller. Pass the total item count and the row height.'
    },
    {
      title: '3. Render the Visible Slice',
      description: 'The Scroller will provide you with the `index` and `style` props. Apply the `style` (which contains absolute positioning) directly to the row.'
    }
  ],
  
  beforeAfterComparison: {
    beforeCode: `// Bad: Renders 10,000 DOM nodes instantly
const DataTable = ({ data }) => {
  return (
    <table>
      <tbody>
        {data.map(row => (
          <Row key={row.id} data={row} />
        ))}
      </tbody>
    </table>
  );
};`,
    afterCode: `// Good: Only renders ~20 rows at a time
import { FixedSizeList } from 'react-window';

const DataTable = ({ data }) => {
  const RowRender = ({ index, style }) => (
    <div style={style}>
      <Row data={data[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={800}
      itemCount={data.length}
      itemSize={50}
      width="100%"
    >
      {RowRender}
    </FixedSizeList>
  );
};`,
    explanation: 'The before code blocks the main thread completely. The after code uses virtualization to absolute position only the items currently inside the 800px viewport.'
  },
  
  productionChecklist: [
    'Did you test native Ctrl+F / Cmd+F functionality to ensure users are not broken?',
    'Are you using a stable unique `key` for rows to prevent unnecessary diffing?',
    'If using complex cells (e.g. sparklines), are they memoized to avoid re-rendering on scroll?',
    'Is the parent container styled with `overflow-y: auto` to allow the virtual scroller to track scroll events?'
  ],
  commonMistakes: [
    'Passing inline arrow functions to row components, causing the virtual scroller to re-render every row on scroll.',
    'Failing to set a fixed height on the scroll container.',
    'Forgetting to pass the `style` prop down to the row element.'
  ],
  
  relatedExperiments: ['virtualization'],
  relatedBrowserAPIs: ['intersection-observer'],
  relatedAnalyzerRules: ['react-large-map', 'vue-large-v-for'],
  relatedRecipes: ['infinite-scroll', 'dashboard-rendering'],
  
  interviewQuestions: [
    {
      question: 'What is DOM virtualization (windowing), and how does it improve performance for large lists?',
      answer: 'Virtualization restricts DOM rendering to only the items currently visible in the viewport, plus a small buffer. Instead of rendering 10,000 DOM nodes, it renders ~20. It achieves this by listening to scroll events and absolutely positioning the items based on their index and fixed height, drastically reducing memory usage and main thread blocking.'
    }
  ],
  
  references: [
    { title: 'patterns.dev: Virtual Lists', url: 'https://www.patterns.dev/posts/virtual-lists' }
  ],
  
  searchMetadata: {
    keywords: ['table', 'grid', 'datatable', 'large list', 'v-for', '.map'],
    synonyms: ['virtualization', 'windowing', 'slow table'],
    concepts: ['DOM size', 'reconciliation', 'main thread blocking']
  }
}
