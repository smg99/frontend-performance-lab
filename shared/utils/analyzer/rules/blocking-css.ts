/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

/**
 * Blocking CSS
 * Detects <link rel="stylesheet"> elements that are render-blocking. A stylesheet is considered blocking if it lacks `media="print"` (often used for non-blocking CSS patterns) or `disabled`.
 */
export const blockingCss: ASTRule = {
  id: 'blocking-css',
  title: 'Render-Blocking CSS',
  description:
    'Synchronous CSS stylesheets block the browser from rendering the page until the CSS is downloaded and parsed.',
  severity: 'Warning',
  browserImpact: { rendering: true, memory: false, cpu: false, cwv: true },
  category: 'Performance',
  frameworks: ['react', 'vue', 'html'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx', 'html'],
  relatedExperiments: ['performance'],
  browserAPIs: [],
  impact: 'Delays First Contentful Paint (FCP) and Largest Contentful Paint (LCP).',
  fix: 'Inline critical CSS and load non-critical CSS asynchronously (e.g. `media="print" onload="this.media=\'all\'"`).',
  confidence: {
    score: 80,
    reasoning:
      'Detects link elements with rel="stylesheet" lacking media="print". Cannot determine if CSS is genuinely critical.',
    falsePositiveRisk: 'Medium'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<Issue, keyof any>[] = []
    traverse(ast, {
      JSXOpeningElement(path: any) {
        const nameNode = path.node.name
        if (nameNode && nameNode.name === 'link') {
          let isStylesheet = false
          let isNonBlocking = false

          for (const attr of path.node.attributes) {
            if (
              attr.name &&
              attr.name.name === 'rel' &&
              attr.value &&
              attr.value.value === 'stylesheet'
            ) {
              isStylesheet = true
            }
            if (
              attr.name &&
              attr.name.name === 'media' &&
              attr.value &&
              attr.value.value === 'print'
            ) {
              isNonBlocking = true
            }
            // Add check for standard Next.js Head implementations where stylesheets are optimized, but standard link tags in body might not be.
          }
          if (isStylesheet && !isNonBlocking) {
            issues.push({ lineNumbers: [path.node.loc.start.line] })
          }
        }
      }
    })
    return issues
  }
}
