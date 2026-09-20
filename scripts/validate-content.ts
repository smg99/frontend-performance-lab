import { browserAPIRegistry } from '../shared/registry/browser-apis'
import { experimentsRegistry } from '../shared/registry'
import { recipesRegistry } from '../shared/registry/recipes'
import { builtInRules } from '../shared/utils/analyzer/rules'
import { validateContent } from '../shared/validation/content'
import { freshnessPolicyDays, provenanceRegistry } from '../shared/content/provenance'

const result = validateContent({
  analyzerRules: builtInRules,
  browserAPIs: browserAPIRegistry,
  experiments: experimentsRegistry,
  recipes: recipesRegistry,
  provenance: provenanceRegistry,
  freshnessPolicy: freshnessPolicyDays
})

if (result.errors.length > 0) {
  console.error(`Content validation failed with ${result.errors.length} error(s):`)
  for (const error of result.errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(
  `Content validation passed: ${result.summary.experiments} experiments, ${result.summary.browserAPIs} browser APIs, ${result.summary.recipes} recipes, ${result.summary.analyzerRules} analyzer rules.`
)
