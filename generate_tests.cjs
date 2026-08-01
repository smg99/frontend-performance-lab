const fs = require('fs');
const path = require('path');

const FIXTURE_ROOT = path.join(__dirname, 'shared/utils/analyzer/tests/fixtures');
const RULES_ROOT = path.join(__dirname, 'shared/utils/analyzer/rules');

// Create fixture files
const files = {
  'vue/vue-large-v-for/detects-basic.vue': '<template><div v-for="item in items" :key="item.id">{{ item.name }}</div></template>',
  'vue/vue-large-v-for/detects-nested.vue': '<template><div><ul><li v-for="item in items">{{ item }}</li></ul></div></template>',
  'vue/vue-large-v-for/detects-component.vue': '<template><ListItem v-for="item in items" :key="item.id" /></template>',
  'vue/vue-large-v-for/ignores-virtualized.vue': '<template><VirtualScroller :items="items"><template v-slot="{ item }"><div v-for="x in y">Wait, virtual scroller tag itself</div></template></VirtualScroller></template>',
  'vue/vue-large-v-for/handles-script-setup.vue': '<script setup>const items = []</script><template><div v-for="item in items"></div></template>',
  
  'react/react-large-map/detects-basic.jsx': 'function List() { return <div>{items.map(item => <div key={item.id}>{item.name}</div>)}</div> }',
  'react/react-large-map/detects-nested.jsx': 'function List() { return <div>{data.map(d => <ul>{d.items.map(i => <li key={i}>{i}</li>)}</ul>)}</div> }',
  'react/react-large-map/ignores-no-jsx.jsx': 'const ids = items.map(item => item.id);',
  
  'javascript/dom-layout-thrashing/detects-basic.js': 'function update() { element.style.width = element.clientWidth + 10 + "px"; }',
  'javascript/dom-layout-thrashing/ignores-raf.js': 'function update() { requestAnimationFrame(() => { element.style.width = element.clientWidth + 10 + "px"; }); }',
  
  'javascript/memory-event-listener/detects-basic.js': 'function mount() { window.addEventListener("resize", onResize); }',
  'javascript/memory-event-listener/ignores-with-remove.js': 'function mount() { window.addEventListener("resize", onResize); } function unmount() { window.removeEventListener("resize", onResize); }',
  'javascript/memory-event-listener/ignores-non-global.js': 'function mount() { const btn = document.getElementById("btn"); btn.addEventListener("click", onClick); }'
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(FIXTURE_ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Fixtures generated.");
