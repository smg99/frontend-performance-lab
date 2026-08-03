# Dogfooding Results

Record every repository analyzed below.

| Repository Name | Framework | Component | Detected Issues | Missed Issues | False Positives | Report Useful? | AI Generated Good Fix? | Trust Recommendation? | Overall Score |
| :-------------- | :-------- | :-------- | :-------------- | :------------ | :-------------- | :------------- | :--------------------- | :-------------------- | :------------ |
| `reactjs/react.dev` | React | Global | 1 (`react-unmemoized-context-provider`) | 1 (`jsx-dynamic-layout-style` missed styled-components) | 0 | Yes | N/A | Yes | 8/10 |
| `vuejs/docs` | Vue | Global | 2 (`vue-large-v-for`) | 0 | 1 (statically generated v-for) | Yes | N/A | Yes | 7/10 |
| `vitejs/vite` | Vanilla | Client | 1 (`memory-event-listener`) | 0 | 0 | Yes | N/A | Yes | 9/10 |
| `vercel/commerce` | Next.js | UI | 1 (`dom-layout-thrashing`) | 1 (missed unoptimized images) | 1 (required non-passive listener) | Yes | N/A | Yes | 8/10 |
| `nuxt/hackernews` | Nuxt | Pages | 1 (`vue-large-v-for`) | 1 (heavy `useAsyncData`) | 0 | Yes | N/A | Yes | 9/10 |
