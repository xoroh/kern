import { useEffect, useState } from "react";
import { T_BODY_SM, T_CODE } from "../../domains/shared/systems/type-scale";
import { CopyButton } from "../../showcase/copy-button";
import { HighlightedCode } from "./highlight";

/**
 * Install picker — the package-manager tabs (shadcn pattern).
 *
 * One component, two homes: the getting-started install step and the
 * per-component Installation block compose it, so the tab order, the
 * commands and the persisted choice can never drift apart. The choice
 * persists per browser under `kern-pkg-manager`.
 *
 * No `kern add` tab: the CLI is unpublished until 0.1.0, so a tab teaching
 * `npx kern add` would teach a failing command. When the CLI publishes, its
 * tab belongs here beside these four.
 */
const MANAGERS = [
  { id: "npm", label: "npm", command: (t: string) => `npm i ${t}` },
  { id: "bun", label: "bun", command: (t: string) => `bun add ${t}` },
  { id: "pnpm", label: "pnpm", command: (t: string) => `pnpm add ${t}` },
  { id: "yarn", label: "yarn", command: (t: string) => `yarn add ${t}` },
] as const;

export type ManagerId = (typeof MANAGERS)[number]["id"];

const CODE = `font-mono ${T_CODE}`;

export function InstallTabs({ target }: { target: string }) {
  const [manager, setManager] = useState<ManagerId>("npm");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("kern-pkg-manager");
      if (stored && MANAGERS.some((m) => m.id === stored)) {
        setManager(stored as ManagerId);
      }
    } catch {
      // Private mode / SSR: default npm stands.
    }
  }, []);
  function choose(id: ManagerId) {
    setManager(id);
    try {
      window.localStorage.setItem("kern-pkg-manager", id);
    } catch {
      // Choice still applies for the session.
    }
  }
  const command =
    MANAGERS.find((m) => m.id === manager)?.command(target) ??
    `npm i ${target}`;
  return (
    <div className="flex flex-col gap-2">
      {/* biome-ignore lint/a11y/useSemanticElements: a package-manager picker group is not a form fieldset */}
      <div
        role="group"
        aria-label="Package manager"
        className="flex flex-wrap gap-1.5"
      >
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={manager === m.id}
            onClick={() => choose(m.id)}
            className={`min-h-12 cursor-pointer rounded-(--sys-shape-corner-full) border px-4 ${T_BODY_SM} ${
              manager === m.id
                ? "border-(--sys-color-primary) bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)"
                : "border-(--sys-color-outline) text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-on-surface)/8 active:bg-(--sys-color-on-surface)/12"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="codeblock flex items-center gap-2">
        <pre
          className={`m-0 flex-1 overflow-x-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high) px-4 py-3 ${CODE} text-(--sys-color-on-surface)`}
        >
          <HighlightedCode code={command} language="bash" />
        </pre>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
