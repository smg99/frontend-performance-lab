<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils/cn'

interface Props {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'emerald'
    | 'purple'
    | 'orange'
    | 'blue'
    | 'cyan'
    | 'indigo'
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
      return 'text-foreground-primary border-border-subtle-strong bg-transparent'
    case 'emerald':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'purple':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    case 'orange':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    case 'blue':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'cyan':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    case 'indigo':
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
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
