<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-mono/400.css'
import { useHead } from '#imports'

useHead({
  titleTemplate: titleChunk => {
    return titleChunk ? `${titleChunk} - Frontend Performance Lab` : 'Frontend Performance Lab'
  },
  htmlAttrs: {
    // Start with dark mode by default for premium SaaS feel
    class: 'dark'
  }
})
</script>
