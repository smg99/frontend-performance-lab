export type KnowledgeKind = 'experiment' | 'browser-api' | 'recipe'
export type EvidenceType =
  | 'official-documentation'
  | 'web-standard'
  | 'vendor-guidance'
  | 'maintainer-guidance'
  | 'community-reference'

export interface KnowledgeProvenance {
  canonicalUrl: string
  publisher: string
  evidenceType: EvidenceType
  retrievedAt: string
  verifiedAt: string
}

export type ProvenanceRegistry = Record<`${KnowledgeKind}:${string}`, KnowledgeProvenance>

export type FreshnessPolicy = Record<EvidenceType, number>
