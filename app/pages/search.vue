<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SearchIcon, BookOpenIcon, BeakerIcon, LightbulbIcon, ZapIcon } from 'lucide-vue-next'
import Container from '../components/layout/Container.vue'
import Card from '../components/ui/Card.vue'
import { searchPlatform, type SearchResultItem } from '@utils/search'

const route = useRoute()
const router = useRouter()

const query = ref((route.query.q as string) || '')

const results = computed(() => {
  if (!query.value) return []
  return searchPlatform({ query: query.value, limit: 50 })
})

const groupedResults = computed(() => {
  const groups: Record<string, SearchResultItem[]> = {
    Experiments: [],
    'Browser APIs': [],
    Recipes: [],
    Actions: []
  }

  results.value.forEach(item => {
    if (item.type === 'experiment') groups['Experiments'].push(item)
    if (item.type === 'browser-api') groups['Browser APIs'].push(item)
    if (item.type === 'recipe') groups['Recipes'].push(item)
    if (item.type === 'action') groups['Actions'].push(item)
  })

  return Object.entries(groups).filter(([_, items]) => items.length > 0)
})

const getIcon = (groupName: string) => {
  switch (groupName) {
    case 'Experiments':
      return BeakerIcon
    case 'Browser APIs':
      return ZapIcon
    case 'Recipes':
      return LightbulbIcon
    default:
      return BookOpenIcon
  }
}

const getHref = (item: SearchResultItem) => {
  if (item.type === 'action') return item.item.href
  if (item.type === 'experiment') return `/experiments/${item.item.id}`
  if (item.type === 'recipe') return `/recipes/${item.item.id}`
  if (item.type === 'browser-api') return `/browser-apis/${item.item.id}`
  return '/'
}

const getTitle = (item: SearchResultItem) => {
  if (item.type === 'action') return item.item.title
  if (item.type === 'experiment') return item.item.title
  if (item.type === 'recipe') return item.item.title
  if (item.type === 'browser-api') return item.item.name
  return ''
}

// Update URL when typing
let timeout: ReturnType<typeof setTimeout> | undefined
watch(query, newVal => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    router.replace({ query: { q: newVal } })
  }, 300)
})
</script>

<template>
  <Container class="py-12 max-w-4xl">
    <div class="mb-12">
      <div class="relative flex items-center w-full">
        <SearchIcon class="absolute left-6 w-6 h-6 text-foreground-muted pointer-events-none" />
        <input
          v-model="query"
          type="text"
          placeholder="Search the lab..."
          class="w-full h-16 pl-16 pr-6 bg-background-surface hover:bg-background-hover focus:bg-background-base rounded-2xl border border-border-subtle-subtle focus:border-border-subtle-strong text-foreground-primary placeholder:text-foreground-muted transition-all duration-200 outline-none focus:ring-4 focus:ring-border-subtle/50 shadow-sm text-lg"
          autofocus
        />
      </div>
    </div>

    <div v-if="!query" class="text-center text-foreground-muted mt-24">
      <SearchIcon class="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p>Type to search experiments, APIs, recipes, and more.</p>
    </div>

    <div
      v-else-if="groupedResults.length === 0"
      class="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border-subtle-strong bg-background-surface/50"
    >
      <div class="mb-4 p-4 rounded-full bg-background-hover text-foreground-muted">
        <SearchIcon class="w-8 h-8" />
      </div>
      <h3 class="text-xl font-bold tracking-tight text-foreground-primary">
        No exact matches found
      </h3>
      <p class="mt-2 text-sm text-foreground-muted max-w-sm mb-10 leading-relaxed">
        We couldn't find anything matching '{{ query }}'. While you're here, explore some of our
        most powerful resources.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
        <NuxtLink
          to="/browser-apis/request-animation-frame"
          class="p-5 rounded-xl bg-background-base border border-border-subtle-subtle hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-220 group hover:-translate-y-[1px] shadow-sm hover:shadow-md"
        >
          <div class="flex items-center gap-2 mb-2">
            <ZapIcon class="w-4 h-4 text-blue-500" />
            <span
              class="text-sm font-semibold text-foreground-primary group-hover:text-blue-500 transition-colors"
              >requestAnimationFrame</span
            >
          </div>
          <p class="text-xs text-foreground-muted leading-relaxed">
            Learn how to schedule visually smooth updates.
          </p>
        </NuxtLink>
        <NuxtLink
          to="/recipes/virtual-lists"
          class="p-5 rounded-xl bg-background-base border border-border-subtle-subtle hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-220 group hover:-translate-y-[1px] shadow-sm hover:shadow-md"
        >
          <div class="flex items-center gap-2 mb-2">
            <LightbulbIcon class="w-4 h-4 text-orange-500" />
            <span
              class="text-sm font-semibold text-foreground-primary group-hover:text-orange-500 transition-colors"
              >Virtual Lists</span
            >
          </div>
          <p class="text-xs text-foreground-muted leading-relaxed">
            Render massive datasets without crashing.
          </p>
        </NuxtLink>
        <NuxtLink
          to="/tools/performance-review"
          class="p-5 rounded-xl bg-background-base border border-border-subtle-subtle hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-220 group hover:-translate-y-[1px] shadow-sm hover:shadow-md"
        >
          <div class="flex items-center gap-2 mb-2">
            <CodeIcon class="w-4 h-4 text-emerald-500" />
            <span
              class="text-sm font-semibold text-foreground-primary group-hover:text-emerald-500 transition-colors"
              >Run Analyzer</span
            >
          </div>
          <p class="text-xs text-foreground-muted leading-relaxed">
            Paste your code to find bottlenecks instantly.
          </p>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-12">
      <section v-for="[groupName, items] in groupedResults" :key="groupName">
        <h2
          class="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border-subtle-subtle pb-2"
        >
          <component :is="getIcon(groupName)" class="w-5 h-5 text-foreground-muted" />
          {{ groupName }}
        </h2>

        <div class="grid gap-4">
          <NuxtLink
            v-for="item in items"
            :key="item.item.id || (item.item as any).name"
            :to="getHref(item)"
          >
            <Card
              class="p-5 hover:border-border-subtle-strong hover:shadow-md transition-all group flex items-start justify-between"
            >
              <div>
                <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">
                  {{ getTitle(item) }}
                </h3>
                <p class="text-foreground-muted mt-1 leading-relaxed max-w-2xl">
                  {{ (item.item as any).description || (item.item as any).problem }}
                </p>
                <div v-if="(item.item as any).tags" class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="tag in (item.item as any).tags"
                    :key="tag"
                    class="text-xs bg-background-hover text-foreground-muted px-2 py-1 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </Card>
          </NuxtLink>
        </div>
      </section>
    </div>
  </Container>
</template>
