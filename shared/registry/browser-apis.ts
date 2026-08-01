import type { BrowserAPI } from '../schemas/browser-api'
import { requestAnimationFrameManifest } from '../content/browser-apis/request-animation-frame/manifest'
import { intersectionObserverManifest } from '../content/browser-apis/intersection-observer/manifest'
import { webWorkersManifest } from '../content/browser-apis/web-workers/manifest'

export const browserAPIRegistry: Record<string, BrowserAPI> = {
  [requestAnimationFrameManifest.id]: requestAnimationFrameManifest,
  [intersectionObserverManifest.id]: intersectionObserverManifest,
  [webWorkersManifest.id]: webWorkersManifest
}

export function getAllBrowserAPIs(): BrowserAPI[] {
  return Object.values(browserAPIRegistry)
}

export function getBrowserAPI(id: string): BrowserAPI | undefined {
  return browserAPIRegistry[id]
}
