import type { ExperimentManifest } from '@schemas/index'
import { examples } from './examples'
import { references } from './references'

const manifest: ExperimentManifest = {
  id: 'rendering',
  version: '1.0.0',
  status: 'stable',
  lastUpdated: new Date().toISOString(),
  title: 'CSS & Paint Rendering',
  description: 'Understand the Browser Rendering Pipeline (Style -> Layout -> Paint -> Composite).',
  difficulty: 'Intermediate',
  estimatedReadingTime: 8,
  tags: ['rendering', 'css', 'layout-thrashing', 'performance'],
  topics: ['rendering'],
  browserAPIs: ['requestAnimationFrame'],
  relationships: [],
  sections: [
    {
      id: 'what-is-it',
      title: 'What is it?',
      type: 'concept',
      order: 1,
      content: 'The browser rendering pipeline converts HTML/CSS into pixels on the screen. Changing certain CSS properties triggers different parts of the pipeline.'
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      type: 'concept',
      order: 2,
      content: 'Changing `width` or `margin` triggers Layout (expensive). Changing `color` triggers Paint. Changing `transform` or `opacity` triggers only Composite (cheap, hardware accelerated).'
    },
    {
      id: 'recommendation',
      title: 'Recommendation',
      type: 'recommendation',
      order: 3,
      content: {
        approach: 'Only animate `transform` and `opacity`.',
        reasoning: 'These two properties are handed off directly to the GPU on a separate compositor thread, ensuring smooth 60fps animations even if the main thread is blocked.'
      }
    },
    ...examples
  ],
  benchmarks: [],
  references
}

export default manifest
