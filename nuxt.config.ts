import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Enable Nuxt 4 features
  future: {
    compatibilityVersion: 4,
  },

  alias: {
    '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '@content': fileURLToPath(new URL('./shared/content', import.meta.url)),
    '@schemas': fileURLToPath(new URL('./shared/schemas', import.meta.url)),
    '@registry': fileURLToPath(new URL('./shared/registry', import.meta.url)),
    '@utils': fileURLToPath(new URL('./shared/utils', import.meta.url)),
    '@mcp': fileURLToPath(new URL('./mcp', import.meta.url))
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/test-utils/module'
  ],

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
    configPath: 'tailwind.config',
    exposeConfig: true,
    viewer: true,
  },

  css: ['~/assets/css/tailwind.css'],
})
