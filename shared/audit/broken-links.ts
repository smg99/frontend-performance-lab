export interface LinkEntry {
  url: string
  source: string
}

export interface LinkFailure {
  url: string
  sources: string[]
  status: number | null
  error: string | null
}

export interface LinkAuditReport {
  checked: number
  failures: LinkFailure[]
}

interface ProvenanceLike {
  canonicalUrl: string
}

interface ManifestLike {
  references?: Array<{ url: string }>
}

export function collectLinkEntries(
  manifests: ManifestLike[],
  provenance: Record<string, ProvenanceLike>
): LinkEntry[] {
  const grouped = new Map<string, Set<string>>()

  for (const [source, value] of Object.entries(provenance)) {
    if (value?.canonicalUrl) {
      if (!grouped.has(value.canonicalUrl)) grouped.set(value.canonicalUrl, new Set())
      grouped.get(value.canonicalUrl)!.add(source)
    }
  }

  for (const manifest of manifests) {
    for (const reference of manifest.references ?? []) {
      if (!reference.url) continue
      if (!grouped.has(reference.url)) grouped.set(reference.url, new Set())
      grouped.get(reference.url)!.add('manifest reference')
    }
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([url, sources]) => ({ url, source: [...sources].sort().join(', ') }))
}

export async function auditUrls(
  entries: LinkEntry[],
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000
): Promise<LinkAuditReport> {
  const grouped = new Map<string, Set<string>>()
  for (const entry of entries) {
    if (!grouped.has(entry.url)) grouped.set(entry.url, new Set())
    grouped.get(entry.url)!.add(entry.source)
  }

  const failures: LinkFailure[] = []
  for (const url of [...grouped.keys()].sort((left, right) => left.localeCompare(right))) {
    let response: Response | undefined
    let error: string | null = null

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        response = await fetchImpl(url, {
          method: 'HEAD',
          redirect: 'follow',
          signal: controller.signal
        })
        if (response.status === 405 || response.status === 501) {
          response = await fetchImpl(url, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal
          })
        }
      } finally {
        clearTimeout(timer)
      }
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught)
    }

    if (error || !response || !response.ok) {
      failures.push({
        url,
        sources: [...(grouped.get(url) ?? [])].sort((left, right) => left.localeCompare(right)),
        status: response?.status ?? null,
        error
      })
    }
  }

  return { checked: grouped.size, failures }
}
