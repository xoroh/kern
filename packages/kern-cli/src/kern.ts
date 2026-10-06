#!/usr/bin/env bun
/** `kern` — dual-delivery installer. Mode 1 (`add`) vendored; Mode 2 is `bun add @xoroh/kern`. */
import { addComponent } from "./add.js";

const [, , cmd, ...rest] = process.argv;

function usage(): never {
  console.log(`kern — vendored components (Mode 1) + dependency install (Mode 2)

  kern add <name> [--dest <dir>] [--self-contained]   vendor a web component + closure
  bun add @xoroh/kern                                 Mode 2: versioned dependency (no command needed)

Options:
  --dest <dir>       where vendored code lands (default: ./components/kern)
  --self-contained   vendor the token CSS snapshot too (default: hybrid — values stayed depended)

Receipts (<dest>/kern.receipt.json) record kern version + file hashes from day one:
they are what \`kern diff\` / \`kern upgrade\` (step 3) compare against.`);
  process.exit(cmd === undefined ? 0 : 1);
}

if (cmd === undefined || cmd === "--help" || cmd === "-h") usage();
if (cmd !== "add") {
  console.error(`kern: unknown command "${cmd}".`);
  usage();
}

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
  const result = addComponent(name, { dest, selfContained });
  console.log(`kern add ${name}: vendored ${result.files.length} file(s)`);
  for (const f of result.files) console.log(`  + ${f}`);
  console.log(`receipt: ${result.receipt}`);
  console.log("run these yourself (never executed for you):");
  for (const line of result.instructions) console.log(`  ${line}`);
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
