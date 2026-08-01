import type { ExperimentManifest } from '@schemas/index'
import { examples } from './examples'
import { references } from './references'

const manifest: ExperimentManifest = {
  id: 'virtualization',
  version: '1.0.0',
  status: 'stable',
  lastUpdated: new Date().toISOString(),
  title: 'Rendering Virtualization',
  description: 'Compare different strategies for rendering massive lists.',
  difficulty: 'Intermediate',
  estimatedReadingTime: 10,
  tags: ['rendering', 'virtualization', 'dom', 'performance'],
  topics: ['virtualization'],
  browserAPIs: ['requestAnimationFrame'],
  relationships: [],
  sections: [
    {
      id: 'what-is-it',
      title: 'What is it?',
      type: 'concept',
      order: 1,
      content: 'List virtualization (or windowing) is the technique of rendering only the items that are currently visible within the scrolling viewport, rather than rendering the entire dataset to the DOM at once.'
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      type: 'concept',
      order: 2,
      content: 'Instead of creating 100,000 DOM nodes, a virtual list calculates the height of all items, creates a massive scrolling container, and absolutely positions a tiny subset of nodes (e.g. 20) inside the visible area. As you scroll, those same 20 nodes are constantly repositioned and recycled with new data.'
    },
    {
      id: 'recommendation',
      title: 'Recommendation',
      type: 'recommendation',
      order: 3,
      content: {
        approach: 'Use an established library like @vueuse/core (useVirtualList) for standard lists.',
        reasoning: 'Virtualization is incredibly difficult to get right (handling variable item heights, scroll anchoring, accessibility). Established libraries solve these edge cases for you.'
      }
    },
    {
      id: 'interview-1',
      title: 'Interview Question: What causes the performance drop when rendering 100,000 items?',
      type: 'interview',
      order: 4,
      content: 'The browser has to allocate memory for 100k DOM objects, parse their CSS rules, and calculate Layout for all of them synchronously. The JS heap balloons, and the main thread blocks for several seconds.'
    },
    {
      id: 'interview-2',
      title: 'Interview Question: How do virtual lists handle scrolling without losing the scrollbar size?',
      type: 'interview',
      order: 5,
      content: 'They calculate the total theoretical height of all items (e.g. 100k * 50px = 5M px) and place a hidden spacer div of that height inside the container. This forces the browser to draw an accurate scrollbar.'
    },
    {
      id: 'pro-tips',
      title: 'Pro Tips',
      type: 'tip',
      order: 6,
      content: [
        'Always provide a `key` binding when recycling DOM nodes in Vue to prevent state collision.',
        'Use CSS `content-visibility: auto` as a quick alternative to JS virtualization for offscreen content.',
        'Ensure you render a small "buffer" of items above and below the viewport to prevent white flashes when scrolling fast.'
      ]
    },
    ...examples
  ],
  benchmarks: [],
  references
}

export default manifest
