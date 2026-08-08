import { reactLargeMap } from './react-large-map'
import { reactUnmemoizedContextProvider } from './react-unmemoized-context-provider'
import { jsxDynamicLayoutStyle } from './jsx-dynamic-layout-style'
import { vueLargeVFor } from './vue-large-v-for'
import { largeReactiveStateObject } from './large-reactive-state-object'
import { lazyLoadImageMisses } from './lazy-load-image-misses'
import { cssContainMissing } from './css-contain-missing'
import { heavyJsOnload } from './heavy-js-onload'
import { domLayoutThrashing } from './dom-layout-thrashing'
import { networkBatching } from './network-batching'
import { passiveEventListenerMissing } from './passive-event-listener-missing'
import { memoryEventListener } from './memory-event-listener'
import { blockingCss } from './blocking-css'
import { reactInlineProps } from './react-inline-props'
import { consolePerformance } from './console-performance'
import { imgMissingDimensions } from './img-missing-dimensions'
import { AnalyzerEngine } from '../engine/index'

export const builtInRules = [
  reactLargeMap,
  reactUnmemoizedContextProvider,
  jsxDynamicLayoutStyle,
  vueLargeVFor,
  largeReactiveStateObject,
  lazyLoadImageMisses,
  cssContainMissing,
  heavyJsOnload,
  domLayoutThrashing,
  networkBatching,
  passiveEventListenerMissing,
  memoryEventListener,
  blockingCss,
  reactInlineProps,
  consolePerformance,
  imgMissingDimensions
]

export const getConfiguredEngine = () => {
  const engine = new AnalyzerEngine()

  for (const rule of builtInRules) {
    engine.registerRule(rule)
  }

  return engine
}
