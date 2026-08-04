<template>
  <div v-for="item in heavyItems" :key="item.id">
    <HeavyCard :data="item" />
  </div>
</template>
