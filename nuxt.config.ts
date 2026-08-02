import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Enable Nuxt 4 features
  future: {
    compatibilityVersion: 4
  },

  alias: {
    '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '@content': fileURLToPath(new URL('./shared/content', import.meta.url)),
    '@schemas': fileURLToPath(new URL('./shared/schemas', import.meta.url)),
    '@registry': fileURLToPath(new URL('./shared/registry', import.meta.url)),
    '@utils': fileURLToPath(new URL('./shared/utils', import.meta.url)),
    '@mcp': fileURLToPath(new URL('./mcp', import.meta.url))
  },

  nitro: {
    prerender: {
      ignore: [
        '/experiments',
        '/LICENSE',
        '/tools',
        '/frontend-performance-lab/experiments',
        '/frontend-performance-lab/LICENSE',
        '/frontend-performance-lab/tools'
      ],
      failOnError: false
    },
    alias: {
      consolidate: 'unenv/runtime/mock/empty'
    }
  },

  app: {
    head: {
      titleTemplate: '%s - Frontend Performance Lab',
      title: 'Frontend Performance Lab',
      meta: [
        {
          name: 'description',
          content: 'AI-Powered Frontend Engineering Platform. Analyze, Understand, and Optimize.'
        },
        { name: 'theme-color', content: '#2563EB' },
        { property: 'og:image', content: '/branding/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/branding/twitter-card.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/branding/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
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
    viewer: true
  },

  css: ['~/assets/css/tailwind.css']
})
