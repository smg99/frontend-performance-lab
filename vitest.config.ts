import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
      '@content': fileURLToPath(new URL('./shared/content', import.meta.url)),
      '@schemas': fileURLToPath(new URL('./shared/schemas', import.meta.url)),
      '@registry': fileURLToPath(new URL('./shared/registry', import.meta.url)),
      '@utils': fileURLToPath(new URL('./shared/utils', import.meta.url)),
      '@mcp': fileURLToPath(new URL('./mcp', import.meta.url))
    }
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
          alias: {
            '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
            '@content': fileURLToPath(new URL('./shared/content', import.meta.url)),
            '@schemas': fileURLToPath(new URL('./shared/schemas', import.meta.url)),
            '@registry': fileURLToPath(new URL('./shared/registry', import.meta.url)),
            '@utils': fileURLToPath(new URL('./shared/utils', import.meta.url)),
            '@mcp': fileURLToPath(new URL('./mcp', import.meta.url))
          }
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url))
            }
          },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }]
          }
        }
      })
    ],
    coverage: {
      enabled: true,
      provider: 'v8'
    }
  }
})
