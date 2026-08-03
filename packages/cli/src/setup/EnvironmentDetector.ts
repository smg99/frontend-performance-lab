import os from 'os'

export const EnvironmentDetector = {
  getOS(): 'mac' | 'windows' | 'linux' {
    const platform = os.platform()
    if (platform === 'darwin') return 'mac'
    if (platform === 'win32') return 'windows'
    return 'linux'
  },
  getHomeDir(): string {
    return os.homedir()
  }
}
