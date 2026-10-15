/**
 * Preset model — the generic extension contract for design systems (P2).
 *
 * A **preset** is a design language: its reference values, semantic roles,
 * themes, component variants and capabilities. A **renderer** (`web` |
 * `native`) is an implementation target and is never part of a preset id.
 * There is no `provider` concept: `material-3` names the initial Material
 * Design 3 preset, not an architecture layer.
 *
 * Extension contract (validated by {@link definePreset}):
 *
 * - Required: `color` role tables for `light` + `dark` (non-empty), and a
 *   non-empty `shape` table. Without these no theme can resolve.
 * - Optional: extra semantic roles, `elevation` / `motion` / `states` /
 *   `spacing` / `typography` extensions, component variant tables, and a
 *   capabilities map. A preset declares what it supports; anything undeclared
 *   is unsupported, never silently inherited from another preset.
 * - Validation is structural (shape of data, id grammar, non-blank tables).
 *   Semantic gates (contrast, reference resolution) run on resolved schemes
 *   in their own modules, not here.
 * - Missing capabilities are explicit: `capabilities[name] = "unsupported"`
 *   with a reason. Never map an unsupported variant onto an unrelated one.
 */

export type PresetId = string;

export type PresetCapabilities = Record<string, "supported" | "unsupported">;

export type PresetManifest = {
  /** Stable id, e.g. `"material-3"`. Lowercase kebab, 2–32 chars. */
  id: string;
  /** Human label, e.g. `"Material 3"`. */
  label: string;
  /** Required semantic color roles per mode. Keys are role names, values hex. */
  color: { light: Record<string, string>; dark: Record<string, string> };
  /** Required shape-corner table. Keys are corner names, values lengths. */
  shape: Record<string, string>;
  /** Optional preset-specific semantic roles beyond the shared set. */
  extraRoles?: string[];
  /** Optional component variant tables, e.g. `{ button: ["primary"] }`. */
  variants?: Record<string, string[]>;
  /** Optional capability declarations with explicit unsupported reasons. */
  capabilities?: PresetCapabilities;
  /** Optional free-text notes (spec generation, evidence pointers). */
  notes?: string;
};

const ID_RE = /^[a-z][a-z0-9-]{1,31}$/;
const HEX_RE = /^#[\da-f]{6}$/i;
const LEN_RE = /^(\d+(\.\d+)?px|\d+(\.\d+)?rem)$/;

function fail(what: string): never {
  throw new Error(`Invalid preset manifest: ${what}`);
}

/**
 * Fail-loud validation for a preset manifest. Returns the manifest.
 * Structural only — see module docs for what is (and is not) checked here.
 */
export function definePreset(manifest: PresetManifest): PresetManifest {
  if (!ID_RE.test(manifest.id)) fail(`id is ${manifest.id}`);
  if (!manifest.label.trim()) fail("label is blank");
  for (const mode of ["light", "dark"] as const) {
    const table = manifest.color?.[mode];
    if (!table || Object.keys(table).length === 0) {
      fail(`${manifest.id} is missing required color.${mode} roles`);
    }
    for (const [role, value] of Object.entries(table)) {
      if (typeof value !== "string" || !HEX_RE.test(value)) {
        fail(`${manifest.id} color.${mode}.${role} must be a six-digit hex`);
      }
    }
  }
  if (!manifest.color.light || !manifest.color.dark) {
    fail(`${manifest.id} needs both color.light and color.dark`);
  }
  const lightRoles = new Set(Object.keys(manifest.color.light));
  const darkRoles = new Set(Object.keys(manifest.color.dark));
  for (const role of lightRoles) {
    if (!darkRoles.has(role)) fail(`${manifest.id} role ${role} missing in dark`);
  }
  for (const role of darkRoles) {
    if (!lightRoles.has(role)) fail(`${manifest.id} role ${role} missing in light`);
  }
  if (!manifest.shape || Object.keys(manifest.shape).length === 0) {
    fail(`${manifest.id} is missing required shape corners`);
  }
  for (const [corner, value] of Object.entries(manifest.shape)) {
    if (typeof value !== "string" || !LEN_RE.test(value)) {
      fail(`${manifest.id} shape.${corner} must be a px or rem length`);
    }
  }
  for (const [name, state] of Object.entries(manifest.capabilities ?? {})) {
    if (!name.trim()) fail("a capability key is blank");
    if (state !== "supported" && state !== "unsupported") {
      fail(`capability ${name} is ${state}`);
    }
  }
  return manifest;
}

/** True for a well-formed preset id shape (not a registry lookup). */
export function isPresetIdShape(id: string): boolean {
  return ID_RE.test(id);
}
