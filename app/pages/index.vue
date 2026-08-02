<template>
  <div class="min-h-screen bg-background-base flex flex-col">
    <HeroSection />
    <FrameworkSupport />
    <WhySection />
    <ExplorePlatform />
    <FeaturedContent />
    <CallToAction />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/landing/HeroSection.vue'
import FrameworkSupport from '../components/landing/FrameworkSupport.vue'
import WhySection from '../components/landing/WhySection.vue'
import ExplorePlatform from '../components/landing/ExplorePlatform.vue'
import FeaturedContent from '../components/landing/FeaturedContent.vue'
import CallToAction from '../components/landing/CallToAction.vue'
import SiteFooter from '../components/landing/SiteFooter.vue'

useHead({
  title: 'Frontend Performance Lab | Master Web Performance',
  meta: [
    {
      name: 'description',
      content:
        'Master frontend performance visually. Interactive AST-powered analyzer, native APIs, and real-world optimization recipes.'
    },
    {
      name: 'keywords',
      content:
        'frontend, performance, web vitals, optimization, vue, react, javascript, ast, performance testing'
    },
    { property: 'og:title', content: 'Frontend Performance Lab' },
    {
      property: 'og:description',
      content:
        'Master frontend performance visually. Interactive AST-powered analyzer, native APIs, and real-world optimization recipes.'
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Frontend Performance Lab' },
    {
      name: 'twitter:description',
      content:
        'Master frontend performance visually. Interactive AST-powered analyzer, native APIs, and real-world optimization recipes.'
    }
  ],
  link: [{ rel: 'canonical', href: 'https://frontend-performance-lab.dev/' }]
})
</script>
