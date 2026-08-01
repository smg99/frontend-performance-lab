<template>
  <div class="h-full flex flex-col bg-surface border-r border-border">
    <div class="p-4 border-b border-border flex justify-between items-center bg-card">
      <h3 class="font-bold text-text-primary">Source Code</h3>
      <div class="flex gap-2">
        <select
          v-model="localLang"
          class="bg-surface text-text-secondary border border-border rounded px-2 py-1 text-sm"
        >
          <option value="vue">Vue</option>
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="jsx">React (JSX)</option>
        </select>
        <button
          class="bg-primary text-white px-4 py-1 rounded text-sm hover:bg-primary/90 transition-colors shadow-subtle"
          @click="$emit('analyze', { code: localCode, language: localLang })"
        >
          Analyze Code
        </button>
      </div>
    </div>
    <div class="flex-1 p-4">
      <textarea
        v-model="localCode"
        class="w-full h-full bg-surface border border-border rounded-lg p-4 font-mono text-sm text-text-secondary focus:outline-none focus:border-primary resize-none"
        placeholder="Paste your frontend code here (Vue, React, JS/TS)..."
        spellcheck="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string; language: string }>()
const emit = defineEmits(['update:modelValue', 'update:language', 'analyze'])

const localCode = ref(props.modelValue)
const localLang = ref(props.language)

watch(localCode, v => emit('update:modelValue', v))
watch(localLang, v => emit('update:language', v))
</script>
