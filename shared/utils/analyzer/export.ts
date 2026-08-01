import type { ReviewReport } from '../../schemas/analyzer'

export function generateJSONReport(report: ReviewReport): string {
  return JSON.stringify(report, null, 2)
}

export function generateMarkdownReport(report: ReviewReport): string {
  let md = `# Performance Review Report\n\n`
  md += `**Overall Grade**: ${report.overallScore}\n`
  md += `**Performance Score**: ${report.performanceScore}/100\n`
  md += `**Confidence Score**: ${report.confidenceScore}%\n\n`

  md += `## Estimates\n`
  md += `- Performance Gain: ${report.estimates.performanceGain}\n`
  md += `- Memory Reduction: ${report.estimates.memoryReduction}\n`
  md += `- Rendering Improvement: ${report.estimates.renderingImprovement}\n`
  md += `- Time to Fix: ${report.estimates.timeToFix}\n\n`

  md += `## Issues (${report.issues.length})\n\n`

  report.issues.forEach((issue, idx) => {
    md += `### ${idx + 1}. [${issue.severity}] ${issue.title}\n`
    md += `**Category**: ${issue.category}\n`
    md += `**Impact**: ${issue.impact}\n\n`

    md += `#### Explain Like Browser\n`
    md += `**What Happened:** ${issue.explanation.whatHappened}\n\n`
    md += `**Why:** ${issue.explanation.whyBrowserBehavesThisWay}\n\n`

    md += `#### Auto Fix\n`
    md += `**Bad Code**:\n\`\`\`javascript\n${issue.autoFix.badCode}\n\`\`\`\n\n`
    md += `**Recommended**:\n\`\`\`javascript\n${issue.autoFix.recommendedCode}\n\`\`\`\n\n`
    md += `**Why Faster**: ${issue.autoFix.whyFaster}\n\n`

    md += `---\n\n`
  })

  md += `_Report Hash: \`${report.reportHash}\`_\n`

  return md
}

export function generateHTMLReport(report: ReviewReport): string {
  // A simple zero-dependency HTML wrapper with basic CSS
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Performance Review Report</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-w-4xl; margin: 0 auto; padding: 2rem; background: #f9fafb; }
  .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  h1 { color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
  h2 { color: #374151; margin-top: 2rem; }
  h3 { color: #4b5563; margin-top: 1.5rem; }
  h4 { color: #6b7280; font-size: 1rem; margin-bottom: 0.5rem; }
  pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 6px; overflow-x: auto; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875em; }
  .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; background: #fee2e2; color: #991b1b; }
</style>
</head>
<body>
<div class="container">
  <h1>Performance Review Report</h1>
  <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
    <div><strong>Grade:</strong> <span style="font-size: 1.5rem;">${report.overallScore}</span></div>
    <div><strong>Score:</strong> <span style="font-size: 1.5rem;">${report.performanceScore}/100</span></div>
  </div>
  
  <h2>Estimates</h2>
  <ul>
    <li><strong>Performance Gain:</strong> ${report.estimates.performanceGain}</li>
    <li><strong>Memory Reduction:</strong> ${report.estimates.memoryReduction}</li>
    <li><strong>Rendering Improvement:</strong> ${report.estimates.renderingImprovement}</li>
    <li><strong>Time to Fix:</strong> ${report.estimates.timeToFix}</li>
  </ul>
  
  <h2>Issues (${report.issues.length})</h2>
  ${report.issues
    .map(
      issue => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
      <h3><span class="badge">${issue.severity}</span> ${issue.title}</h3>
      <p><strong>Impact:</strong> ${issue.impact}</p>
      
      <h4>Explain Like Browser</h4>
      <p><strong>What:</strong> ${issue.explanation.whatHappened}</p>
      <p><strong>Why:</strong> ${issue.explanation.whyBrowserBehavesThisWay}</p>
      
      <h4>Auto Fix</h4>
      <p><strong>Bad Code:</strong></p>
      <pre><code>${issue.autoFix.badCode}</code></pre>
      <p><strong>Recommended:</strong></p>
      <pre><code>${issue.autoFix.recommendedCode}</code></pre>
      <p><em>${issue.autoFix.whyFaster}</em></p>
    </div>
  `
    )
    .join('')}
  
  <p style="margin-top: 3rem; text-align: center; color: #9ca3af; font-size: 0.875rem;">
    Report Hash: <code>${report.reportHash}</code>
  </p>
</div>
</body>
</html>`
}
