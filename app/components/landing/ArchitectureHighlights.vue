<template>
  <section class="py-24 bg-background-surface border-b border-border-subtle">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary mb-4">
          Architecture Highlights
        </h2>
        <p class="text-lg text-foreground-muted max-w-2xl mx-auto">
          Built with modern enterprise-grade tooling and patterns.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="feature in features"
          :key="feature.title"
          :to="feature.link"
          class="block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl h-full"
        >
          <FeatureCard
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
            class="h-full"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  BotIcon,
  CodeIcon,
  ServerIcon,
  DatabaseIcon,
  CompassIcon,
  WrenchIcon,
  GithubIcon
} from 'lucide-vue-next'
import FeatureCard from '../patterns/FeatureCard.vue'

const features = [
  {
    title: 'AI-first Architecture',
    description:
      'Designed from day one to be consumed by AI agents, featuring structured schemas and extensive metadata.',
    icon: BotIcon,
    link: '/search'
  },
  {
    title: 'AST Static Analyzer',
    description:
      'Custom Babel and Vue compiler AST rules to detect anti-patterns and layout thrashing before execution.',
    icon: CodeIcon,
    link: '/tools/performance-review'
  },
  {
    title: 'MCP Server',
    description:
      'Model Context Protocol server natively exposes all educational content and tools directly to the IDE.',
    icon: ServerIcon,
    link: '/search'
  },
  {
    title: 'Shared Knowledge Registry',
    description:
      'A single, deeply integrated TypeScript registry driving both the web UI and MCP server outputs.',
    icon: DatabaseIcon,
    link: '/search'
  },
  {
    title: 'Browser API Graph',
    description:
      'Comprehensive documentation of native performance primitives with code examples and compatibility matrices.',
    icon: CompassIcon,
    link: '/search'
  },
  {
    title: 'Recipe Engine',
    description:
      'Curated library of production-ready patterns mapped directly to performance bottlenecks.',
    icon: WrenchIcon,
    link: '/search'
  },
  {
    title: 'Enterprise CI/CD',
    description:
      'Strict pipeline enforcing type safety, linting, test coverage, and automated MCP validation.',
    icon: GithubIcon,
    link: 'https://github.com/smg99/frontend-performance-lab'
  }
]
</script>
