import type { DiagnosticDefinition } from '../types'

export const reactUnmemoizedContextProvider: DiagnosticDefinition = {
  id: 'react-unmemoized-context-provider',
  title: 'Unmemoized Context Provider Value',
  category: 'Rendering',
  severity: 'high',
  confidence: 'high',
  summary:
    'An inline object, array, or function is passed to a Context.Provider. This breaks memoization for all consumers, causing unnecessary renders.',
  why: 'Context values are checked by reference equality. Inline objects recreate references every render.',
  impact: 'Forces all consumers of this context to re-render, blocking the main thread.',
  howToVerify:
    'Open React DevTools Profiler, check "Record why each component rendered while profiling", and verify consumers no longer re-render unnecessarily.',
  recommendedFix:
    'Wrap the context value in a useMemo (for objects/arrays) or useCallback (for functions) hook.',
  references: [
    'https://react.dev/reference/react/useMemo#skipping-re-rendering-of-components',
    'https://react.dev/learn/passing-data-deeply-with-context'
  ],
  framework: 'react',
  ruleVersion: '1.0.0'
}
