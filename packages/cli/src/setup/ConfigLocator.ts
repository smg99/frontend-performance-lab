import path from 'path'
import fs from 'fs'
import { EnvironmentDetector } from './EnvironmentDetector.js'
import type { SupportedIDE } from './IDEFinder.js'

export const ConfigLocator = {
  getConfigPath(ide: SupportedIDE): string | null {
    const home = EnvironmentDetector.getHomeDir()
    const osType = EnvironmentDetector.getOS()

    switch (ide) {
      case 'Cursor':
        if (osType === 'windows')
          return path.join(
            home,
            'AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json'
          ) // Cursor typically uses global storage for MCP or .cursor/mcp.json. Let's fallback to standard if not known.
        // Actually Cursor has native MCP now in `~/.cursor/mcp.json` or roaming
        return path.join(home, '.cursor/mcp.json')
      case 'Claude Desktop':
        if (osType === 'windows')
          return path.join(home, 'AppData/Roaming/Claude/claude_desktop_config.json')
        if (osType === 'mac')
          return path.join(home, 'Library/Application Support/Claude/claude_desktop_config.json')
        return null
      case 'VSCode':
        if (osType === 'windows') return path.join(home, 'AppData/Roaming/Code/User/mcp.json')
        if (osType === 'mac')
          return path.join(home, 'Library/Application Support/Code/User/mcp.json')
        return path.join(home, '.config/Code/User/mcp.json')
      case 'Antigravity':
        return path.join(home, '.gemini/config/mcp.json')
      default:
        return null
    }
  },

  ensureConfigDir(configPath: string) {
    const dir = path.dirname(configPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}
