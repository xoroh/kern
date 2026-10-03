#!/usr/bin/env node
/**
 * generate-props — props tables that cannot rot (Part 0 of the redesign).
 *
 * WHY
 *
 * Every component page carries a hand-typed `api` array. Of the six repos the
 * ecosystem audit read, only shadcn hand-writes props tables — and that is the
 * rot risk: the table drifts from the code and nothing fails. MUI, Chakra,
 * Mantine and Base UI all generate from source.
 *
 * WHAT IT DOES
 *
 * Reads each web component's Props type with the TypeScript compiler API and
 * emits `apps/site/src/generated/props.json`: export name → PropRow[]
 * (name/type/default/required/note). Only props DECLARED in the component's
 * own file count — the 100+ intrinsic HTML attributes from
 * `ComponentPropsWithRef` are excluded (MUI explicitly omits native props too).
 * `default` comes from the file's `defaultVariants` where one exists; `note`
 * comes from JSDoc where written (usually absent — notes stay hand-authored
 * in content, see below).
 *
 * PROVENANCE (review-m3 P0 condition). Every row carries `src` —
 * `path:line` of the declaration the row was extracted from — so no value in
 * the JSON is an unsourced second spec: type ← the compiler's type of the
 * symbol at that declaration, default ← the file's `defaultVariants` AST,
 * note ← that symbol's JSDoc. A semantic role/state/token mapping per prop is
 * deliberately NOT invented here: that mapping exists nowhere in source, and
 * a heuristic table would BE the second spec source the condition forbids.
 * The semantic layer lives in content (aria rows, keyboard, token tables),
 * keyed by family; this JSON is the mechanical truth it is checked against.
 *
 * WHAT IT DOES NOT DO (stated, not implied)
 *
 * It does not replace the content `api` arrays. Those carry the `note` field —
 * what a prop *implies* — which is judgment, not extraction. Instead
 * `check-props` asserts the two agree on NAMES in both directions: every
 * generated prop is documented, and no documented row names a prop that no
 * longer exists. Type-text equality is deliberately NOT asserted (formatting).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const SITE = resolve(HERE, "..");
const OUT = join(SITE, "src", "generated", "props.json");

const manifestMod = await import(
  join(ROOT, "packages", "mcp", "src", "manifest.ts")
);
// Web entries only: native has no DOM parts and no Props-type convention to
// extract from yet. Extending here later is a second increment, not a gap —
// the gate reports what it covers.
const entries = manifestMod.COMPONENTS.filter(
  (e) => e.platform === "web" && e.status === "real",
).map((e) => ({ name: e.name, export: e.export, path: e.path }));

const files = [...new Set(entries.map((e) => e.path))];
const program = ts.createProgram(
  // Manifest paths are relative to packages/kern (e.g. src/components/button.tsx).
  files.map((f) => join(ROOT, "packages/kern", f)),
  {
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: true,
  },
);
const checker = program.getTypeChecker();

/** `defaultVariants` in a file, by prop name — cva defaults, read from the AST. */
function fileDefaults(src) {
  const out = new Map();
  function visit(node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(src) === "defaultVariants" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const p of node.initializer.properties) {
        if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) {
          out.set(p.name.text, p.initializer.getText(src).trim());
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(src);
  return out;
}

const byExport = {};
const allNames = {};
for (const file of files) {
  const abs = join(ROOT, "packages/kern", file);
  const src = program.getSourceFile(abs);
  if (!src) {
    console.error(`generate-props: cannot load ${file} — entry skipped, not silently dropped`);
    continue;
  }
  const defaults = fileDefaults(src);

  // Every exported `XProps` / `XxxProps` type alias in the file.
  const aliases = [];
  ts.forEachChild(src, (node) => {
    if (ts.isTypeAliasDeclaration(node) && /Props$/.test(node.name.text)) {
      aliases.push(node);
    }
  });

  for (const alias of aliases) {
    const t = checker.getTypeFromTypeNode(alias.type);
    const props = new Map();
    // Every name the type carries, INCLUDING react intrinsics. The gate uses
    // this to distinguish "curated intrinsic" (content documents `type`/`ref`/
    // `className` — they exist, inherited) from "stale" (names nothing at all).
    const names = new Set();
    const seen = new Set();
    (function walk(type) {
      if (seen.has(type)) return;
      seen.add(type);
      if (type.isIntersection?.()) {
        type.types.forEach(walk);
        return;
      }
      for (const sym of type.getProperties()) {
        names.add(sym.name);
        const decl = sym.valueDeclaration ?? sym.declarations?.[0];
        if (!decl) continue;
        const declFile = decl.getSourceFile().fileName;
        const local = decl.getSourceFile() === src;
        // Base UI passthrough: most components alias the primitive's props
        // (`ComponentProps<typeof AccordionPrimitive.Root>`), and content
        // documents THOSE props (value, onValueChange…). Excluding them would
        // report every passthrough component as undocumented — wrongly, because
        // the primitive's public props ARE this component's API. React's own
        // intrinsic attributes (lib.*.d.ts) stay excluded: nobody documents
        // `onCopy` per component, and MUI explicitly omits native props too.
        // (Base UI ships .d.ts/.d.mts from its package dir, wherever the package
        // manager hoists it — match the package path, not the install layout.)
        const baseUi = /@base-ui[/\\].*\.d\.[cm]?ts$/.test(declFile);
        if (!local && !baseUi) continue;
        if (props.has(sym.name)) continue;
        const propType = checker.getTypeOfSymbolAtLocation(sym, decl);
        const declSrc = decl.getSourceFile();
        const declLine =
          ts.getLineAndCharacterOfPosition(declSrc, decl.getStart()).line + 1;
        const row = {
          name: sym.name,
          type: checker.typeToString(propType),
          required: (sym.flags & ts.SymbolFlags.Optional) === 0,
          // Provenance: every value traceable to the declaration it came
          // from. Base UI passthrough rows point into the installed .d.ts —
          // that IS their source of truth, stated, not hidden.
          src: `${relative(ROOT, declSrc.fileName)}:${declLine}`,
        };
        if (defaults.has(sym.name)) row.default = defaults.get(sym.name);
        const doc = ts.displayPartsToString(
          sym.getDocumentationComment(checker),
        );
        if (doc) row.note = doc;
        props.set(sym.name, row);
      }
    })(t);

    // Attribute rows to the manifest export(s). The Props type name usually
    // matches its export (`AccordionRootProps` -> `AccordionRoot`); a file with
    // exactly one Props alias shares it across its exports (genuinely shared).
    // Anything else gets nothing — the gate surfaces the gap instead of this
    // generator silently attributing another component's props.
    const fileExports = entries.filter((x) => x.path === file).map((x) => x.export);
    const aliasBase = alias.name.text.replace(/Props$/, "");
    // One-alias files share everything (rows AND the full name set).
    const share = (exp) => {
      byExport[exp] = [...props.values()];
      allNames[exp] = [...names].sort();
    };
    if (aliases.length === 1) {
      for (const exp of fileExports) share(exp);
    } else if (fileExports.includes(aliasBase)) {
      share(aliasBase);
    }
  }
}

// Biome formats generated output before writing (c57014a rule): the generator
// and the formatter agree instead of racing, and a stale diff means a real
// change rather than whitespace.
const { execFileSync } = await import("node:child_process");
const raw = `// GENERATED by apps/site/scripts/generate-props.mjs — do not hand-edit.\n// Props extracted from web component Props types via the TypeScript compiler\n// API. Only locally-declared props; intrinsic HTML attributes excluded.\n// Every row carries src (path:line of the extracted declaration) — no value\n// without provenance.\nexport const GENERATED_PROPS: Record<string, Array<{\n  name: string;\n  type: string;\n  required: boolean;\n  src: string;\n  default?: string;\n  note?: string;\n}>> = ${JSON.stringify(byExport, null, 2)};\n`;
const allNamesDecl = `export const ALL_PROP_NAMES: Record<string, string[]> = ${JSON.stringify(allNames, null, 2)};`;
let formatted = `${raw}
${allNamesDecl}
`;
try {
  formatted = execFileSync(
    join(ROOT, "node_modules", ".bin", "biome"),
    ["format", "--stdin-file-path=props.ts"],
    { input: formatted, encoding: "utf8", cwd: ROOT },
  );
} catch {
  // Biome unavailable: keep the unformatted concatenation, never silently
  // drop the ALL_PROP_NAMES declaration by falling back to raw.
}
writeFileSync(join(SITE, "src", "generated", "props.ts"), formatted);

const total = Object.values(byExport).reduce((n, r) => n + r.length, 0);
console.log(
  `generate-props: ${Object.keys(byExport).length} exports, ${total} prop rows -> src/generated/props.ts`,
);
