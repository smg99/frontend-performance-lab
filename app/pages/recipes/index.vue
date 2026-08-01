<template>
  <div class="recipes-page">
    <header class="page-header">
      <h1>Performance Recipes</h1>
      <p>Real-world frontend problems, diagnosed and solved. Architectural guidance for large-scale applications.</p>
    </header>

    <div class="filters">
      <input type="text" v-model="searchQuery" placeholder="Search Recipes (e.g., 'slow table', 'infinite scroll')..." class="search-box" />
    </div>

    <div class="recipe-grid">
      <NuxtLink v-for="recipe in filteredRecipes" :key="recipe.id" :to="`/recipes/${recipe.id}`" class="recipe-card">
        <div class="recipe-header">
          <h2>{{ recipe.title }}</h2>
        </div>
        <p class="description">{{ recipe.summary }}</p>
        <div class="symptoms">
          <strong>Common Symptoms:</strong>
          <ul>
            <li v-for="symptom in recipe.symptoms.slice(0, 2)" :key="symptom">{{ symptom }}</li>
          </ul>
        </div>
        <div class="meta">
          <span class="difficulty" :class="recipe.difficulty.toLowerCase()">{{ recipe.difficulty }}</span>
          <span class="time-estimate">⏱ {{ recipe.estimatedImplementationTime }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchPlatform } from '@shared/utils/search/index'
import { getAllRecipes } from '@shared/registry/recipes'

const searchQuery = ref('')

const allRecipes = getAllRecipes()

const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) return allRecipes

  const results = searchPlatform({
    query: searchQuery.value,
    type: 'recipe'
  })
  
  return results.map(r => r.item)
})
</script>

<style scoped>
.recipes-page {
  padding: 2rem;
  max-width: 1400px;
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
  background: var(--bg-surface, #1e1e1e);
  color: var(--text-primary, #fff);
  margin-bottom: 2rem;
}
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}
.recipe-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  border-color: var(--primary-color, #646cff);
}
.recipe-header {
  margin-bottom: 1rem;
}
.recipe-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-primary, #fff);
}
.description {
  color: var(--text-secondary, #aaa);
  margin-bottom: 1rem;
}
.symptoms {
  background: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}
.symptoms ul {
  padding-left: 1.2rem;
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary, #aaa);
}
.meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  align-items: center;
}
.difficulty {
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
}
.difficulty.beginner { color: #4ade80; }
.difficulty.intermediate { color: #facc15; }
.difficulty.advanced { color: #f87171; }
.time-estimate {
  color: #9ca3af;
}
</style>
