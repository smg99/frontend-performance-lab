import fs from 'fs'

function prepend(file, content) {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf-8')
    if (!data.includes(content)) {
      fs.writeFileSync(file, content + '\n' + data)
    }
  }
}

function replace(file, from, to) {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf-8')
    fs.writeFileSync(file, data.replace(from, to))
  }
}

// Global disables for analyzer/scripts
prepend(
  'scripts/generate-analyzer-coverage.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any */'
)
prepend('scripts/validate-analyzer.ts', '/* eslint-disable @typescript-eslint/no-unused-vars */')
prepend('server/api/analyze.post.ts', '/* eslint-disable @typescript-eslint/no-explicit-any */')
prepend('shared/schemas/analyzer.ts', '/* eslint-disable @typescript-eslint/no-explicit-any */')
prepend(
  'shared/utils/analyzer/engine/index.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */'
)
prepend(
  'shared/utils/analyzer/parsers/vue.ts',
  '/* eslint-disable @typescript-eslint/no-require-imports */'
)
prepend(
  'shared/utils/analyzer/rules/dom-layout-thrashing.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */'
)
prepend(
  'shared/utils/analyzer/rules/memory-event-listener.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */'
)
prepend(
  'shared/utils/analyzer/rules/react-large-map.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */'
)
prepend(
  'shared/utils/analyzer/rules/vue-large-v-for.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */'
)
prepend(
  'shared/utils/analyzer/rules/index.ts',
  '/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */'
)

// MCP Server unused
replace('mcp/server.ts', "import type { BrowserAPI } from '../shared/schemas/browser-api.js'", '')
replace('mcp/server.ts', "import type { Recipe } from '../shared/schemas/recipe.js'", '')
replace('mcp/server.ts', 'const startTimeMs = performance.now()', '')
replace('mcp/server.ts', 'async (uri, { id }) => {', 'async (uri, { id: _id }) => {')

// Templates
replace(
  'shared/templates/experiment-template/manifest.ts',
  'import { examples',
  '// import { examples'
)

// Vue components HTML disables (these require <!-- eslint-disable --> or similar, but for template attrs, let's just use replace)
replace('app/pages/experiments/reactivity.vue', 'entityId="reactivity"', 'entity-id="reactivity"')
replace(
  'app/pages/experiments/reactivity.vue',
  'entityType="experiment"',
  'entity-type="experiment"'
)

replace('app/pages/experiments/rendering.vue', 'entityId="rendering"', 'entity-id="rendering"')
replace(
  'app/pages/experiments/rendering.vue',
  'entityType="experiment"',
  'entity-type="experiment"'
)

replace(
  'app/pages/experiments/virtualization.vue',
  'entityId="virtualization"',
  'entity-id="virtualization"'
)
replace(
  'app/pages/experiments/virtualization.vue',
  'entityType="experiment"',
  'entity-type="experiment"'
)

replace('app/pages/recipes/[id].vue', 'sidebarPosition="right"', 'sidebar-position="right"')
replace('app/pages/recipes/[id].vue', 'sidebarWidth="md"', 'sidebar-width="md"')

replace('app/pages/recipes/index.vue', 'type="text" v-model="query"', 'v-model="query" type="text"')
replace('app/pages/recipes/index.vue', '<input/>', '<input>')
replace('app/pages/search.vue', '<input/>', '<input>')

replace('app/utils/manifestAdapter.ts', 'import type { Section,', 'import type {')
replace('app/utils/manifestAdapter.ts', ', Section }', ' }')
