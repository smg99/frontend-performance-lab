<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getBrowserAPI } from '@registry/browser-apis'
import Container from '../../components/layout/Container.vue'
import SplitView from '../../components/layout/SplitView.vue'
import PageHeader from '../../components/patterns/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import Badge from '../../components/ui/Badge.vue'
import RelatedKnowledge from '../../components/patterns/RelatedKnowledge.vue'
import { CheckIcon, XIcon, HelpCircleIcon } from 'lucide-vue-next'

const route = useRoute()
const id = route.params.id as string
const api = getBrowserAPI(id)
</script>

<template>
  <Container v-if="api" class="py-8">
    <PageHeader :title="api.name" :description="api.description">
      <template #actions>
        <Badge variant="outline">{{ api.category }}</Badge>
        <Badge variant="default">{{ api.baseline }} ({{ api.browserSupport }})</Badge>
        <Badge
          :variant="
            api.difficulty === 'Beginner'
              ? 'success'
              : api.difficulty === 'Intermediate'
                ? 'warning'
                : 'danger'
          "
          >{{ api.difficulty }}</Badge
        >
        <Badge variant="outline">Impact: {{ api.performanceImpact }}</Badge>
      </template>
    </PageHeader>

    <SplitView sidebar-position="right" sidebar-width="md">
      <template #default>
        <div class="space-y-8">
          <div class="grid sm:grid-cols-2 gap-6">
            <Card class="p-6">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-success">
                <CheckIcon class="w-5 h-5" /> When to Use
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="item in api.whenToUse"
                  :key="item"
                  class="text-sm text-foreground-muted leading-relaxed"
                >
                  {{ item }}
                </li>
              </ul>
            </Card>

            <Card class="p-6 border-danger-border bg-danger-bg/20">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-danger">
                <XIcon class="w-5 h-5" /> When NOT to Use
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="item in api.whenNotToUse"
                  :key="item"
                  class="text-sm text-foreground-muted leading-relaxed"
                >
                  {{ item }}
                </li>
              </ul>
            </Card>
          </div>

          <Card class="p-6 md:p-8">
            <h2 class="text-xl font-bold mb-6">Advantages vs Limitations</h2>
            <div class="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 class="font-semibold mb-4 text-foreground-primary">Advantages</h3>
                <ul class="space-y-2">
                  <li
                    v-for="adv in api.advantages"
                    :key="adv"
                    class="flex items-start gap-2 text-sm text-foreground-muted"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    {{ adv }}
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold mb-4 text-foreground-primary">Limitations</h3>
                <ul class="space-y-2">
                  <li
                    v-for="lim in api.limitations"
                    :key="lim"
                    class="flex items-start gap-2 text-sm text-foreground-muted"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                    {{ lim }}
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card v-if="api.examples.length" class="p-6 md:p-8">
            <h2 class="text-xl font-bold mb-6">Production Examples</h2>
            <div class="space-y-8">
              <div v-for="ex in api.examples" :key="ex.title">
                <h3 class="font-semibold text-lg mb-2">{{ ex.title }}</h3>
                <p class="text-foreground-muted text-sm mb-4">{{ ex.explanation }}</p>
                <div
                  class="p-4 bg-black rounded-lg border border-border-subtle-strong overflow-x-auto text-sm font-mono text-gray-300"
                >
                  <pre><code>{{ ex.code }}</code></pre>
                </div>
              </div>
            </div>
          </Card>

          <Card v-if="api.interviewQuestions.length" class="p-6 md:p-8 bg-background-surface">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <HelpCircleIcon class="w-5 h-5 text-primary" /> Interview Readiness
            </h2>
            <div class="space-y-6">
              <div
                v-for="(q, i) in api.interviewQuestions"
                :key="i"
                class="p-5 bg-background-base rounded-xl border border-border-subtle-subtle"
              >
                <p class="font-semibold text-foreground-primary mb-2">Q: {{ q.question }}</p>
                <p class="text-foreground-muted text-sm leading-relaxed">A: {{ q.answer }}</p>
              </div>
            </div>
          </Card>
        </div>
      </template>

      <template #sidebar>
        <div class="space-y-6">
          <Card class="p-5">
            <h3 class="font-bold mb-4">Best Practices</h3>
            <ul class="space-y-3">
              <li
                v-for="bp in api.bestPractices"
                :key="bp"
                class="flex items-start gap-2 text-sm text-foreground-muted"
              >
                <CheckIcon class="w-4 h-4 text-success shrink-0 mt-0.5" />
                {{ bp }}
              </li>
            </ul>
          </Card>

          <Card class="p-5 border-danger-border bg-danger-bg/30">
            <h3 class="font-bold mb-4 text-danger">Common Mistakes</h3>
            <ul class="space-y-3">
              <li
                v-for="mistake in api.commonMistakes"
                :key="mistake"
                class="flex items-start gap-2 text-sm text-foreground-muted"
              >
                <XIcon class="w-4 h-4 text-danger shrink-0 mt-0.5" />
                {{ mistake }}
              </li>
            </ul>
          </Card>

          <Card v-if="api.references.length" class="p-5">
            <h3 class="font-bold mb-3">References</h3>
            <ul class="space-y-2">
              <li v-for="ref in api.references" :key="ref.url">
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

    <RelatedKnowledge :entity-id="id" entity-type="browser-api" />
  </Container>

  <Container v-else class="py-24 text-center">
    <h1 class="text-2xl font-bold mb-4">API Not Found</h1>
    <NuxtLink to="/browser-apis" class="text-primary hover:underline">Return to Registry</NuxtLink>
  </Container>
</template>
