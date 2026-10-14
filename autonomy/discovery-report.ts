import type { DiscoveryRun } from './discovery'

function escapeMarkdown(value: string) {
  return value
    .replace(/[\r\n]+/g, ' ')
    .replaceAll('\\', '\\\\')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
}

export function formatDiscoveryReport(
  result: Pick<DiscoveryRun, 'checkedSources' | 'candidates' | 'errors'>
) {
  const lines = [
    '# Autonomous discovery report',
    '',
    `- Sources checked: ${result.checkedSources}`,
    `- New candidates: ${result.candidates.length}`,
    `- Source errors: ${result.errors.length}`,
    '',
    '## Candidates',
    '',
    ...(result.candidates.length
      ? result.candidates.map(
          candidate =>
            `- \`${candidate.id}\`: [${escapeMarkdown(candidate.evidenceTitle)}](${candidate.evidenceUrl}) — ${candidate.publisher}; ${candidate.evidenceType}; score ${candidate.relevanceScore}; ${candidate.matchedTopics.join(', ') || 'no topic match'}; ${candidate.publishedAt ?? 'publication date unavailable'}; ${candidate.reason}; evidence \`${candidate.evidenceHash}\``
        )
      : ['- No new candidates.']),
    '',
    '## Errors',
    '',
    ...(result.errors.length
      ? result.errors.map(error => `- ${error.sourceId}: ${error.message}`)
      : ['- None.'])
  ]
  return `${lines.join('\n')}\n`
}
