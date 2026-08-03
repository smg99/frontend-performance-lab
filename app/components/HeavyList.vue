<template>
  <div>
    <div
      v-for="item in filteredItems"
      :key="item.id"
      :style="{ color: getRandomColor() }"
      @mousemove="handleMove"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const items = ref(
  Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }))
)

const search = ref('')

const filteredItems = computed(() => items.value.filter(i => i.name.includes(search.value)))

watch(filteredItems, () => {
  // Force layout calculation
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  document.body.clientWidth
})

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function handleMove() {
  console.log(document.body.clientHeight)
}
</script>
