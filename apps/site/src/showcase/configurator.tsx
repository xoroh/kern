import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  T_BODY_SM,
  T_CODE,
  T_LEAD,
} from "../domains/shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  MIN_TARGET,
  STAGE as STAGE_TOKEN,
  TRANSITION,
} from "../domains/shared/systems/ui";
import { CopyButton } from "./copy-button";

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

/**
 * The demo stage — the kit's one STAGE tone plus the shared demo layout, so
 * a configurator stage never reads as a different component from an Example
 * stage. Flat by law: no texture, no gradient.
 */
const STAGE = `flex flex-wrap items-center justify-center gap-4 p-8 ${STAGE_TOKEN}`;

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
  const rootRef = useRef<HTMLElement>(null);

  function set(name: string, value: string | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  // Adopt pre-hydration knob positions. A reader who turns a knob before
  // React hydrates flips the SSR HTML with no listener attached yet — the
  // knob would show one thing and the values object another, and the stage
  // and fence would never follow. Knobs are uncontrolled so the DOM stays
  // their source of truth; this mount effect reads it into values once
  // hydration lands. Post-hydration every turn flows through `set` above,
  // and nothing else writes values, so the two cannot diverge afterwards.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const next: ConfigValues = {};
    let touched = false;
    for (const c of spec.controls) {
      const el = root.querySelector(`[data-knob="${c.name}"]`);
      if (c.kind === "select" && el instanceof HTMLSelectElement) {
        if (el.value !== c.default) {
          next[c.name] = el.value;
          touched = true;
        }
      } else if (c.kind === "boolean" && el instanceof HTMLInputElement) {
        if (el.checked !== c.default) {
          next[c.name] = el.checked;
          touched = true;
        }
      }
    }
    if (touched) setValues((v) => ({ ...v, ...next }));
  }, [spec]);

  return (
    <figure
      ref={rootRef}
      className={`${CARD} m-0 flex flex-col overflow-hidden`}
    >
      <figcaption className="flex flex-col gap-1 border-b border-(--md-sys-color-outline-variant) px-6 py-4">
        <h3
          id={`configurator-${spec.id}`}
          className={`m-0 ${T_LEAD} text-(--md-sys-color-on-surface)`}
        >
          {spec.title}
          {/*
            Per-demo permalink, same contract as Example's: this anchor is the
            configurator's address, always visible rather than hover-revealed.
          */}
          <a
            href={`#configurator-${spec.id}`}
            aria-label={`Permalink to ${spec.title}`}
            title="Permalink to this configurator"
            className={`ml-2 inline-flex items-center text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface) ${TRANSITION} ${FOCUS_RING}`}
          >
            #
          </a>
        </h3>
        <p className={`m-0 ${BODY}`}>{spec.description}</p>
      </figcaption>

      {/*
        Knob rows: every row is a MIN_TARGET (≥48dp). The select is 48dp tall
        on its own, because a <select> does not open from a label click — the
        control itself has to meet the floor; the checkbox keeps its explicit
        non-shrinking square and leans on the wrapping 48dp label row as its
        click target. Caption and control sit in one row so selects and
        checkboxes share the same baseline.
      */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-(--md-sys-color-outline-variant) px-6 py-4">
        {spec.controls.map((c) =>
          c.kind === "select" ? (
            <label key={c.name} className={`${MIN_TARGET} gap-3 ${LABEL}`}>
              {c.label}
              <select
                data-knob={c.name}
                defaultValue={c.default}
                onChange={(e) => set(c.name, e.target.value)}
                aria-label={c.label}
                className={`h-12 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-3 ${FOCUS_RING}`}
              >
                {c.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            // The box is an explicit square that never shrinks in the flex
            // row, and it inherits the root color-scheme (set by the theme
            // init + useKernTheme), so the native face follows dark mode
            // instead of painting a light control on a dark stage. The
            // wrapping 48dp label row is the click target.
            <label key={c.name} className={`${MIN_TARGET} gap-3 ${LABEL}`}>
              {c.label}
              <input
                type="checkbox"
                data-knob={c.name}
                defaultChecked={c.default}
                onChange={(e) => set(c.name, e.target.checked)}
                className={`size-5 shrink-0 cursor-pointer accent-(--md-sys-color-primary) ${FOCUS_RING}`}
              />
            </label>
          ),
        )}
      </div>

      <div className={STAGE}>{spec.render(values)}</div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between border-y border-(--md-sys-color-outline-variant) px-4 py-1">
          <span className={BODY}>Code</span>
          <CopyButton text={spec.code(values)} />
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
