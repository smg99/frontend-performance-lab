<template>
  <section
    class="py-16 max-w-7xl mx-auto px-4 border-b border-border-subtle-subtle overflow-hidden"
  >
    <div class="mb-10 text-center sm:text-left">
      <h2 class="text-3xl font-bold tracking-tight text-foreground-primary mb-2">
        Curated Learning Paths
      </h2>
      <p class="text-foreground-muted">
        Follow guided paths to master frontend performance at your own pace.
      </p>
    </div>

    <div class="space-y-12">
      <div
        v-for="path in learningPaths"
        :key="path.title"
        class="bg-background-surface rounded-2xl p-6 md:p-8 border border-border-subtle-subtle"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 class="text-xl font-bold text-foreground-primary mb-1">{{ path.title }}</h3>
            <p class="text-sm text-foreground-muted">{{ path.description }}</p>
          </div>
          <div
            class="shrink-0 bg-background-base border border-border-subtle-subtle px-3 py-1.5 rounded-full text-xs font-medium text-foreground-primary flex items-center gap-2 w-fit"
          >
            <ClockIcon class="w-3.5 h-3.5 text-foreground-muted" />
            Estimated time: {{ path.time }}
          </div>
        </div>

        <div class="relative">
          <!-- Connecting Line -->
          <div
            class="absolute top-1/2 left-0 right-0 h-0.5 bg-border-strong -translate-y-1/2 hidden md:block z-0"
          />

          <div class="flex flex-col md:flex-row justify-between gap-6 md:gap-4 relative z-10">
            <NuxtLink
              v-for="(step, index) in path.steps"
              :key="step.title"
              :to="step.href"
              class="flex flex-row md:flex-col items-center gap-4 md:gap-3 group focus:outline-none"
            >
              <!-- Step Node -->
              <div
                class="w-10 h-10 rounded-full bg-background-base border-2 border-border-subtle-strong flex items-center justify-center font-bold text-sm text-foreground-muted group-hover:border-primary group-hover:text-primary transition-colors shrink-0 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background-surface"
              >
                {{ index + 1 }}
              </div>

              <!-- Step Label -->
              <div
                class="bg-background-base px-3 py-1.5 rounded-lg border border-border-subtle-subtle text-sm font-medium text-foreground-primary group-hover:border-primary group-hover:text-primary transition-colors whitespace-nowrap shadow-sm group-focus-visible:border-primary group-focus-visible:text-primary text-center"
              >
                {{ step.title }}
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ClockIcon } from 'lucide-vue-next'

const learningPaths = [
  {
    title: 'Frontend Performance Foundations',
    description: 'Master the basics of browser rendering and core optimizations.',
    time: '2 hours',
    steps: [
      { title: 'Rendering', href: '/experiments/rendering' },
      { title: 'Layout', href: '/browser-apis/request-animation-frame' },
      { title: 'Virtualization', href: '/experiments/virtualization' },
      { title: 'Browser APIs', href: '/search?q=browser+apis' },
      { title: 'Analyzer', href: '/tools/performance-review' }
    ]
  },
  {
    title: 'Advanced Architecture',
    description: 'Deep dive into memory management, ASTs, and complex pipelines.',
    time: '3 hours',
    steps: [
      { title: 'AST', href: '/tools/performance-review' },
      { title: 'Rendering Pipeline', href: '/experiments/rendering' },
      { title: 'Memory', href: '/experiments/memory-vitals' },
      { title: 'Workers', href: '/browser-apis/web-workers' },
      { title: 'Recipes', href: '/search?q=recipes' }
    ]
  },
  {
    title: 'AI + Automation Engineer',
    description: 'Leverage the MCP to build automated workflows with AI.',
    time: '2 hours',
    steps: [
      { title: 'Knowledge Graph', href: '/search' },
      { title: 'MCP', href: '/mcp' },
      { title: 'Analyzer', href: '/tools/performance-review' },
      { title: 'Recipes', href: '/search?q=recipes' },
      { title: 'Automation', href: '/mcp' }
    ]
  }
]
</script>
