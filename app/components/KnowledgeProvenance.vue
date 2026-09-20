<script setup lang="ts">
import { computed } from 'vue'
import { getKnowledgeProvenance } from '@shared/content/provenance'
import type { KnowledgeKind } from '@shared/schemas/provenance'

const props = defineProps<{ kind: KnowledgeKind; entityId: string }>()
const provenance = computed(() => getKnowledgeProvenance(props.kind, props.entityId))
const verifiedLabel = computed(() =>
  provenance.value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
        new Date(provenance.value.verifiedAt)
      )
    : ''
)
</script>

<template>
  <aside
    v-if="provenance"
    class="rounded-lg border border-border-subtle bg-background-surface p-4 text-sm"
    aria-label="Content provenance"
  >
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <strong class="text-foreground-primary">Verified knowledge</strong>
      <span class="text-foreground-muted">{{ provenance.publisher }}</span>
      <span class="text-foreground-muted">Verified {{ verifiedLabel }}</span>
      <a
        :href="provenance.canonicalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary hover:underline"
      >
        View canonical source
      </a>
    </div>
  </aside>
</template>
