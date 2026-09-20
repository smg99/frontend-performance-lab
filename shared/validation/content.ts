import { z } from 'zod'
import type { ASTRule } from '../schemas/analyzer'
import type { BrowserAPI } from '../schemas/browser-api'
import type { ExperimentManifest } from '../schemas/experiment'
import type { Recipe } from '../schemas/recipe'
import type { FreshnessPolicy, ProvenanceRegistry } from '../schemas/provenance'

const nonEmptyString = z.string().trim().min(1)
const stringList = z.array(nonEmptyString)

const referenceSchema = z.object({
  title: nonEmptyString,
  url: z
    .string()
    .url()
    .refine(url => url.startsWith('https://'), 'reference URL must use HTTPS')
})

const provenanceSchema = z.object({
  canonicalUrl: z
    .string()
    .url()
    .refine(url => url.startsWith('https://')),
  publisher: nonEmptyString,
  evidenceType: z.enum([
    'official-documentation',
    'web-standard',
    'vendor-guidance',
    'maintainer-guidance',
    'community-reference'
  ]),
  retrievedAt: z.string().datetime(),
  verifiedAt: z.string().datetime()
})

const sectionSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  type: z.enum([
    'concept',
    'recommendation',
    'tradeoff',
    'warning',
    'diagram',
    'example',
    'exercise',
    'benchmark',
    'interview',
    'reference',
    'tip',
    'faq'
  ]),
  order: z.number().int().nonnegative(),
  content: z.unknown()
})

const experimentSchema = z.object({
  id: nonEmptyString,
  version: nonEmptyString,
  status: z.enum(['draft', 'experimental', 'stable', 'deprecated']),
  lastUpdated: z.string().datetime(),
  title: nonEmptyString,
  description: nonEmptyString,
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedReadingTime: z.number().positive(),
  tags: stringList,
  topics: stringList,
  browserAPIs: stringList,
  relationships: z.array(
    z.object({
      targetId: nonEmptyString,
      type: z.enum([
        'prerequisite',
        'alternative',
        'extends',
        'related',
        'dependsOn',
        'advancedTopic'
      ])
    })
  ),
  sections: z.array(sectionSchema).min(1),
  benchmarks: z.array(z.unknown()),
  references: z.array(referenceSchema).min(1)
})

const browserApiSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  description: nonEmptyString,
  category: z.enum(['Rendering', 'Memory', 'Network', 'Concurrency', 'Storage', 'Observers']),
  browserSupport: nonEmptyString,
  baseline: z.enum(['Newly available', 'Widely available', 'Limited']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  usageStats: z.object({ popularity: z.number().min(0).max(100) }),
  searchMetadata: z.object({ keywords: stringList, synonyms: stringList, concepts: stringList }),
  whenToUse: stringList,
  whenNotToUse: stringList,
  advantages: stringList,
  limitations: stringList,
  performanceImpact: z.enum(['Low', 'Medium', 'High']),
  commonMistakes: stringList,
  bestPractices: stringList,
  examples: z.array(
    z.object({ title: nonEmptyString, code: nonEmptyString, explanation: nonEmptyString })
  ),
  relatedExperiments: stringList,
  relatedRecipes: stringList,
  relatedBrowserAPIs: stringList,
  interviewQuestions: z.array(z.object({ question: nonEmptyString, answer: nonEmptyString })),
  references: z.array(referenceSchema).min(1)
})

const recipeSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  summary: nonEmptyString,
  problem: nonEmptyString,
  symptoms: stringList,
  rootCauses: stringList,
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedImplementationTime: nonEmptyString,
  performanceImpact: z.enum(['Low', 'Medium', 'High']),
  prerequisites: z.object({
    experiments: stringList,
    browserAPIs: stringList,
    concepts: stringList
  }),
  whenNotToUse: stringList,
  decisionMatrix: z.array(
    z.object({
      scenario: nonEmptyString,
      recommendedApproach: nonEmptyString,
      alternatives: stringList,
      tradeoffs: nonEmptyString,
      why: nonEmptyString,
      confidence: z.enum(['Low', 'Medium', 'High'])
    })
  ),
  recommendedApproaches: stringList,
  approachesToAvoid: stringList,
  implementationSteps: z.array(z.object({ title: nonEmptyString, description: nonEmptyString })),
  beforeAfterComparison: z.object({
    beforeCode: nonEmptyString,
    afterCode: nonEmptyString,
    explanation: nonEmptyString
  }),
  productionChecklist: stringList,
  commonMistakes: stringList,
  relatedExperiments: stringList,
  relatedBrowserAPIs: stringList,
  relatedAnalyzerRules: stringList,
  relatedRecipes: stringList,
  interviewQuestions: z.array(z.object({ question: nonEmptyString, answer: nonEmptyString })),
  references: z.array(referenceSchema).min(1),
  searchMetadata: z.object({ keywords: stringList, synonyms: stringList, concepts: stringList })
})

export interface ContentSnapshot {
  analyzerRules: ASTRule[]
  browserAPIs: Record<string, BrowserAPI>
  experiments: Record<string, ExperimentManifest>
  recipes: Record<string, Recipe>
  provenance: ProvenanceRegistry
  freshnessPolicy: FreshnessPolicy
}

export interface ValidationResult {
  errors: string[]
  summary: {
    analyzerRules: number
    browserAPIs: number
    experiments: number
    recipes: number
  }
}

function formatZodErrors(kind: string, id: string, error: z.ZodError): string[] {
  return error.issues.map(issue => `${kind} "${id}" ${issue.path.join('.')}: ${issue.message}`)
}

function validateRegistry<T>(
  kind: string,
  registry: Record<string, T>,
  schema: z.ZodType,
  errors: string[]
) {
  for (const [key, value] of Object.entries(registry)) {
    const id = (value as { id?: unknown }).id
    const parsed = schema.safeParse(value)
    if (!parsed.success) errors.push(...formatZodErrors(kind, key, parsed.error))
    if (key !== id) errors.push(`${kind} registry key "${key}" does not match manifest id "${id}"`)
  }
}

function checkReferences(
  owner: string,
  values: unknown,
  targets: Set<string>,
  targetKind: string,
  errors: string[]
) {
  if (!Array.isArray(values)) return
  for (const value of values) {
    if (typeof value === 'string' && !targets.has(value)) {
      errors.push(`${owner} references unknown ${targetKind} "${value}"`)
    }
  }
}

export function validateContent(snapshot: ContentSnapshot, now = new Date()): ValidationResult {
  const errors: string[] = []
  validateRegistry('experiment', snapshot.experiments, experimentSchema, errors)
  validateRegistry('browser API', snapshot.browserAPIs, browserApiSchema, errors)
  validateRegistry('recipe', snapshot.recipes, recipeSchema, errors)

  const experimentIds = new Set(Object.keys(snapshot.experiments))
  const browserApiIds = new Set(Object.keys(snapshot.browserAPIs))
  const recipeIds = new Set(Object.keys(snapshot.recipes))
  const analyzerRuleIds = new Set(snapshot.analyzerRules.map(rule => rule.id))

  const expectedProvenanceKeys = [
    ...[...experimentIds].map(id => `experiment:${id}`),
    ...[...browserApiIds].map(id => `browser-api:${id}`),
    ...[...recipeIds].map(id => `recipe:${id}`)
  ]
  for (const key of expectedProvenanceKeys) {
    const entry = snapshot.provenance[key as keyof ProvenanceRegistry]
    if (!entry) {
      errors.push(`missing provenance for "${key}"`)
      continue
    }
    const parsed = provenanceSchema.safeParse(entry)
    if (!parsed.success) errors.push(...formatZodErrors('provenance', key, parsed.error))
    else {
      const maxAgeDays = snapshot.freshnessPolicy[entry.evidenceType]
      const ageDays = (now.getTime() - new Date(entry.verifiedAt).getTime()) / 86_400_000
      if (!Number.isFinite(maxAgeDays) || maxAgeDays <= 0) {
        errors.push(`missing freshness policy for evidence type "${entry.evidenceType}"`)
      } else if (ageDays > maxAgeDays) {
        errors.push(
          `stale provenance for "${key}": verified ${Math.floor(ageDays)} days ago, policy allows ${maxAgeDays}`
        )
      }
    }
  }
  for (const key of Object.keys(snapshot.provenance)) {
    if (!expectedProvenanceKeys.includes(key)) errors.push(`orphan provenance entry "${key}"`)
  }

  for (const experiment of Object.values(snapshot.experiments)) {
    checkReferences(
      `experiment "${experiment.id}"`,
      experiment.browserAPIs,
      browserApiIds,
      'browser API',
      errors
    )
    checkReferences(
      `experiment "${experiment.id}"`,
      Array.isArray(experiment.relationships)
        ? experiment.relationships.map(relationship => relationship.targetId)
        : [],
      experimentIds,
      'experiment',
      errors
    )
  }

  for (const api of Object.values(snapshot.browserAPIs)) {
    checkReferences(
      `browser API "${api.id}"`,
      api.relatedExperiments,
      experimentIds,
      'experiment',
      errors
    )
    checkReferences(`browser API "${api.id}"`, api.relatedRecipes, recipeIds, 'recipe', errors)
    checkReferences(
      `browser API "${api.id}"`,
      api.relatedBrowserAPIs,
      browserApiIds,
      'browser API',
      errors
    )
  }

  for (const recipe of Object.values(snapshot.recipes)) {
    checkReferences(
      `recipe "${recipe.id}"`,
      recipe.prerequisites?.experiments,
      experimentIds,
      'experiment',
      errors
    )
    checkReferences(
      `recipe "${recipe.id}"`,
      recipe.prerequisites?.browserAPIs,
      browserApiIds,
      'browser API',
      errors
    )
    checkReferences(
      `recipe "${recipe.id}"`,
      recipe.relatedExperiments,
      experimentIds,
      'experiment',
      errors
    )
    checkReferences(
      `recipe "${recipe.id}"`,
      recipe.relatedBrowserAPIs,
      browserApiIds,
      'browser API',
      errors
    )
    checkReferences(
      `recipe "${recipe.id}"`,
      recipe.relatedAnalyzerRules,
      analyzerRuleIds,
      'analyzer rule',
      errors
    )
    checkReferences(`recipe "${recipe.id}"`, recipe.relatedRecipes, recipeIds, 'recipe', errors)
  }

  return {
    errors: [...new Set(errors)].sort(),
    summary: {
      analyzerRules: snapshot.analyzerRules.length,
      browserAPIs: browserApiIds.size,
      experiments: experimentIds.size,
      recipes: recipeIds.size
    }
  }
}
