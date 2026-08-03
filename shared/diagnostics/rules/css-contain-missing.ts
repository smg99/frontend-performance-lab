import type { DiagnosticDefinition } from '../types'

export const cssContainMissing: DiagnosticDefinition = {
  id: 'css-contain-missing',
  title: 'CSS `contain` Optimization Missing',
  category: 'Performance',
  severity: 'medium',
  confidence: 'medium',
  summary:
    'A large element with many children is missing the CSS `contain` property.',
  why: 'When a large container with many descendants lacks CSS `contain`, any style or layout changes within it can trigger expensive, page-wide reflows.',
  impact:
    'Increased layout thrashing and slower rendering performance during dynamic updates.',
  howToVerify:
    'Use Chrome DevTools Performance panel to record layout recalculations and check if scope could be reduced by applying CSS `contain`.',
  recommendedFix:
    'Add `contain: content;` (or strict/layout) to the parent element\'s CSS.',
  references: [
    'https://developer.mozilla.org/en-US/docs/Web/CSS/contain'
  ],
  framework: 'universal',
  ruleVersion: '1.0.0'
}
