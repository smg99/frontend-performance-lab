<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils/cn'

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-background-hover text-foreground-primary border-transparent'
    case 'success':
      return 'bg-success-bg text-success border-success-border'
    case 'warning':
      return 'bg-warning-bg text-warning border-warning-border'
    case 'danger':
      return 'bg-danger-bg text-danger border-danger-border'
    case 'outline':
      return 'text-foreground-primary border-border-strong bg-transparent'
    default:
      return ''
  }
})
</script>

<template>
  <div
    :class="
      cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2',
        variantClasses
      )
    "
  >
    <slot />
  </div>
</template>
