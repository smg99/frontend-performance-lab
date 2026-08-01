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
        'rounded-2xl border border-border-subtle bg-background-base text-foreground-primary shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:border-border-strong overflow-hidden transition-all duration-220 ease-out',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
