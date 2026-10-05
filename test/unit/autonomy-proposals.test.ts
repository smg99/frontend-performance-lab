import { describe, expect, it } from 'vitest'
import type { DiscoveryCandidate, DiscoveryRun } from '../../autonomy/discovery'
import {
  createDraftPullRequest,
  createDraftPullRequestsFromDiscovery
} from '../../autonomy/proposals'

const candidate: DiscoveryCandidate = {
  id: 'web-dev:entry:hash',
  sourceId: 'web-dev',
  sourceFeedUrl: 'https://web.dev/feed.xml',
  evidenceUrl: 'https://web.dev/articles/example',
  evidenceTitle: 'Measuring a new rendering metric',
  publisher: 'Google web.dev',
  evidenceType: 'vendor-guidance',
  publishedAt: '2026-09-20',
  matchedTopics: ['performance'],
  relevanceScore: 40,
  evidenceHash: 'evidence-hash',
  sourceContentHash: 'source-hash',
  discoveredAt: '2026-09-20T00:00:00.000Z',
  reason: 'new-entry'
}

const draft = {
  kind: 'experiment' as const,
  id: 'rendering-metric',
  title: 'Rendering metric measurement',
  summary:
    'A controlled lab exercise that compares the metric under repeatable rendering workloads.',
  tags: ['rendering', 'measurement'],
  citations: [
    {
      claim: 'The metric can be captured during rendering tests.',
      evidenceUrl: candidate.evidenceUrl,
      confidence: 'medium' as const
    }
  ],
  uncertainty: ['Browser support and stable thresholds still require verification.'],
  hypothesis: 'The new metric identifies rendering delays that existing aggregate metrics obscure.',
  metrics: ['new rendering metric', 'LCP']
}

describe('autonomous proposal policy', () => {
  it('converts a discovery into a deterministic, review-only draft PR payload', () => {
    const first = createDraftPullRequest(candidate, draft, { existingIds: [], existingTitles: [] })
    const second = createDraftPullRequest(candidate, draft, { existingIds: [], existingTitles: [] })
    expect(first).toEqual(second)
    expect(first.draft).toBe(true)
    expect(first.labels).toContain('human-review-required')
    expect(first.body).toContain(candidate.evidenceHash)
    expect(first.files[0].path).toBe('autonomy/proposals/experiment/rendering-metric.json')
  })

  it('blocks unsupported claims and missing citations', () => {
    expect(() =>
      createDraftPullRequest(
        candidate,
        { ...draft, citations: [] },
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow()
    expect(() =>
      createDraftPullRequest(
        candidate,
        {
          ...draft,
          citations: [{ ...draft.citations[0], evidenceUrl: 'https://example.com/other' }]
        },
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow('unsupported claim')
  })

  it('blocks duplicate and source-paraphrase-only drafts', () => {
    expect(() =>
      createDraftPullRequest(candidate, draft, { existingIds: [draft.id], existingTitles: [] })
    ).toThrow('duplicate content id')
    expect(() =>
      createDraftPullRequest(
        candidate,
        { ...draft, summary: candidate.evidenceTitle },
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow()
  })

  it('builds one review-only draft payload per discovery candidate', () => {
    const discoveryRun: DiscoveryRun = {
      checkedSources: 1,
      candidates: [candidate],
      errors: [],
      state: { sources: {}, seenCandidateIds: [candidate.id] }
    }

    const payloads = createDraftPullRequestsFromDiscovery(discoveryRun, () => draft, {
      existingIds: [],
      existingTitles: []
    })

    expect(payloads).toHaveLength(1)
    expect(payloads[0].files[0].path).toBe('autonomy/proposals/experiment/rendering-metric.json')
    expect(payloads[0].draft).toBe(true)
  })
})
