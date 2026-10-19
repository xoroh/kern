/**
 * MCP tool handlers — the action layer, importable without starting the server.
 *
 * `index.ts` wires these to `server.tool`; tests import them directly (plus
 * one spawned-server smoke) so the agent loop stays green without speaking
 * JSON-RPC everywhere. Payload shapes are the contract: the server wraps them
 * in the text envelope, nothing else.
 *
 * Token reads live here, not in the component reader: component sources ship
 * in `@xoroh/kern` (`packages/kern/...`) while token data ships in
 * `@xoroh/kern-tokens` (`packages/kern-tokens/...`). The old single-root
 * reader only looked under `packages/kern`, so `get_tokens` and `list_themes`
 * failed even inside the monorepo with `KERN_REPO_ROOT` set — the first wall
 * an agent building a themed screen walks into.
 *
 * Roadmap item 7: token, theme, DTCG and block data are served from the
 * build-time bundle (`./bundled-data.js`), never read from a checkout —
 * only component SOURCE bytes still resolve through `KERN_REPO_ROOT`, and
 * only because verbatim source is never embedded (the COMPONENT_SOURCES
 * precedent). Outside a checkout the source reads name what is missing
 * instead of inventing it.
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BUNDLED_BLOCKS,
  BUNDLED_DTCG,
  BUNDLED_THEMES_CATALOG,
  BUNDLED_TOKEN_THEMES,
  BUNDLED_TOKENS_BASE,
} from "./bundled-data.js";
import { COMPONENTS } from "./manifest.js";

export type Platform = "web" | "native";

/**
 * Decision 009: the only current design system. The component tools default
 * to it; the generated registry (`./manifest.js`, single source) carries the
 * system on every row. Mirrors `@xoroh/kern-cli`'s `DEFAULT_SYSTEM` without
 * importing the CLI statically — a static import would drag the CLI's
 * TypeScript compiler into the packed server (see the install-plan note
 * below). The registry rows are the authority; this literal is the default.
 */
export const DEFAULT_SYSTEM = "kern-m3";

/** Systems the generated registry actually carries, in first-seen order. */
export function knownSystems(): string[] {
  return [...new Set(COMPONENTS.map((c) => c.system))];
}

/**
 * Resolve the requested system against the registry. Returns `{ system }`
 * or `{ error }` naming what the registry carries — never an empty result
 * the caller could mistake for "no components".
 */
export function resolveSystem(
  requested?: string,
): { system: string } | { error: string } {
  const known = knownSystems();
  const system = requested ?? DEFAULT_SYSTEM;
  if (!known.includes(system)) {
    return {
      error: `unknown system "${system}" — registry knows: ${known.join(", ")}.`,
    };
  }
  return { system };
}

/**
 * Presets `get_tokens` accepts. `base` is the shared token source
 * (`tokens.json`); the rest are ids from the theme catalog
 * (`packages/kern-m3/src/themes/index.json`). `demo` is a template
 * sample, not a discovery default — it resolves when requested explicitly.
 */
export const TOKEN_PRESETS = [
  "base",
  "material-3",
  "sharp",
  "brand",
  "compact",
] as const;
export type TokenPreset = (typeof TOKEN_PRESETS)[number];

/** Canonical catalog id: presets resolve to themselves (no legacy aliases). */
export function canonicalPreset(preset: TokenPreset): string {
  return preset;
}

// Resolve the kern monorepo root for COMPONENT SOURCE reads only.
// Everything else the tools serve is bundled at build time
// (`./bundled-data.js`, roadmap item 7) — no checkout file is read at
// runtime for data. Component sources are the documented exception: verbatim
// source is never embedded (the COMPONENT_SOURCES precedent), so outside a
// checkout `get_component` names the missing source explicitly instead.
// NOTE: published bundles will inline the registry instead (see README).
function kernRootCandidates(): string[] {
  const here = dirname(fileURLToPath(import.meta.url));
  const roots = [
    process.env.KERN_REPO_ROOT,
    resolve(here, "../../.."), // dist/index.js -> repo root
    resolve(here, "../.."), // src/index.ts -> packages/mcp/.. = packages (wrong, filtered below)
  ].filter((p): p is string => Boolean(p));
  return roots;
}

async function readFirst(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try {
      return await readFile(p, "utf8");
    } catch {
      // try next candidate
    }
  }
  return null;
}

function repoPaths(pkgDir: string, rel: string): string[] {
  return kernRootCandidates().map((base) => resolve(base, pkgDir, rel));
}

/** Component sources: `@xoroh/kern` (`packages/kern/...`). */
async function readKernFile(rel: string): Promise<string | null> {
  return readFirst([
    ...repoPaths("packages/kern", rel),
    ...repoPaths("kern", rel),
  ]);
}

/** Native component sources: `@xoroh/kern-native` (`packages/kern-native/...`). */
async function readNativeFile(rel: string): Promise<string | null> {
  return readFirst([
    ...repoPaths("packages/kern-native", rel),
    ...repoPaths("kern-native", rel),
  ]);
}

export async function listComponents(platform?: Platform, system?: string) {
  const resolved = resolveSystem(system);
  if ("error" in resolved) return resolved;
  const list = COMPONENTS.filter(
    (c) =>
      (!platform || c.platform === platform) && c.system === resolved.system,
  ).map((c) => ({
    name: c.name,
    export: c.export,
    platform: c.platform,
    system: c.system,
    // The subpath that publishes this export — an AI writing the import from
    // `import` alone emits `@xoroh/kern` for SearchBar, which does not
    // compile. Both fields ride together, always.
    entrypoint: c.entrypoint,
    status: c.status,
    import:
      c.platform === "web"
        ? `@xoroh/kern${c.entrypoint === "./start" ? "/start" : ""}`
        : "@xoroh/kern-native",
  }));
  return { system: resolved.system, count: list.length, components: list };
}

export async function getComponent(
  name: string,
  platform: Platform = "web",
  system?: string,
) {
  const resolved = resolveSystem(system);
  if ("error" in resolved) return resolved;
  const entry = COMPONENTS.find(
    (c) =>
      c.name === name &&
      c.platform === platform &&
      c.system === resolved.system,
  );
  if (!entry)
    return {
      error: `unknown component: ${resolved.system}/${platform}/${name}`,
    };
  // Platform roots, not one root: the old code read EVERY row through
  // readKernFile, so `getComponent("button", "native")` returned byte-equal
  // WEB source for a native request — an AI installing from that output ships
  // the wrong renderer. Native rows resolve against the native package.
  const source =
    entry.platform === "native"
      ? await readNativeFile(entry.path)
      : await readKernFile(entry.path);
  return {
    ...entry,
    sourceCode:
      source ??
      "(not bundled — run inside the kern monorepo or set KERN_REPO_ROOT)",
  };
}

export async function getTokens(preset: TokenPreset = "base") {
  // Roadmap item 7: served from the build-time bundle, never read from a
  // checkout — the packed tarball answers from dist.
  if (preset === "base")
    return { preset: canonicalPreset(preset), tokens: BUNDLED_TOKENS_BASE };
  return {
    preset: canonicalPreset(preset),
    tokens: BUNDLED_TOKEN_THEMES[canonicalPreset(preset)],
  };
}

/**
 * The DTCG 2025.10 interchange document (KERN-052) — the machine-readable
 * token projection for third-party tools. Served from the build-time bundle
 * (validated at generation time), so an agent fetching tokens as DTCG gets
 * the same values the CSS ships — inside a checkout or from a packed tarball.
 */
export async function getDtcg(): Promise<
  { spec: string; document: unknown } | { error: string }
> {
  return { spec: "DTCG 2025.10", document: BUNDLED_DTCG };
}

export async function listThemes() {
  // Roadmap item 7: the catalog rides the build-time bundle.
  return BUNDLED_THEMES_CATALOG;
}

// ---------------------------------------------------------------------------
// Icons: discovery over the Material catalog (P5).
//
// The icon package is big (1342 glyphs) and the MCP server must not bundle
// it — nor the CLI's TypeScript compiler — so both arrive via OPTIONAL
// dynamic import. Present workspace install: full data. Absent (packed MCP
// alone): an error naming the missing package, never fabricated rows. An
// icon list with invented names is worse than no list: the agent would render
// a glyph that does not exist.
//

export type IconInfo = {
  semantic: string;
  glyph: string;
};

export async function listIcons(): Promise<
  { count: number; semantic: IconInfo[] } | { error: string }
> {
  try {
    const icons = (await import("@xoroh/kern-icons")) as {
      SEMANTIC_ICONS: Record<string, string>;
      ICON_COUNT?: number;
    };
    const semantic = Object.entries(icons.SEMANTIC_ICONS ?? {}).map(
      ([semantic, glyph]) => ({ semantic, glyph }),
    );
    if (semantic.length === 0) {
      return {
        error:
          "icon package has no semantic map — reinstall @xoroh/kern-icons.",
      };
    }
    return {
      count:
        typeof icons.ICON_COUNT === "number"
          ? icons.ICON_COUNT
          : semantic.length,
      semantic,
    };
  } catch {
    return {
      error:
        "icon catalog unavailable — install @xoroh/kern-icons beside the MCP server or set KERN_REPO_ROOT",
    };
  }
}

export async function getIcon(
  name: string,
): Promise<{ name: string; glyph: string } | { error: string }> {
  const list = await listIcons();
  if ("error" in list) return list;
  const hit =
    list.semantic.find((i) => i.semantic === name) ??
    list.semantic.find((i) => i.glyph === name);
  if (!hit) {
    return {
      error: `unknown icon "${name}" — use list_icons for the semantic map. A missing icon renders null with a dev warning, never a neighbouring glyph.`,
    };
  }
  return { name: hit.semantic, glyph: hit.glyph };
}

// ---------------------------------------------------------------------------
// Blocks: composed sections as installable units (P5).
//
// Metadata only: name, title, category, description and the declared file
// list, parsed from the site block manifest the `check-blocks` gate already
// proves. No file bytes here — `getBlock` names the files, `install_plan`
// vendors them through the CLI. A block row with no files is refused, not
// listed as installable.
//

export type BlockInfo = {
  name: string;
  title: string;
  category: string;
  description: string;
  files: string[];
  components: string[];
};

export async function listBlocks(): Promise<
  { count: number; blocks: BlockInfo[] } | { error: string }
> {
  // Roadmap item 7: block rows ride the build-time bundle (parsed from the
  // site manifest by generate-bundle.mjs) — no checkout read at runtime.
  // The parser lives in the generator now; a row the manifest does not parse
  // is refused at build time, not listed as installable at runtime.
  const blocks: BlockInfo[] = BUNDLED_BLOCKS;
  if (blocks.length === 0) {
    return { error: "bundled 0 block rows — regenerate the MCP bundle." };
  }
  return { count: blocks.length, blocks };
}

export async function getBlock(
  name: string,
): Promise<BlockInfo | { error: string }> {
  const list = await listBlocks();
  if ("error" in list) return list;
  const hit = list.blocks.find((b) => b.name === name);
  if (!hit) return { error: `unknown block: ${name}` };
  return hit;
}

// ---------------------------------------------------------------------------
// Install planning: the deterministic no-write plan (P5).
//
// The CLI owns the planning implementation (`planComponent`: resolve, closure,
// conflict preflight — zero writes). The MCP server exposes it WITHOUT
// bundling the CLI's TypeScript compiler: an optional dynamic import runs the
// real planner when the CLI package is installed beside the server, and when
// it is not, the tool returns the metadata-level plan (registry rows,
// entrypoints, the exact `kern add` command) labelled `metadata-only`.
//
// The label is the load-bearing part. A plan that says "resolved closure"
// when it only read metadata is a fake validation report — the exact failure
// this workflow exists to prevent.
//

export type InstallPlan =
  | {
      evidence: "resolved-closure";
      name: string;
      platform: string;
      system: string;
      files: string[];
      npm: string[];
      instructions: string[];
    }
  | {
      evidence: "metadata-only";
      name: string;
      platform: string;
      system: string;
      row: {
        name: string;
        export: string;
        platform: string;
        system: string;
        entrypoint: string;
        path: string;
        status: string;
      };
      command: string;
    }
  | { error: string };

export async function installPlan(
  name: string,
  platform: Platform = "web",
  system?: string,
): Promise<InstallPlan> {
  const resolved = resolveSystem(system);
  if ("error" in resolved) return resolved;
  const entry = COMPONENTS.find(
    (c) =>
      c.name === name &&
      c.platform === platform &&
      c.system === resolved.system,
  );
  if (!entry)
    return {
      error: `unknown component: ${resolved.system}/${platform}/${name}`,
    };
  if (entry.status !== "real") {
    return { error: `"${name}" is a stub — nothing to install.` };
  }
  try {
    const cli = (await import("@xoroh/kern-cli")) as {
      planComponent: (
        name: string,
        opts: { platform: string; system: string },
      ) => { files: Array<{ out: string }>; npm: string[] };
    };
    const plan = cli.planComponent(name, {
      platform,
      system: resolved.system,
    });
    return {
      evidence: "resolved-closure",
      name,
      platform,
      system: resolved.system,
      files: plan.files.map((f) => f.out),
      npm: plan.npm,
      instructions: [
        `kern add ${name} --platform ${platform} --system ${resolved.system}`,
        ...(plan.npm.length > 0 ? [`bun add ${plan.npm.join(" ")}`] : []),
      ],
    };
  } catch {
    return {
      evidence: "metadata-only",
      name,
      platform,
      system: resolved.system,
      row: { ...entry },
      command: `kern add ${name} --platform ${platform} --system ${resolved.system}`,
    };
  }
}

/**
 * Validate a destination against its receipt (KERN-055) — truthful setup
 * reporting. Runs the CLI's own diff when the CLI package is installed
 * beside the server; otherwise says so instead of inventing a verdict.
 * Customized files are REPORTED (owned edits), never "fixed" here.
 */
export async function validateInstall(dest: string): Promise<
  | {
      dest: string;
      rows: Array<{ path: string; state: string; owner: string }>;
    }
  | { error: string }
> {
  try {
    const cli = (await import("@xoroh/kern-cli")) as {
      diffDest: (
        dest: string,
      ) => Array<{ path: string; state: string; owner: string }>;
    };
    return { dest, rows: cli.diffDest(dest) };
  } catch {
    return {
      error:
        "validation needs @xoroh/kern-cli beside the MCP server — run `kern diff` in the destination instead.",
    };
  }
}
/**
 * Kern compliance checklist for auditing a screen. The twelve categories
 * mirror the `kern` skill's audit table one-for-one — a checklist that names
 * ten of twelve is the omission class the skill exists to prevent.
 *
 * Advisory-only: the categories name what to check, but nothing here
 * measures the screen — there is no runner behind the checklist, so no
 * score, pass/fail, or coverage claim is asserted. Agents must treat the
 * output as headings for their own inspection, not as an audit result.
 */
export function designAudit() {
  return {
    advisoryOnly: true,
    categories: [
      "Color roles (no hardcoded hex; correct on-* pairing)",
      "Typography (Inter, correct MD3 scale role)",
      "Shape (full on pills, small cards, medium dropdowns)",
      "Elevation (flat resting UI; shadows on floating layers only)",
      "Components (match Kern specs; dialog 2-action law)",
      "Layout (topbar/sidebar/content shell; adaptive breakpoints)",
      "Navigation (single-select states; badges anchored upper-trailing)",
      "Motion (utility easing only, <=200ms)",
      "Accessibility (4.5:1 text; 48dp targets; visible focus)",
      "Theming (light + dark + contrast resolve; no hex)",
      "States (hover 8 / focus 10 / press 10 state layers)",
      "Content (sentence case; scannable headings; alt text)",
    ],
    reference: ".agents/skills/kern/SKILL.md in the kern repo",
  };
}
