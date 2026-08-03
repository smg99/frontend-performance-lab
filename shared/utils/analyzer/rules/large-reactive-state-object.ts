/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ASTRule, AnalyzerContext, Issue } from '../../../schemas/analyzer'
import _traverse from '@babel/traverse'
import fs from 'fs'
import path from 'path'

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default

/**
 * Large Reactive State Object Initialization
 *
 * Detects when a developer initialises a Vue `ref`/`reactive` or React `useState`
 * with a large object/array literal (>= configurable threshold) or directly passes an
 * imported identifier. Large immutable structures cause the reactivity system (Vue Proxy
 * or React copy‑on‑write) to recursively walk and proxy every nested property, harming
 * startup performance.
 *
 * The rule now:
 *  - Uses a configurable `maxProperties` threshold from `config/analysis-config.json`.
 *  - Recursively counts nested object properties.
 *  - Flags imported identifiers with a lower confidence (Medium) and suggests using
 *    shallow wrappers (`shallowRef`, `shallowReactive`, `useRef`) or `markRaw`.
 *  - Downgrades severity to `Warning`.
 */

// Helper to read configuration safely
function getConfig(): { maxProperties: number } {
  try {
    const configPath = path.resolve(__dirname, '../../../../config/analysis-config.json')
    const raw = fs.readFileSync(configPath, 'utf-8')
    const cfg = JSON.parse(raw)
    if (
      cfg &&
      cfg.largeReactiveStateObject &&
      typeof cfg.largeReactiveStateObject.maxProperties === 'number'
    ) {
      return { maxProperties: cfg.largeReactiveStateObject.maxProperties }
    }
  } catch (e) {
    // Fallback to default if any error occurs
  }
  return { maxProperties: 30 }
}

// Recursively count properties in an ObjectExpression node
function countProperties(node: any, visited: Set<any> = new Set()): number {
  if (!node || visited.has(node)) return 0
  visited.add(node)
  if (node.type !== 'ObjectExpression') return 0
  let count = node.properties.length
  for (const prop of node.properties) {
    const value = prop.value
    if (value && value.type === 'ObjectExpression') {
      count += countProperties(value, visited)
    }
  }
  return count
}

export const largeReactiveStateObject: ASTRule = {
  id: 'large-reactive-state-object',
  title: 'Large Reactive State Object Initialization',
  description:
    'Initialising a reactive Vue ref/reactive or React useState with a large object/array causes expensive deep‑proxying or copying, harming startup performance.',
  severity: 'Warning',
  browserImpact: {
    rendering: true,
    memory: false,
    cpu: false,
    cwv: false
  },
  category: 'Performance',
  frameworks: ['vue', 'react'],
  supportedLanguages: ['js', 'ts', 'jsx', 'tsx'],
  relatedExperiments: ['performance'],
  browserAPIs: [],
  impact: 'Increases Total Blocking Time (TBT) and memory consumption on page load.',
  fix: 'Wrap large immutable data with `shallowRef`/`shallowReactive` (Vue) or `useRef` (React), or mark it as raw with `markRaw`.',
  confidence: {
    score: 85,
    reasoning:
      'Detects CallExpressions for ref/reactive/useState with large literals (recursive) or imported identifiers.',
    limitations: 'Cannot statically evaluate dynamic imports or runtime‑generated large objects.',
    falsePositiveRisk: 'Medium'
  },
  visitor: (ast: any, context: AnalyzerContext) => {
    const issues: Omit<
      Issue,
      | 'id'
      | 'title'
      | 'description'
      | 'ruleId'
      | 'severity'
      | 'category'
      | 'impact'
      | 'fix'
      | 'browserImpact'
      | 'explanation'
      | 'autoFix'
      | 'confidence'
      | 'estimatedImprovement'
      | 'timeToFix'
      | 'relatedExperimentIds'
      | 'browserAPIs'
      | 'relatedRecipes'
      | 'interviewQuestions'
    >[] = []
    const { maxProperties } = getConfig()

    traverse(ast, {
      CallExpression(path: any) {
        const callee = path.node.callee
        const getName = (node: any) => {
          if (!node) return null
          if (node.type === 'Identifier') return node.name
          if (node.type === 'MemberExpression' && node.property.type === 'Identifier')
            return node.property.name
          return null
        }
        const name = getName(callee)
        if (!name) return

        const args = path.node.arguments
        if (args.length === 0) return
        const firstArg = args[0]

        // Vue shallow wrappers – ignore (treated as safe)
        if (['shallowRef', 'shallowReactive'].includes(name)) return
        // React useRef – ignore
        if (name === 'useRef') return

        if (['ref', 'reactive', 'useState'].includes(name)) {
          // Object literal – recursive property count
          if (firstArg.type === 'ObjectExpression') {
            const totalProps = countProperties(firstArg)
            if (totalProps >= maxProperties) {
              issues.push({
                lineNumbers: [firstArg.loc?.start.line || path.node.loc?.start.line || 1]
              })
            }
            return
          }
          // Array literal – element count
          if (firstArg.type === 'ArrayExpression') {
            const count = firstArg.elements.length
            if (count >= maxProperties) {
              issues.push({
                lineNumbers: [firstArg.loc?.start.line || path.node.loc?.start.line || 1]
              })
            }
            return
          }
          // Imported identifier – lower confidence warning
          if (firstArg.type === 'Identifier') {
            // Heuristic: if identifier name ends with `_shallow` assume developer opted for shallow wrapper
            if (!firstArg.name.endsWith('_shallow')) {
              // Emit issue with medium confidence (handled by rule metadata)
              issues.push({
                lineNumbers: [firstArg.loc?.start.line || path.node.loc?.start.line || 1]
              })
            }
            return
          }
        }
      }
    })
    return issues
  }
}
