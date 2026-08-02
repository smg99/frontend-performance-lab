import type { BrowserAPI } from '../schemas/browser-api'
import { requestAnimationFrameManifest } from '../content/browser-apis/request-animation-frame/manifest'
import { intersectionObserverManifest } from '../content/browser-apis/intersection-observer/manifest'
import { webWorkersManifest } from '../content/browser-apis/web-workers/manifest'
import { resizeObserverManifest } from '../content/browser-apis/resize-observer/manifest'
import { requestIdleCallbackManifest } from '../content/browser-apis/request-idle-callback/manifest'

export const browserAPIRegistry: Record<string, BrowserAPI> = {
  [requestAnimationFrameManifest.id]: requestAnimationFrameManifest,
  [intersectionObserverManifest.id]: intersectionObserverManifest,
  [webWorkersManifest.id]: webWorkersManifest,
  [resizeObserverManifest.id]: resizeObserverManifest,
  [requestIdleCallbackManifest.id]: requestIdleCallbackManifest
}

export function getAllBrowserAPIs(): BrowserAPI[] {
  return Object.values(browserAPIRegistry)
}

export function getBrowserAPI(id: string): BrowserAPI | undefined {
  return browserAPIRegistry[id]
}
