<template>
  <section class="py-16 max-w-7xl mx-auto px-4 border-b border-border-subtle">
    <div class="mb-10 flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight text-foreground-primary">Quick Actions</h2>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <button
        v-for="action in actions"
        :key="action.id"
        class="focus:outline-none focus:ring-2 focus:ring-primary rounded-xl text-left"
        @click="executeAction(action)"
      >
        <Card
          class="p-4 h-full flex flex-col items-center justify-center text-center gap-3 hover:border-primary hover:bg-background-hover transition-colors group cursor-pointer"
        >
          <div
            class="p-2 bg-background-surface rounded-full text-foreground-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors"
          >
            <component :is="action.icon" class="w-5 h-5" />
          </div>
          <span class="text-sm font-medium text-foreground-primary">{{ action.title }}</span>
        </Card>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CodeIcon, BeakerIcon, ZapIcon, LightbulbIcon, CpuIcon, SearchIcon } from 'lucide-vue-next'
import Card from '../ui/Card.vue'

const router = useRouter()

const actions = [
  { id: 'analyze', title: 'Analyze Code', icon: CodeIcon, route: '/tools/performance-review' },
  { id: 'experiments', title: 'Browse Experiments', icon: BeakerIcon, route: '/' },
  { id: 'apis', title: 'Browse Browser APIs', icon: ZapIcon, route: '/search?q=browser+apis' },
  { id: 'recipes', title: 'Browse Recipes', icon: LightbulbIcon, route: '/search?q=recipes' },
  { id: 'mcp', title: 'Open MCP Hub', icon: CpuIcon, route: '/mcp' },
  { id: 'cmd', title: 'Command Palette', icon: SearchIcon, action: 'open-cmdk' }
]

const executeAction = (action: (typeof actions)[0]) => {
  if (action.route) {
    router.push(action.route)
  } else if (action.action === 'open-cmdk') {
    // Trigger command palette by simulating Cmd+K or emitting an event
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }
}
</script>
