/** `kern` — dual-delivery installer. Mode 1 (`add`) vendored; Mode 2 is `bun add @xoroh/kern`. */

import { join } from "node:path";
import { type AddPlatform, addBlock, addComponent } from "./add.js";
import { loadBlocks } from "./blocks.js";
import { createApp } from "./create.js";
import {
  digestFeedback,
  disclosure,
  FEEDBACK_RETENTION_DAYS,
  pruneFeedback,
  submitFeedback,
} from "./feedback.js";
import { initScaffold } from "./init.js";
import {
  diffDest,
  formatDiff,
  listBlocks,
  listComponents,
} from "./list-diff.js";
import { loadRegistry } from "./manifest.js";
import { formatUpgrade, upgradeBlock, upgradeComponent } from "./upgrade.js";

const [, , cmd, ...rest] = process.argv;

function flagValue(name: string): string | undefined {
  const idx = rest.indexOf(name);
  if (idx < 0) return undefined;
  const value = rest[idx + 1];
  if (!value || value.startsWith("--")) {
    console.error(`kern: ${name} needs a value.`);
    process.exit(1);
  }
  return value;
}

function platformFlag(): AddPlatform | undefined {
  const value = flagValue("--platform");
  if (value === undefined) return undefined;
  if (value !== "web" && value !== "native") {
    console.error(`kern: --platform is "web" or "native", not "${value}".`);
    process.exit(1);
  }
  return value;
}

function pmFlag(): "bun" | "npm" | "pnpm" | "yarn" | undefined {
  const value = flagValue("--pm");
  if (value === undefined) return undefined;
  if (
    value !== "bun" &&
    value !== "npm" &&
    value !== "pnpm" &&
    value !== "yarn"
  ) {
    console.error(
      `kern: --pm is "bun", "npm", "pnpm" or "yarn", not "${value}".`,
    );
    process.exit(1);
  }
  return value;
}

function usage(): never {
  console.log(`kern — vendored components (Mode 1) + dependency install (Mode 2)

  kern create <name> [--from <workspace>] [--registry] [--pm bun|npm|pnpm|yarn] [--preset <id>]
      scaffold a new app (refuses if <name> exists — use init there instead)
  kern init <dir> [--from <workspace>] [--registry] [--force] [--pm bun|npm|pnpm|yarn] [--preset <id>]
      scaffold the starter into an existing project: install → run → themed screen (writes kern.json)
  kern add <name> [--dest <dir>] [--platform web|native] [--self-contained]
      vendor a component or block + closure (transactional: a late failure
      writes nothing)
  kern list [--platform web|native|all]
      what the registry holds, with platform, entrypoint and status
  kern diff [--dest <dir>]
      receipt vs destination: current, customized, removed
  kern upgrade <name> [--dest <dir>] [--apply]
      dry-run plan by default; --apply updates non-customized files and
      preserves owned edits (never overwritten)
  kern feedback --category <c> --title <t> --description <d> [fields] [--dry-run]
      validate + disclose + store a feedback report locally; prints the
      issue URL to file it yourself (nothing is sent automatically)
  kern feedback digest
      maintainer digest of the local inbox, grouped with evidence ids
  kern feedback prune [--days <n>]
      delete inbox entries older than n days (default: 90)
  bun add @xoroh/kern                                 Mode 2: versioned dependency (no command needed)

Options:
  --from <root>      kern checkout the scaffold resolves against (default: this workspace)
  --registry         emit versioned dep names instead of file: (post-publish; 404s until then)
  --force            scaffold over a non-empty dir (same kern version only)
  --pm <m>           package manager for scaffold instructions: bun (default), npm, pnpm, yarn
  --preset <id>      design-system preset pinned into kern.json (default: material-3)
  --dest <dir>       where vendored code lands (default: ./components/kern)
  --platform <p>     web (default) or native; native selects the native row first
  --self-contained   vendor the token CSS snapshot too (default: hybrid — values stayed depended)
  --apply            kern upgrade: perform the plan (default is dry-run)

Pre-publish (0.0.0, unpublished): registry names resolve only after the first
publish. init defaults to file: deps against your checkout so first run works
today; add reads the workspace manifest (or the bundled registry in a packed
install) for the same reason.

Receipts (<dest>/kern.receipt.json, schema v2) record release set + file
hashes + owners from day one: they are what \`kern diff\` / \`kern upgrade\`
compare against.`);
  process.exit(cmd === undefined ? 0 : 1);
}

function die(message: string): never {
  console.error(message);
  process.exit(1);
}

if (cmd === undefined || cmd === "--help" || cmd === "-h") usage();

try {
  if (cmd === "create") {
    const name = rest.find((a: string) => !a.startsWith("--"));
    if (!name) die("kern create: missing <name>.");
    const from = flagValue("--from");
    const result = createApp(name as string, {
      root: from,
      registry: rest.includes("--registry"),
      pm: pmFlag(),
      preset: flagValue("--preset"),
    });
    console.log(
      `kern create: scaffolded ${result.files.length} file(s) into ${result.dir}`,
    );
    for (const f of result.files) console.log(`  + ${f}`);
    console.log(`receipt: ${result.receipt}`);
    console.log("run these yourself (never executed for you):");
    for (const line of result.instructions) console.log(`  ${line}`);
  } else if (cmd === "init") {
    const target = rest.find((a: string) => !a.startsWith("--"));
    if (!target) die("kern init: missing <dir>.");
    const from = flagValue("--from");
    const result = initScaffold(target as string, {
      root: from,
      registry: rest.includes("--registry"),
      force: rest.includes("--force"),
      pm: pmFlag(),
      preset: flagValue("--preset"),
    });
    console.log(
      `kern init: scaffolded ${result.files.length} file(s) into ${result.dir}`,
    );
    for (const f of result.files) console.log(`  + ${f}`);
    console.log(`receipt: ${result.receipt}`);
    console.log("run these yourself (never executed for you):");
    for (const line of result.instructions) console.log(`  ${line}`);
  } else if (cmd === "add") {
    const name = rest.find((a: string) => !a.startsWith("--"));
    if (!name) die("kern add: missing <name>.");
    const dest = flagValue("--dest");
    const platform = platformFlag();
    const selfContained = rest.includes("--self-contained");
    // Blocks and components share the `add` verb and the name space. A name
    // that exists in BOTH is refused rather than silently resolved to one:
    // `kern add settings-row` must never mean "whatever the resolver found
    // first".
    const blocks = loadBlocks().map((b) => b.name);
    const components = loadRegistry().rows.map((c) => c.name);
    const isBlock = blocks.includes(name);
    const isComponent = components.includes(name);
    if (isBlock && isComponent) {
      die(
        `kern add: "${name}" is both a block and a component — rename one (blocks live in apps/site/src/blocks/manifest.ts).`,
      );
    }
    if (!isBlock && !isComponent) {
      die(
        `kern add: unknown name "${name}" — neither a component (registry) nor a block (apps/site/src/blocks/manifest.ts).`,
      );
    }
    const result = isBlock
      ? addBlock(name, { dest, selfContained, platform })
      : addComponent(name, { dest, selfContained, platform });
    console.log(
      `kern add ${name}: vendored ${result.files.length} file(s)${isBlock ? " (block)" : ""} [${result.platform}]`,
    );
    for (const f of result.files) console.log(`  + ${f}`);
    console.log(`receipt: ${result.receipt}`);
    console.log("run these yourself (never executed for you):");
    for (const line of result.instructions) console.log(`  ${line}`);
  } else if (cmd === "list") {
    const platform = platformFlag() ?? "all";
    for (const line of listComponents({ platform })) console.log(line);
    console.log("--- blocks ---");
    for (const line of listBlocks()) console.log(line);
  } else if (cmd === "diff") {
    const dest = flagValue("--dest") ?? "components/kern";
    console.log(formatDiff(diffDest(dest)));
  } else if (cmd === "upgrade") {
    const name = rest.find((a: string) => !a.startsWith("--"));
    if (!name) die("kern upgrade: missing <name>.");
    const dest = flagValue("--dest");
    // Same dual-namespace rule as `add`: a name in both maps is refused,
    // a block upgrades through the block planner (C3 — no block path was
    // the gap that left composed installs unupgradable).
    const blocks = loadBlocks().map((b) => b.name);
    const components = loadRegistry().rows.map((c) => c.name);
    const isBlock = blocks.includes(name);
    const isComponent = components.includes(name);
    if (isBlock && isComponent) {
      die(
        `kern upgrade: "${name}" is both a block and a component — rename one (blocks live in apps/site/src/blocks/manifest.ts).`,
      );
    }
    if (!isBlock && !isComponent) {
      die(
        `kern upgrade: unknown name "${name}" — neither a component (registry) nor a block (apps/site/src/blocks/manifest.ts).`,
      );
    }
    const result = isBlock
      ? upgradeBlock(name, {
          dest,
          apply: rest.includes("--apply"),
        })
      : upgradeComponent(name, {
          dest,
          apply: rest.includes("--apply"),
        });
    console.log(formatUpgrade(result));
  } else if (cmd === "feedback") {
    // Subcommand is positional-first only: flag values (e.g. `--category
    // bug`) must never read as subcommands.
    const sub =
      rest[0] !== undefined && !rest[0].startsWith("--") ? rest[0] : undefined;
    if (sub === "digest") {
      console.log(digestFeedback(process.cwd()));
    } else if (sub === "prune") {
      const daysRaw = flagValue("--days");
      const days =
        daysRaw === undefined ? FEEDBACK_RETENTION_DAYS : Number(daysRaw);
      if (!Number.isFinite(days) || days < 0) {
        die(`kern feedback prune: --days is "${daysRaw}", want 0 or more.`);
      }
      const pruned = pruneFeedback(process.cwd(), days);
      console.log(
        pruned.length === 0
          ? "kern feedback: inbox within retention, nothing pruned."
          : `kern feedback: pruned ${pruned.length} entr${pruned.length === 1 ? "y" : "ies"}: ${pruned.join(", ")}`,
      );
    } else if (sub !== undefined) {
      die(
        `kern feedback: unknown subcommand "${sub}" — submit with flags, or use "digest" / "prune".`,
      );
    } else {
      const receipt = submitFeedback(
        {
          category: flagValue("--category") ?? "",
          title: flagValue("--title") ?? "",
          description: flagValue("--description") ?? "",
          component: flagValue("--component"),
          block: flagValue("--block"),
          preset: flagValue("--preset"),
          renderer: flagValue("--renderer"),
          framework: flagValue("--framework"),
          steps: flagValue("--steps"),
          evidence: flagValue("--evidence"),
          consent: rest.includes("--consent"),
        },
        { dryRun: rest.includes("--dry-run") },
      );
      console.log(
        disclosure(receipt.report, join(process.cwd(), ".kern", "feedback")),
      );
      if (rest.includes("--dry-run")) {
        console.log("dry run — nothing stored.");
      } else if (receipt.duplicate) {
        console.log(
          `duplicate of ${receipt.id} — already in the inbox, nothing added.`,
        );
      } else {
        console.log(
          `stored ${receipt.id} — a human files the issue from the URL above.`,
        );
      }
    }
  } else {
    die(`kern: unknown command "${cmd}".`);
  }
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
