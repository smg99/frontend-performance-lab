import { describe, expect, it, vi } from 'vitest'
import { runDiscovery, type DiscoveryState } from '../../autonomy/discovery'
import type { DiscoverySource } from '../../autonomy/sources'

const source: DiscoverySource = {
  id: 'test-source',
  name: 'Test',
  url: 'https://example.com/feed.xml',
  evidenceHosts: ['example.com'],
  publisher: 'Example',
  evidenceType: 'official-documentation',
  topics: ['performance', 'core-web-vitals'],
  rateLimit: 'test',
  licenseNote: 'test'
}
const empty: DiscoveryState = { sources: {}, seenCandidateIds: [] }
const feed = (title = 'Faster performance APIs') => `<rss><channel><item>
  <guid>post-1</guid><title>${title}</title><link>https://example.com/post-1</link>
  <pubDate>2026-09-20</pubDate><description>New Core Web Vitals guidance.</description>
</item></channel></rss>`

describe('autonomous discovery', () => {
  it('creates an evidence-linked scored candidate and deduplicates an unchanged rerun', async () => {
    const fetchImpl = async () => new Response(feed(), { status: 200, headers: { etag: 'v1' } })
    const first = await runDiscovery([source], empty, {
      fetchImpl: fetchImpl as typeof fetch,
      now: new Date('2026-09-20')
    })
    const second = await runDiscovery([source], first.state, {
      fetchImpl: fetchImpl as typeof fetch,
      now: new Date('2026-09-21')
    })
    expect(first.candidates).toHaveLength(1)
    expect(first.candidates[0]).toMatchObject({
      evidenceUrl: 'https://example.com/post-1',
      evidenceTitle: 'Faster performance APIs',
      matchedTopics: ['performance', 'core-web-vitals'],
      relevanceScore: 60
    })
    expect(second.candidates).toHaveLength(0)
  })

  it('creates a new immutable candidate when the same entry evidence changes', async () => {
    const original = await runDiscovery([source], empty, {
      fetchImpl: (async () => new Response(feed())) as typeof fetch
    })
    const updated = await runDiscovery([source], original.state, {
      fetchImpl: (async () => new Response(feed('Updated performance APIs'))) as typeof fetch
    })
    expect(updated.candidates).toHaveLength(1)
    expect(updated.candidates[0].reason).toBe('entry-updated')
    expect(updated.candidates[0].id).not.toBe(original.candidates[0].id)
  })

  it('retries transient failures with bounded exponential backoff', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response('busy', { status: 503 }))
      .mockResolvedValueOnce(new Response(feed(), { status: 200 }))
    const sleep = vi.fn().mockResolvedValue(undefined)
    const result = await runDiscovery([source], empty, { fetchImpl, sleep })
    expect(result.errors).toEqual([])
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledWith(250)
  })

  it('records a source failure without producing a candidate', async () => {
    const fetchImpl = async () => new Response('failure', { status: 503 })
    const result = await runDiscovery([source], empty, {
      fetchImpl: fetchImpl as typeof fetch,
      sleep: async () => undefined
    })
    expect(result.candidates).toEqual([])
    expect(result.errors[0]).toEqual({ sourceId: source.id, message: 'HTTP 503' })
  })

  it('rejects non-HTTPS sources before fetching', async () => {
    const result = await runDiscovery([{ ...source, url: 'http://example.com' }], empty)
    expect(result.errors[0].message).toContain('HTTPS')
  })

  it('rejects HTTPS evidence links outside the source evidence allowlist', async () => {
    const untrustedFeed = feed().replace(
      'https://example.com/post-1',
      'https://untrusted.example/post-1'
    )
    const result = await runDiscovery([source], empty, {
      fetchImpl: (async () => new Response(untrustedFeed)) as typeof fetch
    })

    expect(result.candidates).toEqual([])
    expect(result.errors).toEqual([
      {
        sourceId: source.id,
        message: 'entry evidence URL host is not allowlisted: untrusted.example'
      }
    ])
  })

  it('allows evidence hosted on an explicitly configured publisher domain', async () => {
    const publisherSource = { ...source, evidenceHosts: ['docs.example.com'] }
    const publisherFeed = feed().replace(
      'https://example.com/post-1',
      'https://docs.example.com/post-1'
    )
    const result = await runDiscovery([publisherSource], empty, {
      fetchImpl: (async () => new Response(publisherFeed)) as typeof fetch
    })

    expect(result.errors).toEqual([])
    expect(result.candidates[0].evidenceUrl).toBe('https://docs.example.com/post-1')
  })

  it('rejects sources without an evidence host allowlist', async () => {
    const result = await runDiscovery([{ ...source, evidenceHosts: [] }], empty)

    expect(result.errors[0].message).toBe('source evidence host allowlist is empty')
    expect(result.candidates).toEqual([])
  })

  it('rejects non-feed content and oversized responses', async () => {
    const html = await runDiscovery([source], empty, {
      fetchImpl: (async () =>
        new Response('<html></html>', { headers: { 'content-type': 'text/html' } })) as typeof fetch
    })
    const oversized = await runDiscovery([source], empty, {
      fetchImpl: (async () =>
        new Response('x', { headers: { 'content-length': '2000001' } })) as typeof fetch
    })
    expect(html.errors[0].message).toContain('content type')
    expect(oversized.errors[0].message).toContain('size limit')
  })
})
