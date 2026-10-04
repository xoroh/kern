import type { ReactNode } from "react";
import { useState } from "react";
import { T_BODY_SM, T_CODE, T_LEAD } from "../type-scale";

/**
 * The Configurator tier — Part 4b (Mantine pattern, minimal in-repo harness).
 *
 * An Example shows one fixed thing; a Configurator lets the reader turn the
 * knobs. One live component from the package, a control per prop, and the
 * source that the current knob positions produce. The code string is built
 * from the SAME values object as the render — never a parallel hand-written
 * copy — so the fence cannot drift from the stage.
 *
 * Flagships first (Button, Switch, Dialog), not all: this harness must prove
 * itself before committing to 100+ configurators. Controls are native inputs
 * on system tokens (no component library needed to configure components).
 */

export type SelectControl = {
  kind: "select";
  /** Prop name — also the codegen key. */
  name: string;
  label: string;
  options: readonly string[];
  default: string;
};

export type BooleanControl = {
  kind: "boolean";
  name: string;
  label: string;
  default: boolean;
};

export type Control = SelectControl | BooleanControl;

export type ConfigValues = Record<string, string | boolean>;

export type ConfiguratorSpec = {
  /** Stable id, React key + deep-linking, same contract as ExampleSpec. */
  id: string;
  title: string;
  description: string;
  controls: readonly Control[];
  /** The live component at these knob positions, straight from the package. */
  render: (values: ConfigValues) => ReactNode;
  /** The source those positions produce — same values object, no second copy. */
  code: (values: ConfigValues) => string;
};

const FRAME =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant)";

const STAGE =
  "flex flex-wrap items-center justify-center gap-4 rounded-(--md-sys-shape-corner-medium) bg-(--md-sys-color-surface-container-low) p-8";

const BODY = `text-(--md-sys-color-on-surface-variant) ${T_BODY_SM}`;
const LABEL = `text-(--md-sys-color-on-surface) ${T_BODY_SM}`;

function defaultsOf(spec: ConfiguratorSpec): ConfigValues {
  const out: ConfigValues = {};
  for (const c of spec.controls) out[c.name] = c.default;
  return out;
}

/** One configurator: controls, live stage, and the source they produce. */
export function Configurator({ spec }: { spec: ConfiguratorSpec }) {
  const [values, setValues] = useState<ConfigValues>(() => defaultsOf(spec));
  const [copied, setCopied] = useState(false);

  function set(name: string, value: string | boolean) {
    setCopied(false);
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function copy() {
    const text = spec.code(values);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className={`${FRAME} m-0 flex flex-col overflow-hidden`}>
      <figcaption className="flex flex-col gap-1 border-b border-(--md-sys-color-outline-variant) px-6 py-4">
        <h3
          id={`configurator-${spec.id}`}
          className={`m-0 ${T_LEAD} text-(--md-sys-color-on-surface)`}
        >
          {spec.title}
        </h3>
        <p className={`m-0 ${BODY}`}>{spec.description}</p>
      </figcaption>

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-(--md-sys-color-outline-variant) px-6 py-4">
        {spec.controls.map((c) =>
          c.kind === "select" ? (
            <label key={c.name} className={`flex flex-col gap-1 ${LABEL}`}>
              {c.label}
              <select
                value={String(values[c.name])}
                onChange={(e) => set(c.name, e.target.value)}
                aria-label={c.label}
                className="rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-2 py-1"
              >
                {c.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label
              key={c.name}
              className={`flex items-center gap-2 ${LABEL} cursor-pointer`}
            >
              <input
                type="checkbox"
                checked={values[c.name] === true}
                onChange={(e) => set(c.name, e.target.checked)}
              />
              {c.label}
            </label>
          ),
        )}
      </div>

      <div className={STAGE}>{spec.render(values)}</div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between border-y border-(--md-sys-color-outline-variant) px-4 py-1">
          <span className={BODY}>Code</span>
          <button
            type="button"
            onClick={copy}
            className={`rounded-(--md-sys-shape-corner-small) px-2 py-1 ${T_BODY_SM} text-(--md-sys-color-primary) hover:bg-(--md-sys-color-primary-container)`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre
          className={`m-0 overflow-x-auto bg-(--md-sys-color-surface-container-high) p-6 ${T_CODE} text-(--md-sys-color-on-surface)`}
        >
          <code>{spec.code(values)}</code>
        </pre>
      </div>
    </figure>
  );
}
