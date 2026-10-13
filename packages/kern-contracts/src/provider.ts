/**
 * Provider identity — metadata, not a runtime selector.
 *
 * Kern ships ONE design-system provider: Material 3 (`m3`). The provider id
 * rides on metadata and build-time import ownership so humans, the CLI and the
 * MCP server can name what a component implements. There is no provider
 * service locator, no runtime switching, and no neutral facade: the web theme
 * hook and the native theme provider are THEME controls, not provider
 * selection. Reopen only upon a real independently owned second provider
 * (ADR-P03).
 */

export const PROVIDER_ID = "m3" as const;
export type ProviderId = typeof PROVIDER_ID;

export type ProviderRecord = {
  /** Stable provider id. Today always `"m3"`. */
  id: ProviderId;
  /** Human label, e.g. `"Material 3"`. */
  label: string;
  /** Which Material spec generation the implementation tracks. */
  specGeneration: string;
  /** Where the conformance evidence lives (vendored doc path or URL). */
  evidence: string;
};

export const MATERIAL_PROVIDER: ProviderRecord = {
  id: "m3",
  label: "Material 3",
  specGeneration: "M3 Expressive (May 2025)",
  evidence: "docs/design-systems/m3-usable/",
};

const ID_RE = /^[a-z][a-z0-9-]{0,31}$/;

/** Fail-loud validation for a provider record. Returns the record. */
export function defineProvider(record: ProviderRecord): ProviderRecord {
  if (record.id !== PROVIDER_ID) {
    throw new Error(
      `Unknown provider id: ${record.id}. Only "${PROVIDER_ID}" exists.`,
    );
  }
  if (!record.label.trim())
    throw new Error("Provider label must not be blank.");
  if (!record.specGeneration.trim()) {
    throw new Error("Provider specGeneration must not be blank.");
  }
  if (!record.evidence.trim()) {
    throw new Error("Provider evidence must not be blank.");
  }
  return record;
}

/** True for a well-formed provider id shape (not a registry lookup). */
export function isProviderIdShape(id: string): boolean {
  return ID_RE.test(id);
}
