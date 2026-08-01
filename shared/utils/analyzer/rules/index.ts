import { vueLargeVFor } from './vue-large-v-for'
import { reactLargeMap } from './react-large-map'
import { domLayoutThrashing } from './dom-layout-thrashing'
import { memoryEventListener } from './memory-event-listener'
import { AnalyzerEngine } from '../engine/index'

export const getConfiguredEngine = () => {
  const engine = new AnalyzerEngine()

  engine.registerRule(vueLargeVFor)
  engine.registerRule(reactLargeMap)
  engine.registerRule(domLayoutThrashing)
  engine.registerRule(memoryEventListener)

  return engine
}
