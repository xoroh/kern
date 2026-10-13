/**
 * Schema versioning — semver, metadata schema and CLI receipt versions are
 * SEPARATE coordinates (TARGET_ARCHITECTURE §Distribution).
 *
 * - Package semver follows changesets.
 * - The contract schema version (`CONTRACT_SCHEMA_VERSION`) changes when any
 *   record shape in this package changes.
 * - The CLI receipt version (`RECEIPT_SCHEMA_VERSION`) changes when the
 *   install receipt shape changes.
 * - The provider spec snapshot is dated Material guidance, not a version.
 *
 * Consumers pin the coordinate they depend on. A new package version with an
 * unchanged schema version is compatible for every metadata reader.
 */

import { RECEIPT_SCHEMA_VERSION } from "./install";

/** The current contract schema version. Bump with a changeset. */
export const CONTRACT_SCHEMA_VERSION = "1.0.0" as const;

export type VersionCoordinates = {
  package: string;
  schema: string;
  receipt: string;
};

export function versionCoordinates(packageVersion: string): VersionCoordinates {
  return {
    package: packageVersion,
    schema: CONTRACT_SCHEMA_VERSION,
    receipt: RECEIPT_SCHEMA_VERSION,
  };
}

/** True when `reader` can consume records written at `writer` schema. */
export function schemaCompatible(reader: string, writer: string): boolean {
  const [rMajor] = reader.split(".").map(Number);
  const [wMajor] = writer.split(".").map(Number);
  return (
    Number.isInteger(rMajor) &&
    Number.isInteger(wMajor) &&
    rMajor === wMajor &&
    reader >= writer
  );
}
