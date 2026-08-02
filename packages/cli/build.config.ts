import { defineBuildConfig } from 'unbuild'
import { fileURLToPath } from 'node:url'

export default defineBuildConfig({
  entries: ['src/index', 'src/cli'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  alias: {
    '@schemas': fileURLToPath(new URL('../../shared/schemas', import.meta.url)),
    '@content': fileURLToPath(new URL('../../shared/content', import.meta.url)),
    '@registry': fileURLToPath(new URL('../../shared/registry', import.meta.url)),
    '@mcp': fileURLToPath(new URL('../../shared/mcp', import.meta.url)),
    '@utils': fileURLToPath(new URL('../../shared/utils', import.meta.url))
  }
})
