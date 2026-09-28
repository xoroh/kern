import { buttonBlock } from "./blocks/button";

// TODO: bind to the real `definePlugin` export once pinned to a stable
// `emdash@0.1.x` release. Shape follows the documented plugin API:
// definePlugin({ id, capabilities, hooks }) + custom block types.
export type KernBlocksPluginOptions = {
  /** Block types to register. Defaults to every Kern block. */
  include?: Array<"button">;
};

export function kernBlocksPlugin(options: KernBlocksPluginOptions = {}) {
  const include = options.include ?? ["button"];

  return {
    id: "kern-blocks",
    // Blocks only read content structure; request least privilege.
    capabilities: ["content:read"],
    blockTypes: include.includes("button") ? [buttonBlock] : [],
  };
}
