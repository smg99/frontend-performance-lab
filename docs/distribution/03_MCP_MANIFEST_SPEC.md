# MCP Manifest Spec

The FPL Marketplace package will include a `manifest.json` describing the server's capabilities and compatibility.

```json
{
  "name": "frontend-performance-lab",
  "description": "Deterministic AST-based performance analyzer for Vue and React applications.",
  "homepage": "https://github.com/organization/frontend-performance-lab",
  "repository": {
    "type": "git",
    "url": "https://github.com/organization/frontend-performance-lab.git"
  },
  "license": "MIT",
  "icon": "https://raw.githubusercontent.com/organization/frontend-performance-lab/main/assets/icon.png",
  "keywords": ["performance", "vue", "react", "ast", "analyzer", "mcp", "frontend"],
  "supportedIDEs": [
    "Cursor",
    "Claude Desktop",
    "Claude Code",
    "VSCode",
    "Antigravity",
    "Windsurf",
    "Continue.dev",
    "Cline",
    "RooCode",
    "JetBrains",
    "Zed"
  ],
  "supportedFrameworks": ["Vue", "React"],
  "supportedLanguages": ["TypeScript", "JavaScript", "Vue SFC", "TSX", "JSX"],
  "supportedMCPTools": ["performance_audit"],
  "versionCompatibility": {
    "mcpSpecification": "^1.0.0",
    "node": ">=18.0.0"
  }
}
```
