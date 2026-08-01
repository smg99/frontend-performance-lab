<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils/cn'

interface Props {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  as?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  as: 'button'
})

const componentType = computed(() => (props.href ? 'NuxtLink' : props.as))

const baseClasses =
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium focus-ring disabled:pointer-events-none disabled:opacity-disabled transition-all duration-200'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm'
    case 'secondary':
      return 'bg-background-surface hover:bg-background-hover text-foreground-primary border border-border-subtle shadow-sm'
    case 'ghost':
      return 'hover:bg-background-hover text-foreground-primary'
    case 'outline':
      return 'border border-border-strong bg-transparent hover:bg-background-hover text-foreground-primary shadow-sm'
    case 'destructive':
      return 'bg-danger text-white hover:bg-danger/90 shadow-sm'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'default':
      return 'h-10 px-4 py-2'
    case 'sm':
      return 'h-8 rounded-md px-3 text-xs'
    case 'lg':
      return 'h-12 rounded-xl px-8 text-base'
    case 'icon':
      return 'h-10 w-10'
    default:
      return ''
  }
})

const classes = computed(() => cn(baseClasses, variantClasses.value, sizeClasses.value))
</script>

<template>
  <component
    :is="componentType"
    :to="href"
    :href="href"
    :class="classes"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
  >
    <span v-if="loading" class="mr-2 animate-spin">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </span>
    <slot />
  </component>
</template>
