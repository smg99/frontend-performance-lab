<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMagicKeys } from '@vueuse/core'
import {
  GithubIcon,
  MoonIcon,
  SunIcon,
  SearchIcon,
  BeakerIcon,
  ZapIcon,
  LightbulbIcon,
  HomeIcon
} from 'lucide-vue-next'
import CommandPalette from '../components/patterns/CommandPalette.vue'

const route = useRoute()
const isDark = ref(false)
const cmdkOpen = ref(false)

const toggleTheme = () => {
  if (import.meta.client) {
    isDark.value = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', isDark.value)
  }
}

// Open Command Palette on Cmd+K
const { meta, k } = useMagicKeys()
watch([meta, k], ([m, k]) => {
  if (m && k) {
    cmdkOpen.value = true
  }
})

// Generate Breadcrumbs based on route
const breadcrumbs = computed(() => {
  const path = route.path
  if (path === '/') return []

  const segments = path.split('/').filter(Boolean)
  return segments.map((segment, index) => {
    return {
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      href: '/' + segments.slice(0, index + 1).join('/')
    }
  })
})
</script>

<template>
  <div
    class="min-h-screen flex w-full bg-background-base text-foreground-primary selection:bg-primary selection:text-primary-foreground"
  >
    <!-- Sidebar -->
    <aside
      class="w-64 lg:w-72 flex-shrink-0 border-r border-border-subtle-subtle bg-background-surface flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto"
    >
      <div class="h-16 flex items-center px-6 border-b border-border-subtle-subtle shrink-0">
        <NuxtLink to="/" class="flex items-center">
          <img
            v-if="isDark"
            src="/branding/logo-dark.svg"
            alt="Frontend Performance Lab"
            class="h-8 w-auto"
          />
          <img
            v-else
            src="/branding/logo-light.svg"
            alt="Frontend Performance Lab"
            class="h-8 w-auto"
          />
        </NuxtLink>
      </div>

      <nav class="flex-1 py-6 px-4 space-y-8">
        <div>
          <ul class="space-y-1">
            <li>
              <NuxtLink
                to="/"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-foreground-muted hover:text-foreground-primary hover:bg-background-hover"
                active-class="bg-background-hover text-foreground-primary font-semibold"
              >
                <HomeIcon class="w-4 h-4" />
                Dashboard
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/search"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-foreground-muted hover:text-foreground-primary hover:bg-background-hover"
                active-class="bg-background-hover text-foreground-primary font-semibold"
              >
                <SearchIcon class="w-4 h-4" />
                Search
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3
            class="px-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2"
          >
            Knowledge Graph
          </h3>
          <ul class="space-y-1">
            <li>
              <NuxtLink
                to="/experiments/virtualization"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-foreground-muted hover:text-foreground-primary hover:bg-background-hover"
                active-class="bg-background-hover text-foreground-primary font-semibold"
              >
                <BeakerIcon class="w-4 h-4" />
                Experiments
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/browser-apis/request-animation-frame"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-foreground-muted hover:text-foreground-primary hover:bg-background-hover"
                active-class="bg-background-hover text-foreground-primary font-semibold"
              >
                <ZapIcon class="w-4 h-4" />
                Browser APIs
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/recipes/large-data-table"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-foreground-muted hover:text-foreground-primary hover:bg-background-hover"
                active-class="bg-background-hover text-foreground-primary font-semibold"
              >
                <LightbulbIcon class="w-4 h-4" />
                Recipes
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/mcp"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-foreground-muted hover:text-foreground-primary hover:bg-background-hover"
                active-class="bg-background-hover text-foreground-primary font-semibold"
              >
                <svg
                  class="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                MCP Hub
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-border-subtle-subtle shrink-0">
        <button
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border-subtle-strong bg-background-base text-sm text-foreground-muted hover:text-foreground-primary transition-colors shadow-sm focus-ring"
          @click="cmdkOpen = true"
        >
          <span class="flex items-center gap-2"><SearchIcon class="w-4 h-4" /> Search</span>
          <kbd
            class="px-1.5 py-0.5 rounded border border-border-subtle-subtle text-[10px] font-mono bg-background-surface shrink-0"
            >⌘K</kbd
          >
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 min-h-screen">
      <!-- Top Bar -->
      <header
        class="h-16 border-b border-border-subtle-subtle bg-background-surface/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30"
      >
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-sm text-foreground-muted">
          <NuxtLink to="/" class="hover:text-foreground-primary transition-colors">Home</NuxtLink>
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.href">
            <span class="text-border-strong">/</span>
            <NuxtLink
              :to="crumb.href"
              :class="[
                'hover:text-foreground-primary transition-colors truncate max-w-[150px] sm:max-w-xs',
                index === breadcrumbs.length - 1 ? 'text-foreground-primary font-medium' : ''
              ]"
            >
              {{ crumb.label }}
            </NuxtLink>
          </template>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <NuxtLink
            to="/tools/performance-review"
            class="hidden sm:inline-flex items-center justify-center h-8 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary-hover transition-colors"
          >
            Quick Analyze
          </NuxtLink>

          <button
            class="p-2 text-foreground-muted hover:text-foreground-primary hover:bg-background-hover rounded-full transition-colors focus-ring"
            @click="toggleTheme"
          >
            <MoonIcon v-if="!isDark" class="w-5 h-5" />
            <SunIcon v-else class="w-5 h-5" />
          </button>

          <a
            href="https://github.com/smg99/frontend-performance-lab"
            target="_blank"
            class="p-2 text-foreground-muted hover:text-foreground-primary hover:bg-background-hover rounded-full transition-colors focus-ring"
          >
            <GithubIcon class="w-5 h-5" />
          </a>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 w-full max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <CommandPalette v-model:open="cmdkOpen" />
  </div>
</template>
