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
                    <strong class="shrink-0">Recommended:</strong>
                    <span class="text-success font-medium">{{ matrix.recommendedApproach }}</span>
                  </div>
                  <div class="flex gap-2">
                    <strong class="shrink-0 text-foreground-muted">Alternatives:</strong>
                    <span class="text-foreground-muted">{{ matrix.alternatives.join(', ') }}</span>
                  </div>
                  <p class="text-foreground-muted mt-2">
                    <strong class="text-foreground-primary">Trade-offs:</strong>
                    {{ matrix.tradeoffs }}
                  </p>
                  <p class="text-foreground-muted">
                    <strong class="text-foreground-primary">Why:</strong> {{ matrix.why }}
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
                  <CheckIcon class="w-5 h-5" /> Recommended
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
                  <XIcon class="w-5 h-5" /> Avoid
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
