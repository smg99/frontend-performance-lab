<script setup lang="ts">
import Container from '../components/layout/Container.vue'
import Section from '../components/layout/Section.vue'
import PageHeader from '../components/patterns/PageHeader.vue'
import StatCard from '../components/patterns/StatCard.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { BeakerIcon } from 'lucide-vue-next'
</script>

<template>
  <Container class="py-8 lg:py-12">
    <PageHeader
      title="Performance Dashboard"
      description="Interactive frontend performance playground. Measure, visualize, and optimize."
    />

    <!-- Metrics Summary -->
    <Section class="py-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Average FPS" value="60 fps" :trend="{ direction: 'up', value: '1%' }" />
        <StatCard title="Memory Usage" value="45 MB" :trend="{ direction: 'down', value: '5%' }" />
        <StatCard title="DOM Nodes" value="1.2k" :trend="{ direction: 'neutral', value: '0%' }" />
        <StatCard title="Render Time" value="12 ms" :trend="{ direction: 'up', value: '2ms' }" />
      </div>
    </Section>

    <!-- Intro Card -->
    <Section class="py-4">
      <Card class="p-8 lg:p-12 relative overflow-hidden bg-background-surface">
        <div class="relative z-10 max-w-2xl">
          <div
            class="inline-flex p-3 rounded-xl bg-background-base border border-border-subtle shadow-sm mb-6 text-primary"
          >
            <BeakerIcon class="w-8 h-8" />
          </div>
          <h2 class="text-3xl font-bold text-foreground-primary mb-4 tracking-tight">
            Welcome to the Lab
          </h2>
          <p class="text-lg text-foreground-muted mb-8 leading-relaxed">
            This is not a tutorial. Every concept here is measurable, visual, and interactive.
            Explore the Knowledge Graph to observe the effect of different optimization techniques
            on Core Web Vitals, FPS, Memory, and more.
          </p>
          <div class="flex items-center gap-4">
            <Button as="NuxtLink" href="/experiments/virtualization" size="lg">
              Start Exploring
            </Button>
            <Button
              variant="outline"
              size="lg"
              as="button"
              @click="
                () =>
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
              "
            >
              Open Command Palette
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  </Container>
</template>
