import { vueLargeVFor } from './vue-large-v-for'
import { reactLargeMap } from './react-large-map'
import { domLayoutThrashing } from './dom-layout-thrashing'
import { memoryEventListener } from './memory-event-listener'
import { AnalyzerEngine } from '../engine/index'

import { reactUnmemoizedContextProvider } from './react-unmemoized-context-provider'
import { jsxDynamicLayoutStyle } from './jsx-dynamic-layout-style'
import { largeReactiveStateObject } from './large-reactive-state-object'
import { passiveEventListenerMissing } from './passive-event-listener-missing'

export const analyzerRules = [
  vueLargeVFor,
  reactLargeMap,
  domLayoutThrashing,
  memoryEventListener,
  reactUnmemoizedContextProvider,
  jsxDynamicLayoutStyle,
  passiveEventListenerMissing,
  largeReactiveStateObject
]

export const getConfiguredEngine = () => {
  const engine = new AnalyzerEngine()

  for (const rule of analyzerRules) {
    engine.registerRule(rule)
  }

  return engine
}
