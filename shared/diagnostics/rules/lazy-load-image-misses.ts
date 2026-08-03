import type { DiagnosticDefinition } from '../types'

export const lazyLoadImageMisses: DiagnosticDefinition = {
  id: 'lazy-load-image-misses',
  title: 'Lazy-Load Image Misses',
  category: 'Performance',
  severity: 'medium',
  confidence: 'high',
  summary:
    'Images are missing the `loading="lazy"` attribute on a page with multiple images.',
  why: 'Without `loading="lazy"`, all images download immediately, competing for network bandwidth and delaying First Contentful Paint.',
  impact:
    'Slower First Contentful Paint, increased network bandwidth usage on load.',
  howToVerify:
    'Check Network tab in DevTools on page load and ensure below-the-fold images are only fetched when scrolled into view.',
  recommendedFix:
    'Add `loading="lazy"` to `<img>` tags, or use framework-specific image components like `<Image loading="lazy" />`.',
  references: [
    'https://web.dev/browser-level-image-lazy-loading/'
  ],
  framework: 'universal',
  ruleVersion: '1.0.0'
}
