import { describe, it, expect } from 'vitest'
import { getAllExperiments, getExperimentById } from '../../shared/registry/index'
import { getAllRecipes, getRecipe } from '../../shared/registry/recipes'
import { getAllBrowserAPIs, getBrowserAPI } from '../../shared/registry/browser-apis'

describe('Registry — smoke tests', () => {
  describe('Experiments registry', () => {
    it('loads at least 5 experiments', () => {
      const experiments = getAllExperiments()
      expect(experiments.length).toBeGreaterThanOrEqual(5)
    })

    it('every experiment has required fields', () => {
      const experiments = getAllExperiments()
      for (const exp of experiments) {
        expect(exp.id, `${exp.id} missing id`).toBeTruthy()
        expect(exp.title, `${exp.id} missing title`).toBeTruthy()
        expect(exp.difficulty, `${exp.id} missing difficulty`).toBeTruthy()
      }
    })

    it('getExperimentById returns correct experiment', () => {
      const exp = getExperimentById('virtualization')
      expect(exp).toBeDefined()
      expect(exp?.id).toBe('virtualization')
    })

    it('getExperimentById returns undefined for unknown id', () => {
      expect(getExperimentById('does-not-exist')).toBeUndefined()
    })
  })

  describe('Recipes registry', () => {
    it('loads at least 5 recipes', () => {
      const recipes = getAllRecipes()
      expect(recipes.length).toBeGreaterThanOrEqual(5)
    })

    it('every recipe has required fields', () => {
      const recipes = getAllRecipes()
      for (const recipe of recipes) {
        expect(recipe.id, `${recipe.id} missing id`).toBeTruthy()
        expect(recipe.title, `${recipe.id} missing title`).toBeTruthy()
        expect(
          recipe.relatedAnalyzerRules,
          `${recipe.id} missing relatedAnalyzerRules`
        ).toBeDefined()
      }
    })

    it('getRecipe returns correct recipe', () => {
      const recipe = getRecipe('dom-layout-thrashing')
      expect(recipe).toBeDefined()
      expect(recipe?.id).toBe('dom-layout-thrashing')
      expect(recipe?.relatedAnalyzerRules).toContain('dom-layout-thrashing')
    })

    it('getRecipe returns undefined for unknown id', () => {
      expect(getRecipe('does-not-exist')).toBeUndefined()
    })
  })

  describe('Browser APIs registry', () => {
    it('loads at least 5 browser APIs', () => {
      const apis = getAllBrowserAPIs()
      expect(apis.length).toBeGreaterThanOrEqual(5)
    })

    it('every browser API has required fields', () => {
      const apis = getAllBrowserAPIs()
      for (const api of apis) {
        expect(api.id, `${api.id} missing id`).toBeTruthy()
        expect(api.name, `${api.id} missing name`).toBeTruthy()
        expect(api.category, `${api.id} missing category`).toBeTruthy()
      }
    })

    it('getBrowserAPI returns resize-observer', () => {
      const api = getBrowserAPI('resize-observer')
      expect(api).toBeDefined()
      expect(api?.id).toBe('resize-observer')
    })

    it('getBrowserAPI returns request-idle-callback', () => {
      const api = getBrowserAPI('request-idle-callback')
      expect(api).toBeDefined()
      expect(api?.id).toBe('request-idle-callback')
    })
  })
})
