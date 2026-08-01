<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-bold text-text-primary tracking-tight">Performance Dashboard</h2>
      <p class="text-text-secondary mt-1 text-lg">Interactive frontend performance playground.</p>
    </div>

    <!-- Metrics Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PerformanceMetricCard title="Average FPS" value="60" unit="fps" :trend="0" />
      <PerformanceMetricCard title="Memory Usage" value="45" unit="MB" :trend="-5" />
      <PerformanceMetricCard title="DOM Nodes" value="1.2" unit="k" :trend="10" />
      <PerformanceMetricCard title="Render Time" value="12" unit="ms" :trend="2" />
    </div>

    <!-- Intro Card -->
    <div class="bg-card border border-border rounded-xl p-6 shadow-subtle dark:shadow-subtle-dark">
      <h3 class="text-xl font-semibold mb-4 text-text-primary">Welcome to the Lab</h3>
      <p class="text-text-secondary mb-4 leading-relaxed">
        This is not a tutorial. Every concept here is measurable, visual, and interactive.
        Explore the experiments in the sidebar to observe the effect of different optimization
        techniques on Core Web Vitals, FPS, Memory, and more.
      </p>
      <NuxtLink to="/experiments/virtualization" class="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
        Start First Experiment
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard logic will go here
</script>
