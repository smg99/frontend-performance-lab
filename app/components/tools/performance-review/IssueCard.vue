<template>
  <div class="bg-surface border border-border rounded-lg p-5 shadow-sm">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-xl">{{ icon }}</span>
        <h4 class="font-bold text-text-primary">{{ issue.title }}</h4>
      </div>
      <span class="text-xs px-2 py-1 rounded font-bold" :class="severityBadge">
        {{ issue.severity }}
      </span>
    </div>
    
    <p class="text-sm text-text-secondary mb-4">{{ issue.description }}</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="bg-card border border-border p-3 rounded text-sm">
        <span class="block font-bold text-danger mb-1">Impact</span>
        <span class="text-text-secondary">{{ issue.impact }}</span>
      </div>
      <div class="bg-card border border-border p-3 rounded text-sm">
        <span class="block font-bold text-success mb-1">Fix</span>
        <span class="text-text-secondary">{{ issue.fix }}</span>
      </div>
    </div>

    <!-- Tie back to knowledge base -->
    <div v-if="issue.relatedExperimentIds?.length" class="mt-4 pt-4 border-t border-border flex items-center gap-3">
      <span class="text-xs text-text-secondary">Learn more:</span>
      <NuxtLink 
        v-for="expId in issue.relatedExperimentIds" 
        :key="expId"
        :to="`/experiments/${expId}`"
        class="text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
      >
        {{ expId }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Issue } from '~/../shared/schemas/analyzer'

const props = defineProps<{ issue: Issue }>()

const icon = computed(() => {
  if (props.issue.category === 'Rendering') return '🎨'
  if (props.issue.category === 'Memory') return '🧠'
  if (props.issue.category === 'CPU') return '⚙️'
  return '⚠️'
})

const severityBadge = computed(() => {
  if (props.issue.severity === 'Critical') return 'bg-danger/20 text-danger'
  if (props.issue.severity === 'Warning') return 'bg-warning/20 text-warning-foreground'
  return 'bg-info/20 text-info'
})
</script>
