import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { ConfigPatcher } from '../../src/setup/ConfigPatcher.js'
import { BackupManager, RollbackManager } from '../../src/setup/RollbackManager.js'
import { InstallationValidator } from '../../src/setup/InstallationValidator.js'

describe('Installer MVP Tests', () => {
  const mockDir = path.join(process.cwd(), 'test-fixtures-installer')
  const mockConfig = path.join(mockDir, 'mcp.json')

  beforeEach(() => {
    if (!fs.existsSync(mockDir)) fs.mkdirSync(mockDir, { recursive: true })
  })

  afterEach(() => {
    if (fs.existsSync(mockDir)) fs.rmSync(mockDir, { recursive: true, force: true })
  })

  it('preserves existing configurations and injects FPL', () => {
    fs.writeFileSync(mockConfig, JSON.stringify({ mcpServers: { existing: { command: 'echo' } } }))

    ConfigPatcher.patch(mockConfig)

    const result = JSON.parse(fs.readFileSync(mockConfig, 'utf8'))
    expect(result.mcpServers.existing).toBeDefined()
    expect(result.mcpServers['frontend-performance-lab']).toBeDefined()
  })

  it('avoids duplicate installs idempotently', () => {
    fs.writeFileSync(
      mockConfig,
      JSON.stringify({ mcpServers: { 'frontend-performance-lab': { command: 'old' } } })
    )

    ConfigPatcher.patch(mockConfig)

    const result = JSON.parse(fs.readFileSync(mockConfig, 'utf8'))
    expect(result.mcpServers['frontend-performance-lab'].command).toBe('npx')
  })

  it('validates successful installation', () => {
    fs.writeFileSync(mockConfig, JSON.stringify({ mcpServers: {} }))
    ConfigPatcher.patch(mockConfig)

    const isValid = InstallationValidator.validate(mockConfig)
    expect(isValid).toBe(true)
  })

  it('handles rollback for malformed JSON gracefully', () => {
    fs.writeFileSync(mockConfig, '{ malformed: json')
    const backup = BackupManager.backup(mockConfig)

    expect(() => ConfigPatcher.patch(mockConfig)).toThrow()

    RollbackManager.rollback(mockConfig, backup)
    expect(fs.readFileSync(mockConfig, 'utf8')).toBe('{ malformed: json')
  })
})
