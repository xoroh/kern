/**
 * `@xoroh/kern-cli` programmatic API — the same operations the `kern` binary
 * runs, importable without spawning a process. The MCP install planner and
 * external tooling read these instead of shelling out: one implementation,
 * two front ends, no drift between what the CLI does and what the planner
 * describes.
 */

export type { AddOptions, AddPlatform, AddResult, PlannedFile } from "./add.js";
export {
  addBlock,
  addComponent,
  commitPlan,
  planComponent,
  readProjectConfig,
} from "./add.js";
export type { BlockCategory, BlockRow } from "./blocks.js";
export {
  blockFileBytes,
  blockFileList,
  blocksDir,
  loadBlocks,
} from "./blocks.js";
export type { Closure } from "./closure.js";
export { resolveClosure } from "./closure.js";
export type { InitOptions, InitResult } from "./init.js";
export { initScaffold } from "./init.js";
export type { DiffRow, ListOptions } from "./list-diff.js";
export {
  diffDest,
  formatDiff,
  listBlocks,
  listComponents,
} from "./list-diff.js";
export type { ManifestRow, Registry } from "./manifest.js";
export {
  kernVersion,
  loadManifest,
  loadRegistry,
  WORKSPACE_ROOT,
} from "./manifest.js";
export type { InstallReceipt } from "./receipt.js";
export { convertV1, customized, readReceipt } from "./receipt.js";
export type { UpgradePlan, UpgradeResult } from "./upgrade.js";
export { formatUpgrade, upgradeComponent } from "./upgrade.js";
