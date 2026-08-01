import type { Section } from '@schemas/index'

export const examples: Section[] = [
  {
    id: 'common-mistake',
    title: 'Rendering entire datasets.',
    type: 'example',
    order: 1,
    content: {
      goodCode: `<template>
  <!-- ✅ Renders only 20 nodes -->
  <div v-bind="containerProps">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.index">
        {{ item.data.name }}
      </div>
    </div>
  </div>
</template>`,
      badCode: `<template>
  <!-- ❌ Renders all 50,000 nodes -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>`,
      explanation: 'Browser freezes while evaluating 50k nodes. Heap memory crashes tab. Implement pagination or virtualization.'
    }
  },
  {
    id: 'common-mistake-2',
    title: 'Virtualizing small lists.',
    type: 'example',
    order: 2,
    content: {
      explanation: 'Unnecessary calculation overhead for simple lists. Only virtualize if DOM node count exceeds ~1500.'
    }
  }
]
