import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['shared/utils/analyzer/**/*.test.ts', 'test/unit/analyzer/rules/**/*.test.ts']
  }
})
