/**
 * Icon records — one Material mapping, checked meanings.
 *
 * The icon family is Material Symbols Rounded, weight 400, pinned in
 * `packages/kern-icons/config/source.json`. A record binds a semantic name to
 * its upstream glyph plus the rendering contract both renderers honor: sizes,
 * fill, RTL, decorative behavior and the fallback when a name is missing.
 */

export type IconRecord = {
  schemaVersion: string;
  /** Semantic name, e.g. `"menu-book"`. */
  name: string;
  /** Upstream Material Symbols glyph name. */
  glyph: string;
  /** What the icon must mean on every renderer. */
  meaning: string;
  /** Supported sizes in dp. */
  sizes: number[];
  /** Whether the filled variant exists. */
  fill: boolean;
  /** Decorative icons render `aria-hidden` with no label; named ones do not. */
  decorative: boolean;
};

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(what: string): never {
  throw new Error(`Invalid IconRecord: ${what}`);
}

/** Fail-loud validation for an icon record. Returns the record. */
export function defineIcon(record: IconRecord): IconRecord {
  if (!record.schemaVersion.trim()) fail("schemaVersion is blank");
  if (!NAME_RE.test(record.name)) fail(`name is ${record.name}`);
  if (!record.glyph.trim()) fail("glyph is blank");
  if (!record.meaning.trim()) fail(`meaning is blank for ${record.name}`);
  if (record.sizes.length === 0) fail(`sizes is empty for ${record.name}`);
  for (const size of record.sizes) {
    if (!Number.isInteger(size) || size <= 0) {
      fail(`size ${size} for ${record.name}`);
    }
  }
  return record;
}

/**
 * Missing-icon policy, shared so both renderers and the CLI agree: return
 * null with a development warning, never a wrong glyph. A wrong icon is a lie
 * about meaning; an absent one is a gap with a name.
 */
export const MISSING_ICON_POLICY = "null-with-dev-warning" as const;
