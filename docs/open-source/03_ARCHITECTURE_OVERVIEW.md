# Architecture Overview

Frontend Performance Lab (FPL) is designed to be highly decoupled.

## 1. File Access (`shared/filesystem/`)

Responsible for safely loading files. It strictly enforces a 1MB size limit and directory traversal prevention.

## 2. The Engine (`shared/utils/analyzer/`)

Accepts raw source code and an AST parser (Babel or Vue compiler). It traverses the tree and yields raw detection objects containing an ID, severity, and line number. It knows _nothing_ about humans or MCP.

## 3. The Mapper (`shared/diagnostics/`)

Takes raw detection objects and maps them to human-readable explanations. It answers the "why does this matter?" and "how do I fix it?" questions.

## 4. The Builder (`shared/reporting/`)

Takes enriched diagnostics and deterministically builds a clean Markdown engineering report.

## 5. The MCP Server (`shared/mcp/`)

The interface between the IDE (Cursor, Claude Desktop, etc.) and FPL. It implements the Model Context Protocol to expose `performance_audit`.
