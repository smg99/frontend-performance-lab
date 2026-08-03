import fs from 'fs'
import path from 'path'
import { EnvironmentDetector } from './EnvironmentDetector.js'

export type SupportedIDE = 'Claude Desktop' | 'Cursor' | 'VSCode' | 'Antigravity'

export const IDEFinder = {
  findInstalledIDEs(): SupportedIDE[] {
    const home = EnvironmentDetector.getHomeDir()
    const ides: SupportedIDE[] = []

    // Cursor
    const cursorMac = path.join(home, 'Library/Application Support/Cursor')
    const cursorWin = path.join(home, 'AppData/Roaming/Cursor')
    const cursorLinux = path.join(home, '.config/Cursor')
    const cursorLegacy = path.join(home, '.cursor')

    if (
      fs.existsSync(cursorMac) ||
      fs.existsSync(cursorWin) ||
      fs.existsSync(cursorLinux) ||
      fs.existsSync(cursorLegacy)
    ) {
      ides.push('Cursor')
    }

    // Claude Desktop
    const claudeMac = path.join(home, 'Library/Application Support/Claude')
    const claudeWin = path.join(home, 'AppData/Roaming/Claude')
    if (fs.existsSync(claudeMac) || fs.existsSync(claudeWin)) {
      ides.push('Claude Desktop')
    }

    // VSCode
    const vscodeDir = path.join(home, '.vscode')
    if (fs.existsSync(vscodeDir)) {
      ides.push('VSCode')
    }

    // Antigravity
    const antigravityDir = path.join(home, '.gemini/config')
    if (fs.existsSync(antigravityDir)) {
      ides.push('Antigravity')
    }

    return ides
  }
}
