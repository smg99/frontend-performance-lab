import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['shared/utils/analyzer/**/*.test.ts', 'test/unit/analyzer/rules/**/*.test.ts'],
    coverage: {
      include: ['shared/utils/analyzer/engine/**/*.ts', 'shared/utils/analyzer/rules/**/*.ts'],
      reporter: ['text', 'json-summary']
    }
  }
})
