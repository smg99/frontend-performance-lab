<template>
  <div class="recipe-detail-page" v-if="recipe">
    <header class="header">
      <div class="breadcrumb">
        <NuxtLink to="/recipes">← Back to Recipes</NuxtLink>
      </div>
      <h1>{{ recipe.title }}</h1>
      <p class="summary">{{ recipe.summary }}</p>
      
      <div class="metadata-tags">
        <span class="tag difficulty" :class="recipe.difficulty.toLowerCase()">{{ recipe.difficulty }}</span>
        <span class="tag time">⏱ {{ recipe.estimatedImplementationTime }}</span>
        <span class="tag impact" :class="recipe.performanceImpact.toLowerCase()">Impact: {{ recipe.performanceImpact }}</span>
      </div>
    </header>

    <div class="content-grid">
      <div class="main-content">
        <!-- Problem Space -->
        <section class="card">
          <h2>The Problem</h2>
          <p>{{ recipe.problem }}</p>
          
          <h3>Common Symptoms</h3>
          <ul>
            <li v-for="symptom in recipe.symptoms" :key="symptom">{{ symptom }}</li>
          </ul>

          <h3>Root Causes</h3>
          <ul>
            <li v-for="cause in recipe.rootCauses" :key="cause">{{ cause }}</li>
          </ul>
        </section>
        
        <!-- Decision Matrix -->
        <section class="card">
          <h2>Decision Matrix</h2>
          <p class="subtitle">Architectural decision guidance for different scenarios.</p>
          <div v-for="(matrix, i) in recipe.decisionMatrix" :key="i" class="matrix-block">
            <h4>Scenario: {{ matrix.scenario }}</h4>
            <div class="matrix-details">
              <div><strong>Recommended:</strong> <span class="highlight">{{ matrix.recommendedApproach }}</span></div>
              <div><strong>Alternatives:</strong> {{ matrix.alternatives.join(', ') }}</div>
              <p><strong>Trade-offs:</strong> {{ matrix.tradeoffs }}</p>
              <p><strong>Why:</strong> {{ matrix.why }}</p>
            </div>
          </div>
        </section>

        <!-- When NOT to Use -->
        <section class="card danger-card" v-if="recipe.whenNotToUse && recipe.whenNotToUse.length">
          <h2>When NOT To Use</h2>
          <ul class="cross-list">
            <li v-for="item in recipe.whenNotToUse" :key="item">{{ item }}</li>
          </ul>
        </section>

        <!-- Approaches -->
        <section class="card">
          <h2>Approaches</h2>
          <div class="split-view">
            <div>
              <h3>Recommended</h3>
              <ul class="check-list">
                <li v-for="app in recipe.recommendedApproaches" :key="app">{{ app }}</li>
              </ul>
            </div>
            <div>
              <h3>Avoid</h3>
              <ul class="cross-list">
                <li v-for="app in recipe.approachesToAvoid" :key="app">{{ app }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Before/After -->
        <section class="card" v-if="recipe.beforeAfterComparison">
          <h2>Code Comparison</h2>
          <p>{{ recipe.beforeAfterComparison.explanation }}</p>
          <div class="split-view code-split">
            <div>
              <h3>Before (Bad)</h3>
              <pre><code>{{ recipe.beforeAfterComparison.beforeCode }}</code></pre>
            </div>
            <div>
              <h3>After (Good)</h3>
              <pre><code>{{ recipe.beforeAfterComparison.afterCode }}</code></pre>
            </div>
          </div>
        </section>

      </div>

      <aside class="sidebar">
        <!-- Prerequisites -->
        <div class="sidebar-card">
          <h3>Prerequisites</h3>
          
          <div v-if="recipe.prerequisites.concepts.length" class="prereq-group">
            <strong>Concepts</strong>
            <ul><li v-for="c in recipe.prerequisites.concepts" :key="c">{{ c }}</li></ul>
          </div>
          
          <div v-if="recipe.prerequisites.browserAPIs.length" class="prereq-group">
            <strong>Browser APIs</strong>
            <ul>
              <li v-for="api in recipe.prerequisites.browserAPIs" :key="api">
                <NuxtLink :to="`/browser-apis/${api}`">{{ api }}</NuxtLink>
              </li>
            </ul>
          </div>
          
          <div v-if="recipe.prerequisites.experiments.length" class="prereq-group">
            <strong>Lab Experiments</strong>
            <ul>
              <li v-for="exp in recipe.prerequisites.experiments" :key="exp">
                <NuxtLink :to="`/experiments/${exp}`">{{ exp }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Checklist -->
        <div class="sidebar-card highlight-card">
          <h3>Production Checklist</h3>
          <ul class="check-list">
            <li v-for="item in recipe.productionChecklist" :key="item">{{ item }}</li>
          </ul>
        </div>
        
        <!-- Mistakes -->
        <div class="sidebar-card danger-card">
          <h3>Common Mistakes</h3>
          <ul class="cross-list">
            <li v-for="mistake in recipe.commonMistakes" :key="mistake">{{ mistake }}</li>
          </ul>
        </div>

        <div class="sidebar-card" v-if="recipe.references.length">
          <h3>References</h3>
          <ul class="link-list">
            <li v-for="ref in recipe.references" :key="ref.url">
              <a :href="ref.url" target="_blank" rel="noopener">{{ ref.title }}</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
  <div v-else>
    <h1>Recipe Not Found</h1>
    <NuxtLink to="/recipes">Return to Recipes Library</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipe } from '@shared/registry/recipes'

const route = useRoute()
const id = route.params.id as string
const recipe = getRecipe(id)
</script>

<style scoped>
.recipe-detail-page {
  padding: 2rem;
  max-width: 1500px;
  margin: 0 auto;
}
.header { margin-bottom: 2rem; }
.breadcrumb { margin-bottom: 1rem; }
.breadcrumb a { color: var(--primary-color, #646cff); text-decoration: none; }
.summary { font-size: 1.2rem; color: var(--text-secondary, #aaa); }

.metadata-tags {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.tag {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--bg-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
}
.tag.difficulty.beginner { color: #4ade80; border-color: #4ade80; }
.tag.difficulty.intermediate { color: #facc15; border-color: #facc15; }
.tag.difficulty.advanced { color: #f87171; border-color: #f87171; }
.tag.impact { color: #a5b4fc; border-color: #646cff; }

.content-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 2rem;
}
@media (max-width: 1000px) {
  .content-grid { grid-template-columns: 1fr; }
}

.card, .sidebar-card {
  background: var(--bg-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.danger-card { border-color: #7f1d1d; background: rgba(127, 29, 29, 0.05); }
.highlight-card { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }

.subtitle { color: var(--text-secondary, #aaa); font-style: italic; }

.matrix-block {
  background: rgba(255,255,255,0.03);
  border-left: 4px solid var(--primary-color, #646cff);
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 1.5rem;
}
.matrix-block h4 { margin-top: 0; font-size: 1.1rem; }
.highlight { color: #4ade80; font-weight: bold; }

.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.code-split { gap: 1rem; }

ul.check-list li, ul.cross-list li {
  list-style: none;
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
ul.check-list li::before { content: '✓'; position: absolute; left: 0; color: #4ade80; }
ul.cross-list li::before { content: '✗'; position: absolute; left: 0; color: #f87171; }

pre {
  background: #000;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  border: 1px solid #333;
}

.prereq-group { margin-bottom: 1.25rem; }
.prereq-group ul { padding-left: 1.2rem; margin-top: 0.5rem; font-size: 0.9rem; }
.prereq-group a { color: var(--primary-color, #646cff); text-decoration: none; }
.link-list li { margin-bottom: 0.75rem; }
.link-list a { color: var(--primary-color, #646cff); text-decoration: none; }
</style>
