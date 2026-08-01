<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal'
})
</script>

<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :class="
      cn(
        'bg-border-subtle',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        props.class
      )
    "
  />
</template>
