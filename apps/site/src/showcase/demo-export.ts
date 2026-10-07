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

function importLines(code: string): string[] {
  const lines: string[] = [];
  const imports = usedComponents(code);
  if (imports.length > 0) {
    lines.push(`import { ${imports.join(", ")} } from "@xoroh/kern";`);
  }
  if (usesIcon(code)) {
    lines.push(`import { Icon } from "@xoroh/kern-icons";`);
  }
  return lines;
}

function installComment(code: string): string[] {
  return [
    `// Paste into a React + Tailwind project with the packages installed:`,
    `//   bun add @xoroh/kern${usesIcon(code) ? " @xoroh/kern-icons" : ""}`,
    `// and \`@import "@xoroh/kern/theme";\` once in your CSS entry.`,
  ];
}

/**
 * One demo as a standalone module: derived imports plus the fence as the
 * body of a named function. Sibling roots are wrapped in a fragment, so what
 * copies is what renders.
 */
export function demoExportSource(spec: DemoSource): string {
  const code = (spec.code ?? "").trim();
  if (!code) return "";
  return [
    `// ${spec.title} — kern docs demo export (example "${spec.id}").`,
    ...installComment(code),
    ...importLines(code),
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
  return [
    `// Minimal repro — ${spec.title} (example "${spec.id}").`,
    `// 1. Fresh Vite + React + Tailwind app; install + theme import as below.`,
    `// 2. Render <Repro /> instead of <App />; confirm the bug is still visible.`,
    `// 3. Fill in Expected / Actual / Environment, then paste this whole file into the issue.`,
    ...installComment(code),
    ...importLines(code),
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
