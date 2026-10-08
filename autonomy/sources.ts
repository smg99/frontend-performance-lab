export interface DiscoverySource {
  id: string
  name: string
  url: string
  evidenceHosts: string[]
  publisher: string
  evidenceType: 'official-documentation' | 'vendor-guidance' | 'maintainer-guidance'
  topics: string[]
  rateLimit: string
  licenseNote: string
}

export const discoverySources: DiscoverySource[] = [
  {
    id: 'mdn-blog',
    name: 'MDN Blog',
    url: 'https://developer.mozilla.org/en-US/blog/rss.xml',
    evidenceHosts: ['developer.mozilla.org'],
    publisher: 'MDN Web Docs',
    evidenceType: 'official-documentation',
    topics: ['browser-api', 'javascript', 'css', 'performance'],
    rateLimit: 'At most once per scheduled run; conditional requests required.',
    licenseNote: 'Discovery metadata only. Do not republish source text.'
  },
  {
    id: 'web-dev-feed',
    name: 'web.dev',
    url: 'https://web.dev/feed.xml',
    evidenceHosts: ['web.dev'],
    publisher: 'Google web.dev',
    evidenceType: 'vendor-guidance',
    topics: ['core-web-vitals', 'performance', 'browser'],
    rateLimit: 'At most once per scheduled run; conditional requests required.',
    licenseNote: 'Discovery metadata only. Do not republish source text.'
  },
  {
    id: 'vue-blog',
    name: 'Vue.js Blog',
    url: 'https://blog.vuejs.org/feed.rss',
    evidenceHosts: ['blog.vuejs.org'],
    publisher: 'Vue.js',
    evidenceType: 'maintainer-guidance',
    topics: ['vue', 'framework', 'performance'],
    rateLimit: 'At most once per scheduled run; conditional requests required.',
    licenseNote: 'Discovery metadata only. Do not republish source text.'
  }
]
