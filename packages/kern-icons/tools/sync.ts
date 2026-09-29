/**
 * Syncs Material Symbols Rounded SVGs into local asset storage.
 *
 *   bun run sync                       # pinned version from config/source.json
 *   WEIGHT=300 bun run sync            # a different weight axis value
 *   FORCE=true bun run sync            # re-download even when cached
 *
 * Material Symbols is a variable font with FILL / wght / GRAD / opsz axes. The
 * pinned npm package is the SVG extraction of that font at one axis instance
 * (style `rounded`, weight 400, opsz 48), so "the Google font system" and
 * "these local SVGs" are the same artwork — just frozen, versioned, and
 * offline. The version is pinned in `config/source.json`, which makes the sync
 * reproducible: the same config always produces byte-identical assets. The
 * tarball is cached under `assets/material/.cache/` and never leaves the
 * machine. Nothing at runtime touches the network.
 *
 * Output layout (gitignored, regenerable):
 *
 *   assets/material/.cache/<pkg>-<version>.tgz        pinned tarball
 *   assets/material/rounded/<snake_case_name>.svg     FILL 0
 *   assets/material/rounded/<snake_case_name>-fill.svg FILL 1
 *   assets/material/SOURCE.md                         provenance
 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { ICON_SPEC, PATHS, readSourceConfig, rel } from "./lib/config";

const REGISTRY = "https://registry.npmjs.org";

function envFlag(name: string): boolean {
  const v = process.env[name];
  return v === "true" || v === "1";
}

function envNumber(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function log(message: string): void {
  process.stdout.write(`[icons] ${message}\n`);
}

function svgCount(dir: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".svg"))
    .length;
}

async function downloadTarball(
  pkg: string,
  version: string,
  dest: string,
): Promise<void> {
  const encoded = pkg.replace("/", "%2F");
  const metaUrl = `${REGISTRY}/${encoded}`;
  log(`resolving ${pkg}@${version}`);

  const meta = await fetch(metaUrl);
  if (!meta.ok)
    throw new Error(`npm registry returned ${meta.status} for ${metaUrl}`);
  const json = (await meta.json()) as {
    versions?: Record<string, { dist?: { tarball?: string } }>;
  };

  const tarball = json.versions?.[version]?.dist?.tarball;
  if (!tarball) {
    throw new Error(
      `${pkg}@${version} not found in the registry — check config/source.json`,
    );
  }

  log(`downloading ${tarball}`);
  const res = await fetch(tarball);
  if (!res.ok)
    throw new Error(`download failed with ${res.status}: ${tarball}`);

  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  log(
    `cached ${(readFileSync(dest).byteLength / 1024 / 1024).toFixed(1)} MiB → ${rel(dest)}`,
  );
}

/**
 * Extracts `package/<style>` into `assets/material/`, producing
 * `assets/material/rounded/*.svg`.
 *
 * Only the `<style>` directory is replaced — `assets/material/.cache/` and
 * `SOURCE.md` sit beside it and must survive a re-extract.
 */
function extractRounded(
  tarball: string,
  style: string,
  destRoot: string,
): number {
  rmSync(path.join(destRoot, style), { recursive: true, force: true });
  mkdirSync(destRoot, { recursive: true });

  // `--strip-components=1` turns `package/<style>/x.svg` into `<style>/x.svg`
  // inside destRoot, giving us `assets/material/rounded/*.svg`.
  execFileSync(
    "tar",
    [
      "-xzf",
      tarball,
      "-C",
      destRoot,
      "--strip-components=1",
      `package/${style}`,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );

  const dir = path.join(destRoot, style);
  const count = svgCount(dir);
  if (count === 0) throw new Error(`extraction produced no SVGs in ${dir}`);
  return count;
}

function writeProvenance(style: string, count: number, weight: number): void {
  const source = readSourceConfig();
  writeFileSync(
    path.join(PATHS.materialAssets, "..", "SOURCE.md"),
    `# Material Symbols — local asset cache

**This directory is generated and gitignored.** Do not edit it by hand and do
not commit it. Regenerate with:

\`\`\`bash
bun run sync
\`\`\`

| Field | Value |
| ----- | ----- |
| Package | \`${source.package}@${source.version}\` |
| Style | \`${style}\` |
| Weight axis (wght) | \`${weight}\` |
| Optical size (opsz) | \`${ICON_SPEC.opticalSize}px\` |
| Source viewBox | \`${source.sourceViewBox}\` |
| Files | ${count} (\`${count / 2}\` icons × FILL 0 / FILL 1) |
| License | [${source.license}](${source.licenseUrl}) |

Material Symbols is a variable font on four axes — \`FILL\`, \`wght\`,
\`GRAD\`, \`opsz\`. These SVGs are that font extracted at one frozen axis
instance (\`wght=${weight}\`, \`opsz=${ICON_SPEC.opticalSize}\`, \`GRAD=0\`),
so the artwork is identical to ${source.homepage} but needs no font download and
no network at runtime.

The pipeline re-bases every path from the ${source.sourceGrid}-unit source
grid onto the canonical \`0 0 24 24\` viewBox at generate time. Only the names
listed in \`config/kern-icon-set.txt\` (plus everything in \`assets/brand/\`) get
committed shape data.

Upstream extraction: ${source.upstream}
Canonical source: ${source.homepage}
`,
    "utf8",
  );
}

async function main(): Promise<void> {
  const source = readSourceConfig();
  const weight = envNumber("WEIGHT", source.weight);
  const pkg =
    weight === 400
      ? source.package
      : source.package.replace(/svg-400$/, `svg-${weight}`);
  const version = process.env.VERSION ?? source.version;
  const style = process.env.STYLE ?? source.style;

  const tarball = path.join(
    PATHS.cache,
    `${pkg.replace("/", "-")}-${version}.tgz`,
  );
  const extracted = svgCount(PATHS.materialAssets);
  const force = envFlag("FORCE");

  if (!force && (existsSync(tarball) || extracted > 0)) {
    if (extracted > 0) {
      log(
        `already synced (${extracted} SVGs in ${rel(PATHS.materialAssets)}) — nothing to do`,
      );
      log("next: bun run generate");
      return;
    }
    log(`using cached ${path.basename(tarball)}`);
  } else if (force || (!existsSync(tarball) && extracted === 0)) {
    await downloadTarball(pkg, version, tarball);
  }

  const destRoot = path.dirname(PATHS.materialAssets);
  log(`extracting package/${style} → ${rel(destRoot)}`);
  const count = extractRounded(tarball, style, destRoot);
  writeProvenance(style, count, weight);

  log(
    `synced ${count} SVGs (${count / 2} icons) for style "${style}" weight ${weight}`,
  );
  log("next: bun run generate");
}

main().catch((err) => {
  process.stderr.write(
    `[icons] sync failed: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exitCode = 1;
});
