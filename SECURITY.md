# Security Architecture

## MCP Server Security Boundary

The Frontend Performance Lab MCP Server relies on `shared/filesystem/FileAccessService.ts` to implement a strict security perimeter around the user's workspace.

### 1. Workspace Isolation

The analyzer is firmly restricted to the active workspace root directory where the server is launched. It cannot analyze files outside this boundary.

- **Path normalization**: All input paths are normalized (stripping redundant `./` and `../`).
- **Traversal Prevention**: Inputs containing explicitly attempted directory traversal strings (like `../../`) are instantly rejected.
- **Absolute Paths Verification**: Any absolute paths provided must begin with the workspace root path.
- **Symlink Escaping**: We invoke `fs.realpathSync` to guarantee that the absolute resolved file path hasn't bypassed workspace limits via symbolic links pointing externally.

### 2. Supported File Types

Only specific web-focused file extensions can be passed into the engine to prevent parsing binaries, massive un-ignorable JSON data, or sensitive system files like `.env`.
Supported:

- `.vue`
- `.jsx`
- `.tsx`
- `.js`
- `.ts`
- `.mjs`
- `.cjs`

### 3. File Size Limits

To prevent the engine from OOM crashing or causing the MCP server to hang the IDE, individual files are hard-capped at **1 MB**.

### 4. Robust Failure

The File Access layer guarantees it will never throw an uncaught exception. All filesystem and permission errors are caught, sanitized, and returned as a structured response `FileAccessResult`, ensuring the MCP connection remains stable under stress.
