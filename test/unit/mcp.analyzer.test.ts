import { describe, it, expect } from 'vitest'
import { mcpCore } from '../../shared/mcp/core'

describe('mcpCore.performance_audit (Slice 2)', () => {
  it('detects issues in a valid Vue component', async () => {
    const vueCode = `
      <template>
        <div v-for="i in 10000" :key="i">
          {{ i }}
        </div>
      </template>
      <script setup>
      import { ref } from 'vue'
      </script>
    `
    const result = await mcpCore.performance_audit({ sourceCode: vueCode })
    const data = JSON.parse(result.content[0].text)

    expect(data.score).toBeLessThan(100)
    expect(data.issues.length).toBeGreaterThan(0)
    expect(data.issues[0].id).toContain('vue-large-v-for')
  })

  it('detects issues in a valid React component', async () => {
    const reactCode = `
      import React from "react"
      export function LargeMap() {
        const items = Array.from({length: 5000})
        return (
          <div>
            {items.map((_, i) => <div key={i}>{i}</div>)}
          </div>
        )
      }
    `
    const result = await mcpCore.performance_audit({ sourceCode: reactCode })
    const data = JSON.parse(result.content[0].text)

    expect(data.score).toBeLessThan(100)
    expect(data.issues.length).toBeGreaterThan(0)
    expect(data.issues[0].id).toContain('react-large-map')
  })

  it('returns default empty values for no findings', async () => {
    const cleanCode = `
      import React from "react"
      export function Clean() {
        return <div>Hello</div>
      }
    `
    const result = await mcpCore.performance_audit({ sourceCode: cleanCode })
    const data = JSON.parse(result.content[0].text)

    expect(data.score).toBe(100)
    expect(data.issues).toEqual([])
    expect(data.summary).toBe('0 performance issue(s) detected.')
  })

  it('handles malformed source gracefully', async () => {
    const malformed = `import React from "reac // syntax error!`
    const result = await mcpCore.performance_audit({ sourceCode: malformed })
    const data = JSON.parse(result.content[0].text)

    // Expect the analyzer to either catch it or return 100 with no issues
    expect(data.issues).toEqual([])
    expect(data.score).toBe(100)
    // The summary should mention error or 0 issues
    expect(typeof data.summary).toBe('string')
  })
})
