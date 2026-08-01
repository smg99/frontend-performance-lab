<template>
  <section ref="sectionRef" class="py-24 bg-background-base border-b border-border-subtle">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary mb-4">
          A Growing Platform
        </h2>
        <p class="text-lg text-foreground-muted max-w-2xl mx-auto">
          Constantly evolving with new rules, recipes, and tools.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="displayCounts[stat.key]"
          :description="stat.description"
          :icon="stat.icon"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'
import { BeakerIcon, ZapIcon, LightbulbIcon, CodeIcon, WrenchIcon } from 'lucide-vue-next'
import { getAllExperiments } from '@registry/index'
import { getAllBrowserAPIs } from '@registry/browser-apis'
import { getAllRecipes } from '@registry/recipes'
import { mcpTools } from '@registry/mcp-tools'
import { analyzerRules } from '@utils/analyzer/rules'
import StatCard from '../patterns/StatCard.vue'

const sectionRef = ref(null)
const hasAnimated = ref(false)
const prefersReducedMotion = usePreferredReducedMotion()

const targetCounts = {
  experiments: getAllExperiments().length,
  apis: getAllBrowserAPIs().length,
  recipes: getAllRecipes().length,
  rules: analyzerRules.length,
  tools: mcpTools.length
}

type StatKey = keyof typeof targetCounts

const displayCounts = reactive({
  experiments: 0,
  apis: 0,
  recipes: 0,
  rules: 0,
  tools: 0
})

const stats = [
  {
    key: 'experiments' as StatKey,
    title: 'Experiments',
    description: 'Interactive visual labs',
    icon: BeakerIcon
  },
  {
    key: 'apis' as StatKey,
    title: 'Browser APIs',
    description: 'Native performance APIs',
    icon: ZapIcon
  },
  {
    key: 'recipes' as StatKey,
    title: 'Recipes',
    description: 'Production-ready solutions',
    icon: LightbulbIcon
  },
  {
    key: 'rules' as StatKey,
    title: 'Analyzer Rules',
    description: 'AST checks and heuristics',
    icon: CodeIcon
  },
  {
    key: 'tools' as StatKey,
    title: 'MCP Tools',
    description: 'AI agent integrations',
    icon: WrenchIcon
  }
]

const animateValue = (key: StatKey, end: number) => {
  if (prefersReducedMotion.value) {
    displayCounts[key] = end
    return
  }

  const duration = 2000
  const steps = 60
  const stepTime = Math.abs(Math.floor(duration / steps))
  let current = 0
  const increment = end / steps

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      displayCounts[key] = end
      clearInterval(timer)
    } else {
      displayCounts[key] = Math.ceil(current)
    }
  }, stepTime)
}

useIntersectionObserver(sectionRef, ([entry]) => {
  if (entry?.isIntersecting && !hasAnimated.value) {
    hasAnimated.value = true
    stats.forEach(stat => {
      animateValue(stat.key, targetCounts[stat.key])
    })
  }
})
</script>
