import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { FileAccessService } from '../../shared/filesystem/file-access-service'
import os from 'os'

describe('FileAccessService', () => {
  let workspaceRoot: string
  let service: FileAccessService
  const tempFiles: string[] = []

  beforeAll(() => {
    // We use the real project root as the workspace root for tests
    workspaceRoot = process.cwd()
    service = new FileAccessService(workspaceRoot)

    // Create some happy path files in the workspace
    const tempVue = path.join(workspaceRoot, 'test-happy.vue')
    const tempTs = path.join(workspaceRoot, 'test-happy.ts')
    const tempReact = path.join(workspaceRoot, 'test-happy.tsx')

    fs.writeFileSync(tempVue, '<template><div></div></template>')
    fs.writeFileSync(tempTs, 'console.log("ts")')
    fs.writeFileSync(tempReact, 'export const React = () => <div/>')
    tempFiles.push(tempVue, tempTs, tempReact)

    // Create an unsupported extension file
    const tempUnsupported = path.join(workspaceRoot, 'test-unsupported.json')
    fs.writeFileSync(tempUnsupported, '{}')
    tempFiles.push(tempUnsupported)

    // Create an oversized file > 1MB
    const tempOversized = path.join(workspaceRoot, 'test-oversized.js')
    const largeBuffer = Buffer.alloc(1024 * 1024 + 10, 'a')
    fs.writeFileSync(tempOversized, largeBuffer)
    tempFiles.push(tempOversized)

    // Create an external file outside the workspace
    const tempExternal = path.join(os.tmpdir(), 'test-external.js')
    fs.writeFileSync(tempExternal, 'console.log("external")')
    tempFiles.push(tempExternal)

    // Create a symlink that escapes the workspace
    const tempSymlink = path.join(workspaceRoot, 'test-symlink.js')
    try {
      fs.symlinkSync(tempExternal, tempSymlink)
    } catch (e) {
      /* ignore */
    } // May fail on Windows without admin, but works on macOS/Linux
    tempFiles.push(tempSymlink)
  })

  afterAll(() => {
    // Clean up
    for (const file of tempFiles) {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file)
        } catch (e) {
          /* ignore */
        }
      }
    }
  })

  describe('Happy Paths', () => {
    it('Reads a Vue file successfully', () => {
      const result = service.readFileSafely('test-happy.vue')
      expect(result.success).toBe(true)
      expect(result.content).toBe('<template><div></div></template>')
      expect(result.extension).toBe('.vue')
    })
    it('Reads a React file successfully', () => {
      const result = service.readFileSafely('test-happy.tsx')
      expect(result.success).toBe(true)
    })
    it('Reads a TS file successfully', () => {
      const result = service.readFileSafely('test-happy.ts')
      expect(result.success).toBe(true)
    })
  })

  describe('Security & Validation', () => {
    it('Rejects ../../ traversal', () => {
      const result = service.readFileSafely('../../package.json')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Path traversal (../) is not allowed.')
    })

    it('Rejects absolute external path', () => {
      const externalPath = path.join(os.tmpdir(), 'test-external.js')
      const result = service.readFileSafely(externalPath)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Access denied: Path is outside the workspace')
    })

    it('Rejects unsupported extensions', () => {
      const result = service.readFileSafely('test-unsupported.json')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported file extension')
    })

    it('Rejects missing file', () => {
      const result = service.readFileSafely('doesnt-exist.js')
      expect(result.success).toBe(false)
      expect(result.error).toContain('File not found')
    })

    it('Rejects oversized file', () => {
      const result = service.readFileSafely('test-oversized.js')
      expect(result.success).toBe(false)
      expect(result.error).toContain('exceeds the 1MB maximum size limit')
    })

    it('Rejects symlink escaping workspace', () => {
      const result = service.readFileSafely('test-symlink.js')
      // It might fail on symlink creation in some OS, but if it exists, it should be rejected.
      if (fs.existsSync(path.join(process.cwd(), 'test-symlink.js'))) {
        expect(result.success).toBe(false)
        expect(result.error).toContain('Access denied: Symlink resolves outside the workspace')
      }
    })
  })
})
