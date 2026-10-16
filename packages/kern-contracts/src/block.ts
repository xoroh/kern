/**
 * Block records — composed sections as installable units.
 *
 * A block is a composed section (settings-screen, auth-form, empty-search)
 * vendored WHOLE by the CLI. The record names the complete dependency closure
 * so the registry never installs an incomplete graph: component dependencies,
 * token/icon requirements, platform compatibility and the receipt data the
 * installer writes.
 */

import type { DependencySet, DesignSystemId, Renderer } from "./component";

export type BlockCategory = "settings" | "auth" | "dashboard" | string;

export type BlockRecord = {
  schemaVersion: string;
  /** Design system this block implements, e.g. `"material-3"`. */
  designSystem: DesignSystemId;
  /** Block name, e.g. `"auth-form"`. */
  name: string;
  title: string;
  description: string;
  category: BlockCategory;
  /** Renderers this block supports. */
  platforms: Renderer[];
  /** Component exports this block composes. */
  components: string[];
  /** Token roles, icon names and files the block needs beyond its components. */
  dependencies?: DependencySet;
  /** Install command, e.g. `"kern add auth-form"`. */
  installCommand: string;
  /** Source files vendored by the install, relative to the block root. */
  files: string[];
};

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(what: string): never {
  throw new Error(`Invalid BlockRecord: ${what}`);
}

/** Fail-loud validation for a block record. Returns the record. */
export function defineBlock(record: BlockRecord): BlockRecord {
  if (!record.schemaVersion.trim()) fail("schemaVersion is blank");
  if (!NAME_RE.test(record.designSystem))
    fail(`designSystem is ${record.designSystem}`);
  if (!NAME_RE.test(record.name)) fail(`name is ${record.name}`);
  if (!record.title.trim()) fail("title is blank");
  if (!record.description.trim()) fail("description is blank");
  if (!record.category.trim()) fail("category is blank");
  if (record.platforms.length === 0) fail("platforms is empty");
  for (const p of record.platforms) {
    if (p !== "web" && p !== "native") fail(`platform is ${p}`);
  }
  if (record.components.length === 0) fail("components is empty");
  if (!record.installCommand.trim()) fail("installCommand is blank");
  if (record.files.length === 0) fail("files is empty");
  return record;
}
