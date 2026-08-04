<template>
  <div class="browser-apis-page">
    <header class="page-header">
      <h1>Browser API Knowledge Graph</h1>
      <p>
        Master the platform. Understand the deeply integrated native APIs that power
        high-performance web applications.
      </p>
    </header>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Browser APIs (e.g., 'virtual scrolling', 'layout thrashing')..."
        class="search-box"
      />
    </div>

    <div class="api-grid">
      <ApiCard v-for="api in filteredApis" :key="api.id" :api="api" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchPlatform } from '@shared/utils/search/index'
import { getAllBrowserAPIs } from '@shared/registry/browser-apis'
import ApiCard from '@/components/ApiCard.vue'

const searchQuery = ref('')

const allApis = getAllBrowserAPIs().sort(
  (a, b) => b.usageStats.popularity - a.usageStats.popularity
)

const filteredApis = computed(() => {
  if (!searchQuery.value.trim()) return allApis

  const results = searchPlatform({
    query: searchQuery.value,
    type: 'browser-api'
  })

  return results.map(r => r.item).sort((a, b) => b.usageStats.popularity - a.usageStats.popularity)
})
</script>

<style scoped>
.browser-apis-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}
.search-box {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, #333);
  background: var(--bg-background-surface, #1e1e1e);
  color: var(--text-primary, #fff);
  margin-bottom: 2rem;
}
.api-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.api-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-background-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.api-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-color, #646cff);
}
.api-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.api-header h2 {
  margin: 0;
  font-size: 1.25rem;
}
.category-badge {
  background: rgba(100, 108, 255, 0.2);
  color: #a5b4fc;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
.description {
  color: var(--text-secondary, #aaa);
  margin-bottom: 1.5rem;
  flex-grow: 1;
}
.meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}
.difficulty {
  font-weight: 600;
}
.difficulty.beginner {
  color: #4ade80;
}
.difficulty.intermediate {
  color: #facc15;
}
.difficulty.advanced {
  color: #f87171;
}
.popularity {
  font-weight: 600;
  color: #fb923c;
}
</style>
