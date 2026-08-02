<template>
  <section class="py-16 border-b border-border-subtle-subtle bg-background-surface/30">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-sm font-semibold text-foreground-muted uppercase tracking-widest mb-8">
        Built for modern frontend frameworks
      </p>
      <div class="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70">
        <div
          v-for="framework in frameworks"
          :key="framework"
          class="flex items-center gap-2 text-foreground-primary font-bold text-lg grayscale hover:grayscale-0 transition-all duration-300"
        >
          <!-- We use simple CSS checkmarks or text for now, but in a real app these would be SVG logos -->
          <CheckIcon class="w-5 h-5 text-primary" />
          <span>{{ framework }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'

const frameworks = ['Vue', 'React', 'Nuxt', 'Next.js', 'Angular', 'Svelte']
</script>
