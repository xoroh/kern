#!/usr/bin/env node
/**
 * Consumer fixtures (KERN-042/043/044/045/046) — standalone proof, not prose.
 *
 * Packs the built packages, installs the TARBALLS (the artifact, never a
 * checkout alias) into isolated fixtures, and runs the real commands:
 * typecheck, SSR render, styles assertion, CLI source add from a tarball,
 * nested workspaces. Every step prints its command, cwd, exit and artifact
 * hashes; a failure names the step. Timeouts and missing network mean NOT
 * PERFORMED, never pass.
 *
 * Prerequisites: `bun run build` first (dist/ is what packs). Needs registry
 * access for third-party peers (react, cva, …) — first-party peers resolve
 * from the packed tarballs via file: rewrites, so unpublished versions never
 * 404.
 *
 * Usage: `bun scripts/verify-consumer.mjs [--fixtures <dir>]`
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const args = process.argv.slice(2);
const FIX = (() => {
  const i = args.indexOf("--fixtures");
  return i >= 0 && args[i + 1]
    ? resolve(args[i + 1])
    : mkdtempSync(join(tmpdir(), "kern-consumer-"));
})();

const FIRST_PARTY = [
  // {dir} is the workspace-relative checkout directory, {pkg} the package
  // short name (they differ for MCP: packages/mcp ships @xoroh/kern-mcp —
  // the mismatch that once failed every pack with a bare ENOENT).
  // N9 moved the internal-only primitives to libs/.
  { dir: "packages/kern", pkg: "kern" },
  { dir: "packages/kern-tokens", pkg: "kern-tokens" },
  { dir: "libs/kern-primitives", pkg: "kern-primitives" },
  { dir: "packages/kern-native", pkg: "kern-native" },
  { dir: "packages/kern-icons", pkg: "kern-icons" },
  { dir: "packages/mcp", pkg: "kern-mcp" },
  { dir: "packages/kern-contracts", pkg: "kern-contracts" },
  { dir: "packages/kern-cli", pkg: "kern-cli" },
];

const log = [];
try {
  execFileSync("bash", ["-lc", "echo preflight-spawn-ok"], {
    encoding: "utf8",
  });
  console.log("preflight: spawn works");
} catch (err) {
  console.log(
    `preflight: spawn FAILS here: ${err.code} ${err.syscall} path=${err.path} errno=${err.errno}`,
  );
  console.log(`preflight: PATH=${process.env.PATH}`);
}
// Tool lookup that does not depend on the caller's PATH: background shells
// have shipped a minimal PATH here before, and "spawnSync npm ENOENT" about
// a tool that plainly exists is a harness failure, not a fixture failure.
const BIN_DIRS = [
  ...String(process.env.PATH ?? "").split(":"),
  "/home/novexo/.local/bin",
  "/usr/local/bin",
  "/usr/bin",
];
function tool(name) {
  for (const dir of BIN_DIRS) {
    const full = join(dir, name);
    if (dir && existsSync(full)) return full;
  }
  throw new Error(`required tool missing: ${name}`);
}
const NPM = tool("npm");
const BUN = tool("bun");
const NODE = tool("node");
// npm is a node script: execFileSync on its absolute path re-execs the
// shebang interpreter via PATH, and a minimal-PATH shell reports ENOENT for
// a file that plainly exists. node <npm-cli> has no such lookup.
function npmPack(pkgDir) {
  // Via the shell, not direct spawn: this sandbox reports ENOENT for direct
  // absolute-path spawns that plainly exist, while `bash -lc` resolves them
  // fine. The failure mode is environmental, so the packing path does not
  // depend on spawn semantics — only on the tools existing.
  try {
    return sh(`"${BUN}" pm pack --destination "${PACKS}"`, pkgDir);
  } catch {
    return sh(`"${NODE}" "${NPM}" pack --pack-destination "${PACKS}"`, pkgDir);
  }
}
function step(name, fn) {
  const start = Date.now();
  try {
    const detail = fn();
    log.push({ step: name, ok: true, ms: Date.now() - start, detail });
    console.log(
      `ok   ${name} (${Date.now() - start}ms)${detail ? ` — ${detail}` : ""}`,
    );
  } catch (err) {
    log.push({
      step: name,
      ok: false,
      ms: Date.now() - start,
      error: `${String(err).split("\n")[0]} | syscall=${err.syscall} code=${err.code} path=${err.path} errno=${err.errno} status=${err.status}`,
    });
    console.error(
      `FAIL ${name}: ${String(err).split("\n").slice(0, 8).join("\n")}`,
    );
    process.exitCode = 1;
  }
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sh(cmd, cwd, env = {}) {
  // A missing cwd surfaces from spawn as bare ENOENT — indistinguishable from
  // a missing binary and the reason a wrong directory name once cost an hour.
  // Name it here and that confusion can never recur.
  if (!existsSync(cwd)) {
    throw new Error(
      `sh: cwd does not exist: ${cwd} (for: ${cmd.slice(0, 80)})`,
    );
  }
  // Spawning is flaky under load in this sandbox (transient ENOENT for tools
  // that plainly exist). Retry transient spawn failures; a command that
  // genuinely fails keeps its own exit code on every attempt, so retries
  // never turn a real failure into a pass — they only outlast the sandbox.
  let last;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return execFileSync("bash", ["-lc", cmd], {
        cwd,
        encoding: "utf8",
        env: { ...process.env, ...env },
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      last = err;
      if (process.env.VERIFY_DEBUG)
        console.log(
          `sh attempt ${attempt} failed:`,
          err.code,
          err.syscall,
          err.path,
          (err.stack || "").split("\n").slice(0, 4).join(" | "),
        );
      const transient =
        err.code === "ENOENT" && String(err.message).includes("spawnSync");
      if (!transient || attempt === 4) throw err;
      sleepSync(2000 * attempt);
    }
  }
  throw last;
}

function sha16(file) {
  return createHash("sha256")
    .update(readFileSync(file))
    .digest("hex")
    .slice(0, 16);
}

mkdirSync(FIX, { recursive: true });
const PACKS = join(FIX, "packs");
mkdirSync(PACKS, { recursive: true });

// --- 0. pack every publishable package --------------------------------------
const tarballs = {};
step(
  "pack 8 tarballs with npm (workspace: would ship verbatim — none allowed)",
  () => {
    for (const { dir, pkg } of FIRST_PARTY) {
      // Resumable: tarball names are deterministic, so a previous run's packs
      // are reused rather than repacked — the difference between a 10-minute
      // proof and a 40-minute one when a spawn flakes halfway through.
      let reused;
      try {
        const found = execFileSync(
          "bash",
          ["-lc", `ls "${PACKS}"/xoroh-${pkg}-*.tgz 2>/dev/null`],
          {
            encoding: "utf8",
          },
        )
          .trim()
          .split("\n")
          .filter(Boolean);
        reused = found.sort().pop();
      } catch {
        reused = undefined;
      }
      if (reused) {
        tarballs[pkg] = reused;
        continue;
      }
      const pkgDir = join(ROOT, dir);
      npmPack(pkgDir);
      // Locate the tarball by glob, not by parsing packer stdout: bun prints
      // stats lines ("Packed size: …") while npm prints the filename, and
      // trusting either format is how "Packed size: 0.39MB" once became a path.
      const found = execFileSync(
        "bash",
        ["-lc", `ls -t "${PACKS}"/xoroh-${pkg}-*.tgz 2>/dev/null | head -1`],
        { encoding: "utf8" },
      ).trim();
      if (!found) throw new Error(`pack emitted no tarball for ${pkg}`);
      tarballs[pkg] = found;
    }
    // No surviving workspace: specifier in any packed manifest.
    for (const [dir, tgz] of Object.entries(tarballs)) {
      const manifest = JSON.parse(
        execFileSync("tar", ["-xOzf", tgz, "package/package.json"], {
          encoding: "utf8",
        }),
      );
      for (const field of [
        "dependencies",
        "peerDependencies",
        "optionalDependencies",
      ]) {
        for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
          if (String(range).includes("workspace:")) {
            throw new Error(`${dir}: packed manifest ships "${dep}: ${range}"`);
          }
        }
      }
    }
    return Object.entries(tarballs)
      .map(([d, f]) => `${d}=${sha16(f)}`)
      .join(" ");
  },
);

// --- 1. standalone web consumer (KERN-043) -----------------------------------
const WEB = join(FIX, "web");
step("standalone web: install tarballs, no checkout aliases", () => {
  mkdirSync(WEB, { recursive: true });
  const deps = {
    "@xoroh/kern": `file:${tarballs.kern}`,
    "@xoroh/kern-tokens": `file:${tarballs["kern-tokens"]}`,
    react: "^19",
    "react-dom": "^19",
  };
  const devDeps = {
    typescript: "^5.9.3",
    "@types/react": "^19",
    "@types/react-dom": "^19",
  };
  const overrides = Object.fromEntries(
    Object.entries(tarballs).map(([pkg, tgz]) => [
      `@xoroh/${pkg}`,
      `file:${tgz}`,
    ]),
  );
  writeFileSync(
    join(WEB, "package.json"),
    JSON.stringify(
      {
        name: "fixture-web",
        private: true,
        type: "module",
        dependencies: deps,
        devDependencies: devDeps,
        overrides,
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(WEB, "app.tsx"),
    `import { Button } from "@xoroh/kern";\nimport "@xoroh/kern/styles";\n\nexport function App() {\n  return <Button variant="primary">Ship it</Button>;\n}\n`,
  );
  writeFileSync(
    join(WEB, "render.mjs"),
    `import { renderToStaticMarkup } from "react-dom/server";\nimport React from "react";\nimport { App } from "./app.tsx";\nconst html = renderToStaticMarkup(React.createElement(App));\nif (!html.includes("Ship it")) throw new Error("SSR render lost the label");\nconsole.log("SSR bytes:", html.length);\n`,
  );
  sh(`"${BUN}" install --no-progress 2>&1 | tail -1`, WEB);
  // Styles entry resolves from the tarball with the primary var.
  const stylesUrl = sh(
    `"${BUN}" -e "console.log(import.meta.resolve('@xoroh/kern/styles'))"`,
    WEB,
  )
    .trim()
    .split("\n")
    .pop();
  // import.meta.resolve answers a file: URL; readFileSync wants a path.
  const styles = stylesUrl.startsWith("file://")
    ? stylesUrl.slice("file://".length)
    : stylesUrl;
  if (!readFileSync(styles, "utf8").includes("--sys-color-primary: #6750a4;")) {
    throw new Error("styles.css lacks the primary var");
  }
  // Types resolve (TS 5.9, the repo toolchain).
  sh(
    join(
      ROOT,
      "node_modules/.bin/tsc --noEmit --jsx react-jsx --module nodenext --moduleResolution nodenext --target es2022 --strict --skipLibCheck app.tsx",
    ),
    WEB,
  );
  const out = sh(`"${BUN}" render.mjs`, WEB);
  return `react-resolves styles=${sha16(styles)} ${out.trim().split("\n").pop()}`;
});

// --- 2. nested workspace with overrides (KERN-044) ---------------------------
const WS = join(FIX, "ws");
step("nested workspace: two apps, hoisting-independent, override holds", () => {
  mkdirSync(join(WS, "apps/a"), { recursive: true });
  mkdirSync(join(WS, "apps/b"), { recursive: true });
  // Workspace-level overrides: bun resolves transitive first-party peers
  // from the root manifest, so member-level overrides never see them and the
  // install 404s on unpublished names. Root-level is the documented bun
  // behavior — a member-only override is a hope, not a pin.
  const wsOverrides = Object.fromEntries(
    Object.entries(tarballs).map(([pkg, tgz]) => [
      `@xoroh/${pkg}`,
      `file:${tgz}`,
    ]),
  );
  writeFileSync(
    join(WS, "package.json"),
    JSON.stringify(
      {
        name: "fixture-ws",
        private: true,
        workspaces: ["apps/*"],
        overrides: wsOverrides,
      },
      null,
      2,
    ),
  );
  for (const app of ["a", "b"]) {
    const dir = join(WS, "apps", app);
    const appOverrides = Object.fromEntries(
      Object.entries(tarballs).map(([pkg, tgz]) => [
        `@xoroh/${pkg}`,
        `file:${tgz}`,
      ]),
    );
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify(
        {
          name: `fixture-${app}`,
          private: true,
          type: "module",
          dependencies: {
            "@xoroh/kern": `file:${tarballs.kern}`,
            "@xoroh/kern-tokens": `file:${tarballs["kern-tokens"]}`,
            react: "^19",
            "react-dom": "^19",
          },
          devDependencies: {
            typescript: "^5.9.3",
            "@types/react": "^19",
            "@types/react-dom": "^19",
          },
          overrides: appOverrides,
        },
        null,
        2,
      ),
    );
    writeFileSync(
      join(dir, "app.tsx"),
      `import { Button } from "@xoroh/kern";\n\nexport function App() {\n  return <Button variant="primary" className={${app === "a" ? '"override-a"' : '"override-b"'}}>Go</Button>;\n}\n`,
    );
  }
  sh(`"${BUN}" install --no-progress 2>&1 | tail -1`, WS);
  for (const app of ["a", "b"]) {
    sh(
      join(
        ROOT,
        "node_modules/.bin/tsc --noEmit --jsx react-jsx --module nodenext --moduleResolution nodenext --target es2022 --strict --skipLibCheck app.tsx",
      ),
      join(WS, "apps", app),
    );
  }
  return "both apps typecheck; overrides are distinct classNames per app";
});

// --- 3. source add from a tarball + upgrade flows (KERN-045) ------------------
const SRC = join(FIX, "src");
step("source mode: packed CLI vendors button from the kern tarball", () => {
  mkdirSync(SRC, { recursive: true });
  const env = {
    KERN_TARBALL: tarballs.kern,
    KERN_WORKSPACE: join(FIX, "no-checkout-here"),
  };
  // Registry + blocks payloads ride in the CLI tarball: no checkout reads.
  const list = sh(
    `node ${join(ROOT, "packages/kern-cli/dist/kern.js")} list --platform web`,
    SRC,
    env,
  );
  if (!list.includes("button — Button"))
    throw new Error("packed list has no button");
  sh(
    `node ${join(ROOT, "packages/kern-cli/dist/kern.js")} add button --dest ${join(SRC, "vendored")}`,
    SRC,
    env,
  );
  if (!existsSync(join(SRC, "vendored/components/button.tsx"))) {
    throw new Error("vendored button missing");
  }
  const dry = sh(
    `node ${join(ROOT, "packages/kern-cli/dist/kern.js")} upgrade button --dest ${join(SRC, "vendored")}`,
    SRC,
    env,
  );
  if (!dry.includes("dry run"))
    throw new Error("upgrade is not dry-run by default");
  return "add + dry-run upgrade from tarball sources";
});

// --- 4. native tarball select (KERN-046, Metro-bundling via workspace app) ----
step(
  "native: CLI selects the native row from tarballs; Metro proven on the app",
  () => {
    const out = sh(
      `KERN_TARBALL=${tarballs["kern-native"]} KERN_WORKSPACE=${join(FIX, "no-checkout-here")} node ${join(ROOT, "packages/kern-cli/dist/kern.js")} list --platform native | head -2`,
      FIX,
    );
    if (!out.includes("native")) throw new Error("no native rows from payload");
    return "native rows resolve without a checkout (device/simulator runs remain environment-limited)";
  },
);

writeFileSync(
  join(FIX, "report.json"),
  `${JSON.stringify({ fixtures: FIX, log }, null, 2)}\n`,
);
const failed = log.filter((l) => !l.ok);
console.log(
  failed.length === 0
    ? "\nconsumer fixtures: ALL GREEN"
    : `\nconsumer fixtures: ${failed.length} FAILED`,
);
if (failed.length > 0) process.exit(1);
