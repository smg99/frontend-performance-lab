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
        '- draft\\(experiment\\): Rendering measurement',
        `  - Summary: ${draft.summary.replace('.', '\\.')}`,
        '  - Claims:',
        `    - [medium] ${draft.citations[0].claim.replace('.', '\\.')} (evidence: ${candidate.evidenceUrl})`,
        '  - Uncertainty:',
        `    - ${draft.uncertainty[0].replace('.', '\\.')}`,
        `  - Candidate: ${candidate.id}`,
        `  - Evidence: ${candidate.evidenceUrl}`,
        `  - Evidence hash: ${candidate.evidenceHash}`,
        `  - Payload: ${payload.files[0].path}`,
        ''
      ].join('\n')
    )
  })

  it('keeps author-supplied review text on safe, single Markdown lines', () => {
    const unsafeDraft = {
      ...draft,
      title: 'Rendering [guide](https://example.com)',
      summary: 'A controlled summary.\n\n## Forged section',
      citations: [
        {
          ...draft.citations[0],
          claim: 'This claim has **emphasis** and a\nforged list item.'
        }
      ],
      uncertainty: ['Needs checking.\n- Forged checklist item']
    }
    const payload = createDraftPullRequest(candidate, unsafeDraft, {
      existingIds: [],
      existingTitles: []
    })

    const report = formatProposalPayloadReport([payload])

    expect(report).toContain(
      '- draft\\(experiment\\): Rendering \\[guide\\]\\(https://example\\.com\\)'
    )
    expect(report).toContain('  - Summary: A controlled summary\\. \\#\\# Forged section')
    expect(report).toContain(
      `    - [medium] This claim has \\*\\*emphasis\\*\\* and a forged list item\\. (evidence: ${candidate.evidenceUrl})`
    )
    expect(report).toContain('    - Needs checking\\. \\- Forged checklist item')
    expect(report).not.toContain('\n## Forged section')
    expect(report).not.toContain('\n- Forged checklist item')
  })

  it('clearly reports an empty preparation result', () => {
    expect(formatProposalPayloadReport([])).toContain('- No review-only proposals were prepared.')
  })
})
