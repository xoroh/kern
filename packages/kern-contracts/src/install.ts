/**
 * Install contracts — receipt schema, transaction states and CLI config.
 *
 * The installer is transactional: resolve → preflight → stage → commit, with
 * rollback when anything fails late. The receipt (v2) records the release set,
 * per-file baseline/current hashes, owners, assets, licenses and config so a
 * repeated identical add is idempotent and an upgrade diffs against evidence
 * instead of re-guessing. A v1 receipt converts; a corrupt one fails loud.
 */

export const RECEIPT_SCHEMA_VERSION = "2" as const;

export type InstallMode = "package" | "source-hybrid" | "source-snapshot";

export type ReceiptFile = {
  path: string;
  baselineHash: string;
  currentHash: string;
  owner: string;
  customized: boolean;
};

export type InstallReceipt = {
  schemaVersion: typeof RECEIPT_SCHEMA_VERSION;
  /** The pinned release set this install came from. */
  releaseSet: string;
  mode: InstallMode;
  files: ReceiptFile[];
  assets: string[];
  licenses: string[];
  config: Record<string, string>;
};

export type TransactionState =
  | "resolve"
  | "preflight"
  | "stage"
  | "commit"
  | "rollback";

export type CliConfig = {
  /** Workspace or app the install targets. */
  target: string;
  renderer: "web" | "native" | "both";
  mode: InstallMode;
  /**
   * Pinned design-system preset (N6, owner-decided): the scaffold default
   * (`material-3`) is recorded so later installs/upgrades resolve against
   * the user's preset, never a silently substituted default.
   */
  preset?: string;
  /**
   * Package manager the scaffold's instructions target (C2). `bun` is the
   * validated default; `npm`/`pnpm`/`yarn` emit the matching install/run
   * commands. Only these four are advertised.
   */
  pm?: "bun" | "npm" | "pnpm" | "yarn";
  /** Explicit opt-in before writing over customized files. */
  force?: boolean;
  dryRun?: boolean;
};

function fail(what: string): never {
  throw new Error(`Invalid install record: ${what}`);
}

/** Fail-loud validation for an install receipt. Returns the receipt. */
export function defineReceipt(receipt: InstallReceipt): InstallReceipt {
  if (receipt.schemaVersion !== RECEIPT_SCHEMA_VERSION) {
    fail(`schemaVersion is ${receipt.schemaVersion}`);
  }
  if (!receipt.releaseSet.trim()) fail("releaseSet is blank");
  if (!["package", "source-hybrid", "source-snapshot"].includes(receipt.mode)) {
    fail(`mode is ${receipt.mode}`);
  }
  // Empty files are valid: a scaffold receipt owns no files yet. What is
  // invalid is a ROW with blank fields — checked per row below.
  for (const file of receipt.files) {
    if (!file.path.trim()) fail("a file path is blank");
    if (!file.baselineHash.trim() || !file.currentHash.trim()) {
      fail(`hashes are blank for ${file.path}`);
    }
    if (!file.owner.trim()) fail(`owner is blank for ${file.path}`);
  }
  return receipt;
}

/** Fail-loud validation for CLI config. Returns the config. */
export function defineCliConfig(config: CliConfig): CliConfig {
  if (!config.target.trim()) fail("target is blank");
  if (!["web", "native", "both"].includes(config.renderer)) {
    fail(`renderer is ${config.renderer}`);
  }
  if (!["package", "source-hybrid", "source-snapshot"].includes(config.mode)) {
    fail(`mode is ${config.mode}`);
  }
  if (config.preset !== undefined) {
    if (
      typeof config.preset !== "string" ||
      !/^[a-z][a-z0-9-]{1,31}$/.test(config.preset)
    ) {
      fail(`preset is ${config.preset}`);
    }
  }
  if (
    config.pm !== undefined &&
    !["bun", "npm", "pnpm", "yarn"].includes(config.pm)
  ) {
    fail(`pm is ${config.pm}`);
  }
  return config;
}
