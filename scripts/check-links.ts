import { auditUrls, collectLinkEntries } from '../shared/audit/broken-links'
import { provenanceRegistry } from '../shared/content/provenance'
import { browserAPIRegistry } from '../shared/registry/browser-apis'
import { experimentsRegistry } from '../shared/registry'
import { recipesRegistry } from '../shared/registry/recipes'

const manifests = [
  ...Object.values(experimentsRegistry),
  ...Object.values(browserAPIRegistry),
  ...Object.values(recipesRegistry)
]

const entries = collectLinkEntries(manifests, provenanceRegistry)
const report = await auditUrls(entries)

if (report.failures.length > 0) {
  console.error(
    `Broken-link audit failed: ${report.failures.length} of ${report.checked} URL(s) failed.`
  )
  for (const failure of report.failures) {
    const detail =
      failure.status !== null ? `HTTP ${failure.status}` : (failure.error ?? 'request failed')
    console.error(`- ${failure.url} [${detail}] — ${failure.sources.join(', ')}`)
  }
  process.exit(1)
}

console.log(`Broken-link audit passed: ${report.checked} unique knowledge URLs reachable.`)
