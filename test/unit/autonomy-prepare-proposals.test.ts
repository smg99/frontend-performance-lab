import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { prepareProposalPayloads } from '../../autonomy/prepare-proposals'

const candidate = {
  id: 'web-dev-feed:entry:hash',
  sourceId: 'web-dev-feed',
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
  kind: 'experiment',
  id: 'rendering-measurement',
  title: 'Rendering measurement',
  summary: 'A controlled lab exercise comparing repeatable rendering workloads.',
  tags: ['rendering', 'measurement'],
  citations: [
    {
      claim: 'The metric can be captured during rendering tests.',
      evidenceUrl: candidate.evidenceUrl,
      confidence: 'medium'
    }
  ],
  uncertainty: ['Browser support and stable thresholds still require verification.'],
  hypothesis: 'The metric identifies rendering delays that existing aggregate metrics obscure.',
  metrics: ['new rendering metric', 'LCP']
}

const context = { existingIds: [], existingTitles: [] }

describe('autonomous proposal preparation', () => {
  let outputDirectory = ''

  beforeEach(() => {
    outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'fpl-proposal-preparation-'))
  })

  afterEach(() => {
    fs.rmSync(outputDirectory, { recursive: true, force: true })
  })

  function writeInputs(authoredDraft: unknown) {
    fs.writeFileSync(
      path.join(outputDirectory, 'discovery-report.json'),
      JSON.stringify({ candidates: [candidate] })
    )
    fs.writeFileSync(
      path.join(outputDirectory, 'proposal-drafts.json'),
      JSON.stringify([{ candidateId: candidate.id, draft: authoredDraft }])
    )
  }

  it('writes validated review-only payloads for explicitly authored drafts', () => {
    writeInputs(draft)

    const payloads = prepareProposalPayloads(outputDirectory, context)

    expect(payloads).toHaveLength(1)
    expect(payloads[0].draft).toBe(true)
    expect(
      JSON.parse(fs.readFileSync(path.join(outputDirectory, 'proposal-payloads.json'), 'utf8'))
    ).toEqual(payloads)
  })

  it('removes a previous payload before rejecting invalid authored content', () => {
    const payloadsPath = path.join(outputDirectory, 'proposal-payloads.json')
    fs.writeFileSync(payloadsPath, '[{"stale":true}]')
    writeInputs({ ...draft, citations: [] })

    expect(() => prepareProposalPayloads(outputDirectory, context)).toThrow()
    expect(fs.existsSync(payloadsPath)).toBe(false)
  })
})
