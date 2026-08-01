<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  as?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  size: 'xl'
})
</script>

<template>
  <component
    :is="as"
    :class="
      cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        {
          'max-w-3xl': size === 'sm',
          'max-w-5xl': size === 'md',
          'max-w-7xl': size === 'lg',
          'max-w-[96rem]': size === 'xl',
          'max-w-none': size === 'full'
        },
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
