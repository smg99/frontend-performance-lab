<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { SunIcon, ActivityIcon, LayoutTemplateIcon } from 'lucide-vue-next'
import Container from '../components/layout/Container.vue'
import Section from '../components/layout/Section.vue'
import PageHeader from '../components/patterns/PageHeader.vue'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Divider from '../components/ui/Divider.vue'
import Progress from '../components/ui/Progress.vue'
import Tabs from '../components/ui/Tabs.vue'
import Accordion from '../components/ui/Accordion.vue'
import Tooltip from '../components/ui/Tooltip.vue'
import Dialog from '../components/ui/Dialog.vue'
import Callout from '../components/patterns/Callout.vue'
import StatCard from '../components/patterns/StatCard.vue'

// Controls
const theme = ref<'light' | 'dark' | 'system'>('system')
const density = ref<'comfortable' | 'compact'>('comfortable')
const reduceMotion = ref(false)

const isDark = ref(false)
const dialogOpen = ref(false)

onMounted(() => {
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
  }
})

watchEffect(() => {
  if (typeof document !== 'undefined') {
    const html = document.documentElement

    // Theme
    if (theme.value === 'dark' || (theme.value === 'system' && isDark.value)) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Motion
    if (reduceMotion.value) {
      html.style.setProperty('--transition-duration', '0ms')
      html.classList.add('reduce-motion-preview') // simulated class
    } else {
      html.style.removeProperty('--transition-duration')
      html.classList.remove('reduce-motion-preview')
    }
  }
})
</script>

<template>
  <Container class="pb-24">
    <!-- Configuration Panel -->
    <div
      class="sticky top-0 z-40 -mx-4 px-4 py-4 mb-8 bg-background-base/80 backdrop-blur-lg border-b border-border-subtle flex flex-wrap items-center justify-between gap-4"
    >
      <div class="flex items-center gap-2">
        <h1 class="font-semibold text-lg">Design System Preview</h1>
      </div>
      <div class="flex items-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-foreground-muted flex items-center gap-1"
            ><SunIcon class="w-4 h-4" /> Theme</span
          >
          <div class="flex bg-background-surface rounded-lg p-1 border border-border-subtle">
            <button
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                theme === 'light'
                  ? 'bg-background-base shadow-sm text-foreground-primary'
                  : 'text-foreground-muted hover:text-foreground-primary'
              ]"
              @click="theme = 'light'"
            >
              Light
            </button>
            <button
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                theme === 'dark'
                  ? 'bg-background-base shadow-sm text-foreground-primary'
                  : 'text-foreground-muted hover:text-foreground-primary'
              ]"
              @click="theme = 'dark'"
            >
              Dark
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-foreground-muted flex items-center gap-1"
            ><LayoutTemplateIcon class="w-4 h-4" /> Density</span
          >
          <div class="flex bg-background-surface rounded-lg p-1 border border-border-subtle">
            <button
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                density === 'comfortable'
                  ? 'bg-background-base shadow-sm text-foreground-primary'
                  : 'text-foreground-muted hover:text-foreground-primary'
              ]"
              @click="density = 'comfortable'"
            >
              Comfortable
            </button>
            <button
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                density === 'compact'
                  ? 'bg-background-base shadow-sm text-foreground-primary'
                  : 'text-foreground-muted hover:text-foreground-primary'
              ]"
              @click="density = 'compact'"
            >
              Compact
            </button>
          </div>
        </div>

        <label
          class="flex items-center gap-2 text-foreground-muted cursor-pointer hover:text-foreground-primary transition-colors"
        >
          <input
            v-model="reduceMotion"
            type="checkbox"
            class="rounded border-border-strong text-primary focus:ring-primary"
          />
          <ActivityIcon class="w-4 h-4" />
          Reduce Motion
        </label>
      </div>
    </div>

    <!-- Overview -->
    <PageHeader
      title="Foundation Components"
      description="A unified, accessible, and premium visual language. This system utilizes Radix Vue for headless accessibility and Tailwind CSS for robust styling."
    />

    <!-- Buttons -->
    <Section class="py-8" :class="density === 'compact' ? 'py-4' : ''">
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-1">Buttons</h2>
        <p class="text-sm text-foreground-muted">
          Interactive elements supporting various semantic states and sizes.
        </p>
      </div>
      <Card class="p-6 md:p-8 overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="text-xs text-foreground-muted border-b border-border-subtle">
              <th class="pb-3 font-medium">Variant</th>
              <th class="pb-3 font-medium">Default</th>
              <th class="pb-3 font-medium">Hover / Focus</th>
              <th class="pb-3 font-medium">Disabled</th>
              <th class="pb-3 font-medium">Loading</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-subtle">
            <tr
              v-for="variant in ['default', 'secondary', 'outline', 'ghost', 'destructive']"
              :key="variant"
            >
              <td class="py-4 capitalize text-sm font-medium">{{ variant }}</td>
              <td class="py-4"><Button :variant="variant as any">Action</Button></td>
              <td class="py-4">
                <Button
                  :variant="variant as any"
                  class="ring-2 ring-border-focus ring-offset-2 ring-offset-background-base"
                  >Action</Button
                >
              </td>
              <td class="py-4"><Button :variant="variant as any" disabled>Action</Button></td>
              <td class="py-4"><Button :variant="variant as any" loading>Action</Button></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </Section>

    <!-- Badges -->
    <Section class="py-8" :class="density === 'compact' ? 'py-4' : ''">
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-1">Badges & Status</h2>
        <p class="text-sm text-foreground-muted">
          Visual indicators for categorization and status updates.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Error</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </Section>

    <Divider class="my-8" />

    <!-- Patterns -->
    <Section class="py-8" :class="density === 'compact' ? 'py-4' : ''">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-1">Composed Patterns</h2>
        <p class="text-sm text-foreground-muted">Higher-level components built from primitives.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Requests" value="1.2M" :trend="{ direction: 'up', value: '12%' }" />
        <StatCard title="Error Rate" value="0.05%" :trend="{ direction: 'down', value: '2.1%' }" />
        <StatCard
          title="Active Workers"
          value="45"
          :trend="{ direction: 'neutral', value: '0%' }"
        />
      </div>

      <div class="flex flex-col gap-4 mb-8 max-w-3xl">
        <Callout variant="info" title="Optimization Available"
          >We detected multiple layout thrashing occurrences in this component.</Callout
        >
        <Callout variant="warning" title="Memory Leak Detected"
          >Objects in the global scope are retaining memory preventing GC.</Callout
        >
        <Callout variant="success" title="Analysis Complete"
          >100% of files passed validation.</Callout
        >
        <Callout variant="danger" title="Critical Regression"
          >Total Blocking Time increased by 500ms.</Callout
        >
      </div>
    </Section>

    <!-- Interactive -->
    <Section class="py-8" :class="density === 'compact' ? 'py-4' : ''">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-1">Interactive Elements</h2>
        <p class="text-sm text-foreground-muted">Accessible components using Radix Vue.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card class="p-6">
          <h3 class="font-medium mb-4">Tabs</h3>
          <Tabs
            default-value="vue"
            :tabs="[
              { value: 'vue', label: 'Vue.js' },
              { value: 'react', label: 'React' },
              { value: 'vanilla', label: 'Vanilla JS' }
            ]"
          >
            <template #vue>
              <div
                class="p-4 bg-background-surface rounded-lg text-sm font-mono border border-border-subtle text-foreground-muted"
              >
                &lt;template&gt;<br />
                &lt;div&gt;Vue Performance&lt;/div&gt;<br />&lt;/template&gt;
              </div>
            </template>
            <template #react>
              <div
                class="p-4 bg-background-surface rounded-lg text-sm font-mono border border-border-subtle text-foreground-muted"
              >
                export const ReactPerf = () =&gt; &lt;div&gt;React Performance&lt;/div&gt;
              </div>
            </template>
            <template #vanilla>
              <div
                class="p-4 bg-background-surface rounded-lg text-sm font-mono border border-border-subtle text-foreground-muted"
              >
                document.createElement('div')
              </div>
            </template>
          </Tabs>
        </Card>

        <Card class="p-6 flex flex-col gap-6">
          <div>
            <h3 class="font-medium mb-4">Progress</h3>
            <Progress :value="66" />
            <p class="text-xs text-foreground-muted mt-2 text-right">66% Complete</p>
          </div>

          <div>
            <h3 class="font-medium mb-4">Tooltip & Dialog</h3>
            <div class="flex gap-4">
              <Tooltip content="Provides architectural guidance">
                <Button variant="outline">Hover me</Button>
              </Tooltip>

              <Dialog
                title="Delete Configuration?"
                description="This action cannot be undone. This will permanently delete your performance thresholds."
                :open="dialogOpen"
                @update:open="dialogOpen = $event"
              >
                <template #trigger>
                  <Button variant="destructive">Open Dialog</Button>
                </template>
                <div class="flex justify-end gap-3">
                  <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
                  <Button variant="destructive" @click="dialogOpen = false">Delete</Button>
                </div>
              </Dialog>
            </div>
          </div>
        </Card>

        <Card class="p-6 lg:col-span-2">
          <h3 class="font-medium mb-4">Accordion</h3>
          <Accordion
            :items="[
              {
                value: 'item-1',
                title: 'Is it accessible?',
                content: 'Yes. It adheres to the WAI-ARIA design pattern.'
              },
              {
                value: 'item-2',
                title: 'Is it unstyled?',
                content:
                  'Yes. It is entirely unstyled by default, allowing you to easily style it with Tailwind CSS.'
              },
              {
                value: 'item-3',
                title: 'Can it be animated?',
                content:
                  'Yes! You can animate the Accordion with CSS variables or Tailwind classes.'
              }
            ]"
          />
        </Card>
      </div>
    </Section>
  </Container>
</template>

<style>
/* Preview Specific Styles */
.reduce-motion-preview * {
  transition: none !important;
  animation: none !important;
}
</style>
