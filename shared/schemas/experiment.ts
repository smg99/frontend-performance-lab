import type { Section } from './section'
import type { Benchmark } from './benchmark'

export type ExperimentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type ExperimentStatus = 'draft' | 'experimental' | 'stable' | 'deprecated'

export type RelationshipType =
  'prerequisite' | 'alternative' | 'extends' | 'related' | 'dependsOn' | 'advancedTopic'

export interface Relationship {
  targetId: string
  type: RelationshipType
}

export interface ReferenceLink {
  title: string
  description: string
  url: string
  category: 'Vue Docs' | 'MDN' | 'web.dev' | 'Chrome Developers' | 'TypeScript Handbook' | 'Other'
}

export interface ExperimentManifest {
  id: string
  version: string
  status: ExperimentStatus
  lastUpdated: string
  title: string
  description: string
  difficulty: ExperimentDifficulty
  estimatedReadingTime: number // in minutes
  tags: string[]
  topics: string[]
  browserAPIs: string[]
  relationships: Relationship[]
  sections: Section[]
  benchmarks: Benchmark[]
  references: ReferenceLink[]
}
