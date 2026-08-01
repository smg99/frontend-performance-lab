<script setup lang="ts">
import { ProgressRoot, ProgressIndicator } from 'radix-vue'
import { cn } from '../../utils/cn'
import { computed } from 'vue'

interface Props {
  value: number
  max?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <ProgressRoot
    :value="value"
    :max="max"
    :class="cn('relative overflow-hidden bg-background-hover rounded-full w-full h-2', props.class)"
  >
    <ProgressIndicator
      class="bg-primary w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rounded-full"
      :style="{ transform: `translateX(-${100 - percentage}%)` }"
    />
  </ProgressRoot>
</template>
