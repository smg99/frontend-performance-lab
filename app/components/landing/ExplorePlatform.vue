<template>
  <section class="py-16 max-w-7xl mx-auto px-4 border-b border-border-subtle">
    <div class="mb-10 text-center sm:text-left">
      <h2 class="text-3xl font-bold tracking-tight text-foreground-primary mb-2">
        Explore the Platform
      </h2>
      <p class="text-foreground-muted">
        Master frontend performance through interactive tools, APIs, and real-world recipes.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="card in exploreCards"
        :key="card.id"
        :to="card.href"
        class="focus:outline-none focus:ring-2 focus:ring-primary rounded-xl block h-full"
      >
        <FeatureCard
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
          class="h-full"
        >
          <template #badges>
            <Badge
              v-if="card.isNew"
              variant="default"
              class="bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider"
              >New</Badge
            >
            <Badge v-if="card.difficulty" variant="outline" class="text-xs">{{
              card.difficulty
            }}</Badge>
            <Badge v-if="card.time" variant="secondary" class="text-xs">{{ card.time }}</Badge>
          </template>
          <template #meta>
            <span>{{ card.count }} items</span>
          </template>
        </FeatureCard>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ActivityIcon, BeakerIcon, ZapIcon, LightbulbIcon, CpuIcon } from 'lucide-vue-next'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'
import { getAllRecipes } from '@registry/recipes'
import { mcpTools } from '@registry/mcp-tools'
import FeatureCard from '../patterns/FeatureCard.vue'
import Badge from '../ui/Badge.vue'

const exploreCards = computed(() => {
  const experiments = getAllExperiments()
  const apis = getAllBrowserAPIs()
  const recipes = getAllRecipes()

  return [
    {
      id: 'analyzer',
      title: 'Performance Analyzer',
      description: 'Upload or paste code for an instant AST-powered performance review.',
      href: '/tools/performance-review',
      icon: ActivityIcon,
      count: 1, // It's a single tool
      time: '5m',
      difficulty: 'All Levels',
      isNew: true
    },
    {
      id: 'experiments',
      title: 'Interactive Experiments',
      description: 'Visually understand performance bottlenecks through interactive sandboxes.',
      href: '/',
      icon: BeakerIcon,
      count: experiments.length,
      time: '1h 30m',
      difficulty: 'Intermediate',
      isNew: experiments.some(e => e.tags?.includes('new'))
    },
    {
      id: 'browser-apis',
      title: 'Browser APIs',
      description: 'Deep dive into native browser APIs designed for high performance.',
      href: '/search?q=browser+apis',
      icon: ZapIcon,
      count: apis.length,
      time: '2h',
      difficulty: 'Advanced',
      isNew: apis.some(a => a.category === 'new') // Example logic
    },
    {
      id: 'recipes',
      title: 'Performance Recipes',
      description: 'Real-world, copy-pasteable solutions for common frontend performance issues.',
      href: '/search?q=recipes',
      icon: LightbulbIcon,
      count: recipes.length,
      time: '3h',
      difficulty: 'Advanced',
      isNew: recipes.some(r => r.performanceImpact === 'High')
    },
    {
      id: 'mcp-hub',
      title: 'MCP Hub',
      description: 'Connect your AI coding assistant directly to our performance knowledge graph.',
      href: '/mcp',
      icon: CpuIcon,
      count: mcpTools.length,
      time: '30m',
      difficulty: 'Advanced',
      isNew: true
    }
  ]
})
</script>
