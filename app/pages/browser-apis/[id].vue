<template>
  <div class="api-detail-page" v-if="api">
    <NuxtLink to="/browser-apis" class="back-link">
      <LucideArrowLeft class="icon" /> Back to APIs
    </NuxtLink>

    <header class="api-header">
      <div class="header-main">
        <h1>{{ api.name }}</h1>
        <span class="category-badge">{{ api.category }}</span>
      </div>
      <p class="description">{{ api.description }}</p>

      <div class="meta-stats">
        <div class="stat-card">
          <span class="label">Support</span>
          <span class="value">{{ api.browserSupport }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Baseline</span>
          <span class="value">{{ api.baseline }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Impact</span>
          <span class="value" :class="api.performanceImpact.toLowerCase()">{{
            api.performanceImpact
          }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Popularity</span>
          <span class="value popularity">🔥 {{ api.usageStats.popularity }}</span>
        </div>
      </div>
    </header>

    <div class="content-grid">
      <!-- Left Column -->
      <div class="main-column">
        <section class="section">
          <h2>When to Use</h2>
          <ul class="check-list">
            <li v-for="(item, idx) in api.whenToUse" :key="'use-' + idx">
              <LucideCheckCircle class="check-icon" /> {{ item }}
            </li>
          </ul>
        </section>

        <section class="section">
          <h2>When NOT to Use</h2>
          <ul class="cross-list">
            <li v-for="(item, idx) in api.whenNotToUse" :key="'nouse-' + idx">
              <LucideXCircle class="cross-icon" /> {{ item }}
            </li>
          </ul>
        </section>

        <section class="section">
          <h2>Code Examples</h2>
          <div class="example-card" v-for="(example, idx) in api.examples" :key="'ex-' + idx">
            <h3>{{ example.title }}</h3>
            <p>{{ example.explanation }}</p>
            <div class="code-wrapper">
              <pre><code>{{ example.code }}</code></pre>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="side-column">
        <section class="section">
          <h2>Advantages</h2>
          <ul class="bullet-list">
            <li v-for="(item, idx) in api.advantages" :key="'adv-' + idx">{{ item }}</li>
          </ul>
        </section>

        <section class="section">
          <h2>Limitations</h2>
          <ul class="bullet-list limitation">
            <li v-for="(item, idx) in api.limitations" :key="'lim-' + idx">{{ item }}</li>
          </ul>
        </section>

        <section class="section">
          <h2>Common Mistakes</h2>
          <ul class="bullet-list mistake">
            <li v-for="(item, idx) in api.commonMistakes" :key="'mistake-' + idx">{{ item }}</li>
          </ul>
        </section>

        <section class="section">
          <h2>References</h2>
          <ul class="link-list">
            <li v-for="(ref, idx) in api.references" :key="'ref-' + idx">
              <a :href="ref.url" target="_blank" rel="noopener noreferrer">
                {{ ref.title }} <LucideExternalLink class="ext-icon" />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h1>API Not Found</h1>
    <NuxtLink to="/browser-apis">Return to Browser APIs</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBrowserAPI } from '@shared/registry/browser-apis'
import {
  ArrowLeft as LucideArrowLeft,
  CheckCircle as LucideCheckCircle,
  XCircle as LucideXCircle,
  ExternalLink as LucideExternalLink
} from 'lucide-vue-next'

const route = useRoute()
const apiId = route.params.id as string

const api = computed(() => getBrowserAPI(apiId))
</script>

<style scoped>
.api-detail-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary, #aaa);
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  transition: color 0.2s;
}
.back-link:hover {
  color: var(--primary-color, #646cff);
}
.icon {
  width: 18px;
  height: 18px;
}
.ext-icon {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  opacity: 0.7;
}

.api-header {
  margin-bottom: 3rem;
}
.header-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.header-main h1 {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(90deg, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.category-badge {
  background: rgba(100, 108, 255, 0.2);
  color: #a5b4fc;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(100, 108, 255, 0.3);
}
.description {
  font-size: 1.2rem;
  color: var(--text-secondary, #ccc);
  max-width: 800px;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.meta-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  background: var(--bg-background-surface, #1e1e1e);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color, #333);
}
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.stat-card .label {
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-card .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}
.value.high {
  color: #f87171;
}
.value.medium {
  color: #facc15;
}
.value.low {
  color: #4ade80;
}
.value.popularity {
  color: #fb923c;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.section {
  margin-bottom: 2.5rem;
}
.section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color, #333);
}

.check-list,
.cross-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.check-list li,
.cross-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  color: var(--text-primary, #eaeaea);
}
.check-icon {
  color: #4ade80;
  flex-shrink: 0;
  margin-top: 2px;
}
.cross-icon {
  color: #f87171;
  flex-shrink: 0;
  margin-top: 2px;
}

.bullet-list {
  padding-left: 1.2rem;
  color: var(--text-primary, #eaeaea);
  line-height: 1.5;
}
.bullet-list li {
  margin-bottom: 0.75rem;
}
.bullet-list.limitation li {
  color: #fca5a5;
}
.bullet-list.mistake li {
  color: #f87171;
}

.link-list {
  list-style: none;
  padding: 0;
}
.link-list li {
  margin-bottom: 0.75rem;
}
.link-list a {
  color: #818cf8;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}
.link-list a:hover {
  color: #a5b4fc;
  text-decoration: underline;
}

.example-card {
  background: var(--bg-background-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.example-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #e2e8f0;
}
.example-card p {
  color: var(--text-secondary, #aaa);
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
.code-wrapper {
  background: #111;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid #222;
}
.code-wrapper pre {
  margin: 0;
  font-family: var(--font-mono, monospace);
  font-size: 0.9rem;
  line-height: 1.5;
  color: #a5b4fc;
}

.not-found {
  text-align: center;
  padding: 5rem 2rem;
}
.not-found h1 {
  margin-bottom: 1rem;
  color: #f87171;
}
.not-found a {
  color: var(--primary-color, #646cff);
  text-decoration: none;
}
</style>
