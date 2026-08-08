import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { promises as fs, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { buildProjectContext } from '../../../shared/core/src/buildProjectContext'

describe('buildProjectContext', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'context-test-'))
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('reads files, detects framework, and builds AnalyzerContext objects', async () => {
    const reactFile = join(tempDir, 'Component.tsx')
    const vueFile = join(tempDir, 'App.vue')
    const missingFile = join(tempDir, 'NonExistent.ts')

    writeFileSync(reactFile, 'import React from "react"; export const Component = () => null;')
    writeFileSync(vueFile, '<template><div>Vue</div></template>')

    const contexts = await buildProjectContext([reactFile, vueFile, missingFile])

    expect(contexts).toHaveLength(2)
    expect(contexts[0]).toEqual({
      filename: reactFile,
      code: 'import React from "react"; export const Component = () => null;',
      language: 'tsx',
      framework: 'react'
    })
    expect(contexts[1]).toEqual({
      filename: vueFile,
      code: '<template><div>Vue</div></template>',
      language: 'vue',
      framework: 'vue'
    })
  })
})
