// shared/core/src/detectFramework.ts
import type { AnalyzerContext } from '../../../shared/schemas/analyzer'

/**
 * Detection metadata returned by detectFramework.
 */
export type DetectionResult = {
  /** Detected framework (react, vue, svelte, or generic js) */
  framework: 'react' | 'vue' | 'svelte' | 'js'
  /** Confidence score between 0 (low) and 1 (high) */
  confidence: number
  /** How the detection was performed */
  strategy: 'extension' | 'content'
}

/**
 * Detect the framework used by a file based on its extension and content.
 * Returns a {@link DetectionResult} describing the framework, confidence, and strategy.
 */
export function detectFramework(context: AnalyzerContext): DetectionResult {
  const { filename, code } = context
  // Extension based detection – highest confidence
  if (filename.endsWith('.vue')) {
    return { framework: 'vue', confidence: 1.0, strategy: 'extension' }
  }
  if (filename.endsWith('.svelte')) {
    return { framework: 'svelte', confidence: 1.0, strategy: 'extension' }
  }
  if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
    return { framework: 'react', confidence: 1.0, strategy: 'extension' }
  }

  // Content based heuristics – lower confidence
  if (code.includes('import React') || code.includes("from 'react'")) {
    return { framework: 'react', confidence: 0.7, strategy: 'content' }
  }
  if (code.includes("from 'vue'")) {
    return { framework: 'vue', confidence: 0.7, strategy: 'content' }
  }
  if (code.includes("from 'svelte'")) {
    return { framework: 'svelte', confidence: 0.7, strategy: 'content' }
  }

  // Default to plain JavaScript with low confidence
  return { framework: 'js', confidence: 0.5, strategy: 'content' }
}
