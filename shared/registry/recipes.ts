import type { Recipe } from '../schemas/recipe'
import { largeDataTableManifest } from '../content/recipes/large-data-table/manifest'
import { dashboardRenderingManifest } from '../content/recipes/dashboard-rendering/manifest'
import { backgroundProcessingManifest } from '../content/recipes/background-processing/manifest'

export const recipesRegistry: Record<string, Recipe> = {
  [largeDataTableManifest.id]: largeDataTableManifest,
  [dashboardRenderingManifest.id]: dashboardRenderingManifest,
  [backgroundProcessingManifest.id]: backgroundProcessingManifest
}

export function getAllRecipes(): Recipe[] {
  return Object.values(recipesRegistry)
}

export function getRecipe(id: string): Recipe | undefined {
  return recipesRegistry[id]
}
