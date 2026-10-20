/**
 * Per-demo export + minimal-repro template (demo DX).
 *
 * WHAT IT IS: two pure string builders over an ExampleSpec's `code` fence.
 * `demoExportSource` turns one demo into a standalone copyable module;
 * `demoReproSource` turns it into a minimal bug-report template. Both run in
 * the Example frame's Code panel as one-click copy buttons, so every docs
 * demo is independently openable (permalink anchor on the frame) and
 * copyable without touching the frame's stage.
 *
 * IMPORTS ARE DERIVED, NOT AUTHORED: the import lines are collected from the
 * capitalized JSX tags the fence itself uses (`<MenuRoot>` → `MenuRoot`,
 * `<Field.Root>` → `Field`), so the export cannot drift from the fence the
 * way a hand-written header would. `<Icon>` resolves to `@xoroh/kern-icons`;
 * everything else resolves to `@xoroh/kern`.
 *
 * BOUNDARY (stated, not implied): the live registry demos
 * (`src/demos/web/*` — PreviewStack functions with no source fence) have no
 * code to export. The Example tier is the copyable tier by design; a stage
 * with no fence exports nothing rather than an invented one.
 */

type DemoSource = {
  id: string;
  title: string;
  code?: string;
  /**
   * The package the fence's components live in. Defaults to the web barrel;
   * a native example declares `@xoroh/kern-native`. See `ExampleSpec.package`.
   */
  package?: string;
};

/** Capitalized JSX tags used in a fence, minus Icon (its own package). */
function usedComponents(code: string): string[] {
  const names = new Set<string>();
  for (const match of code.matchAll(/<\/?([A-Z][A-Za-z0-9]*)/g)) {
    names.add(match[1]);
  }
  names.delete("Icon");
  return [...names].sort();
}

function usesIcon(code: string): boolean {
  return /<\/?Icon[\s>/]/.test(code);
}

/** `error-actions` → `ErrorActionsDemo`. Falls back, never emits invalid JS. */
function componentName(id: string): string {
  const parts = id.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (parts.length === 0) return "KernDemo";
  const name = `${parts
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("")}Demo`;
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : "KernDemo";
}

function indent(code: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line.trim() ? `${pad}${line}` : line))
    .join("\n");
}

function importLines(code: string, pkg: string): string[] {
  const lines: string[] = [];
  const imports = usedComponents(code);
  if (imports.length > 0) {
    lines.push(`import { ${imports.join(", ")} } from "${pkg}";`);
  }
  if (usesIcon(code)) {
    lines.push(`import { Icon } from "@xoroh/kern-icons";`);
  }
  return lines;
}

function installComment(code: string, pkg: string): string[] {
  // The installable package, not the import path: `@xoroh/kern/start` is an
  // EXPORT SUBPATH of the `@xoroh/kern` package, and `bun add @xoroh/kern/start`
  // is a command that fails. The comment teaches a command that works.
  const segments = pkg.split("/");
  const installable = pkg.startsWith("@")
    ? segments.slice(0, 2).join("/")
    : segments[0];
  return [
    `// Paste into a React + Tailwind project with the packages installed:`,
    `//   bun add ${installable}${usesIcon(code) ? " @xoroh/kern-icons" : ""}`,
    `// and \`@import "@xoroh/kern/theme";\` once in your CSS entry.`,
  ];
}

/**
 * One demo as a standalone module: derived imports plus the fence as the
 * body of a named function. Sibling roots are wrapped in a fragment, so what
 * copies is what renders.
 *
 * The import line follows the spec's `package`: the web barrel by default,
 * `@xoroh/kern-native` for a native example. Resolving the fence's tags
 * against the web barrel alone would hand a reader a module that does not
 * compile, because the web barrel exports no native-only component.
 */
export function demoExportSource(spec: DemoSource): string {
  const code = (spec.code ?? "").trim();
  if (!code) return "";
  const pkg = spec.package ?? "@xoroh/kern";
  return [
    `// ${spec.title} — kern docs demo export (example "${spec.id}").`,
    ...installComment(code, pkg),
    ...importLines(code, pkg),
    ``,
    `export function ${componentName(spec.id)}() {`,
    `  return (`,
    `    <>`,
    indent(code, 6),
    `    </>`,
    `  );`,
    `}`,
    ``,
  ].join("\n");
}

/**
 * One demo as a minimal bug-report template: the same derived module, plus
 * the prompts a report needs (Expected / Actual / Environment) so the
 * reporter fills blanks instead of inventing structure.
 */
export function demoReproSource(spec: DemoSource): string {
  const code = (spec.code ?? "").trim();
  if (!code) return "";
  const pkg = spec.package ?? "@xoroh/kern";
  return [
    `// Minimal repro — ${spec.title} (example "${spec.id}").`,
    `// 1. Fresh Vite + React + Tailwind app; install + theme import as below.`,
    `// 2. Render <Repro /> instead of <App />; confirm the bug is still visible.`,
    `// 3. Fill in Expected / Actual / Environment, then paste this whole file into the issue.`,
    ...installComment(code, pkg),
    ...importLines(code, pkg),
    ``,
    `export function Repro() {`,
    `  return (`,
    `    <>`,
    indent(code, 6),
    `    </>`,
    `  );`,
    `}`,
    ``,
    `// Expected: <what you expected to see>`,
    `// Actual: <what you saw instead>`,
    `// kern: <version> · react: <version> · browser/OS: <...>`,
    ``,
  ].join("\n");
}
