<template>
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background-base border-b border-border-subtle pt-24 pb-16 lg:pt-32 lg:pb-24">
    
    <!-- Background: Faint Engineering Grid -->
    <div class="absolute inset-0 z-0 opacity-10 hero-grid pointer-events-none mix-blend-overlay"></div>
    
    <!-- Background: Subtle Radial Lighting & Gradient Mesh -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute top-0 left-1/4 w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] animate-blob"></div>
      <div class="absolute bottom-1/4 right-0 w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
    </div>
    
    <!-- Background: Soft Vignette Overlay to blend to base -->
    <div class="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,var(--background-base)_100%)] opacity-90"></div>

    <div class="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        <!-- LEFT COLUMN: Content -->
        <div class="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left">
          
          <!-- Announcement Badge -->
          <div class="inline-flex items-center rounded-full border border-border-strong bg-background-surface/80 backdrop-blur-sm px-4 py-1.5 text-xs font-mono font-medium text-foreground-primary mb-8 shadow-sm hover:border-primary/50 transition-colors">
            <span class="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse-slow"></span>
            Open Source • MCP Ready • AST Powered
          </div>

          <!-- Headline -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground-primary leading-[1.1] mb-6">
            Understand.<br />
            Analyze.<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-gradient">Optimize.</span>
          </h1>

          <!-- Supporting Text -->
          <p class="text-lg sm:text-xl text-foreground-muted mb-10 font-medium max-w-2xl leading-relaxed">
            The professional Frontend Performance Engineering Platform. Learn browser internals, analyze real code, explore Browser APIs and Recipes, and use the built-in AST Analyzer directly from your IDE.
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              class="w-full sm:w-auto text-base px-8 py-6 rounded-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
              as="NuxtLink"
              href="/tools/performance-review"
            >
              Try Analyzer
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              class="w-full sm:w-auto text-base px-8 py-6 rounded-full bg-background-surface/50 backdrop-blur-sm border-border-strong hover:bg-background-hover hover:border-primary/50 transition-all"
              as="NuxtLink"
              href="/mcp/install"
            >
              Install MCP
            </Button>
            
            <a 
              href="https://github.com/smg99/frontend-performance-lab" 
              target="_blank"
              class="flex items-center justify-center w-full sm:w-auto px-6 py-4 text-sm font-medium text-foreground-muted hover:text-foreground-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full group"
            >
              <GithubIcon class="w-5 h-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              GitHub
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="mt-14 w-full">
            <p class="text-xs font-mono uppercase tracking-widest text-foreground-muted mb-4 opacity-70 text-center lg:text-left">
              Built with & Supports
            </p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-2.5">
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ Open Source</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ MCP Ready</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ AI Powered</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ Type Safe</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ 27 Analyzer Tests</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ 94% Coverage</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ Nuxt 4</span>
              <span class="px-3 py-1 rounded-md bg-background-surface border border-border-subtle text-[11px] font-medium text-foreground-secondary hover:border-border-strong transition-colors cursor-default">✓ Vue 3</span>
            </div>
          </div>
          
        </div>
        
        <!-- RIGHT COLUMN: Live Analyzer Showcase -->
        <div class="flex-1 w-full flex justify-center lg:justify-end lg:pl-10 mt-12 lg:mt-0">
          <LiveAnalyzerShowcase />
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'
import LiveAnalyzerShowcase from './LiveAnalyzerShowcase.vue'
import { GithubIcon } from 'lucide-vue-next'
</script>

<style scoped>
/* Engineering Grid */
.hero-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
}

/* Background Blobs (CSS optimized) */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 20s infinite alternate ease-in-out;
  will-change: transform;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}

@keyframes textGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: textGradient 6s ease infinite;
}

/* Reduced Motion Fallbacks */
@media (prefers-reduced-motion: reduce) {
  .animate-blob,
  .animate-pulse-slow,
  .animate-gradient {
    animation: none !important;
    transform: none !important;
  }
}
</style>
