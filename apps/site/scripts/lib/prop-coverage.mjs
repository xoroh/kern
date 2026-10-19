/**
 * prop-coverage — the pure counting core of check-props.
 *
 * Extracted so the gate's attribution rule is unit-testable without running
 * the whole site: `computeCoverage` takes the generated props, the full name
 * sets and the parsed content files, and returns the counts. check-props.mjs
 * wires the real directories, prints the report and exits; the *_test
 * pins the semantics on fixtures.
 *
 * Semantics (see check-props.mjs WHY):
 * - stale: an UNSCOPED content name nothing in the part's type carries.
 *   Still counted per part; the gate hard-fails on any stale row (the old
 *   471 baseline and its ratchet are gone with the burn-down).
 * - scoped rows (`for: [...]`) attribute only to the listed parts: they
 *   never count as stale anywhere, but a scope naming a non-part, a part
 *   with no generated export, or a name none of the scoped parts carries
 *   is a hard scope error, not a silent skip.
 * - uncovered: per generated row, no attributed content row of the same
 *   name in the part's family. Failing since the gate-2 flip: an
 *   undocumented generated prop fails the gate.
 */

export function computeCoverage({ gen, all, files }) {
  const scopeErrors = [];
  const attributed = new Map(); // part -> [{ name, scoped }]
  const unscopedByPart = new Map(); // part -> Set<name>, for the stale ratchet

  for (const { file, parts, rows } of files) {
    const short = file.split("/").slice(-2).join("/");
    for (const row of rows) {
      const targets = row.for ?? parts;
      if (row.for) {
        for (const t of row.for) {
          if (!parts.includes(t)) {
            scopeErrors.push(
              `${short}: api row "${row.name}" scopes to "${t}", which is not one of the file's parts (${parts.join(", ")})`,
            );
          } else if (gen[t] === undefined) {
            scopeErrors.push(
              `${short}: api row "${row.name}" scopes to "${t}", which has no generated props export — nothing to document against`,
            );
          }
        }
        const validTargets = targets.filter(
          (t) => parts.includes(t) && gen[t] !== undefined,
        );
        const carried =
          validTargets.length > 0 &&
          validTargets.some((t) => knownNames(gen, all, t).has(row.name));
        if (!carried && validTargets.length > 0) {
          scopeErrors.push(
            `${short}: scoped api row "${row.name}" is carried by none of its scoped parts (${targets.join(", ")})`,
          );
        }
      }
      for (const part of targets) {
        if (!parts.includes(part)) continue;
        if (!attributed.get(part)) attributed.set(part, []);
        attributed.get(part).push({ name: row.name, scoped: row.for != null });
        if (row.for == null) {
          if (!unscopedByPart.has(part)) unscopedByPart.set(part, new Set());
          unscopedByPart.get(part).add(row.name);
        }
      }
    }
  }

  const stale = [];
  let uncovered = 0;
  const uncoveredByExport = [];
  const unjudgeable = [];
  let checked = 0;

  for (const [exp, rows] of Object.entries(gen)) {
    const documented = attributed.get(exp);
    if (!documented) continue; // no web content page claims this export — not this gate's job
    // The type did not resolve (no rows AND no names): the extractor cannot
    // judge this export, so the gate reports UNJUDGEABLE instead of calling
    // every content row stale. A gate that cannot inspect evidence must not
    // silently pass — or falsely fail.
    if (rows.length === 0 && (all[exp] ?? []).length === 0) {
      unjudgeable.push(exp);
      continue;
    }
    checked += 1;
    const known = knownNames(gen, all, exp);
    for (const n of unscopedByPart.get(exp) ?? []) {
      if (!known.has(n)) {
        stale.push(
          `${exp}: content api names "${n}", which nothing in the component's type carries.`,
        );
      }
    }
    const names = new Set(documented.map((r) => r.name));
    const missing = rows.filter((r) => !names.has(r.name)).map((r) => r.name);
    if (missing.length) {
      uncovered += missing.length;
      uncoveredByExport.push(`${exp}: ${missing.join(", ")}`);
    }
  }

  return {
    stale,
    uncovered,
    uncoveredByExport,
    unjudgeable,
    checked,
    scopeErrors,
  };
}

function knownNames(gen, all, exp) {
  return new Set([...(gen[exp] ?? []).map((r) => r.name), ...(all[exp] ?? [])]);
}
