<template>
  <section class="py-24 bg-background-base border-b border-border-subtle overflow-hidden">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-foreground-primary mb-4">
          Complete Ecosystem Workflow
        </h2>
        <p class="text-lg text-foreground-muted max-w-2xl mx-auto">
          From raw code to expert optimizations in seconds.
        </p>
      </div>

      <div class="relative">
        <div
          class="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 lg:gap-2 xl:gap-4 overflow-x-auto pt-2 pb-8 snap-x snap-mandatory hide-scrollbar"
        >
          <template v-for="(step, index) in workflowSteps" :key="step.title">
            <NuxtLink
              :to="step.link"
              class="flex-none w-full lg:w-64 snap-center relative group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl block"
            >
              <div
                class="h-full min-h-[220px] bg-background-surface border border-border-subtle rounded-xl p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-md group-hover:bg-background-hover"
              >
                <div
                  class="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"
                >
                  <span
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"
                    >{{ index + 1 }}</span
                  >
                  {{ step.phase }}
                </div>
                <h3 class="font-bold text-base text-foreground-primary mb-2 leading-tight">
                  {{ step.title }}
                </h3>
                <p class="text-sm text-foreground-muted leading-relaxed mb-4">
                  {{ step.description }}
                </p>

                <div
                  v-if="step.codeSnippet"
                  class="bg-background-base rounded border border-border-subtle p-3 text-[10px] font-mono overflow-x-auto text-foreground-secondary"
                >
                  <pre>{{ step.codeSnippet }}</pre>
                </div>
              </div>

              <!-- Connection Line & Arrow (Desktop) -->
              <div
                v-if="index < workflowSteps.length - 1"
                class="hidden lg:block absolute top-1/2 -right-3 xl:-right-5 -translate-y-1/2 w-4 xl:w-6 h-px bg-border-strong z-10 group-hover:bg-primary transition-colors"
              >
                <div
                  class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 border-t-2 border-r-2 border-border-strong group-hover:border-primary rotate-45 transition-colors"
                />
              </div>

              <!-- Connection Line & Arrow (Mobile) -->
              <div
                v-if="index < workflowSteps.length - 1"
                class="block lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-px h-4 bg-border-strong z-10 group-hover:bg-primary transition-colors"
              >
                <div
                  class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-b-2 border-r-2 border-border-strong group-hover:border-primary rotate-45 transition-colors"
                />
              </div>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const workflowSteps = [
  {
    phase: 'Input',
    title: 'Paste Vue Component',
    description: 'Provide your raw component.',
    link: '/tools/performance-review',
    codeSnippet:
      '<template>\n  <div v-for="i in 10000"\n    :key="i.id">\n    <HeavyCard />\n  </div>\n</template>'
  },
  {
    phase: 'Analysis',
    title: 'AST Analyzer',
    description: 'Static analysis engine scans for anti-patterns.',
    link: '/tools/performance-review'
  },
  {
    phase: 'Detection',
    title: 'Large v-for Detected',
    description: 'Identifies layout thrashing and extreme DOM node counts.',
    link: '/tools/performance-review'
  },
  {
    phase: 'API Solution',
    title: 'Intersection Observer',
    description: 'Learn the native browser API for lazy rendering.',
    link: '/browser-apis/intersection-observer'
  },
  {
    phase: 'Recipe',
    title: 'Large Data Table',
    description: 'Apply a production-ready recipe for high-performance lists.',
    link: '/recipes/large-data-table'
  },
  {
    phase: 'Experiment',
    title: 'Rendering Virtualization',
    description: 'Interactively visualize the FPS and memory gains.',
    link: '/experiments/virtualization'
  }
]
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
