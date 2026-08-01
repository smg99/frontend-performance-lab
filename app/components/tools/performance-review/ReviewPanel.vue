<template>
  <div class="h-full overflow-y-auto bg-card p-6 space-y-6">
    <div v-if="!report" class="flex flex-col items-center justify-center h-full text-text-secondary">
      <div class="text-4xl mb-4">🔬</div>
      <p>Paste your code and click Analyze to generate a performance review.</p>
    </div>

    <template v-else>
      <div class="flex justify-between items-end">
        <h2 class="text-2xl font-bold text-text-primary tracking-tight">Performance Report</h2>
        <span class="text-sm text-text-secondary">Analyzed 1 file</span>
      </div>

      <PerformanceScore :score="report.overallScore" :metrics="report.metrics" />
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-text-primary">Detected Issues ({{ report.issues.length }})</h3>
          <IssueCard v-for="issue in report.issues" :key="issue.id" :issue="issue" />
          <div v-if="report.issues.length === 0" class="bg-success/10 border border-success/30 p-6 rounded-lg text-center">
            <span class="text-4xl block mb-2">🎉</span>
            <span class="text-success font-bold block">No performance bottlenecks detected!</span>
            <p class="text-sm text-success-foreground mt-1">Your code looks incredibly optimized.</p>
          </div>
        </div>
        
        <div class="space-y-6">
          <OptimizationChecklist :checklist="report.checklist" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ReviewReport } from '~/../shared/schemas/analyzer'
import PerformanceScore from './PerformanceScore.vue'
import OptimizationChecklist from './OptimizationChecklist.vue'
import IssueCard from './IssueCard.vue'

defineProps<{
  report: ReviewReport | null
}>()
</script>
