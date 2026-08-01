import type { ExperimentManifest } from '@schemas/index'

import virtualization from '@content/experiments/virtualization/manifest'
import reactivity from '@content/experiments/reactivity/manifest'
import concurrency from '@content/experiments/concurrency/manifest'
import rendering from '@content/experiments/rendering/manifest'
import memoryVitals from '@content/experiments/memory-vitals/manifest'

// The single source of truth for all experiments in the platform.
export const experimentsRegistry: Record<string, ExperimentManifest> = {
  [virtualization.id]: virtualization,
  [reactivity.id]: reactivity,
  [concurrency.id]: concurrency,
  [rendering.id]: rendering,
  [memoryVitals.id]: memoryVitals
}

export const getAllExperiments = (): ExperimentManifest[] => {
  return Object.values(experimentsRegistry)
}

export const getExperimentById = (id: string): ExperimentManifest | undefined => {
  return experimentsRegistry[id]
}
