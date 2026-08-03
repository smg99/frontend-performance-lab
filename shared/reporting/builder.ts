import type { EnrichedDiagnostic } from '../diagnostics/types'

export interface ReportConfig {
  score: number
  filename?: string
}

export const PerformanceReportBuilder = {
  build(diagnostics: EnrichedDiagnostic[], config: ReportConfig): string {
    const critical = diagnostics.filter(d => d.severity === 'critical')
    const high = diagnostics.filter(d => d.severity === 'high')
    const medium = diagnostics.filter(d => d.severity === 'medium')
    const low = diagnostics.filter(d => d.severity === 'low')

    // Sort issues by line number for deterministic output within severities
    const sortByLine = (a: EnrichedDiagnostic, b: EnrichedDiagnostic) => a.line - b.line
    critical.sort(sortByLine)
    high.sort(sortByLine)
    medium.sort(sortByLine)
    low.sort(sortByLine)

    let md = ''

    // 1. Overall Score
    md += `# Frontend Performance Audit: ${config.filename || 'Source Code'}\n\n`
    md += `## Overall Score: **${config.score} / 100**\n\n`

    // 2. Executive Summary
    md += `## Executive Summary\n\n`
    if (diagnostics.length === 0) {
      md += `This component is highly optimized. No significant performance issues were detected. Keep up the excellent work!\n\n`
    } else {
      md += `We detected ${diagnostics.length} area(s) for improvement, including ${critical.length} critical and ${high.length} high-severity issue(s). Addressing these will measurably improve rendering latency and memory stability.\n\n`
    }

    // 3. Positive Findings
    md += `## Positive Findings\n\n`
    if (diagnostics.length === 0) {
      md += `- Zero architectural anti-patterns detected.\n- Clean memory management.\n- Optimal DOM layout boundaries.\n\n`
    } else if (critical.length === 0 && high.length === 0) {
      md += `- No catastrophic rendering bottlenecks.\n- Memory lifecycle appears stable.\n\n`
    } else {
      md += `*Note: Focus on resolving critical and high-priority issues first to unlock baseline performance.* \n\n`
    }

    // Helper to format issues
    const formatIssues = (title: string, items: EnrichedDiagnostic[]) => {
      if (items.length === 0) return ''
      let sec = `## ${title}\n\n`
      items.forEach((item, index) => {
        sec += `### ${index + 1}. [${item.id}] ${item.title} (Line ${item.line})\n\n`
        sec += `**Category:** ${item.category} | **Confidence:** ${item.confidence.toUpperCase()}\n\n`
        sec += `**Summary:** ${item.summary}\n\n`
        sec += `**Why it matters:** ${item.why}\n\n`
        sec += `**Performance Impact:** ${item.impact}\n\n`
        sec += `**How to verify:** ${item.howToVerify}\n\n`
        sec += `**Recommended Fix:**\n> ${item.recommendedFix}\n\n`

        if (item.references && item.references.length > 0) {
          sec += `**References:**\n`
          item.references.forEach(ref => {
            sec += `- <${ref}>\n`
          })
          sec += '\n'
        }
      })
      return sec
    }

    // 4. Critical, High, Medium, Low Priority Sections
    md += formatIssues('Critical Issues', critical)
    md += formatIssues('High Priority', high)
    md += formatIssues('Medium Priority', medium)
    md += formatIssues('Low Priority', low)

    // 5. Recommended Order of Fixes
    if (diagnostics.length > 0) {
      md += `## Recommended Order of Fixes\n\n`
      const fixes = [...critical, ...high, ...medium, ...low]
      fixes.slice(0, 3).forEach((item, index) => {
        md += `${index + 1}. **Line ${item.line}:** ${item.title}\n`
      })
      md += '\n'
    }

    // 6. Estimated Performance Impact
    md += `## Estimated Performance Impact\n\n`
    if (critical.length > 0 || high.length > 0) {
      md += `Fixing these issues is expected to yield a **Major** improvement in Total Blocking Time (TBT) and runtime responsiveness. You should see a noticeable drop in dropped frames during interaction.\n\n`
    } else if (medium.length > 0) {
      md += `Fixing these issues will provide a **Moderate** improvement, primarily stabilizing edge-case renders and preventing gradual memory bloat.\n\n`
    } else {
      md += `Current performance is optimal. Future improvements will yield diminishing returns.\n\n`
    }

    // 7. Quick Wins vs Long-Term Improvements
    md += `## Strategic Recommendations\n\n`

    // Naive heuristic: high confidence, localized changes = quick win
    const quickWins = diagnostics.filter(
      d => d.confidence === 'high' && d.category !== 'Architecture'
    )
    const longTerm = diagnostics.filter(
      d => d.confidence !== 'high' || d.category === 'Architecture'
    )

    if (quickWins.length > 0) {
      md += `### Quick Wins (High ROI, Low Effort)\n`
      quickWins.forEach(item => {
        md += `- **${item.title}:** ${item.summary}\n`
      })
      md += '\n'
    }

    if (longTerm.length > 0) {
      md += `### Long-Term Improvements (Architecture / Refactoring)\n`
      longTerm.forEach(item => {
        md += `- **${item.title}:** Requires deeper structural changes to ${item.category}.\n`
      })
      md += '\n'
    }

    if (quickWins.length === 0 && longTerm.length === 0 && diagnostics.length === 0) {
      md += `### Quick Wins\n- Maintain current coding standards.\n\n### Long-Term Improvements\n- Continue monitoring bundle size and third-party script impact.\n\n`
    }

    md += `---\n*Report generated by Frontend Performance Lab Analyzer v1.0*`

    return md
  }
}
