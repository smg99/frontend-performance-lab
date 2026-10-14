import { describe, expect, it } from 'vitest'
import { formatDiscoveryReport } from '../../autonomy/discovery-report'
import type { DiscoveryRun } from '../../autonomy/discovery'

const discoveryRun: DiscoveryRun = {
  checkedSources: 1,
  candidates: [
    {
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
  ],
  errors: [{ sourceId: 'vue-blog', message: 'HTTP 503' }],
  state: { sources: {}, seenCandidateIds: [] }
}

describe('autonomous discovery report', () => {
  it('prints the exact candidate ID and evidence details needed to author a proposal', () => {
    const report = formatDiscoveryReport(discoveryRun)

    expect(report).toContain('`web-dev:entry:hash`')
    expect(report).toContain('[Measuring a new rendering metric](https://web.dev/articles/example)')
    expect(report).toContain('Google web.dev; vendor-guidance; score 40')
    expect(report).toContain('2026-09-20; new-entry')
    expect(report).toContain('evidence `evidence-hash`')
  })

  it('reports empty candidate and source error states without hiding the failure', () => {
    const report = formatDiscoveryReport({
      ...discoveryRun,
      candidates: []
    })

    expect(report).toContain('- No new candidates.')
    expect(report).toContain('- vue-blog: HTTP 503')
  })

  it('escapes source titles so they cannot inject links or report entries', () => {
    const report = formatDiscoveryReport({
      ...discoveryRun,
      candidates: [
        {
          ...discoveryRun.candidates[0],
          evidenceTitle: 'Metric](https://attacker.example)\n- fabricated entry'
        }
      ]
    })

    expect(report).not.toContain('[Metric](https://attacker.example)')
    expect(report).not.toContain('\n- fabricated entry')
    expect(report).toContain('](https://web.dev/articles/example)')
  })
})
