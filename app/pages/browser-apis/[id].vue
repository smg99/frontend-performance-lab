<template>
  <div class="api-detail-page" v-if="api">
    <header class="header">
      <div class="breadcrumb">
        <NuxtLink to="/browser-apis">← Back to Registry</NuxtLink>
      </div>
      <h1>{{ api.name }}</h1>
      <p class="description">{{ api.description }}</p>
      
      <div class="metadata-tags">
        <span class="tag category">{{ api.category }}</span>
        <span class="tag baseline">{{ api.baseline }} ({{ api.browserSupport }})</span>
        <span class="tag impact">Impact: {{ api.performanceImpact }}</span>
        <span class="tag difficulty">{{ api.difficulty }}</span>
      </div>
    </header>

    <div class="content-grid">
      <div class="main-content">
        <section class="card">
          <h2>When to Use</h2>
          <ul class="check-list">
            <li v-for="item in api.whenToUse" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="card">
          <h2>When NOT to Use</h2>
          <ul class="cross-list">
            <li v-for="item in api.whenNotToUse" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="card">
          <h2>Advantages vs Limitations</h2>
          <div class="split-view">
            <div>
              <h3>Advantages</h3>
              <ul>
                <li v-for="adv in api.advantages" :key="adv">{{ adv }}</li>
              </ul>
            </div>
            <div>
              <h3>Limitations</h3>
              <ul>
                <li v-for="lim in api.limitations" :key="lim">{{ lim }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="card" v-if="api.examples.length">
          <h2>Production Examples</h2>
          <div v-for="ex in api.examples" :key="ex.title" class="example-block">
            <h3>{{ ex.title }}</h3>
            <p>{{ ex.explanation }}</p>
            <pre><code>{{ ex.code }}</code></pre>
          </div>
        </section>

        <section class="card" v-if="api.interviewQuestions.length">
          <h2>Interview Readiness</h2>
          <div v-for="(q, i) in api.interviewQuestions" :key="i" class="qa-block">
            <strong>Q: {{ q.question }}</strong>
            <p>A: {{ q.answer }}</p>
          </div>
        </section>
      </div>

      <aside class="sidebar">
        <div class="sidebar-card">
          <h3>Best Practices</h3>
          <ul class="sidebar-list">
            <li v-for="bp in api.bestPractices" :key="bp">{{ bp }}</li>
          </ul>
        </div>
        
        <div class="sidebar-card danger">
          <h3>Common Mistakes</h3>
          <ul class="sidebar-list">
            <li v-for="mistake in api.commonMistakes" :key="mistake">{{ mistake }}</li>
          </ul>
        </div>

        <div class="sidebar-card" v-if="api.relatedExperiments.length">
          <h3>Related Lab Experiments</h3>
          <ul class="sidebar-list">
            <li v-for="exp in api.relatedExperiments" :key="exp">
              <NuxtLink :to="`/experiments/${exp}`">{{ exp }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="sidebar-card" v-if="api.references.length">
          <h3>References</h3>
          <ul class="sidebar-list">
            <li v-for="ref in api.references" :key="ref.url">
              <a :href="ref.url" target="_blank" rel="noopener">{{ ref.title }}</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
  <div v-else>
    <h1>API Not Found</h1>
    <NuxtLink to="/browser-apis">Return to Registry</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getBrowserAPI } from '@shared/registry/browser-apis'

const route = useRoute()
const id = route.params.id as string
const api = getBrowserAPI(id)
</script>

<style scoped>
.api-detail-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
.header {
  margin-bottom: 2rem;
}
.breadcrumb {
  margin-bottom: 1rem;
}
.breadcrumb a {
  color: var(--primary-color, #646cff);
  text-decoration: none;
}
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
.tag.category { border-color: #646cff; color: #a5b4fc; }
.tag.impact { border-color: #f87171; color: #fca5a5; }

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
}
.card, .sidebar-card {
  background: var(--bg-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.sidebar-card.danger {
  border-color: #7f1d1d;
  background: rgba(127, 29, 29, 0.1);
}
.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
ul.check-list li {
  list-style: none;
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}
ul.check-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4ade80;
}
ul.cross-list li {
  list-style: none;
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}
ul.cross-list li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #f87171;
}
.example-block pre {
  background: #000;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}
.qa-block {
  background: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.sidebar-list li {
  margin-bottom: 0.75rem;
}
.sidebar-list a {
  color: var(--primary-color, #646cff);
}
</style>
