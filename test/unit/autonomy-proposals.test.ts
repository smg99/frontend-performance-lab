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

const commonDraft = {
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
  uncertainty: ['Browser support and stable thresholds still require verification.']
}

const draft = {
  kind: 'experiment' as const,
  ...commonDraft,
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

  it('rejects fields that are not part of the proposal or citation schema', () => {
    expect(() =>
      createDraftPullRequest(
        candidate,
        { ...draft, confidenceScore: 0.99 },
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow()
    expect(() =>
      createDraftPullRequest(
        candidate,
        {
          ...draft,
          citations: [{ ...draft.citations[0], sourceExcerpt: 'unverified source text' }]
        },
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow()
  })

  it.each([
    {
      ...commonDraft,
      kind: 'metadata',
      targetEntityId: 'existing-entity'
    },
    {
      ...commonDraft,
      kind: 'browser-api',
      apiName: 'requestAnimationFrame',
      compatibilityQuestions: ['Which browsers support this API?']
    },
    {
      ...commonDraft,
      kind: 'recipe',
      prerequisites: [],
      validationPlan: ['Run the provided measurement']
    }
  ])('rejects unknown fields on the $kind proposal schema', untrustedDraft => {
    expect(() =>
      createDraftPullRequest(candidate, untrustedDraft, { existingIds: [], existingTitles: [] })
    ).not.toThrow()
    expect(() =>
      createDraftPullRequest(
        candidate,
        { ...untrustedDraft, unknownMetadata: true },
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow()
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

  it('rejects duplicate IDs generated within the same discovery run', () => {
    const secondCandidate = {
      ...candidate,
      id: 'vue-blog:entry:other',
      evidenceUrl: 'https://blog.vuejs.org/entry',
      evidenceTitle: 'Rendering measurements in Vue'
    }
    const discoveryRun: DiscoveryRun = {
      checkedSources: 2,
      candidates: [candidate, secondCandidate],
      errors: [],
      state: { sources: {}, seenCandidateIds: [candidate.id, secondCandidate.id] }
    }

    expect(() =>
      createDraftPullRequestsFromDiscovery(
        discoveryRun,
        candidateItem => ({
          ...draft,
          citations: [{ ...draft.citations[0], evidenceUrl: candidateItem.evidenceUrl }]
        }),
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow('duplicate content id')
  })

  it('rejects duplicate titles generated within the same discovery run', () => {
    const secondCandidate = {
      ...candidate,
      id: 'vue-blog:entry:other',
      evidenceUrl: 'https://blog.vuejs.org/entry',
      evidenceTitle: 'Rendering measurements in Vue'
    }
    const discoveryRun: DiscoveryRun = {
      checkedSources: 2,
      candidates: [candidate, secondCandidate],
      errors: [],
      state: { sources: {}, seenCandidateIds: [candidate.id, secondCandidate.id] }
    }

    expect(() =>
      createDraftPullRequestsFromDiscovery(
        discoveryRun,
        candidateItem => ({
          ...draft,
          id: candidateItem === candidate ? draft.id : 'another-rendering-metric',
          title: candidateItem === candidate ? draft.title : '  RENDERING   METRIC MEASUREMENT  ',
          citations: [{ ...draft.citations[0], evidenceUrl: candidateItem.evidenceUrl }]
        }),
        { existingIds: [], existingTitles: [] }
      )
    ).toThrow('duplicate content title')
  })
})
