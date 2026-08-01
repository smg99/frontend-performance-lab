export type SectionType = 
  | 'concept'
  | 'recommendation'
  | 'tradeoff'
  | 'warning'
  | 'diagram'
  | 'example'
  | 'exercise'
  | 'benchmark'
  | 'interview'
  | 'reference'
  | 'tip'
  | 'faq'

export interface Section {
  id: string
  title: string
  type: SectionType
  order: number
  /**
   * The actual content. This could be raw markdown or a structured object depending on the section type.
   * For strictness, if it's an example, it should map to ExampleSchema.
   */
  content: unknown 
}

export interface ExampleSectionContent {
  goodCode?: string
  badCode?: string
  explanation: string
}

export interface RecommendationSectionContent {
  approach: string
  reasoning: string
}
