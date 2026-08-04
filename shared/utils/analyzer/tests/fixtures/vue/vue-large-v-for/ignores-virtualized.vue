<template>
  <VirtualScroller :items="items"
    ><template v-slot="{ item }"
      ><div>Wait, virtual scroller tag itself</div></template
    ></VirtualScroller
  >
</template>
