import { vueLargeVFor } from './vue-large-v-for'
import { reactLargeMap } from './react-large-map'
import { domLayoutThrashing } from './dom-layout-thrashing'
import { memoryEventListener } from './memory-event-listener'
import { AnalyzerEngine } from '../engine/index'

export const analyzerRules = [vueLargeVFor, reactLargeMap, domLayoutThrashing, memoryEventListener]

export const getConfiguredEngine = () => {
  const engine = new AnalyzerEngine()

  for (const rule of analyzerRules) {
    engine.registerRule(rule)
  }

  return engine
}
