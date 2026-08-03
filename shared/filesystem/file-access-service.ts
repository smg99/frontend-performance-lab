import fs from 'fs'
import path from 'path'

export interface FileAccessResult {
  success: boolean
  content?: string
  extension?: string
  error?: string
}

export class FileAccessService {
  private workspaceRoot: string
  private static MAX_FILE_SIZE = 1 * 1024 * 1024 // 1 MB
  private static ALLOWED_EXTENSIONS = ['.vue', '.jsx', '.tsx', '.js', '.ts', '.mjs', '.cjs']

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot)
  }

  public readFileSafely(requestedPath: string): FileAccessResult {
    try {
      // 1. Path Normalization
      const normalizedRequestedPath = path.normalize(requestedPath)

      // 2. Reject explicit directory traversal just to be safe, though resolve handles it
      if (requestedPath.includes('..')) {
        return { success: false, error: 'Path traversal (../) is not allowed.' }
      }

      // 3. Absolute path resolution
      const absolutePath = path.resolve(this.workspaceRoot, normalizedRequestedPath)

      // 4. Workspace restriction check (pre-realpath)
      if (!absolutePath.startsWith(this.workspaceRoot)) {
        return { success: false, error: 'Access denied: Path is outside the workspace.' }
      }

      // 5. File existence
      if (!fs.existsSync(absolutePath)) {
        return { success: false, error: 'File not found.' }
      }

      // 6. Symlink resolution and escaping check
      const realPath = fs.realpathSync(absolutePath)
      if (!realPath.startsWith(this.workspaceRoot)) {
        return { success: false, error: 'Access denied: Symlink resolves outside the workspace.' }
      }

      // 7. Stat validation (size and type)
      const stat = fs.statSync(realPath)
      if (!stat.isFile()) {
        return { success: false, error: 'Requested path is not a file.' }
      }
      if (stat.size > FileAccessService.MAX_FILE_SIZE) {
        return { success: false, error: 'File exceeds the 1MB maximum size limit.' }
      }

      // 8. Extension validation
      const extension = path.extname(realPath).toLowerCase()
      if (!FileAccessService.ALLOWED_EXTENSIONS.includes(extension)) {
        return { success: false, error: 'Unsupported file extension: ' + extension }
      }

      // 9. Read contents
      const content = fs.readFileSync(realPath, 'utf-8')

      return { success: true, content, extension }
    } catch (err: unknown) {
      return {
        success: false,
        error: 'File access error: ' + (err instanceof Error ? err.message : String(err))
      }
    }
  }
}
