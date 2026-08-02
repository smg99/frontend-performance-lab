<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
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

const componentType = computed(() => {
  if (props.href) {
    if (props.href.startsWith('http') || props.href.startsWith('mailto:')) {
      return 'a'
    }
    return resolveComponent('NuxtLink')
  }
  return props.as
})

const baseClasses =
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-disabled transition-all duration-180 ease-out'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm'
    case 'secondary':
      return 'bg-background-surface hover:bg-background-hover text-foreground-primary border border-border-subtle-subtle shadow-sm'
    case 'ghost':
      return 'hover:bg-background-hover text-foreground-primary'
    case 'outline':
      return 'border border-border-subtle-strong bg-transparent hover:bg-background-hover text-foreground-primary shadow-sm'
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
    :to="componentType !== 'a' && href ? href : undefined"
    :href="componentType === 'a' ? href : undefined"
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
