import { domLayoutThrashing } from './rules/dom-layout-thrashing'
import { memoryEventListener } from './rules/memory-event-listener'
import { vueLargeVFor } from './rules/vue-large-v-for'
import { reactLargeMap } from './rules/react-large-map'
import { reactUnmemoizedContextProvider } from './rules/react-unmemoized-context-provider'
import { jsxDynamicLayoutStyle } from './rules/jsx-dynamic-layout-style'
import { passiveEventListenerMissing } from './rules/passive-event-listener-missing'
import { largeReactiveStateObject } from './rules/large-reactive-state-object'
import { cssContainMissing } from './rules/css-contain-missing'
import { blockingCss } from './rules/blocking-css'
import { networkBatching } from './rules/network-batching'
import { heavyJsOnload } from './rules/heavy-js-onload'
import { lazyLoadImageMisses } from './rules/lazy-load-image-misses'
import type { DiagnosticDefinition, EnrichedDiagnostic } from './types'

export const DiagnosticsRegistry: Record<string, DiagnosticDefinition> = {
  [domLayoutThrashing.id]: domLayoutThrashing,
  [memoryEventListener.id]: memoryEventListener,
  [vueLargeVFor.id]: vueLargeVFor,
  [reactLargeMap.id]: reactLargeMap,
  [reactUnmemoizedContextProvider.id]: reactUnmemoizedContextProvider,
  [jsxDynamicLayoutStyle.id]: jsxDynamicLayoutStyle,
  [passiveEventListenerMissing.id]: passiveEventListenerMissing,
  [largeReactiveStateObject.id]: largeReactiveStateObject,
  [lazyLoadImageMisses.id]: lazyLoadImageMisses,
  [cssContainMissing.id]: cssContainMissing,
  [blockingCss.id]: blockingCss,
  [networkBatching.id]: networkBatching,
  [heavyJsOnload.id]: heavyJsOnload
}

export const DiagnosticsMapper = {
  enrich(
    rawViolations: Array<{ id: string; severity?: string; line?: number }>
  ): EnrichedDiagnostic[] {
    return rawViolations.map(raw => {
      const def = DiagnosticsRegistry[raw.id]

      if (!def) {
        // Unknown rules degrade gracefully
        return {
          id: raw.id,
          title: 'Unknown Violation: ' + raw.id,
          category: 'Unknown',
          severity: raw.severity || 'medium',
          confidence: 'low',
          summary: 'An undefined performance issue was detected.',
          why: 'No detailed explanation available for this rule ID.',
          impact: 'Unknown performance impact.',
          howToVerify: 'Inspect the code manually.',
          recommendedFix: 'Review performance best practices.',
          references: [],
          framework: 'unknown',
          ruleVersion: '1.0',
          line: raw.line || 0
        }
      }

      return {
        ...def,
        severity: raw.severity || def.severity,
        line: raw.line || 0
      }
    })
  }
}
