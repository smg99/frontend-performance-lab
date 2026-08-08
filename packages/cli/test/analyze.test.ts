import { describe, it, expect, vi } from 'vitest'
import { promises as fs } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import analyzeCommand from '../src/commands/analyze'

// Mock dependencies
vi.mock('../../../../shared/utils/analyzer/rules/index', () => ({
  getConfiguredEngine: () => ({
    analyze: () => ({
      overallScore: 100,
      performanceScore: 100,
      estimates: { performanceGain: '0%', timeToFix: '0h' },
      issues: [],
      analyzedFiles: 1
    }),
    registerPlugin: vi.fn()
  })
}))

vi.mock('../../../../shared/core/src/index', () => ({
  buildProjectContext: async (files: string[]) =>
    files.map(f => ({
      filename: f,
      code: '',
      language: 'js',
      framework: 'js'
    })),
  discoverFiles: (dir: string) => [join(dir, 'index.js')]
}))

vi.mock('c12', () => ({
  loadConfig: async () => ({ config: {} })
}))

describe('CLI analyze command', () => {
  it('runs without errors on a simple project', async () => {
    const tempDir = await fs.mkdtemp(join(tmpdir(), 'fpl-test-'))
    await fs.writeFile(join(tempDir, 'index.js'), 'console.log("hello");')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args = { target: tempDir, 'auto-fix': false } as any

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await analyzeCommand.run({ args })
    consoleSpy.mockRestore()
    expect(true).toBe(true)
  })
})
