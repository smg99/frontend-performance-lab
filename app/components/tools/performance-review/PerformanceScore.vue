<template>
  <div
    class="bg-card border border-border rounded-xl p-6 shadow-subtle flex items-center justify-between"
  >
    <div>
      <h3 class="text-sm text-text-secondary uppercase tracking-wider font-bold mb-1">
        Performance Score
      </h3>
      <div class="text-5xl font-black" :class="gradeColor">
        {{ score }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 text-sm w-1/2">
      <div v-for="(val, key) in metrics" :key="key" class="flex flex-col">
        <span class="text-text-secondary">{{ key }}</span>
        <div class="w-full bg-border rounded-full h-2 mt-1 overflow-hidden">
          <div class="h-full bg-primary" :style="{ width: val + '%' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PerformanceScoreCategory, PerformanceMetrics } from '@schemas/analyzer'

const props = defineProps<{
  score: PerformanceScoreCategory
  metrics: PerformanceMetrics
}>()

const gradeColor = computed(() => {
  if (['A+', 'A'].includes(props.score)) return 'text-success'
  if (['B'].includes(props.score)) return 'text-info'
  if (['C'].includes(props.score)) return 'text-warning'
  return 'text-danger'
})
</script>
