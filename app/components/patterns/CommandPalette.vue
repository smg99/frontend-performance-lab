<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys, useLocalStorage } from '@vueuse/core'
import { SearchIcon, CornerDownLeftIcon, ClockIcon } from 'lucide-vue-next'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription
} from 'radix-vue'
import { searchPlatform, type SearchResultItem } from '@utils/search'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['update:open'])
const router = useRouter()

const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const recentSearches = useLocalStorage<string[]>('perf-lab-recent-searches', [])

const { current } = useMagicKeys()
const keys = current

// Debounce query slightly for performance
const debouncedQuery = ref('')
let timeout: ReturnType<typeof setTimeout> | undefined
watch(query, newVal => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    debouncedQuery.value = newVal
    selectedIndex.value = 0
  }, 150)
})

const results = computed(() => {
  if (!debouncedQuery.value) return []
  return searchPlatform({ query: debouncedQuery.value, limit: 15 })
})

// Grouped results for rendering
const groupedResults = computed(() => {
  const groups: Record<string, SearchResultItem[]> = {
    Actions: [],
    Experiments: [],
    Recipes: [],
    'Browser APIs': []
  }

  results.value.forEach(item => {
    if (item.type === 'action') groups['Actions'].push(item)
    if (item.type === 'experiment') groups['Experiments'].push(item)
    if (item.type === 'recipe') groups['Recipes'].push(item)
    if (item.type === 'browser-api') groups['Browser APIs'].push(item)
  })

  // Remove empty groups
  return Object.entries(groups).filter(([_, items]) => items.length > 0)
})

// Flattened list for keyboard navigation
const flatResults = computed(() => {
  return groupedResults.value.flatMap(([_, items]) => items)
})

// Keyboard navigation
watch(keys, k => {
  if (!props.open) return

  if (k.has('arrowdown')) {
    selectedIndex.value = (selectedIndex.value + 1) % flatResults.value.length
    scrollToSelected()
  } else if (k.has('arrowup')) {
    selectedIndex.value =
      (selectedIndex.value - 1 + flatResults.value.length) % flatResults.value.length
    scrollToSelected()
  } else if (k.has('enter')) {
    executeSelected()
  }
})

const scrollToSelected = () => {
  setTimeout(() => {
    const el = document.getElementById(`cmdk-item-${selectedIndex.value}`)
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, 0)
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

const executeSelected = () => {
  if (flatResults.value.length === 0 && !debouncedQuery.value) return

  if (debouncedQuery.value && flatResults.value.length === 0) {
    // Go to dedicated search page
    router.push(`/search?q=${encodeURIComponent(debouncedQuery.value)}`)
    addRecentSearch(debouncedQuery.value)
    emit('update:open', false)
    return
  }

  const selected = flatResults.value[selectedIndex.value]
  if (selected) {
    addRecentSearch(debouncedQuery.value)
    router.push(getHref(selected))
    emit('update:open', false)
  }
}

const executeRecent = (term: string) => {
  query.value = term
  inputRef.value?.focus()
}

const addRecentSearch = (term: string) => {
  if (!term.trim()) return
  const filtered = recentSearches.value.filter(s => s !== term)
  recentSearches.value = [term, ...filtered].slice(0, 5)
}

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      query.value = ''
      selectedIndex.value = 0
      setTimeout(() => inputRef.value?.focus(), 50)
    }
  }
)
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 pointer-events-none"
      >
        <DialogContent
          class="w-full max-w-2xl rounded-2xl border border-border-strong bg-background-base shadow-dialog overflow-hidden animate-zoom-in focus:outline-none flex flex-col max-h-[70vh] pointer-events-auto"
        >
          <DialogTitle class="sr-only">Command Palette</DialogTitle>
          <DialogDescription class="sr-only"
            >Search for experiments, APIs, recipes, and more.</DialogDescription
          >

          <!-- Search Input -->
          <div
            class="flex items-center px-4 border-b border-border-subtle bg-background-base shrink-0 h-14"
          >
            <SearchIcon class="w-5 h-5 text-foreground-muted mr-3" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search experiments, APIs, recipes..."
              class="flex-1 bg-transparent border-none outline-none text-foreground-primary placeholder:text-foreground-muted text-lg"
            />
            <div class="flex items-center gap-2">
              <kbd
                class="hidden sm:inline-flex px-1.5 py-0.5 text-xs font-mono rounded border border-border-strong bg-background-surface text-foreground-muted"
                >ESC</kbd
              >
            </div>
          </div>

          <!-- Scrollable Results -->
          <div class="overflow-y-auto flex-1 overscroll-contain">
            <div v-if="!query && recentSearches.length > 0" class="p-2">
              <div
                class="px-3 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider"
              >
                Recent Searches
              </div>
              <div
                v-for="term in recentSearches"
                :key="term"
                class="flex items-center px-3 py-2.5 mx-2 rounded-lg cursor-pointer text-foreground-primary hover:bg-background-hover transition-colors"
                @click="executeRecent(term)"
              >
                <ClockIcon class="w-4 h-4 mr-3 text-foreground-muted" />
                <span>{{ term }}</span>
              </div>
            </div>

            <div
              v-else-if="query && groupedResults.length === 0"
              class="p-8 text-center text-foreground-muted"
            >
              <p class="mb-2">No results found for "{{ query }}"</p>
              <p class="text-sm">Press Enter to view all results on the search page.</p>
            </div>

            <div v-else class="p-2 space-y-4">
              <div v-for="[groupName, items] in groupedResults" :key="groupName">
                <div
                  class="px-3 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider"
                >
                  {{ groupName }}
                </div>
                <div class="space-y-1">
                  <div
                    v-for="item in items"
                    :id="`cmdk-item-${flatResults.indexOf(item)}`"
                    :key="item.item.id || (item.item as any).name"
                    class="flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors"
                    :class="
                      flatResults.indexOf(item) === selectedIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground-primary hover:bg-background-hover'
                    "
                    @mouseenter="selectedIndex = flatResults.indexOf(item)"
                    @click="executeSelected"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium">{{ getTitle(item) }}</span>
                      <span class="text-xs opacity-70 truncate max-w-[400px]">
                        {{ (item.item as any).description || (item.item as any).problem }}
                      </span>
                    </div>
                    <CornerDownLeftIcon
                      v-if="flatResults.indexOf(item) === selectedIndex"
                      class="w-4 h-4 opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between px-4 py-3 bg-background-surface border-t border-border-subtle shrink-0 text-xs text-foreground-muted"
          >
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1"
                ><kbd class="px-1.5 py-0.5 rounded border border-border-strong bg-background-base"
                  >↑</kbd
                ><kbd class="px-1.5 py-0.5 rounded border border-border-strong bg-background-base"
                  >↓</kbd
                >
                to navigate</span
              >
              <span class="flex items-center gap-1"
                ><kbd class="px-1.5 py-0.5 rounded border border-border-strong bg-background-base"
                  >↵</kbd
                >
                to select</span
              >
            </div>
            <span>Frontend Performance Lab</span>
          </div>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
