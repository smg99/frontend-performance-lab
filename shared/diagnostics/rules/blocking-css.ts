import type { DiagnosticDefinition } from '../types'

export const blockingCss: DiagnosticDefinition = {
  id: 'blocking-css',
  title: 'Render-Blocking CSS',
  category: 'Performance',
  severity: 'high',
  confidence: 'high',
  summary:
    'A CSS stylesheet is linked synchronously without `media="print"` or `async` behavior, blocking page rendering.',
  why: 'Browsers halt HTML parsing and rendering until all synchronous stylesheets are downloaded and parsed, delaying First Contentful Paint.',
  impact: 'Significantly slower First Contentful Paint (FCP) and Largest Contentful Paint (LCP).',
  howToVerify:
    'Check the Network tab and Lighthouse report for "Eliminate render-blocking resources".',
  recommendedFix:
    'Inline critical CSS into the `<head>` and load non-critical CSS asynchronously (e.g., using `media="print" onload="this.media=\'all\'"`).',
  references: ['https://web.dev/render-blocking-css/'],
  framework: 'universal',
  ruleVersion: '1.0.0'
}
