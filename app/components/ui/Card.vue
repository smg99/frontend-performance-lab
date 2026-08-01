<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  class?: string
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div'
})
</script>

<template>
  <component
    :is="as"
    :class="
      cn(
        'rounded-xl border border-border-subtle bg-background-base text-foreground-primary shadow-sm overflow-hidden transition-all duration-200',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
