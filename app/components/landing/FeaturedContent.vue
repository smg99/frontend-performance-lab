<template>
  <section class="py-24 max-w-7xl mx-auto px-4">
    <!-- Experiments -->
    <div class="mb-20">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary">
          Interactive Labs
        </h2>
      </div>

      <!-- MCP Hub Highlight -->
      <NuxtLink
        to="/mcp"
        class="block mb-8 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl group"
      >
        <div
          class="bg-foreground-primary text-background-base rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-transform duration-300 group-hover:-translate-y-1"
        >
          <div>
            <Badge
              variant="secondary"
              class="mb-3 bg-background-base text-foreground-primary border-none"
              >New</Badge
            >
            <h3 class="text-2xl font-bold mb-2">Model Context Protocol (MCP) Hub</h3>
            <p class="text-background-surface max-w-2xl">
              Connect your AI coding assistant (Cursor, Claude, VS Code) directly to our performance
              knowledge graph with the official MCP server.
            </p>
          </div>
          <div class="shrink-0 flex items-center gap-2 font-medium">
            Explore MCP
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </NuxtLink>

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
