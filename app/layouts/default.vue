<template>
  <div class="min-h-screen flex w-full bg-background">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 border-r border-border bg-surface flex flex-col hidden md:flex">
      <div class="h-16 flex items-center px-6 border-b border-border">
        <h1 class="font-bold text-lg text-primary tracking-tight">Performance Lab</h1>
      </div>
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">
          <li>
            <NuxtLink to="/" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              About
            </NuxtLink>
          </li>
          <li class="pt-4 pb-2 px-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-text-secondary">Experiments</span>
          </li>
          <li>
            <NuxtLink to="/experiments/virtualization" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              Rendering Virtualization
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/experiments/reactivity" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              Reactivity Visualizer
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/experiments/concurrency" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              Event Loop & Concurrency
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/experiments/rendering" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              Rendering & Layout Thrashing
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/experiments/memory-vitals" class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-border/50 text-text-secondary hover:text-text-primary" active-class="bg-border text-text-primary">
              Memory & Core Web Vitals
            </NuxtLink>
          </li>
          <!-- More experiments will go here -->
        </ul>
      </nav>
      <div class="p-4 border-t border-border">
        <button class="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg shadow-subtle hover:bg-border/50 transition-colors text-sm font-medium" @click="toggleTheme">
          Toggle Theme
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Header for mobile / extra tools -->
      <header class="h-16 border-b border-border bg-surface/80 backdrop-blur-md flex items-center px-6 md:px-8 shrink-0">
        <div class="flex-1"/>
        <div class="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" class="text-text-secondary hover:text-text-primary transition-colors">
            GitHub
          </a>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8">
        <div class="max-w-6xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Theme logic relies on root class toggling

const toggleTheme = () => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark')
  }
}
</script>
