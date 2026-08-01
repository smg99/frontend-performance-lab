<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  as?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'section'
})
</script>

<template>
  <component :is="as" :class="cn('py-12 md:py-16 lg:py-24', props.class)">
    <slot />
  </component>
</template>
