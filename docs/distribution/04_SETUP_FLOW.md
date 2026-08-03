# Setup Flow Architecture

The user experience for `npx fpl setup` will be:

1. **Invocation**: User runs `npx fpl setup` in their terminal.
2. **Discovery**: CLI scans common directories (`~/.cursor`, `~/.vscode`, etc.) to find installed MCP clients.
3. **Prompt (Optional)**: If multiple clients are found, prompt the user: "We found Cursor and Claude Desktop. Configure both? [Y/n]". (Defaults to Y for headless execution).
4. **Configuration Patching**:
   - For each selected client, locate the `mcp.json` or equivalent.
   - Backup the file to `mcp.json.bak`.
   - Parse JSON. If FPL exists, update path/args. If not, append the `frontend-performance-lab` server entry using `npx -y frontend-performance-lab`.
   - Write file.
5. **Validation**:
   - Run a quick health check ping using the MCP protocol over stdio to the newly configured path.
   - If success: Print ✅.
   - If failure: Print ❌, restore `.bak`, and log error.
6. **Completion**:
   - "✅ FPL successfully installed in Cursor. Please restart your IDE if tools do not appear."
