import { readdirSync, statSync } from 'fs'
import { extname, join } from 'path'

/**
 * Walk a directory recursively and return all files matching the supplied extensions.
 * Ignores typical noise folders (node_modules, .git, .fpl, dist).
 */
export function discoverFiles(targetPath: string, supportedExts: string[]): string[] {
  const fileList: string[] = []
  const walk = (dir: string) => {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (['node_modules', '.git', '.fpl', 'dist'].includes(entry)) continue
      const full = join(dir, entry)
      let stat
      try {
        stat = statSync(full)
      } catch {
        continue
      }
      if (stat.isDirectory()) {
        walk(full)
      } else if (stat.isFile() && supportedExts.includes(extname(full))) {
        fileList.push(full)
      }
    }
  }
  walk(targetPath)
  return fileList
}
