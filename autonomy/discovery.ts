import { createHash } from 'node:crypto'
import type { DiscoverySource } from './sources'

const MAX_RESPONSE_BYTES = 2_000_000
const FETCH_TIMEOUT_MS = 15_000
const MAX_ATTEMPTS = 3
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504])

export interface SourceState {
  contentHash: string
  etag?: string
  lastModified?: string
  checkedAt: string
}

export interface DiscoveryState {
  sources: Record<string, SourceState>
  seenCandidateIds: string[]
}

export interface DiscoveryCandidate {
  id: string
  sourceId: string
  sourceFeedUrl: string
  evidenceUrl: string
  evidenceTitle: string
  publisher: string
  evidenceType: DiscoverySource['evidenceType']
  publishedAt?: string
  matchedTopics: string[]
  relevanceScore: number
  evidenceHash: string
  sourceContentHash: string
  discoveredAt: string
  reason: 'new-entry' | 'entry-updated'
}

export interface DiscoveryRun {
  candidates: DiscoveryCandidate[]
  checkedSources: number
  errors: { sourceId: string; message: string }[]
  state: DiscoveryState
}

interface FeedEntry {
  stableId: string
  title: string
  url: string
  publishedAt?: string
  searchableText: string
}

interface DiscoveryOptions {
  fetchImpl?: typeof fetch
  now?: Date
  sleep?: (milliseconds: number) => Promise<void>
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tagValue(xml: string, names: string[]) {
  for (const name of names) {
    const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))
    if (match) return decodeXml(match[1])
  }
  return undefined
}

function entryLink(xml: string) {
  const atomLink = xml.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1]
  return atomLink ? decodeXml(atomLink) : tagValue(xml, ['link'])
}

function normalizeEvidenceUrl(value: string, sourceUrl: string, evidenceHosts: string[]) {
  const url = new URL(value, sourceUrl)
  if (url.protocol !== 'https:') throw new Error('entry evidence URL must use HTTPS')
  if (!evidenceHosts.includes(url.hostname)) {
    throw new Error(`entry evidence URL host is not allowlisted: ${url.hostname}`)
  }
  url.hash = ''
  return url.toString()
}

function parseFeedEntries(body: string, sourceUrl: string, evidenceHosts: string[]): FeedEntry[] {
  const blocks = body.match(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi) ?? []
  return blocks.map(block => {
    const title = tagValue(block, ['title'])
    const rawUrl = entryLink(block)
    if (!title || !rawUrl) throw new Error('feed entry is missing a title or link')
    const url = normalizeEvidenceUrl(rawUrl, sourceUrl, evidenceHosts)
    const publishedAt = tagValue(block, ['published', 'updated', 'pubDate'])
    const stableId = tagValue(block, ['guid', 'id']) ?? url
    const summary = tagValue(block, ['summary', 'description', 'content']) ?? ''
    return {
      stableId,
      title,
      url,
      publishedAt,
      searchableText: `${title} ${summary}`.toLowerCase()
    }
  })
}

function scoreEntry(entry: FeedEntry, topics: string[]) {
  const matchedTopics = topics.filter(topic => {
    const words = topic
      .toLowerCase()
      .split(/[-\s]+/)
      .filter(word => word.length > 2)
    return words.some(word => entry.searchableText.includes(word))
  })
  return { matchedTopics, relevanceScore: Math.min(100, 20 + matchedTopics.length * 20) }
}

function assertSource(source: DiscoverySource) {
  const url = new URL(source.url)
  if (url.protocol !== 'https:') throw new Error('source URL must use HTTPS')
  if (!source.id || !source.publisher || source.topics.length === 0)
    throw new Error('source metadata is incomplete')
  if (source.evidenceHosts.length === 0) throw new Error('source evidence host allowlist is empty')
}

function assertResponse(source: DiscoverySource, response: Response) {
  const configuredUrl = new URL(source.url)
  const finalUrl = new URL(response.url || source.url)
  if (finalUrl.protocol !== 'https:' || finalUrl.hostname !== configuredUrl.hostname) {
    throw new Error('source redirected outside its allowlisted HTTPS host')
  }
  const contentType = response.headers.get('content-type')?.toLowerCase()
  if (contentType && !/(xml|rss|atom|text\/plain)/.test(contentType))
    throw new Error(`unexpected content type: ${contentType}`)
}

async function fetchWithRetry(
  source: DiscoverySource,
  init: RequestInit,
  fetchImpl: typeof fetch,
  sleep: (milliseconds: number) => Promise<void>
) {
  let response: Response | undefined
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    response = await fetchImpl(source.url, init)
    if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === MAX_ATTEMPTS) return response
    await sleep(250 * 2 ** (attempt - 1))
  }
  return response as Response
}

export async function runDiscovery(
  sources: DiscoverySource[],
  previousState: DiscoveryState,
  options: DiscoveryOptions = {}
): Promise<DiscoveryRun> {
  const fetchImpl = options.fetchImpl ?? fetch
  const sleep =
    options.sleep ?? (milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)))
  const now = (options.now ?? new Date()).toISOString()
  const nextState: DiscoveryState = {
    sources: { ...previousState.sources },
    seenCandidateIds: [...previousState.seenCandidateIds]
  }
  const seen = new Set(nextState.seenCandidateIds)
  const candidates: DiscoveryCandidate[] = []
  const errors: DiscoveryRun['errors'] = []

  for (const source of sources) {
    try {
      assertSource(source)
      const prior = previousState.sources[source.id]
      const headers = new Headers({
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9'
      })
      if (prior?.etag) headers.set('If-None-Match', prior.etag)
      if (prior?.lastModified) headers.set('If-Modified-Since', prior.lastModified)
      const response = await fetchWithRetry(
        source,
        { headers, redirect: 'follow', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
        fetchImpl,
        sleep
      )
      if (response.status === 304 && prior) {
        nextState.sources[source.id] = { ...prior, checkedAt: now }
        continue
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      assertResponse(source, response)
      const contentLength = Number(response.headers.get('content-length') ?? 0)
      if (contentLength > MAX_RESPONSE_BYTES) throw new Error('response exceeds size limit')
      const body = await response.text()
      if (Buffer.byteLength(body) > MAX_RESPONSE_BYTES)
        throw new Error('response exceeds size limit')

      const sourceContentHash = sha256(body)
      if (prior?.contentHash === sourceContentHash) {
        nextState.sources[source.id] = { ...prior, checkedAt: now }
        continue
      }
      const entries = parseFeedEntries(body, source.url, source.evidenceHosts)
      if (entries.length === 0) throw new Error('feed contains no RSS or Atom entries')
      for (const entry of entries) {
        const evidenceHash = sha256(
          JSON.stringify({ title: entry.title, url: entry.url, publishedAt: entry.publishedAt })
        )
        const candidateId = `${source.id}:${sha256(entry.stableId).slice(0, 16)}:${evidenceHash.slice(0, 16)}`
        if (seen.has(candidateId)) continue
        const { matchedTopics, relevanceScore } = scoreEntry(entry, source.topics)
        candidates.push({
          id: candidateId,
          sourceId: source.id,
          sourceFeedUrl: source.url,
          evidenceUrl: entry.url,
          evidenceTitle: entry.title,
          publisher: source.publisher,
          evidenceType: source.evidenceType,
          publishedAt: entry.publishedAt,
          matchedTopics,
          relevanceScore,
          evidenceHash,
          sourceContentHash,
          discoveredAt: now,
          reason: prior ? 'entry-updated' : 'new-entry'
        })
        seen.add(candidateId)
      }
      nextState.sources[source.id] = {
        contentHash: sourceContentHash,
        etag: response.headers.get('etag') ?? undefined,
        lastModified: response.headers.get('last-modified') ?? undefined,
        checkedAt: now
      }
    } catch (error) {
      errors.push({
        sourceId: source.id,
        message: error instanceof Error ? error.message : String(error)
      })
    }
  }
  nextState.seenCandidateIds = [...seen].sort()
  candidates.sort(
    (left, right) => right.relevanceScore - left.relevanceScore || left.id.localeCompare(right.id)
  )
  return { candidates, checkedSources: sources.length, errors, state: nextState }
}
