<template>
  <div class="max-w-4xl mx-auto pb-12">
    <div class="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div class="p-8 md:p-12 markdown-body" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import rawReadme from '~/../README.md?raw'

useHead({
  title: 'About - Frontend Performance Lab'
})

// Parse the raw markdown into HTML
const htmlContent = computed(() => {
  return marked.parse(rawReadme)
})
</script>

<style>
/* Custom styling for the parsed markdown since we aren't using Tailwind Typography */
.markdown-body {
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.markdown-body h1, 
.markdown-body h2, 
.markdown-body h3 {
  color: var(--color-text-primary);
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
.markdown-body h1 { font-size: 2.25rem; text-align: center; }
.markdown-body h2 { font-size: 1.5rem; padding-bottom: 0.3rem; border-bottom: 1px solid var(--color-border); }
.markdown-body h3 { font-size: 1.25rem; }
.markdown-body p { margin-bottom: 1rem; }
.markdown-body a { color: var(--color-primary); text-decoration: none; }
.markdown-body a:hover { text-decoration: underline; }
.markdown-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.markdown-body li { margin-bottom: 0.5rem; }
.markdown-body blockquote {
  border-left: 4px solid var(--color-primary);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  padding: 1rem;
  border-radius: 0.5rem;
}
.markdown-body code {
  background-color: var(--color-surface);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
  border: 1px solid var(--color-border);
}
.markdown-body pre {
  background-color: #0d1117;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
}
.markdown-body pre code {
  background-color: transparent;
  padding: 0;
  border: none;
  color: #c9d1d9;
}
.markdown-body hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2rem 0;
}
</style>
