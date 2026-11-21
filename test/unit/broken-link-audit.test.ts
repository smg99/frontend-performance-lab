import { describe, expect, it, vi } from 'vitest'
import { auditUrls, collectLinkEntries, type LinkEntry } from '../../shared/audit/broken-links'

describe('broken-link audit', () => {
  it('deduplicates URLs and reports failures deterministically', async () => {
    const fetchImpl = vi.fn(async (url: string) => ({
      ok: url.endsWith('/ok'),
      status: url.endsWith('/ok') ? 200 : 404
    })) as typeof fetch

    const entries: LinkEntry[] = [
      { url: 'https://example.com/z', source: 'b' },
      { url: 'https://example.com/ok', source: 'a' },
      { url: 'https://example.com/z', source: 'c' }
    ]

    const report = await auditUrls(entries, fetchImpl)

    expect(report.checked).toBe(2)
    expect(report.failures.map(failure => failure.url)).toEqual(['https://example.com/z'])
    expect(report.failures[0].sources).toEqual(['b', 'c'])
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('falls back from HEAD to GET when HEAD is unsupported', async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === 'HEAD') return { ok: false, status: 405 }
      return { ok: true, status: 200 }
    }) as typeof fetch

    const report = await auditUrls([{ url: 'https://example.com/page', source: 'test' }], fetchImpl)

    expect(report.failures).toEqual([])
    expect(fetchImpl.mock.calls.map(call => call[1]?.method)).toEqual(['HEAD', 'GET'])
  })

  it('collects provenance and manifest references without duplicates', () => {
    const entries = collectLinkEntries(
      [{ references: [{ title: 'Reference', url: 'https://example.com/shared' }] }],
      { 'experiment:one': { canonicalUrl: 'https://example.com/shared' } }
    )

    expect(entries).toEqual([
      {
        url: 'https://example.com/shared',
        source: 'experiment:one, manifest reference'
      }
    ])
  })
})
