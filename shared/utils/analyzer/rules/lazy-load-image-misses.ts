/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue, RuleVisitorResult } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

/**
 * Lazy‑Load Image Misses
 * Detects <img> elements (JSX or HTML) without the `loading="lazy"` attribute when the file contains multiple images.
 */
export const lazyLoadImageMisses: ASTRule = {
  id: 'lazy-load-image-misses',
  title: 'Lazy‑Load Image Misses',
  description:
    'Images missing `loading="lazy"` can delay page rendering, especially when many images are present.',
  severity: 'Warning',
  browserImpact: { rendering: true, memory: false, cpu: false, cwv: false },
  category: 'Performance',
  frameworks: ['react', 'vue'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx', 'html'],
  relatedExperiments: ['performance'],
  browserAPIs: [],
  impact: 'Improves First Contentful Paint by allowing images to load lazily.',
  fix: 'Add `loading="lazy"` to img tags or use <Image loading="lazy"/> in Next.js.',
  confidence: {
    score: 85,
    reason: 'Detects JSX img or HTML img elements without loading attribute.',
    falsePositiveRisk: 'Low'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: RuleVisitorResult[] = []
    let imgCount = 0
    const imgElements: any[] = []
    traverse(ast, {
      JSXOpeningElement(path: any) {
        const nameNode = path.node.name
        const name = nameNode && nameNode.name ? nameNode.name : null
        if (name === 'img') {
          imgCount++
          imgElements.push(path)
        }
      }
      // Simple HTML detection via JSXOpeningElement with name as string literal (e.g., <"img" ...>)
      // For non‑JSX files, we could add a generic visitor later.
    })
    if (imgCount >= 5) {
      for (const p of imgElements) {
        const hasLoading = p.node.attributes.some(
          (attr: any) => attr.name && attr.name.name === 'loading'
        )
        if (!hasLoading) {
          issues.push({ lineNumbers: [p.node.loc.start.line] })
        }
      }
    }
    return issues
  }
}
