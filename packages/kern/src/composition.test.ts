/**
 * R2 composition rule, re-homed (T1): `render` for new parts, `asChild`
 * grandfathered as a bridge onto `render` — never both active on one part.
 *
 * Ported from the platform fork's R2 series. kern/ currently has no
 * `asChild` prop definitions at all (one `render` consumer in textarea),
 * so this guard constrains future code: any new `asChild?: boolean` must
 * carry the mutual-exclusion bridge
 * `render={asChild ? (children as React.ReactElement) : render}` (comments
 * stripped first, so prose about the rule cannot satisfy it). A custom
 * `asChild` child must forward its ref — a non-forwarding child silently
 * breaks focus management.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOTS = [join(HERE), join(HERE, "..", "..", "kern-native", "src")];

/** Files whose asChild shape is reviewed and recorded in api-consistency.md. */
const DOCUMENTED_EXCEPTIONS = new Set<string>([]);

async function tsxFiles(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "parity") continue;
      await tsxFiles(full, out);
    } else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("composition rule: asChild is always bridged onto render", () => {
  it("every asChild prop definition uses the mutual-exclusion bridge", async () => {
    const offenders: string[] = [];
    for (const root of ROOTS) {
      for (const full of await tsxFiles(root)) {
        const raw = await readFile(full, "utf8");
        const rel = full.slice(join(HERE, "..", "..").length + 1);
        if (!/asChild\?: boolean/.test(raw)) continue;
        if (DOCUMENTED_EXCEPTIONS.has(rel)) continue;
        const source = raw
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(^|[^:])\/\/.*$/gm, "$1");
        if (
          !/render=\{asChild \? \(children as React\.ReactElement\) : render\}/.test(
            source,
          )
        ) {
          offenders.push(rel);
        }
      }
    }
    expect(offenders.join("\n")).toBe("");
  });
});
