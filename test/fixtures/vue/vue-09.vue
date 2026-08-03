<template>
  <div v-for="i in 10000" :key="i">
    <!-- intentionally bad vue code 9 -->
    <div @mousemove="() => document.body.clientHeight">{{ i }}</div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const data = ref([])
watch(data, () => document.body.clientHeight)
window.addEventListener('resize', () => document.body.clientWidth)
</script>
