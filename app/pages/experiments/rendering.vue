<template>
  <Container class="space-y-6 flex flex-col h-full py-8 max-w-7xl">
    <PageHeader
      title="Rendering Pipeline & Layout"
      description="An interactive engineering playground for understanding CSSOM, Layout Thrashing, and GPU Compositing."
    />

    <!-- 1. The Rendering Pipeline -->
    <section>
      <h3 class="text-2xl font-bold text-foreground-primary mb-4">
        1. The Browser Rendering Pipeline
      </h3>
      <p class="text-foreground-muted mb-4">
        Every time a web page loads or updates, the browser executes a precise sequence of steps to
        convert HTML/CSS/JS into pixels on the screen. Understanding this pipeline is the key to
        mastering rendering performance.
      </p>
      <RenderingPipeline />
    </section>

    <!-- 2. Layout Thrashing -->
    <section>
      <h3 class="text-2xl font-bold text-foreground-primary mb-4">
        2. Layout Thrashing (Forced Synchronous Layout)
      </h3>
      <p class="text-foreground-muted mb-4">
        Reading a layout property (like <code>offsetHeight</code>) and immediately writing to the
        DOM (like <code>style.height</code>) inside a loop forces the browser to recalculate the
        entire layout synchronously over and over again. This destroys performance.
      </p>
      <LayoutThrashing />
    </section>

    <!-- 3. Animation Performance (Layout vs Composite) -->
    <section>
      <h3 class="text-2xl font-bold text-foreground-primary mb-4">
        3. Animation Performance: Layout vs Composite
      </h3>
      <p class="text-foreground-muted mb-4">
        Animating properties like <code>top</code>, <code>left</code>, or
        <code>width</code> triggers Layout and Paint for every frame. Animating properties like
        <code>transform</code> or <code>opacity</code> triggers only Composite, running natively on
        the GPU.
      </p>
      <AnimationComparison />
    </section>

    <!-- 4. Paint Flashing -->
    <section>
      <h3 class="text-2xl font-bold text-foreground-primary mb-4">4. Paint Flashing Simulation</h3>
      <p class="text-foreground-muted mb-4">
        A simulation of Chrome DevTools' "Paint Flashing" feature. Observe how changing different
        properties causes the browser to repaint localized rectangles or the entire screen.
      </p>
      <PaintFlashing />
    </section>

    <!-- Educational Framework Integration -->
    <LearningSummaryCard :data="learningData" class="mx-auto mt-8" />

    <RelatedKnowledge entity-id="rendering" entity-type="experiment" />
  </Container>
</template>

<script setup lang="ts">
import LearningSummaryCard from '~/components/common/learning/LearningSummaryCard.vue'
import Container from '~/components/layout/Container.vue'
import PageHeader from '~/components/patterns/PageHeader.vue'
import RelatedKnowledge from '~/components/patterns/RelatedKnowledge.vue'
import type { LearningSummaryData } from '~/types/learning'
import RenderingPipeline from '~/components/experiments/rendering/RenderingPipeline.vue'
import LayoutThrashing from '~/components/experiments/rendering/LayoutThrashing.vue'
import AnimationComparison from '~/components/experiments/rendering/AnimationComparison.vue'
import PaintFlashing from '~/components/experiments/rendering/PaintFlashing.vue'
const learningData: LearningSummaryData = {
  title: 'Rendering Pipeline & Layout',
  whatIsIt:
    'The Browser Rendering Pipeline (also known as the Critical Rendering Path) is the sequence of steps a browser takes to convert HTML, CSS, and JS into actual pixels on the screen: Parse HTML -> Recalculate Style -> Layout -> Paint -> Composite.',
  howItWorks:
    'Whenever JavaScript changes a CSS property, the browser must update the screen. If you change a geometric property (like `width`), the browser must recalculate the geometry of ALL elements (Layout), then re-draw the pixels (Paint), and send it to the GPU (Composite). This is extremely expensive.',
  recommendation: {
    approach: 'Only animate CSS Transform and Opacity.',
    reasoning:
      '`transform` and `opacity` completely bypass the Layout and Paint phases. They are handled exclusively by the GPU in the Composite phase, meaning they can run smoothly at 60fps even if the Main JS Thread is 100% blocked.',
    codeSample: `/* ❌ Avoid animating Layout properties */
.bad-anim {
  transition: left 0.3s;
  left: 100px;
}

/* ✅ Animate Composite properties (GPU accelerated) */
.good-anim {
  transition: transform 0.3s;
  transform: translateX(100px);
}`
  },
  decisionMatrix: [
    {
      situation: 'Moving an element (X/Y)',
      recommended: 'transform: translate()',
      alternative: 'margin (if static)',
      avoid: 'top / left / margin'
    },
    {
      situation: 'Resizing an element',
      recommended: 'transform: scale()',
      alternative: 'width/height (only if needed)',
      avoid: 'width/height in animations'
    },
    {
      situation: 'Hiding an element',
      recommended: 'opacity: 0',
      alternative: 'visibility: hidden',
      avoid: 'display: none (Triggers Layout)'
    }
  ],
  commonMistakes: [
    {
      problem: 'Layout Thrashing (Forced Synchronous Layout).',
      impact:
        'Reading a layout property (e.g. `offsetHeight`) immediately after writing a layout property (e.g. `style.height`) forces the browser to calculate the layout synchronously in JavaScript, destroying performance.',
      fix: 'Batch your DOM reads together, and then batch your DOM writes together (FastDOM pattern).',
      badCode: `// ❌ Forces layout calculation on EVERY iteration
elements.forEach(el => {
  const height = el.offsetHeight // READ
  el.style.height = height + 10 + 'px' // WRITE
})`,
      goodCode: `// ✅ Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight) // READ ALL

elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px' // WRITE ALL
})`
    }
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between Layout (Reflow) and Repaint?',
      difficulty: 'Intermediate',
      answer:
        'Layout (Reflow) occurs when elements change shape, size, or position, affecting the geometry of the whole page. Repaint occurs when visual styles change (like color or background) that DO NOT affect geometry. Layout is far more expensive than Repaint.'
    },
    {
      question: 'Why does animating `box-shadow` cause lag on low-end devices?',
      difficulty: 'Advanced',
      answer:
        "`box-shadow` forces the browser into a heavy Paint cycle. While it doesn't trigger Layout, painting complex blurs on every frame taxes the CPU. It is better to animate the `opacity` of a pseudo-element that has a static box-shadow."
    }
  ],
  proTips: [
    'Use `will-change: transform` sparingly to hint to the browser to promote an element to its own GPU layer before the animation starts.',
    'Always use Chrome DevTools "Performance" tab and enable "Paint Flashing" to identify bottlenecks.'
  ]
}

useHead({
  title: 'Rendering & Layout - Frontend Performance Lab'
})
</script>
