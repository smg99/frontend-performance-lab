<script setup lang="ts">
import { SearchIcon, CommandIcon } from 'lucide-vue-next'
import { cn } from '../../utils/cn'

interface Props {
  placeholder?: string
  class?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Search documentation, recipes, or APIs...'
})
</script>

<template>
  <div :class="cn('relative flex items-center w-full max-w-2xl', $props.class)">
    <SearchIcon class="absolute left-4 w-5 h-5 text-foreground-muted pointer-events-none" />
    <input
      type="text"
      :placeholder="placeholder"
      class="w-full h-12 pl-12 pr-16 bg-background-surface hover:bg-background-hover focus:bg-background-base rounded-xl border border-border-subtle-subtle focus:border-border-subtle-strong text-foreground-primary placeholder:text-foreground-muted transition-all duration-200 outline-none focus:ring-4 focus:ring-border-subtle/50 shadow-sm"
    />
    <div
      class="absolute right-4 flex items-center gap-1 text-xs font-mono text-foreground-muted pointer-events-none"
    >
      <kbd
        class="px-1.5 py-0.5 rounded border border-border-subtle-subtle bg-background-base shadow-sm"
        ><CommandIcon class="w-3 h-3 inline" /> K</kbd
      >
    </div>
  </div>
</template>
