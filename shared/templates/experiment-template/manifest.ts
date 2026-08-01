import type { ExperimentManifest } from '@schemas/index'
// import { examples } from './examples'
import { references } from './references'
import { benchmarks } from './benchmarks'

const manifest: ExperimentManifest = {
  id: 'experiment-template',
  version: '1.0.0',
  status: 'draft',
  lastUpdated: new Date().toISOString(),
  title: 'Experiment Template',
  description: 'A brief description of what this experiment tests or teaches.',
  difficulty: 'Beginner',
  estimatedReadingTime: 5,
  tags: ['template'],
  topics: ['performance'],
  browserAPIs: [],
  relationships: [],
  sections: [
    {
      id: 'what-is-it',
      title: 'What is it?',
      type: 'concept',
      order: 1,
      content: 'Explain the concept here.'
    }
  ],
  benchmarks,
  references
}

export default manifest
