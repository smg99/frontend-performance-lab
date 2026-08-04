<template>
  <VirtualScroller :items="heavyItems" v-slot="{ item }">
    <HeavyCard :data="item" />
  </VirtualScroller>
</template>
