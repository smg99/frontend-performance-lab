<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  SearchIcon,
  BookOpenIcon,
  BeakerIcon,
  LightbulbIcon,
  ZapIcon,
  ClockIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  CodeIcon,
  WrenchIcon
} from 'lucide-vue-next'
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

const highlightText = (text: string, q: string) => {
  if (!text || !q) return text
  // Escape query for regex
  const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeQuery})`, 'gi')
  return text.replace(
    regex,
    '<span class="text-primary font-semibold bg-primary/10 rounded px-0.5">$1</span>'
  )
}

const recentSearches = ref<string[]>([
  'Vue Virtualization',
  'ResizeObserver',
  'requestAnimationFrame'
])

onMounted(() => {
  try {
    const saved = localStorage.getItem('fpl_recent_searches')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        recentSearches.value = parsed
      }
    }
  } catch (e) {
    // ignore
  }
})

const addToRecent = (q: string) => {
  if (!q || q.length < 3) return
  const current = [...recentSearches.value]
  const idx = current.findIndex(t => t.toLowerCase() === q.toLowerCase())
  if (idx > -1) current.splice(idx, 1)
  current.unshift(q)
  if (current.length > 5) current.length = 5
  recentSearches.value = current
  try {
    localStorage.setItem('fpl_recent_searches', JSON.stringify(current))
  } catch (e) {
    // ignore
  }
}

// Update URL when typing
let timeout: ReturnType<typeof setTimeout> | undefined
watch(query, newVal => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    router.replace({ query: { q: newVal } })
    if (newVal) addToRecent(newVal)
  }, 400)
})
</script>

<template>
  <Container class="py-12 max-w-4xl">
    <!-- 1. Hero Title -->
    <div class="mb-10 text-center">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground-primary mb-4">
        Search the Performance Knowledge Graph
      </h1>
      <p class="text-lg text-foreground-muted">
        Instantly search Browser APIs, Recipes, Experiments, Analyzer Rules and MCP tools.
      </p>
    </div>

    <!-- 2. Search Box -->
    <div class="mb-12 max-w-3xl mx-auto w-full">
      <div class="relative flex items-center w-full group">
        <SearchIcon
          class="absolute left-6 w-6 h-6 text-foreground-muted pointer-events-none group-focus-within:text-primary transition-colors"
        />
        <input
          v-model="query"
          type="text"
          placeholder="Search APIs, Recipes, Experiments, Analyzer Rules..."
          class="w-full h-[68px] pl-16 pr-28 bg-background-surface hover:bg-background-hover focus:bg-background-base rounded-2xl border border-border-subtle-subtle focus:border-primary/50 text-foreground-primary placeholder:text-foreground-muted transition-all duration-200 outline-none focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] shadow-sm text-lg"
          autofocus
        />
        <div
          class="absolute right-4 flex items-center pointer-events-none transition-opacity duration-200"
          :class="{ 'opacity-0': query, 'opacity-100': !query }"
        >
          <kbd
            class="px-2 py-1 rounded flex items-center gap-1.5 border border-border-subtle-strong bg-background-base font-mono text-[10px] text-foreground-muted shadow-sm"
          >
            <span>⌘K</span>
            <span class="hidden sm:inline opacity-70 border-l border-border-subtle-subtle pl-1.5"
              >to search</span
            >
          </kbd>
        </div>
      </div>
    </div>

    <Transition name="fade-slide" mode="out-in">
      <!-- Educational Empty State (Linear Layout) -->
      <div v-if="!query" key="empty" class="max-w-3xl mx-auto w-full">
        <!-- Popular Searches -->
        <div class="py-8">
          <h3 class="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-6">
            Popular Searches
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="tag in [
                'ResizeObserver',
                'requestAnimationFrame',
                'Virtualization',
                'Layout Thrashing'
              ]"
              :key="tag"
              @click="query = tag"
              class="px-4 py-2 rounded-full bg-background-surface border border-border-subtle-subtle text-foreground-primary font-medium hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-2"
            >
              <span class="opacity-70 text-[10px]">⚡</span> {{ tag }}
            </button>
          </div>
        </div>

        <!-- Browse Categories -->
        <div class="py-8">
          <h3 class="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-6">
            Browse Categories
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              @click="query = 'Browser API'"
              class="p-5 rounded-xl bg-background-surface border border-border-subtle-subtle hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 text-left group cursor-pointer hover:-translate-y-[1px] hover:shadow-md"
            >
              <div
                class="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors"
              >
                <ZapIcon class="w-5 h-5" />
              </div>
              <div
                class="font-semibold text-foreground-primary group-hover:text-blue-500 transition-colors"
              >
                Browser APIs
              </div>
              <div class="text-xs text-foreground-muted mt-1 leading-relaxed">
                Performance-focused browser APIs
              </div>
              <div
                class="text-[10px] font-medium text-foreground-muted/70 mt-3 uppercase tracking-wider"
              >
                45 APIs
              </div>
            </button>

            <button
              @click="query = 'Recipe'"
              class="p-5 rounded-xl bg-background-surface border border-border-subtle-subtle hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-200 text-left group cursor-pointer hover:-translate-y-[1px] hover:shadow-md"
            >
              <div
                class="p-2.5 rounded-lg bg-orange-500/10 text-orange-500 w-fit mb-4 group-hover:bg-orange-500/20 transition-colors"
              >
                <LightbulbIcon class="w-5 h-5" />
              </div>
              <div
                class="font-semibold text-foreground-primary group-hover:text-orange-500 transition-colors"
              >
                Recipes
              </div>
              <div class="text-xs text-foreground-muted mt-1 leading-relaxed">
                Production-ready optimization guides
              </div>
              <div
                class="text-[10px] font-medium text-foreground-muted/70 mt-3 uppercase tracking-wider"
              >
                18 Recipes
              </div>
            </button>

            <button
              @click="query = 'Experiment'"
              class="p-5 rounded-xl bg-background-surface border border-border-subtle-subtle hover:border-pink-500 hover:bg-pink-500/5 transition-all duration-200 text-left group cursor-pointer hover:-translate-y-[1px] hover:shadow-md"
            >
              <div
                class="p-2.5 rounded-lg bg-pink-500/10 text-pink-500 w-fit mb-4 group-hover:bg-pink-500/20 transition-colors"
              >
                <BeakerIcon class="w-5 h-5" />
              </div>
              <div
                class="font-semibold text-foreground-primary group-hover:text-pink-500 transition-colors"
              >
                Experiments
              </div>
              <div class="text-xs text-foreground-muted mt-1 leading-relaxed">
                Interactive performance demos
              </div>
              <div
                class="text-[10px] font-medium text-foreground-muted/70 mt-3 uppercase tracking-wider"
              >
                12 Labs
              </div>
            </button>

            <button
              @click="query = 'Rule'"
              class="p-5 rounded-xl bg-background-surface border border-border-subtle-subtle hover:border-emerald-500 hover:bg-emerald-500/5 transition-all duration-200 text-left group cursor-pointer hover:-translate-y-[1px] hover:shadow-md"
            >
              <div
                class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit mb-4 group-hover:bg-emerald-500/20 transition-colors"
              >
                <CodeIcon class="w-5 h-5" />
              </div>
              <div
                class="font-semibold text-foreground-primary group-hover:text-emerald-500 transition-colors"
              >
                Analyzer Rules
              </div>
              <div class="text-xs text-foreground-muted mt-1 leading-relaxed">
                AST-based performance checks
              </div>
              <div
                class="text-[10px] font-medium text-foreground-muted/70 mt-3 uppercase tracking-wider"
              >
                27 Rules
              </div>
            </button>

            <button
              @click="query = 'MCP'"
              class="p-5 rounded-xl bg-background-surface border border-border-subtle-subtle hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-200 text-left group cursor-pointer hover:-translate-y-[1px] hover:shadow-md"
            >
              <div
                class="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 w-fit mb-4 group-hover:bg-purple-500/20 transition-colors"
              >
                <WrenchIcon class="w-5 h-5" />
              </div>
              <div
                class="font-semibold text-foreground-primary group-hover:text-purple-500 transition-colors"
              >
                MCP Tools
              </div>
              <div class="text-xs text-foreground-muted mt-1 leading-relaxed">
                AI integration capabilities
              </div>
              <div
                class="text-[10px] font-medium text-foreground-muted/70 mt-3 uppercase tracking-wider"
              >
                6 Tools
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Searches -->
        <div class="py-8">
          <h3 class="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-6">
            Recent Searches
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="tag in recentSearches"
              :key="tag"
              @click="query = tag"
              class="px-4 py-2 rounded-full bg-background-surface border border-border-subtle-subtle text-foreground-muted font-medium hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-2"
            >
              <ClockIcon class="w-3.5 h-3.5 opacity-50" /> {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-else-if="groupedResults.length === 0"
        key="no-results"
        class="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border-subtle-strong bg-background-surface/50 w-full"
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

      <div v-else key="results" class="space-y-12 w-full">
        <section v-for="[groupName, items] in groupedResults" :key="groupName">
          <h2
            class="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border-subtle-subtle pb-2"
          >
            <component :is="getIcon(groupName)" class="w-5 h-5 text-foreground-muted" />
            {{ groupName }}
          </h2>

          <Card
            class="overflow-hidden border border-border-subtle-subtle shadow-sm bg-background-surface/50"
          >
            <div class="divide-y divide-border-subtle-subtle">
              <NuxtLink
                v-for="item in items"
                :key="item.item.id || (item.item as any).name"
                :to="getHref(item)"
                class="block p-4 hover:bg-background-hover transition-colors group"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3
                      class="font-medium text-foreground-primary group-hover:text-primary transition-colors"
                      v-html="highlightText(getTitle(item), query)"
                    ></h3>
                    <p
                      class="text-sm text-foreground-muted mt-1 leading-relaxed max-w-2xl"
                      v-html="
                        highlightText(
                          (item.item as any).description || (item.item as any).problem,
                          query
                        )
                      "
                    ></p>
                    <div v-if="(item.item as any).tags" class="flex flex-wrap gap-2 mt-2">
                      <span
                        v-for="tag in (item.item as any).tags"
                        :key="tag"
                        class="text-[10px] uppercase font-semibold bg-background-base border border-border-subtle-subtle text-foreground-muted px-2 py-0.5 rounded"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon
                    class="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 shrink-0 mt-1"
                  />
                </div>
              </NuxtLink>
            </div>
          </Card>
        </section>
      </div>
    </Transition>
  </Container>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
