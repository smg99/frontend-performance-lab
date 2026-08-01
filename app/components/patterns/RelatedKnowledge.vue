<script setup lang="ts">
import { computed } from 'vue'
import { BeakerIcon, ZapIcon, LightbulbIcon } from 'lucide-vue-next'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'
import { getAllRecipes } from '@registry/recipes'
import FeatureCard from './FeatureCard.vue'

interface Props {
  entityId: string
  entityType: 'experiment' | 'browser-api' | 'recipe'
}

const props = defineProps<Props>()

const relatedExperiments = computed(() => {
  const allExp = getAllExperiments()

  if (props.entityType === 'browser-api') {
    // Return experiments that use this API
    return allExp.filter(e => e.browserAPIs.includes(props.entityId))
  }
  if (props.entityType === 'recipe') {
    // Return experiments that this recipe explicitly relates to
    const recipe = getAllRecipes().find(r => r.id === props.entityId)
    if (!recipe) return []
    // Recipe schema might not have relatedExperiments yet, so we loosely match by checking if experiment tags match recipe concepts
    return allExp
      .filter(
        e =>
          e.tags.some(t => recipe.searchMetadata.concepts.includes(t)) ||
          e.searchKeywords?.some(k => recipe.searchMetadata.keywords.includes(k))
      )
      .slice(0, 3)
  }
  return []
})

const relatedAPIs = computed(() => {
  const allAPIs = getAllBrowserAPIs()

  if (props.entityType === 'experiment') {
    const exp = getAllExperiments().find(e => e.id === props.entityId)
    if (!exp) return []
    return allAPIs.filter(api => exp.browserAPIs.includes(api.id))
  }
  if (props.entityType === 'recipe') {
    const recipe = getAllRecipes().find(r => r.id === props.entityId)
    if (!recipe) return []
    return allAPIs.filter(api => recipe.relatedBrowserAPIs?.includes(api.id))
  }
  return []
})

const relatedRecipes = computed(() => {
  const allRecipes = getAllRecipes()

  if (props.entityType === 'browser-api') {
    // Recipes that use this API
    return allRecipes.filter(r => r.relatedBrowserAPIs?.includes(props.entityId))
  }
  if (props.entityType === 'experiment') {
    const exp = getAllExperiments().find(e => e.id === props.entityId)
    if (!exp) return []
    return allRecipes
      .filter(
        r =>
          r.searchMetadata.concepts.some(c => exp.tags.includes(c)) ||
          r.searchMetadata.keywords.some(k => exp.searchKeywords?.includes(k))
      )
      .slice(0, 3)
  }
  return []
})

const hasRelated = computed(
  () =>
    relatedExperiments.value.length > 0 ||
    relatedAPIs.value.length > 0 ||
    relatedRecipes.value.length > 0
)
</script>

<template>
  <div v-if="hasRelated" class="mt-16 pt-12 border-t border-border-subtle">
    <h2 class="text-2xl font-bold mb-8">Related Knowledge</h2>

    <div class="space-y-12">
      <div v-if="relatedRecipes.length > 0">
        <h3
          class="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-2"
        >
          <LightbulbIcon class="w-4 h-4" /> Recommended Recipes
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="recipe in relatedRecipes" :key="recipe.id" :to="`/recipes/${recipe.id}`">
            <FeatureCard :title="recipe.title" :description="recipe.problem" />
          </NuxtLink>
        </div>
      </div>

      <div v-if="relatedAPIs.length > 0">
        <h3
          class="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-2"
        >
          <ZapIcon class="w-4 h-4" /> Core Browser APIs
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="api in relatedAPIs" :key="api.id" :to="`/browser-apis/${api.id}`">
            <FeatureCard :title="api.name" :description="api.description" />
          </NuxtLink>
        </div>
      </div>

      <div v-if="relatedExperiments.length > 0">
        <h3
          class="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-4 flex items-center gap-2"
        >
          <BeakerIcon class="w-4 h-4" /> Related Experiments
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="exp in relatedExperiments" :key="exp.id" :to="`/experiments/${exp.id}`">
            <FeatureCard :title="exp.title" :description="exp.description" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
