import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Content api names, per part. Web content only (`src/content/web`).
 *
 * Shared by check-props (the gate: what content documents) and
 * generate-props (curated lists: documented-but-not-extracted names) so the
 * two can never disagree on what content documents. A regex pair with two
 * owners drifts; a function with two callers does not.
 *
 * Returns Map<part export name, Set<prop names>>. Every `api` row in a family
 * file is attributed to every part in that file — the same attribution
 * check-props has always used.
 */
export function readContentApiNames(contentWebDir) {
  const out = new Map();
  function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
        continue;
      }
      if (!e.name.endsWith(".ts")) continue;
      const src = readFileSync(full, "utf8");
      const partsMatch = src.match(/parts:\s*\[([^\]]*)\]/);
      if (!partsMatch) continue;
      const partNames = [...partsMatch[1].matchAll(/"([^"]+)"/g)].map(
        (m) => m[1],
      );
      const apiBlock = src.match(/api:\s*\[([\s\S]*?)\n\s*\],/);
      const apiRows = apiBlock
        ? [...apiBlock[1].matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1])
        : [];
      for (const part of partNames) {
        if (!out.has(part)) out.set(part, new Set());
        for (const name of apiRows) out.get(part).add(name);
      }
    }
  }
  walk(contentWebDir);
  return out;
}
