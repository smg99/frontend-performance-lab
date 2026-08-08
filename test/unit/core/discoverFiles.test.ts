import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { promises as fs, mkdirSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { discoverFiles } from '../../../shared/core/src/discoverFiles'

describe('discoverFiles', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'discover-test-'))
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('recursively finds supported extensions and ignores noise directories', () => {
    mkdirSync(join(tempDir, 'src'), { recursive: true })
    mkdirSync(join(tempDir, 'node_modules'), { recursive: true })
    mkdirSync(join(tempDir, '.git'), { recursive: true })
    mkdirSync(join(tempDir, '.fpl'), { recursive: true })
    mkdirSync(join(tempDir, 'dist'), { recursive: true })

    writeFileSync(join(tempDir, 'src', 'app.tsx'), 'export const App = () => null;')
    writeFileSync(join(tempDir, 'src', 'styles.css'), 'body {}')
    writeFileSync(join(tempDir, 'node_modules', 'pkg.js'), 'module.exports = {}')
    writeFileSync(join(tempDir, '.git', 'HEAD'), 'ref: refs/heads/main')
    writeFileSync(join(tempDir, '.fpl', 'cache.json'), '{}')
    writeFileSync(join(tempDir, 'dist', 'bundle.js'), 'console.log()')

    const files = discoverFiles(tempDir, ['.js', '.jsx', '.ts', '.tsx'])

    expect(files).toHaveLength(1)
    expect(files[0]).toBe(join(tempDir, 'src', 'app.tsx'))
  })
})
