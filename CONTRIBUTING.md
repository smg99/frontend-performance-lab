# Contributing to Frontend Performance Lab

Welcome! This project is designed as an AI-first, framework-independent knowledge platform. 

## Architectural Philosophy

1. **Single Source of Truth**: All educational content lives in `shared/content/`.
2. **Framework Agnostic**: The `shared/` directory must contain ZERO Nuxt, Vue, or DOM imports. It is pure TypeScript.
3. **Strongly Typed**: Every experiment must adhere to the `ExperimentManifest` schema defined in `shared/schemas/`.

## How to Add a New Experiment

To ensure consistency, we use a template system for new experiments.

1. Copy the template folder:
   ```bash
   cp -r shared/templates/experiment-template shared/content/experiments/your-experiment-name
   ```
2. Fill out the TypeScript files inside your new folder:
   - `manifest.ts`: The root metadata (title, difficulty, etc.)
   - `examples.ts`: Code comparisons (Good vs Bad)
   - `references.ts`: Links to external documentation
   - `benchmarks.ts`: Benchmark configurations
3. **Register it manually**:
   Open `shared/registry/index.ts` and export your new manifest:
   ```typescript
   export { default as yourExperiment } from '../content/experiments/your-experiment-name/manifest'
   ```

## Coding Standards

- Use the predefined path aliases (`@shared`, `@content`, `@schemas`, `@registry`, `@utils`) instead of relative imports.
- Never hardcode educational data into the Vue components. Always query the registry.
- Run `npm run lint` and ensure TypeScript strict mode passes with zero errors before opening a Pull Request.
