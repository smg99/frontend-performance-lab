<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  sidebarPosition: 'left',
  sidebarWidth: 'md'
})
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col lg:flex-row gap-8 w-full',
        sidebarPosition === 'right' ? 'lg:flex-row-reverse' : '',
        props.class
      )
    "
  >
    <!-- Sidebar -->
    <aside
      :class="
        cn('shrink-0 w-full', {
          'lg:w-64': sidebarWidth === 'sm',
          'lg:w-72': sidebarWidth === 'md',
          'lg:w-80': sidebarWidth === 'lg'
        })
      "
    >
      <slot name="sidebar" />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 min-w-0">
      <slot />
    </main>
  </div>
</template>
