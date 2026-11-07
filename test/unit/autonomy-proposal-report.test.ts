import { describe, expect, it } from 'vitest'
import { createDraftPullRequest } from '../../autonomy/proposals'
import { formatProposalPayloadReport } from '../../autonomy/proposal-report'

const candidate = {
  id: 'web-dev:entry:hash',
  sourceId: 'web-dev',
  sourceFeedUrl: 'https://web.dev/feed.xml',
  evidenceUrl: 'https://web.dev/articles/example',
  evidenceTitle: 'Measuring a new rendering metric',
  publisher: 'Google web.dev',
  evidenceType: 'vendor-guidance' as const,
  publishedAt: '2026-09-20',
  matchedTopics: ['performance'],
  relevanceScore: 40,
  evidenceHash: 'evidence-hash',
  sourceContentHash: 'source-hash',
  discoveredAt: '2026-09-20T00:00:00.000Z',
  reason: 'new-entry' as const
}

const draft = {
  kind: 'experiment' as const,
  id: 'rendering-measurement',
  title: 'Rendering measurement',
  summary: 'A controlled lab exercise comparing repeatable rendering workloads.',
  tags: ['rendering', 'measurement'],
  citations: [
    {
      claim: 'The metric can be captured during rendering tests.',
      evidenceUrl: candidate.evidenceUrl,
      confidence: 'medium' as const
    }
  ],
  uncertainty: ['Browser support and stable thresholds still require verification.'],
  hypothesis: 'The metric identifies rendering delays that existing aggregate metrics obscure.',
  metrics: ['new rendering metric', 'LCP']
}

describe('autonomous proposal report', () => {
  it('prints every prepared draft with its exact candidate evidence and payload path', () => {
    const payload = createDraftPullRequest(candidate, draft, {
      existingIds: [],
      existingTitles: []
    })

    expect(formatProposalPayloadReport([payload])).toBe(
      [
        '# Prepared proposal payloads',
        '',
        '- Prepared proposals: 1',
        '',
        '## Review before publishing',
        '',
        `- ${payload.title}`,
        `  - Candidate: ${candidate.id}`,
        `  - Evidence: ${candidate.evidenceUrl}`,
        `  - Evidence hash: ${candidate.evidenceHash}`,
        `  - Payload: ${payload.files[0].path}`,
        ''
      ].join('\n')
    )
  })

  it('clearly reports an empty preparation result', () => {
    expect(formatProposalPayloadReport([])).toContain('- No review-only proposals were prepared.')
  })
})
