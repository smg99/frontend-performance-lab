import fs from 'fs'

export const BackupManager = {
  backup(configPath: string): string | null {
    if (!fs.existsSync(configPath)) return null
    const backupPath = `${configPath}.bak`
    fs.copyFileSync(configPath, backupPath)
    return backupPath
  }
}

export const RollbackManager = {
  rollback(configPath: string, backupPath: string | null) {
    if (backupPath && fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, configPath)
    } else {
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath)
      }
    }
  }
}
