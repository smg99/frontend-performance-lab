import type { Section } from '@schemas/index'

export const examples: Section[] = [
  {
    id: 'basic-example',
    title: 'Basic Implementation',
    type: 'example',
    order: 1,
    content: {
      goodCode: `// Optimal implementation here`,
      badCode: `// Suboptimal implementation here`,
      explanation: `Explanation of why the good code is better.`
    }
  }
]
