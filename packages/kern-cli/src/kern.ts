#!/usr/bin/env bun
/** `kern` — dual-delivery installer. Mode 1 (`add`) vendored; Mode 2 is `bun add @xoroh/kern`. */
import { addBlock, addComponent } from "./add.js";
import { loadBlocks } from "./blocks.js";
import { initScaffold } from "./init.js";
import { loadManifest } from "./manifest.js";

const [, , cmd, ...rest] = process.argv;

function usage(): never {
  console.log(`kern — vendored components (Mode 1) + dependency install (Mode 2)

  kern init <dir> [--from <workspace>] [--registry] [--force]
      scaffold the starter: install → run → themed screen (preset picker:
      kern / sharp / brand / demo tenant)
  kern add <name> [--dest <dir>] [--self-contained]   vendor a web component + closure
  kern add <block> [--dest <dir>]                     vendor a multi-file block (settings-screen, auth-form, …)
  bun add @xoroh/kern                                 Mode 2: versioned dependency (no command needed)

Options:
  --from <root>      kern checkout the scaffold resolves against (default: this workspace)
  --registry         emit versioned dep names instead of file: (post-publish; 404s until then)
  --force            scaffold over a non-empty dir (same kern version only)
  --dest <dir>       where vendored code lands (default: ./components/kern)
  --self-contained   vendor the token CSS snapshot too (default: hybrid — values stayed depended)

Pre-publish (0.0.0, unpublished): registry names resolve only after the first
publish. init defaults to file: deps against your checkout so first run works
today; add reads the workspace manifest for the same reason.

Receipts (<dest>/kern.receipt.json) record kern version + file hashes from day one:
they are what \`kern diff\` / \`kern upgrade\` (step 3) compare against.`);
  process.exit(cmd === undefined ? 0 : 1);
}

if (cmd === undefined || cmd === "--help" || cmd === "-h") usage();
if (cmd !== "add" && cmd !== "init") {
  console.error(`kern: unknown command "${cmd}".`);
  usage();
}

if (cmd === "init") {
  const target = rest.find((a: string) => !a.startsWith("--"));
  if (!target) {
    console.error("kern init: missing <dir>.");
    usage();
  }
  const fromIdx = rest.indexOf("--from");
  const from = fromIdx >= 0 ? rest[fromIdx + 1] : undefined;
  if (fromIdx >= 0 && !from) {
    console.error("kern init: --from needs a workspace root.");
    process.exit(1);
  }
  try {
    const result = initScaffold(target, {
      root: from,
      registry: rest.includes("--registry"),
      force: rest.includes("--force"),
    });
    console.log(
      `kern init: scaffolded ${result.files.length} file(s) into ${result.dir}`,
    );
    for (const f of result.files) console.log(`  + ${f}`);
    console.log(`receipt: ${result.receipt}`);
    console.log("run these yourself (never executed for you):");
    for (const line of result.instructions) console.log(`  ${line}`);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
} else {
  const name = rest.find((a: string) => !a.startsWith("--"));
  if (!name) {
    console.error("kern add: missing <name>.");
    usage();
  }
  const destIdx = rest.indexOf("--dest");
  const dest = destIdx >= 0 ? rest[destIdx + 1] : undefined;
  if (destIdx >= 0 && !dest) {
    console.error("kern add: --dest needs a directory.");
    process.exit(1);
  }
  const selfContained = rest.includes("--self-contained");

  try {
    // Blocks and components share the `add` verb and the name space. A name
    // that exists in BOTH is refused rather than silently resolved to one:
    // `kern add settings-row` must never mean "whatever the resolver found
    // first".
    const blocks = loadBlocks().map((b) => b.name);
    const components = loadManifest().map((c) => c.name);
    const isBlock = blocks.includes(name);
    const isComponent = components.includes(name);
    if (isBlock && isComponent) {
      console.error(
        `kern add: "${name}" is both a block and a component — rename one (blocks live in apps/site/src/blocks/manifest.ts).`,
      );
      process.exit(1);
    }
    if (!isBlock && !isComponent) {
      console.error(
        `kern add: unknown name "${name}" — neither a component (packages/mcp/src/manifest.ts) nor a block (apps/site/src/blocks/manifest.ts).`,
      );
      process.exit(1);
    }
    const result = isBlock
      ? addBlock(name, { dest, selfContained })
      : addComponent(name, { dest, selfContained });
    console.log(
      `kern add ${name}: vendored ${result.files.length} file(s)${isBlock ? " (block)" : ""}`,
    );
    for (const f of result.files) console.log(`  + ${f}`);
    console.log(`receipt: ${result.receipt}`);
    console.log("run these yourself (never executed for you):");
    for (const line of result.instructions) console.log(`  ${line}`);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}
