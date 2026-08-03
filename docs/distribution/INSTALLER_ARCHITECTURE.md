# Installer Architecture

The `npx fpl setup` CLI command is highly modular to ensure robustness, testability, and safety across different operating systems.

## Modules

- **EnvironmentDetector**: Identifies the underlying OS (Mac, Windows, Linux) and the user's home directory.
- **IDEFinder**: Scans the filesystem for known configuration directories (e.g., `~/.vscode`, `~/.cursor`) to detect which supported IDEs are actually installed.
- **ConfigLocator**: Maps a detected IDE to its specific MCP `mcp.json` or `claude_desktop_config.json` configuration path, applying OS-specific logic.
- **BackupManager / RollbackManager**: Responsible for creating `.bak` files before any mutations occur, and restoring them if the configuration fails validation.
- **ConfigPatcher**: Safely reads the existing JSON, merges the `frontend-performance-lab` MCP entry into `mcpServers`, and stringifies the output without destroying existing configurations.
- **InstallationValidator**: Reads the written configuration file to verify that the FPL server was properly injected and the JSON remains valid.
- **ProgressRenderer**: A thin UI wrapper providing consistent, emoji-driven console output to ensure the CLI remains friendly and approachable for Junior Developers.
- **Orchestrator (`index.ts`)**: Wires the modules together into a cohesive setup workflow.
