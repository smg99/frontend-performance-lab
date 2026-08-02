<template>
  <div class="overflow-x-auto border border-border-subtle rounded-lg bg-background-surface">
    <table class="w-full text-sm text-left text-foreground-muted">
      <thead
        class="text-xs text-foreground-primary uppercase bg-background border-b border-border-subtle"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Situation</th>
          <th scope="col" class="px-6 py-3 text-success">Recommended</th>
          <th scope="col" class="px-6 py-3 text-warning">Alternative</th>
          <th scope="col" class="px-6 py-3 text-danger">Avoid</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="idx"
          class="border-b border-border-subtle last:border-0 hover:bg-background/50"
        >
          <th scope="row" class="px-6 py-4 font-medium text-foreground-primary whitespace-nowrap">
            {{ row.situation }}
          </th>
          <td class="px-6 py-4">
            <span
              class="bg-success/10 text-success border border-success/30 px-2 py-1 rounded text-xs"
              >{{ row.recommended }}</span
            >
          </td>
          <td class="px-6 py-4">
            <span
              class="bg-warning/10 text-warning border border-warning/30 px-2 py-1 rounded text-xs"
              >{{ row.alternative }}</span
            >
          </td>
          <td class="px-6 py-4">
            <span
              class="bg-danger/10 text-danger border border-danger/30 px-2 py-1 rounded text-xs"
              >{{ row.avoid }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { DecisionMatrixRow } from '~/types/learning'

defineProps<{
  rows: DecisionMatrixRow[]
}>()
</script>
