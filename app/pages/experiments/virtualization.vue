<template>
  <Container class="space-y-6 flex flex-col h-full py-8 max-w-7xl">
    <PageHeader
      title="Rendering Virtualization"
      description="Compare different strategies for rendering massive lists."
    />

    <!-- Controls -->
    <div
      class="bg-background-base border border-border-subtle rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row gap-4 justify-between items-center"
    >
      <div class="flex space-x-2 bg-background-surface p-1 rounded-lg border border-border-subtle">
        <button
          v-for="stage in stages"
          :key="stage.id"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeStage === stage.id
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-foreground-muted hover:text-foreground-primary hover:bg-border/50'
          ]"
          @click="setStage(stage.id)"
        >
          {{ stage.name }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-foreground-muted">Items:</span>
        <select
          v-model="itemCount"
          class="bg-background-surface border border-border-subtle text-foreground-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none"
        >
          <option :value="1000">1,000</option>
          <option :value="10000">10,000</option>
          <option :value="100000">100,000</option>
        </select>
      </div>
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <PerformanceMetricCard title="FPS" :value="fps" unit="fps" />
      <PerformanceMetricCard title="Render Time" :value="renderTime" unit="ms" />
      <PerformanceMetricCard title="DOM Nodes" :value="domNodes" />
      <PerformanceMetricCard title="Memory" :value="memory" unit="MB" />
    </div>

    <!-- Implementation Area -->
    <div
      class="flex-1 min-h-[500px] bg-background-base border border-border-subtle rounded-xl shadow-subtle overflow-hidden flex flex-col"
    >
      <div class="p-4 border-b border-border-subtle bg-background-surface/50">
        <h3 class="font-semibold text-foreground-primary">{{ currentStageDetails.name }}</h3>
        <p class="text-sm text-foreground-muted mt-1">{{ currentStageDetails.description }}</p>
      </div>

      <div class="flex-1 relative bg-background/50">
        <ClientOnly>
          <!-- Stage 1 -->
          <Stage1Naive v-if="activeStage === 1" :items="items" />

          <!-- Stage 2 -->
          <Stage2VueUse v-else-if="activeStage === 2" :items="items" />

          <!-- Stage 3 -->
          <Stage3Custom v-else-if="activeStage === 3" :items="items" />
        </ClientOnly>
      </div>
    </div>

    <!-- Educational Framework Integration -->
    <LearningSummaryCard :data="learningData" class="mx-auto mt-8" />

    <RelatedKnowledge entity-id="virtualization" entity-type="experiment" />
  </Container>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef, nextTick } from 'vue'
import { usePerformanceMonitor } from '~/composables/usePerformanceMonitor'
import LearningSummaryCard from '~/components/common/learning/LearningSummaryCard.vue'
import Container from '~/components/layout/Container.vue'
import PageHeader from '~/components/patterns/PageHeader.vue'
import RelatedKnowledge from '~/components/patterns/RelatedKnowledge.vue'
import type { LearningSummaryData } from '~/types/learning'

// Basic Item generator
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `List Item ${i}`,
    description: `This is a randomly generated description for item ${i}. It helps simulate realistic DOM complexity.`,
    avatar: `https://i.pravatar.cc/150?u=${i}`
  }))
}

const itemCount = ref(10000)
const items = shallowRef(generateItems(itemCount.value))

const measureRender = async (action: () => void) => {
  const start = performance.now()
  action()

  // Wait for Vue virtual DOM
  await nextTick()

  // Wait for browser layout and paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      renderTime.value = Math.round(performance.now() - start)
    })
  })
}

watch(itemCount, newCount => {
  measureRender(() => {
    items.value = generateItems(newCount)
  })
})

const stages = [
  {
    id: 1,
    name: 'Stage 1: Naive',
    description: 'Renders every single DOM node. Watch your memory and FPS tank on large lists.'
  },
  {
    id: 2,
    name: 'Stage 2: VueUse',
    description: 'Uses the @vueuse/core useVirtualList composable for basic virtualization.'
  },
  {
    id: 3,
    name: 'Stage 3: Custom',
    description:
      'A fully custom virtualization engine demonstrating buffer management, recycling, and positioning.'
  }
]

const activeStage = ref(1)
const currentStageDetails = computed(() => stages.find(s => s.id === activeStage.value)!)

const setStage = (id: number) => {
  if (activeStage.value === id) return
  measureRender(() => {
    activeStage.value = id
  })
}

const { fps, domNodes, memory } = usePerformanceMonitor()
const renderTime = ref(0) // Render time is harder to track globally, keep as ref for now

const learningData: LearningSummaryData = {
  title: 'Rendering Virtualization',
  whatIsIt:
    'List virtualization (or windowing) is the technique of rendering only the items that are currently visible within the scrolling viewport, rather than rendering the entire dataset to the DOM at once.',
  howItWorks:
    'Instead of creating 100,000 DOM nodes, a virtual list calculates the height of all items, creates a massive scrolling container, and absolutely positions a tiny subset of nodes (e.g. 20) inside the visible area. As you scroll, those same 20 nodes are constantly repositioned and recycled with new data.',
  recommendation: {
    approach: 'Use an established library like @vueuse/core (useVirtualList) for standard lists.',
    reasoning:
      'Virtualization is incredibly difficult to get right (handling variable item heights, scroll anchoring, accessibility). Established libraries solve these edge cases for you.',
    codeSample: `<template>
  <div v-bind="containerProps" style="height: 400px">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index" style="height: 50px">
        Row: {{ item.data }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  massiveArrayOfData,
  { itemHeight: 50 }
)
</' + 'script>`
  },
  decisionMatrix: [
    {
      situation: '< 500 items',
      recommended: 'Standard v-for',
      alternative: 'Pagination',
      avoid: 'Virtualization (Overkill)'
    },
    {
      situation: '1,000+ items (Fixed Height)',
      recommended: 'useVirtualList (@vueuse)',
      alternative: 'Custom Fixed Virtualizer',
      avoid: 'Standard v-for'
    },
    {
      situation: '10,000+ items (Variable Height)',
      recommended: 'vue-virtual-scroller',
      alternative: 'TanStack Virtual',
      avoid: 'Standard v-for'
    }
  ],
  commonMistakes: [
    {
      problem: 'Rendering entire datasets.',
      impact: 'Browser freezes while evaluating 50k nodes. Heap memory crashes tab.',
      fix: 'Implement pagination or virtualization.',
      badCode: `<template>
  <!-- ❌ Renders all 50,000 nodes -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</' + 'template>`,
      goodCode: `<template>
  <!-- ✅ Renders only 20 nodes -->
  <div v-bind="containerProps">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index">
        {{ item.data.name }}
      </div>
    </div>
  </div>
</' + 'template>`
    },
    {
      problem: 'Virtualizing small lists.',
      impact: 'Unnecessary calculation overhead for simple lists.',
      fix: 'Only virtualize if DOM node count exceeds ~1500.'
    }
  ],
  interviewQuestions: [
    {
      question: 'What causes the performance drop when rendering 100,000 items?',
      difficulty: 'Intermediate',
      answer:
        'The browser has to allocate memory for 100k DOM objects, parse their CSS rules, and calculate Layout for all of them synchronously. The JS heap balloons, and the main thread blocks for several seconds.'
    },
    {
      question: 'How do virtual lists handle scrolling without losing the scrollbar size?',
      difficulty: 'Advanced',
      answer:
        'They calculate the total theoretical height of all items (e.g. 100k * 50px = 5M px) and place a hidden spacer div of that height inside the container. This forces the browser to draw an accurate scrollbar.'
    }
  ],
  proTips: [
    'Always provide a `key` binding when recycling DOM nodes in Vue to prevent state collision.',
    'Use CSS `content-visibility: auto` as a quick alternative to JS virtualization for offscreen content.',
    'Ensure you render a small "buffer" of items above and below the viewport to prevent white flashes when scrolling fast.'
  ]
}
</script>
