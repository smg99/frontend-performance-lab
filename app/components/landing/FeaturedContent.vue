<template>
  <section class="py-24 max-w-7xl mx-auto px-4">
    <!-- Experiments -->
    <div class="mb-20">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary">
          Interactive Labs
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="exp in experiments"
          :key="exp.id"
          :to="`/experiments/${exp.id}`"
          class="focus:outline-none focus:ring-2 focus:ring-primary rounded-xl block h-full"
        >
          <FeatureCard
            :title="exp.title"
            :description="exp.summary || exp.tags?.join(', ') || ''"
            :icon="BeakerIcon"
            class="h-full"
          >
            <template #badges>
              <Badge v-if="exp.difficulty" variant="outline" class="text-xs">{{
                exp.difficulty
              }}</Badge>
              <Badge v-if="exp.estimatedReadingTime" variant="secondary" class="text-xs"
                >{{ exp.estimatedReadingTime }}m read</Badge
              >
            </template>
            <template #meta>
              <span v-if="exp.relationships"> {{ exp.relationships.length }} concepts </span>
            </template>
          </FeatureCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Recipes -->
    <div class="mb-20">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary">
          Production Recipes
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="recipe in recipes"
          :key="recipe.id"
          :to="`/recipes/${recipe.id}`"
          class="focus:outline-none focus:ring-2 focus:ring-primary rounded-xl block h-full"
        >
          <FeatureCard
            :title="recipe.title"
            :description="recipe.summary || recipe.description || ''"
            :icon="LightbulbIcon"
            class="h-full"
          >
            <template #badges>
              <Badge v-if="recipe.difficulty" variant="outline" class="text-xs">{{
                recipe.difficulty
              }}</Badge>
              <Badge v-if="recipe.performanceImpact" variant="secondary" class="text-xs"
                >{{ recipe.performanceImpact }} Impact</Badge
              >
            </template>
            <template #meta>
              <span>{{ getRecipeConceptsCount(recipe) }} concepts</span>
            </template>
          </FeatureCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Browser APIs -->
    <div>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary">
          Native Browser APIs
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="api in apis"
          :key="api.id"
          :to="`/browser-apis/${api.id}`"
          class="focus:outline-none focus:ring-2 focus:ring-primary rounded-xl block h-full"
        >
          <FeatureCard
            :title="api.name"
            :description="api.description"
            :icon="ZapIcon"
            class="h-full"
          >
            <template #badges>
              <Badge v-if="api.category" variant="secondary" class="text-xs">{{
                api.category
              }}</Badge>
              <Badge v-if="api.difficulty" variant="outline" class="text-xs">{{
                api.difficulty
              }}</Badge>
            </template>
            <template #meta>
              <span>{{ getApiConceptsCount(api) }} concepts</span>
            </template>
          </FeatureCard>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BeakerIcon, LightbulbIcon, ZapIcon } from 'lucide-vue-next'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'
import { getAllRecipes } from '@registry/recipes'
import FeatureCard from '../patterns/FeatureCard.vue'
import Badge from '../ui/Badge.vue'

const getFeatured = <T extends { featured?: boolean }>(items: T[]) => {
  const featured = items.filter(i => i.featured)
  return featured.length > 0 ? featured.slice(0, 3) : items.slice(0, 3)
}

const experiments = getFeatured(getAllExperiments())
const apis = getFeatured(getAllBrowserAPIs())
const recipes = getFeatured(getAllRecipes())

// Utilities to calculate total related concepts safely
const getRecipeConceptsCount = (recipe: {
  relatedExperiments?: unknown[]
  relatedBrowserAPIs?: unknown[]
  relatedRecipes?: unknown[]
}) => {
  let count = 0
  if (recipe.relatedExperiments) count += recipe.relatedExperiments.length
  if (recipe.relatedBrowserAPIs) count += recipe.relatedBrowserAPIs.length
  if (recipe.relatedRecipes) count += recipe.relatedRecipes.length
  return count
}

const getApiConceptsCount = (api: {
  relatedExperiments?: unknown[]
  relatedBrowserAPIs?: unknown[]
  relatedRecipes?: unknown[]
}) => {
  let count = 0
  if (api.relatedExperiments) count += api.relatedExperiments.length
  if (api.relatedRecipes) count += api.relatedRecipes.length
  if (api.relatedBrowserAPIs) count += api.relatedBrowserAPIs.length
  return count
}
</script>
