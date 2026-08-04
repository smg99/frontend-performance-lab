# FPL Plugin SDK

The Frontend Performance Lab (FPL) allows you to author custom AST-based performance rules and distribute them via the Plugin SDK.

## Creating a Plugin

First, install the SDK:

```bash
npm install -D @smg99/frontend-performance-lab-sdk
```

Create a new file for your plugin (`my-fpl-plugin.ts`):

```typescript
import { definePlugin, defineRule } from '@smg99/frontend-performance-lab-sdk'

const customRule = defineRule({
  id: 'custom-heavy-loop',
  title: 'Heavy Loop Detected',
  description: 'Flags expensive `for` loops in React components.',
  severity: 'Warning',
  category: 'CPU',
  frameworks: ['react'],
  supportedLanguages: ['js', 'jsx', 'ts', 'tsx'],
  impact: 'High CPU utilization blocks the main thread.',
  fix: 'Use Web Workers for heavy data processing.',
  browserImpact: {
    cpu: true,
    memory: false,
    rendering: false,
    network: false,
    cwv: true
  },
  explanation: {
    whatHappened: 'A long-running loop was found in the render path.',
    whyBrowserBehavesThisWay: 'The browser main thread is single-threaded.',
    pipelineInvolved: ['DOM']
  },
  autoFix: {
    badCode: 'for(let i=0; i<1e9; i++) {}',
    recommendedCode: 'worker.postMessage(data)',
    whyFaster: 'Offloads work.'
  },
  confidence: {
    score: 80,
    reasoning: 'AST detected loop limit.',
    limitations: 'Cannot determine runtime data size.',
    falsePositiveRisk: 'Medium'
  },
  relatedExperiments: [],
  browserAPIs: ['web-workers'],
  relatedRecipes: [],

  visitor: (ast, context) => {
    const issues = []
    // Example AST traversal (using babel ast directly)
    if (ast.type === 'File') {
      // logic to detect
    }
    return issues
  }
})

export default definePlugin({
  id: 'my-custom-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',
  rules: [customRule]
})
```

## Consuming a Plugin

To use your plugin (or one downloaded from NPM), create an `fpl.config.ts` in your repository root:

```typescript
import myPlugin from './my-fpl-plugin'

export default {
  plugins: [myPlugin]
}
```

When you run `npx fpl analyze .`, the CLI will automatically load `fpl.config.ts` and register your custom rules into the Analyzer Engine.
