<template>
  <NuxtLink :to="`/browser-apis/${api.id}`" class="api-card">
    <div class="api-header">
      <h2>{{ api.name }}</h2>
      <span class="category-badge">{{ api.category }}</span>
    </div>
    <p class="description">{{ api.description }}</p>
    <div class="meta">
      <span :class="['difficulty', api.difficulty.toLowerCase()]">
        {{ api.difficulty }}
      </span>
      <span class="popularity">⚡ {{ api.usageStats.popularity }}% usage</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BrowserAPI } from '@shared/schemas/browser-api'

defineProps<{
  api: BrowserAPI
}>()
</script>
