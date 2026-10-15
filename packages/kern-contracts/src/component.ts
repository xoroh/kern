/**
 * Component capability records — what a registry row CLAIMS, in one shape.
 *
 * A `ComponentRecord` is the published form of what `packages/mcp` generates
 * today (`ComponentEntry`) PLUS the capability/dependency metadata the CLI and
 * MCP install planners need: entrypoint, axes, origin, verified states,
 * obligations, platform exceptions, dependency closure and install modes.
 *
 * Unknown capability ≠ supported: a missing field means "not claimed", never
 * "supported but undocumented". The validators below fail loud on malformed
 * records so a generator cannot emit a half-row that reads as complete.
 */

import type { ProviderId } from "./provider";

export type Renderer = "web" | "native";
export type ComponentStatus = "real" | "stub";
/** Where the export is published from. */
export type Entrypoint = "." | "./start" | "./native";
/** Where the component's design comes from. */
export type ComponentOrigin = "spec-native" | "kern-adaptation";
/** A verified capability state — never an unmeasured claim. */
export type CapabilityState = "verified" | "unverified" | "unsupported";

export type DependencySet = {
  /** Token roles the component reads (e.g. `sys.color.primary`). */
  tokens?: string[];
  /** Icon names the component renders. */
  icons?: string[];
  /** Relative source files in its import closure. */
  files?: string[];
  /** npm packages it needs at runtime. */
  npm?: string[];
  /** Asset files (fonts, images) it needs. */
  assets?: string[];
};

export type ComponentRecord = {
  schemaVersion: string;
  provider: ProviderId;
  renderer: Renderer;
  /** Registry name, e.g. `"rich-tooltip"`. */
  name: string;
  /** Export name, e.g. `"RichTooltip"`. */
  export: string;
  entrypoint: Entrypoint;
  /** Source path, e.g. `"src/components/tooltip.tsx"`. */
  path: string;
  status: ComponentStatus;
  /** Variant/size axes, e.g. `["variant: primary · tonal"]`. */
  axes?: string[];
  origin: ComponentOrigin;
  capabilities: Record<string, CapabilityState>;
  /** Obligations a consumer must honor (a11y, controlled mode, …). */
  obligations?: string[];
  /** Why this platform differs, when it genuinely does. */
  platformException?: string;
  dependencies?: DependencySet;
  doc?: string;
  example?: string;
  installModes?: Array<"package" | "source-hybrid" | "source-snapshot">;
  /** Compatible release ranges, e.g. `">=0.1.0"`. */
  compatibility?: string;
};

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EXPORT_RE = /^[A-Z][A-Za-z0-9]*$/;

function fail(what: string): never {
  throw new Error(`Invalid ComponentRecord: ${what}`);
}

/** Fail-loud validation for a component record. Returns the record. */
export function defineComponent(record: ComponentRecord): ComponentRecord {
  if (!record.schemaVersion.trim()) fail("schemaVersion is blank");
  if (record.provider !== "m3") fail(`provider is ${record.provider}`);
  if (record.renderer !== "web" && record.renderer !== "native") {
    fail(`renderer is ${record.renderer}`);
  }
  if (!NAME_RE.test(record.name)) fail(`name is ${record.name}`);
  if (!EXPORT_RE.test(record.export)) fail(`export is ${record.export}`);
  if (![".", "./start", "./native"].includes(record.entrypoint)) {
    fail(`entrypoint is ${record.entrypoint}`);
  }
  if (!record.path.trim()) fail("path is blank");
  if (record.status !== "real" && record.status !== "stub") {
    fail(`status is ${record.status}`);
  }
  if (record.origin !== "spec-native" && record.origin !== "kern-adaptation") {
    fail(`origin is ${record.origin}`);
  }
  for (const [cap, state] of Object.entries(record.capabilities ?? {})) {
    if (!cap.trim()) fail("a capability key is blank");
    if (!["verified", "unverified", "unsupported"].includes(state)) {
      fail(`capability ${cap} is ${state}`);
    }
  }
  return record;
}

/**
 * The registry key for a row: platform/name. Two different exports fighting
 * over one key is an API collision, never a duplicate to collapse silently.
 */
export function registryKey(renderer: Renderer, name: string): string {
  return `${renderer}/${name}`;
}
