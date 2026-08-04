<template>
  <div class="dashboard">
    <!-- Intentionally bad: v-for over massive table without virtualization -->
    <table>
      <tr v-for="row in 10000" :key="row">
        <td>{{ row }}</td>
      </tr>
    </table>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
// Intentionally bad: global event listener leak
onMounted(() => {
  window.addEventListener('scroll', () => {})
})
</script>
