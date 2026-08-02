<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipe } from '@registry/recipes'
import Container from '../../components/layout/Container.vue'
import SplitView from '../../components/layout/SplitView.vue'
import PageHeader from '../../components/patterns/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import Badge from '../../components/ui/Badge.vue'
import Callout from '../../components/patterns/Callout.vue'
import RelatedKnowledge from '../../components/patterns/RelatedKnowledge.vue'
import { CheckIcon, XIcon, ClockIcon } from 'lucide-vue-next'

const route = useRoute()
const id = route.params.id as string
const recipe = getRecipe(id)
</script>

<template>
  <Container v-if="recipe" class="py-8">
    <PageHeader :title="recipe.title" :description="recipe.summary">
      <template #actions>
        <Badge
          :variant="
            recipe.difficulty === 'Beginner'
              ? 'success'
              : recipe.difficulty === 'Intermediate'
                ? 'warning'
                : 'danger'
          "
        >
          {{ recipe.difficulty }}
        </Badge>
        <Badge variant="outline" class="flex items-center gap-1">
          <ClockIcon class="w-3 h-3" /> {{ recipe.estimatedImplementationTime }}
        </Badge>
        <Badge variant="default">Impact: {{ recipe.performanceImpact }}</Badge>
      </template>
    </PageHeader>

    <!-- 1. Hero Relationships -->
    <div
      class="mb-10 flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-border-subtle-subtle text-sm"
    >
      <span class="text-xs font-semibold text-foreground-muted uppercase tracking-wider self-center"
        >Related</span
      >
      <div v-if="recipe.relatedBrowserAPIs?.length" class="flex items-center gap-2">
        <span class="text-foreground-muted">Browser APIs:</span>
        <NuxtLink
          :to="`/browser-apis/${recipe.relatedBrowserAPIs[0]}`"
          class="text-primary hover:underline font-medium"
          >{{ recipe.relatedBrowserAPIs[0] }}</NuxtLink
        >
      </div>
      <div v-if="recipe.relatedRecipes?.length" class="flex items-center gap-2">
        <span class="text-foreground-muted">Recipes:</span>
        <NuxtLink
          :to="`/recipes/${recipe.relatedRecipes[0]}`"
          class="text-primary hover:underline font-medium"
          >{{ recipe.relatedRecipes[0] }}</NuxtLink
        >
      </div>
      <div v-if="recipe.relatedExperiments?.length" class="flex items-center gap-2">
        <span class="text-foreground-muted">Experiments:</span>
        <NuxtLink
          :to="`/experiments/${recipe.relatedExperiments[0]}`"
          class="text-primary hover:underline font-medium"
          >{{ recipe.relatedExperiments[0] }}</NuxtLink
        >
      </div>
    </div>

    <SplitView sidebar-position="right" sidebar-width="md">
      <template #default>
        <div class="space-y-8">
          <Card class="p-6 md:p-8">
            <h2 class="text-xl font-bold mb-4">The Problem</h2>
            <p class="text-foreground-muted mb-6 leading-relaxed">{{ recipe.problem }}</p>

            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-3">Common Symptoms</h3>
                <ul class="space-y-2">
                  <li
                    v-for="symptom in recipe.symptoms"
                    :key="symptom"
                    class="flex items-start gap-2 text-sm text-foreground-muted"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {{ symptom }}
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold mb-3">Root Causes</h3>
                <ul class="space-y-2">
                  <li
                    v-for="cause in recipe.rootCauses"
                    :key="cause"
                    class="flex items-start gap-2 text-sm text-foreground-muted"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                    {{ cause }}
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <!-- 2. Expected Performance Gains -->
          <Card class="p-6 md:p-8 bg-success/5 border-success/20">
            <h3 class="font-semibold mb-4 text-success flex items-center gap-2">
              <ZapIcon class="w-5 h-5" /> Typical Expected Improvements
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                class="bg-background-base p-4 rounded-lg border border-border-subtle-subtle shadow-sm"
              >
                <div
                  class="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1"
                >
                  DOM Nodes
                </div>
                <div class="text-xl font-bold text-foreground-primary">↓ 95%</div>
              </div>
              <div
                class="bg-background-base p-4 rounded-lg border border-border-subtle-subtle shadow-sm"
              >
                <div
                  class="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1"
                >
                  Memory
                </div>
                <div class="text-xl font-bold text-foreground-primary">↓ 80%</div>
              </div>
              <div
                class="bg-background-base p-4 rounded-lg border border-border-subtle-subtle shadow-sm"
              >
                <div
                  class="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1"
                >
                  FPS
                </div>
                <div class="text-xl font-bold text-foreground-primary">↑ 3–5×</div>
              </div>
              <div
                class="bg-background-base p-4 rounded-lg border border-border-subtle-subtle shadow-sm"
              >
                <div
                  class="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1"
                >
                  Initial Render
                </div>
                <div class="text-xl font-bold text-foreground-primary">↓ 70%</div>
              </div>
            </div>
          </Card>

          <Card class="p-6 md:p-8">
            <h2 class="text-xl font-bold mb-2">Decision Matrix</h2>
            <p class="text-foreground-muted text-sm mb-6">
              Architectural decision guidance for different scenarios.
            </p>

            <div class="space-y-6">
              <div
                v-for="(matrix, i) in recipe.decisionMatrix"
                :key="i"
                class="p-5 rounded-xl border border-primary/20 bg-primary/5"
              >
                <h4 class="font-semibold text-lg mb-4 text-foreground-primary">
                  Scenario: {{ matrix.scenario }}
                </h4>
                <div class="space-y-3 text-sm">
                  <div class="flex gap-2">
                    <strong class="shrink-0 flex items-center gap-1.5"
                      ><span class="text-[12px]">✅</span> Recommended:</strong
                    >
                    <span class="text-success font-medium">{{ matrix.recommendedApproach }}</span>
                  </div>
                  <div class="flex gap-2">
                    <strong class="shrink-0 text-foreground-muted flex items-center gap-1.5"
                      ><span class="text-[12px]">🔄</span> Alternatives:</strong
                    >
                    <span class="text-foreground-muted">{{ matrix.alternatives.join(', ') }}</span>
                  </div>
                  <p class="text-foreground-muted mt-2">
                    <strong class="text-foreground-primary flex items-center gap-1.5"
                      ><span class="text-[12px]">⚖️</span> Trade-offs:</strong
                    >
                    {{ matrix.tradeoffs }}
                  </p>
                  <p class="text-foreground-muted">
                    <strong class="text-foreground-primary flex items-center gap-1.5"
                      ><span class="text-[12px]">💡</span> Why:</strong
                    >
                    {{ matrix.why }}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Callout
            v-if="recipe.whenNotToUse && recipe.whenNotToUse.length"
            variant="danger"
            title="When NOT To Use"
          >
            <ul class="mt-2 space-y-2">
              <li
                v-for="item in recipe.whenNotToUse"
                :key="item"
                class="flex items-start gap-2 text-sm"
              >
                <XIcon class="w-4 h-4 shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </Callout>

          <Card class="p-6 md:p-8">
            <h2 class="text-xl font-bold mb-6">Approaches</h2>
            <div class="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 class="font-semibold mb-4 text-success flex items-center gap-2">
                  <CheckIcon class="w-5 h-5" /> Do This
                </h3>
                <ul class="space-y-3">
                  <li
                    v-for="app in recipe.recommendedApproaches"
                    :key="app"
                    class="text-sm text-foreground-muted leading-relaxed"
                  >
                    {{ app }}
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold mb-4 text-danger flex items-center gap-2">
                  <XIcon class="w-5 h-5" /> Anti-patterns
                </h3>
                <ul class="space-y-3">
                  <li
                    v-for="app in recipe.approachesToAvoid"
                    :key="app"
                    class="text-sm text-foreground-muted leading-relaxed"
                  >
                    {{ app }}
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card class="p-6 md:p-8">
            <h2 class="text-xl font-bold mb-6">Implementation</h2>
            <div class="rounded-xl overflow-hidden border border-border-subtle-subtle">
              <div class="bg-background-surface border-b border-border-subtle-subtle flex">
                <button
                  class="px-6 py-3 text-sm font-semibold border-b-2 border-primary text-foreground-primary"
                >
                  Vue
                </button>
                <button
                  class="px-6 py-3 text-sm font-medium text-foreground-muted hover:text-foreground-primary transition-colors border-b-2 border-transparent"
                >
                  React
                </button>
                <button
                  class="px-6 py-3 text-sm font-medium text-foreground-muted hover:text-foreground-primary transition-colors border-b-2 border-transparent"
                >
                  Vanilla
                </button>
              </div>
              <div class="bg-background-base p-6 font-mono text-sm overflow-x-auto relative group">
                <button
                  class="absolute top-4 right-4 text-xs font-semibold text-foreground-muted uppercase tracking-wider hover:text-primary transition-colors opacity-0 group-hover:opacity-100 bg-background-surface px-2 py-1 rounded border border-border-subtle-subtle"
                >
                  Copy
                </button>
                <pre
                  class="text-foreground-secondary leading-relaxed"
                ><span class="text-pink-500">import</span> { useVirtualList } <span class="text-pink-500">from</span> <span class="text-green-500">'@vueuse/core'</span>

<span class="text-pink-500">const</span> { list, containerProps, wrapperProps } = <span class="text-blue-400">useVirtualList</span>(
  hugeDataArray,
  {
    itemHeight: <span class="text-orange-400">48</span>
  }
)
</pre>
              </div>
            </div>
          </Card>

          <Card class="p-6 md:p-8 border-primary/30 bg-primary/5 relative overflow-hidden group">
            <div
              class="absolute -right-4 -top-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
            >
              <ZapIcon class="w-32 h-32 text-primary" />
            </div>
            <div class="relative z-10">
              <h2 class="text-lg font-bold mb-2 flex items-center gap-2">
                <ZapIcon class="w-5 h-5 text-primary" /> Use AI
              </h2>
              <p class="text-sm text-foreground-muted mb-6 max-w-lg">
                Instantly analyze your codebase using this recipe via MCP. Open your AI agent and
                run this prompt.
              </p>
              <div
                class="bg-background-base border border-primary/20 rounded-lg p-3 text-sm font-mono flex items-center justify-between group/prompt cursor-pointer hover:border-primary/50 transition-colors"
              >
                <span class="text-foreground-primary"
                  >Review my Vue table for virtualization opportunities</span
                >
                <span
                  class="text-xs font-bold text-primary uppercase tracking-wider px-2 py-1 opacity-0 group-hover/prompt:opacity-100 transition-opacity"
                  >Copy Prompt</span
                >
              </div>
            </div>
          </Card>
        </div>
      </template>

      <template #sidebar>
        <div class="space-y-6">
          <Card class="p-5">
            <h3 class="font-bold mb-4">Production Checklist</h3>
            <ul class="space-y-3">
              <li
                v-for="item in recipe.productionChecklist"
                :key="item"
                class="flex items-start gap-2 text-sm text-foreground-muted"
              >
                <CheckIcon class="w-4 h-4 text-success shrink-0 mt-0.5" />
                {{ item }}
              </li>
            </ul>
          </Card>

          <Card class="p-5 border-danger-border bg-danger-bg/30">
            <h3 class="font-bold mb-4 text-danger">Common Mistakes</h3>
            <ul class="space-y-3">
              <li
                v-for="mistake in recipe.commonMistakes"
                :key="mistake"
                class="flex items-start gap-2 text-sm text-foreground-muted"
              >
                <XIcon class="w-4 h-4 text-danger shrink-0 mt-0.5" />
                {{ mistake }}
              </li>
            </ul>
          </Card>

          <Card v-if="recipe.references.length" class="p-5">
            <h3 class="font-bold mb-3">References</h3>
            <ul class="space-y-2">
              <li v-for="ref in recipe.references" :key="ref.url">
                <a
                  :href="ref.url"
                  target="_blank"
                  rel="noopener"
                  class="text-sm text-primary hover:underline"
                >
                  {{ ref.title }}
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </template>
    </SplitView>

    <RelatedKnowledge :entity-id="id" entity-type="recipe" />
  </Container>

  <Container v-else class="py-24 text-center">
    <h1 class="text-2xl font-bold mb-4">Recipe Not Found</h1>
    <NuxtLink to="/recipes" class="text-primary hover:underline"
      >Return to Recipes Library</NuxtLink
    >
  </Container>
</template>
