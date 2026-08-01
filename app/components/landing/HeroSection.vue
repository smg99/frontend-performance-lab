<template>
  <section
    class="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden border-b border-border-subtle bg-background-base"
  >
    <!-- Grid background -->
    <div class="absolute inset-0 z-0 opacity-20 hero-grid pointer-events-none" />

    <!-- Animated background mesh/blobs -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-[-20%] left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-blob"
      />
      <div
        class="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-blob animation-delay-2000"
      />
    </div>

    <!-- Radial glow behind headline -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-primary/5 blur-[150px] pointer-events-none"
    />

    <div class="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-4">
      <div
        class="inline-flex items-center rounded-full border border-border-strong bg-background-surface/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-foreground-primary mb-8 shadow-sm"
      >
        <span class="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse-slow" />
        MCP Ready &bull; AST Powered &bull; AI First
      </div>

      <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-foreground-primary mb-6">
        Master Frontend<br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400"
          >Performance Visually.</span
        >
      </h1>

      <p class="text-xl lg:text-2xl text-foreground-muted mb-12 font-medium max-w-2xl mx-auto">
        Learn &rarr; Analyze &rarr; Optimize &rarr; Ship
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-3xl">
        <Button
          size="lg"
          class="w-full sm:w-auto text-lg px-8 py-6 rounded-full"
          as="NuxtLink"
          href="/experiments/virtualization"
        >
          Start Learning
        </Button>
        <Button
          variant="outline"
          size="lg"
          class="w-full sm:w-auto text-lg px-8 py-6 rounded-full"
          as="NuxtLink"
          href="/tools/performance-review"
        >
          Open Analyzer
        </Button>
        <button
          class="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-transparent rounded-full text-foreground-muted hover:text-foreground-primary hover:bg-background-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          @click="openSearch"
        >
          <SearchIcon class="w-5 h-5" />
          <span class="font-medium text-lg">Search Everything</span>
          <div class="flex items-center gap-1 text-foreground-muted ml-1">
            <kbd
              class="font-mono text-sm bg-background-surface border border-border-strong rounded px-2 py-0.5 shadow-sm text-foreground-muted"
              >⌘K</kbd
            >
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'
import { SearchIcon } from 'lucide-vue-next'

const openSearch = () => {
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }
}
</script>

<style scoped>
.hero-grid {
  background-image:
    linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px);
  background-size: 40px 40px;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animate-blob {
  animation: blob 15s infinite alternate ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-blob,
  .animate-pulse-slow {
    animation: none;
    transform: none;
  }
}
</style>
