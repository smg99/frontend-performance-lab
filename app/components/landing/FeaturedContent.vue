<template>
  <section class="py-24 max-w-7xl mx-auto px-4 border-b border-border-subtle">
    
    <div class="mb-12 text-center sm:text-left">
      <h2 class="text-3xl font-bold tracking-tight text-foreground-primary mb-2">
        Featured Showcase
      </h2>
      <p class="text-foreground-muted">
        Explore a curated selection of performance experiments, APIs, and recipes.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- 1 Experiment -->
      <NuxtLink
        v-if="featuredExperiment"
        :to="`/experiments/${featuredExperiment.id}`"
        class="focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl block h-full"
      >
        <FeatureCard
          :title="featuredExperiment.title"
          :description="featuredExperiment.summary"
          :icon="BeakerIcon"
          class="h-full"
        >
          <template #badges>
            <Badge variant="outline" class="text-xs">Experiment</Badge>
          </template>
        </FeatureCard>
      </NuxtLink>

      <!-- 1 Recipe -->
      <NuxtLink
        v-if="featuredRecipe"
        :to="`/recipes/${featuredRecipe.id}`"
        class="focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl block h-full"
      >
        <FeatureCard
          :title="featuredRecipe.title"
          :description="featuredRecipe.summary"
          :icon="LightbulbIcon"
          class="h-full"
        >
          <template #badges>
            <Badge variant="outline" class="text-xs text-primary border-primary/20 bg-primary/5">Recipe</Badge>
          </template>
        </FeatureCard>
      </NuxtLink>

      <!-- 1 API -->
      <NuxtLink
        v-if="featuredApi"
        :to="`/browser-apis/${featuredApi.id}`"
        class="focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl block h-full"
      >
        <FeatureCard
          :title="featuredApi.name"
          :description="featuredApi.description"
          :icon="ZapIcon"
          class="h-full"
        >
          <template #badges>
            <Badge variant="outline" class="text-xs text-blue-500 border-blue-500/20 bg-blue-500/5">Native API</Badge>
          </template>
        </FeatureCard>
      </NuxtLink>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BeakerIcon, LightbulbIcon, ZapIcon } from 'lucide-vue-next'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'
import { getAllRecipes } from '@registry/recipes'
import FeatureCard from '../patterns/FeatureCard.vue'
import Badge from '../ui/Badge.vue'

const featuredExperiment = computed(() => getAllExperiments().find(e => e.featured) || getAllExperiments()[0])
const featuredRecipe = computed(() => getAllRecipes().find(r => r.featured) || getAllRecipes()[0])
const featuredApi = computed(() => getAllBrowserAPIs().find(a => a.featured) || getAllBrowserAPIs()[0])
</script>
