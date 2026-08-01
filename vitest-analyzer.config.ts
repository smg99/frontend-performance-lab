import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['shared/utils/analyzer/analyzer.test.ts']
  }
})
