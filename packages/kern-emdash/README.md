# `@xoroh/kern-emdash`

Kern for EmDash (Cloudflare's Astro + TypeScript CMS). Astro integration +
block plugin so EmDash themes render Kern components with shared M3 themes.

> Beta alignment: built against `emdash@0.1.x` (beta). Re-verify the
> `definePlugin` + custom block type binding on every EmDash minor.

## Install

```bash
bun add @xoroh/kern @xoroh/kern-emdash astro emdash react react-dom
bun add -d @astrojs/react
```

## Theme (`astro.config.mjs`)

```typescript
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import react from "@astrojs/react";
import { kernEmdash } from "@xoroh/kern-emdash";

export default defineConfig({
  integrations: [react(), emdash({ database: d1() }), kernEmdash({ theme: "m3" })],
});
```

## Blocks (`@xoroh/kern-emdash/plugin`)

Registers Kern components as EmDash custom block types (Portable Text).
Least-privilege manifest: `content:read` only.

## License

Apache License 2.0 — see root `LICENSE`.
