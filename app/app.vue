<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Frontend Performance Lab` : 'Frontend Performance Lab'
  },
  htmlAttrs: {
    // Start with dark mode by default for premium SaaS feel
    class: 'dark'
  }
})
</script>
