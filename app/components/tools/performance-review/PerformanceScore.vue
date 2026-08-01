<template>
  <div
    class="bg-background-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden"
  >
    <div
      class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-background-surface to-background-base"
    >
      <div class="flex items-center gap-6">
        <!-- Grade -->
        <div class="text-center">
          <h3 class="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Grade</h3>
          <div class="text-5xl font-black" :class="gradeColor">
            {{ report.overallScore }}
          </div>
        </div>

        <div class="w-px h-16 bg-border-subtle hidden md:block" />

        <!-- Score & Confidence -->
        <div class="flex flex-col gap-2">
          <div>
            <div class="flex justify-between items-end text-sm mb-1">
              <span class="text-text-secondary font-medium">Performance Score</span>
              <span class="font-bold text-text-primary">{{ report.performanceScore }}/100</span>
            </div>
            <div
              class="w-48 bg-background-base rounded-full h-2 overflow-hidden border border-border-subtle"
            >
              <div class="h-full bg-primary" :style="{ width: report.performanceScore + '%' }" />
            </div>
          </div>
          <div>
            <div class="flex justify-between items-end text-sm mb-1">
              <span class="text-text-secondary font-medium">AI Confidence</span>
              <span class="font-bold text-text-primary">{{ report.confidenceScore }}%</span>
            </div>
            <div
              class="w-48 bg-background-base rounded-full h-2 overflow-hidden border border-border-subtle"
            >
              <div class="h-full bg-info" :style="{ width: report.confidenceScore + '%' }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Estimates Grid -->
      <div
        class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-background-base p-4 rounded-lg border border-border-subtle"
      >
        <div>
          <span class="text-text-muted text-xs uppercase tracking-wide block mb-0.5">FPS Gain</span>
          <span class="text-text-primary font-medium">{{ report.estimates.performanceGain }}</span>
        </div>
        <div>
          <span class="text-text-muted text-xs uppercase tracking-wide block mb-0.5">Memory</span>
          <span class="text-text-primary font-medium">{{ report.estimates.memoryReduction }}</span>
        </div>
        <div>
          <span class="text-text-muted text-xs uppercase tracking-wide block mb-0.5"
            >Rendering</span
          >
          <span class="text-text-primary font-medium">{{
            report.estimates.renderingImprovement
          }}</span>
        </div>
        <div>
          <span class="text-text-muted text-xs uppercase tracking-wide block mb-0.5"
            >Est. Time</span
          >
          <span class="text-text-primary font-medium">{{ report.estimates.timeToFix }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReviewReport } from '@schemas/analyzer'

const props = defineProps<{
  report: ReviewReport
}>()

const gradeColor = computed(() => {
  if (['A+', 'A'].includes(props.report.overallScore)) return 'text-success'
  if (['B'].includes(props.report.overallScore)) return 'text-info'
  if (['C'].includes(props.report.overallScore)) return 'text-warning'
  return 'text-error'
})
</script>
