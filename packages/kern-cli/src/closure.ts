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
  /** Non-code leaves to copy: JSON, CSS, assets. Copied verbatim. */
  assets: string[];
  /** Relative dynamic `import()` specifiers found (declared policy: below). */
  dynamic: string[];
};

/** `..`-segments that stay inside `src/` after stripping — the mirror rule. */
function mirrorPath(pkgRel: string): string | null {
  if (!pkgRel.startsWith("src/")) return null;
  return pkgRel.slice("src/".length);
}

/** Asset leaves: copied verbatim, never parsed as modules. (Extension set
 * removed as unused; reintroduce with its consumer if asset handling
 * needs it.) */

export function resolveClosure(
  pkgDir: string,
  entryPkgRel: string,
): Closure & { mirror: Map<string, string> } {
  const vendor: string[] = [];
  const npm = new Set<string>();
  const assets: string[] = [];
  const dynamic = new Set<string>();
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
      // Dynamic import(): a static analyzer cannot follow a computed path, so
      // the policy is DECLARED, not guessed. Bare specifiers join npm; relative
      // ones must resolve to a file (else fail naming it) and join the closure.
      // An unresolvable relative dynamic import is a broken graph, and a graph
      // that installs without it is broken on arrival.
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments.length === 1 &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const spec = node.arguments[0].text;
        dynamic.add(spec);
        if (spec.startsWith(".")) {
          const next = resolve(dirname(join(pkgDir, rel)), spec);
          const hit = [
            next,
            `${next}.ts`,
            `${next}.tsx`,
            join(next, "index.ts"),
            join(next, "index.tsx"),
          ].find((cand) => existsSync(cand) && statSync(cand).isFile());
          if (!hit) {
            throw new Error(
              `cannot vendor "${rel}": dynamic import "${spec}" resolves to no file.`,
            );
          }
          const pkgRel = hit.slice(pkgDir.length + 1);
          if (!seen.has(pkgRel)) queue.push(pkgRel);
        } else {
          const parts = spec.split("/");
          npm.add(
            spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0],
          );
        }
      }
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const spec = node.moduleSpecifier.text;
        if (spec.startsWith(".")) {
          const next = resolve(dirname(join(pkgDir, rel)), spec);
          // Directory index first: `./x` may mean `./x/index.ts`. Then files,
          // then asset leaves (JSON/CSS/assets are copied, never compiled).
          const hit = [
            join(next, "index.ts"),
            join(next, "index.tsx"),
            next,
            `${next}.ts`,
            `${next}.tsx`,
            `${next}.json`,
            `${next}.css`,
          ].find((cand) => existsSync(cand) && statSync(cand).isFile());
          if (hit) {
            const pkgRel = hit.slice(pkgDir.length + 1);
            if (/\.(json|css|svg|png|ttf|woff|woff2)$/.test(hit)) {
              if (!seen.has(pkgRel)) {
                seen.add(pkgRel);
                assets.push(pkgRel);
                const mirrored = mirrorPath(pkgRel);
                if (mirrored === null) {
                  throw new Error(
                    `cannot vendor "${pkgRel}": outside src/ — the mirrored tree cannot represent it.`,
                  );
                }
                mirror.set(pkgRel, mirrored);
              }
            } else if (!seen.has(pkgRel)) queue.push(pkgRel);
          } else {
            // A MISSING relative is not skipped silently anymore (the old code
            // did): a graph with a hole installs broken. Fail naming it.
            throw new Error(
              `cannot vendor "${rel}": relative import "${spec}" resolves to no file.`,
            );
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
  return {
    vendor,
    npm: [...npm].sort(),
    assets: assets.sort(),
    dynamic: [...dynamic].sort(),
    mirror,
  };
}
