import type { ExperimentManifest } from '@schemas/index'
import { examples } from './examples'
import { references } from './references'

const manifest: ExperimentManifest = {
  id: 'memory-vitals',
  version: '1.0.0',
  status: 'stable',
  lastUpdated: new Date().toISOString(),
  title: 'Memory & Web Vitals',
  description: 'Understand memory leaks and Core Web Vitals.',
  difficulty: 'Beginner',
  estimatedReadingTime: 5,
  tags: ['memory', 'vitals', 'performance'],
  topics: ['memory', 'vitals'],
  browserAPIs: ['PerformanceObserver'],
  relationships: [],
  sections: [
    {
      id: 'what-is-it',
      title: 'What is it?',
      type: 'concept',
      order: 1,
      content: 'Memory management in JS is automatic via Garbage Collection. Web Vitals are Google\'s metrics for user experience (LCP, FID, CLS).'
    },
    ...examples
  ],
  benchmarks: [],
  references
}

export default manifest
