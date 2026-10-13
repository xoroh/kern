# `@xoroh/kern-contracts`

Versioned platform-free metadata types and validators for the Kern design
system: provider identity, component capability records, block records, icon
records, install receipts/CLI config, and version coordinates.

Pure by construction: no React, no DOM, no React Native, no CSS, no test
runner, no UI implementation. Renderers, tokens, the CLI, the MCP server and
the registry generator all read this one vocabulary instead of each carrying
its own row shape (ADR-P02).

```ts
import { defineComponent, defineReceipt, PROVIDER_ID } from "@xoroh/kern-contracts";
```
