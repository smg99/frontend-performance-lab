import type { ExperimentManifest } from '@schemas/index'
import { examples } from './examples'
import { references } from './references'

const manifest: ExperimentManifest = {
  id: 'reactivity',
  version: '1.0.0',
  status: 'stable',
  lastUpdated: new Date().toISOString(),
  title: 'Vue Reactivity System',
  description: 'An interactive deep dive into Vue 3\'s Proxy-based reactivity engine.',
  difficulty: 'Advanced',
  estimatedReadingTime: 12,
  tags: ['vue', 'reactivity', 'proxy', 'performance'],
  topics: ['reactivity'],
  browserAPIs: ['Proxy', 'Reflect', 'WeakMap'],
  relationships: [],
  sections: [
    {
      id: 'what-is-it',
      title: 'What is it?',
      type: 'concept',
      order: 1,
      content: 'Vue 3\'s reactivity system is built on JavaScript ES6 Proxies. It intercepts read and write operations to variables, allowing Vue to track dependencies (which components read the data) and automatically trigger updates when the data changes.'
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      type: 'concept',
      order: 2,
      content: 'When you wrap an object in `reactive()` or `ref()`, Vue returns a Proxy. When a component render function accesses a property (a "GET"), Vue records that component as a dependency. When you mutate the property (a "SET"), Vue notifies all recorded dependencies to re-render.'
    },
    {
      id: 'recommendation',
      title: 'Recommendation',
      type: 'recommendation',
      order: 3,
      content: {
        approach: 'Standardize on using ref() for almost all reactive state.',
        reasoning: 'While reactive() is slightly cleaner (no .value), it has severe limitations: it only works on objects, and you lose reactivity if you destructure it or reassign the entire object. ref() is universally consistent and makes reactivity explicit.'
      }
    },
    {
      id: 'interview-1',
      title: 'Interview Question: Computed vs Method',
      type: 'interview',
      order: 4,
      content: 'A computed property is cached based on its reactive dependencies. It will only re-evaluate when its dependencies change. A method will re-evaluate every single time the component re-renders, which can cause severe performance issues if the calculation is heavy.'
    },
    {
      id: 'interview-2',
      title: 'Interview Question: Proxies vs Object.defineProperty',
      type: 'interview',
      order: 5,
      content: 'Proxies can intercept operations on the entire object, allowing Vue 3 to detect property additions, deletions, and Array index modifications dynamically. Object.defineProperty requires walking the object upfront and attaching getters/setters to existing keys only.'
    },
    {
      id: 'pro-tips',
      title: 'Pro Tips',
      type: 'tip',
      order: 6,
      content: [
        'Avoid deeply nested reactive objects if possible. The deeper the proxy, the more overhead it takes to traverse and update.',
        'Use `shallowRef` for large arrays or objects where you only plan to replace the entire object, not mutate its individual properties. This saves massive performance overhead.'
      ]
    },
    ...examples
  ],
  benchmarks: [],
  references
}

export default manifest
