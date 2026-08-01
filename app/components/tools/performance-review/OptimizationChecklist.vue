<template>
  <div class="bg-card border border-border rounded-xl p-6 shadow-subtle">
    <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
      <span>📋</span> Optimization Checklist
    </h3>
    <ul class="space-y-3">
      <li v-for="item in checklist" :key="item.id" class="flex items-start gap-3">
        <input
          v-model="item.completed"
          type="checkbox"
          class="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <span
          class="text-sm text-text-secondary"
          :class="{ 'line-through opacity-50': item.completed }"
          >{{ item.title }}</span
        >
      </li>
      <li v-if="checklist.length === 0" class="text-sm text-text-secondary italic text-success">
        No critical optimizations required! You're good to go.
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { OptimizationChecklist } from '@schemas/analyzer'

defineProps<{
  checklist: OptimizationChecklist[]
}>()
</script>
