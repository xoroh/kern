/**
 * Closure resolution for vendoring — the file PLUS everything it needs.
 *
 * A kern component is never one file (measured: button = cva + react +
 * ../utils/cn; dialog = Base UI + react + ../utils/cnState; cnState re-exports
 * through ./cn into clsx + tailwind-merge). Copying the component alone
 * vendors a broken import graph. So `kern add` resolves the transitive
 * closure over RELATIVE imports with the TypeScript compiler API (repo rule:
 * real parsers, not import-regexes), then sorts every module into:
 *
 * - vendorable: relative source inside the package → copied, layout mirrored
 *   (see add.ts), so relative imports keep working byte-identical;
 * - npm: bare specifiers → installed by the consumer, never copied. The
 *   package is the top-level specifier (@base-ui/react/dialog → @base-ui/react);
 * - refused: relative imports escaping the mirrored tree (none exist today;
 *   if one appears the command fails naming it rather than emitting a file
 *   whose imports point outside the vendored tree).
 */
import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import ts from "typescript";

export type Closure = {
  /** Package-relative paths (e.g. `src/components/button.tsx`), entry first. */
  vendor: string[];
  /** Top-level npm packages the consumer must install. */
  npm: string[];
};

/** `..`-segments that stay inside `src/` after stripping — the mirror rule. */
function mirrorPath(pkgRel: string): string | null {
  if (!pkgRel.startsWith("src/")) return null;
  return pkgRel.slice("src/".length);
}

export function resolveClosure(
  pkgDir: string,
  entryPkgRel: string,
): Closure & { mirror: Map<string, string> } {
  const vendor: string[] = [];
  const npm = new Set<string>();
  const mirror = new Map<string, string>();
  const seen = new Set<string>();
  const program = ts.createProgram([join(pkgDir, entryPkgRel)], {
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    allowJs: true,
    skipLibCheck: true,
  });

  const queue = [entryPkgRel];
  while (queue.length) {
    const rel = queue.shift() as string;
    if (seen.has(rel)) continue;
    seen.add(rel);
    const mirrored = mirrorPath(rel);
    if (mirrored === null) {
      throw new Error(
        `cannot vendor "${rel}": outside src/ — the mirrored tree cannot represent it.`,
      );
    }
    vendor.push(rel);
    mirror.set(rel, mirrored);

    const abs = join(pkgDir, rel);
    const src = program.getSourceFile(abs);
    if (!src) {
      throw new Error(`cannot vendor "${rel}": file not in the program.`);
    }
    ts.forEachChild(src, function visit(node): void {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const spec = node.moduleSpecifier.text;
        if (spec.startsWith(".")) {
          const next = resolve(dirname(join(pkgDir, rel)), spec);
          // Only files (not dirs, not missing) join the closure.
          const hit = [next, `${next}.ts`, `${next}.tsx`].find(
            (cand) => existsSync(cand) && statSync(cand).isFile(),
          );
          if (hit) {
            const pkgRel = hit.slice(pkgDir.length + 1);
            if (!seen.has(pkgRel)) queue.push(pkgRel);
          }
        } else {
          // Top-level package: @scope/pkg/rest → @scope/pkg; pkg/rest → pkg.
          const parts = spec.split("/");
          npm.add(
            spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0],
          );
        }
      }
      ts.forEachChild(node, visit);
    });
  }
  return { vendor, npm: [...npm].sort(), mirror };
}
