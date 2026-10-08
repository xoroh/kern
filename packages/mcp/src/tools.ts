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
 */
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENTS } from "./manifest.js";

export type Platform = "web" | "native";

/**
 * Presets `get_tokens` accepts. `base` is the shared token source
 * (`tokens.json`); the rest are ids from the theme catalog
 * (`packages/kern-tokens/src/themes/index.json`). `m3` is the pre-rename
 * alias `resolve.ts` (`LEGACY_ALIASES`) still honors — accepted here, resolved
 * to `kern`, so older agents are not broken by the rename.
 */
export const TOKEN_PRESETS = [
  "base",
  "kern",
  "m3",
  "sharp",
  "brand",
  "compact",
  "demo",
] as const;
export type TokenPreset = (typeof TOKEN_PRESETS)[number];

/** Canonical catalog id: the legacy alias resolves, everything else is itself. */
export function canonicalPreset(preset: TokenPreset): string {
  return preset === "m3" ? "kern" : preset;
}

// Resolve the kern monorepo root: explicit env first, then dist/src layouts.
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

/** Token data: `@xoroh/kern-tokens` (`packages/kern-tokens/...`). */
async function readTokenFile(rel: string): Promise<string | null> {
  return readFirst([
    ...repoPaths("packages/kern-tokens", rel),
    ...repoPaths("kern-tokens", rel),
  ]);
}

function tokenFileFor(preset: TokenPreset): string {
  if (preset === "base") return "src/tokens.json";
  return `src/themes/${canonicalPreset(preset)}.json`;
}

export async function listComponents(platform?: Platform) {
  const list = COMPONENTS.filter(
    (c) => !platform || c.platform === platform,
  ).map((c) => ({
    name: c.name,
    export: c.export,
    platform: c.platform,
    status: c.status,
    import: c.platform === "web" ? "@xoroh/kern" : "@xoroh/kern-native",
  }));
  return { count: list.length, components: list };
}

export async function getComponent(name: string, platform: Platform = "web") {
  const entry = COMPONENTS.find(
    (c) => c.name === name && c.platform === platform,
  );
  if (!entry) return { error: `unknown component: ${platform}/${name}` };
  const source = await readKernFile(entry.path);
  return {
    ...entry,
    sourceCode:
      source ??
      "(not bundled — run inside the kern monorepo or set KERN_REPO_ROOT)",
  };
}

export async function getTokens(preset: TokenPreset = "base") {
  const rel = tokenFileFor(preset);
  const raw = await readTokenFile(rel);
  if (!raw)
    return {
      error: `tokens unavailable (wanted ${rel}) — run inside the kern monorepo or set KERN_REPO_ROOT`,
    };
  return { preset: canonicalPreset(preset), tokens: JSON.parse(raw) };
}

export async function listThemes() {
  const raw = await readTokenFile("src/themes/index.json");
  if (!raw)
    return {
      error:
        "theme catalog unavailable — run inside the kern monorepo or set KERN_REPO_ROOT",
    };
  return JSON.parse(raw);
}

/**
 * Kern compliance checklist for auditing a screen. The twelve categories
 * mirror the `kern` skill's audit table one-for-one — a checklist that names
 * ten of twelve is the omission class the skill exists to prevent.
 */
export function designAudit() {
  return {
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
