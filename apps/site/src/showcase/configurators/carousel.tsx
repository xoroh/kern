import { Carousel } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Carousel configurator — the thirty-eighth Part-4 configurator
 * (move #38). Three genuine knobs: initial slide (`defaultIndex` select —
 * the painted-verify axis), `wrap` (clamped ends vs wrap-around), and
 * `showIndicators` (dot navigation on/off). Everything else is fixed
 * anatomy or caller wiring by design: `items` are the caller's content,
 * controlled `index` + `onIndexChange` are wiring not knobs, `label` and
 * `itemLabels` are strings not variations, and `disabled` freezes the
 * very interaction the stage exists to show. The stage shows the
 * documented anatomy whole — three slides with the middle mounted — so
 * the fence teaches it too. The stage remounts by key on the knobs so it
 * cannot drift from the fence.
 */
const SLIDES = ["One", "Two", "Three"];

function indexOf(v: ConfigValues): number {
  const n = Number(v.index);
  return n >= 0 && n < SLIDES.length ? n : 0;
}

function wrapOf(v: ConfigValues): boolean {
  return v.wrap === true;
}

function indicatorsOf(v: ConfigValues): boolean {
  return v.indicators === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (indexOf(v) !== 0) out.push(`defaultIndex={${indexOf(v)}}`);
  if (wrapOf(v)) out.push("wrap");
  if (indicatorsOf(v)) out.push("showIndicators");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const CAROUSEL_CONFIGURATOR: ConfiguratorSpec = {
  id: "carousel-knobs",
  title: "Configure the carousel",
  description:
    "Which slide mounts first, clamped ends or wrap-around, dots or not. Exactly one slide shows at a time — the rest stay mounted but hidden. The knobs describe the next mount (the stage remounts by key): driving the live controls does not flip them back, so a moved stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "index",
      label: "Initial slide",
      options: ["0", "1", "2"],
      default: "0",
    },
    {
      kind: "boolean",
      name: "wrap",
      label: "Wrap around ends",
      default: false,
    },
    {
      kind: "boolean",
      name: "indicators",
      label: "Dot indicators",
      default: false,
    },
  ],
  render: (v) => (
    <Carousel
      key={`${indexOf(v)}-${wrapOf(v) ? "wrap" : "clamp"}-${indicatorsOf(v) ? "dots" : "nodots"}`}
      items={SLIDES.map((s) => <p key={s}>{s}</p>)}
      defaultIndex={indexOf(v)}
      wrap={wrapOf(v)}
      showIndicators={indicatorsOf(v)}
    />
  ),
  code: (v) =>
    `<Carousel${rootPropsOf(v)}>\n  items={[<p key="a">One</p>, <p key="b">Two</p>, <p key="c">Three</p>]}\n</Carousel>\n\n// items are the caller's content; controlled index + onIndexChange are wiring.\n// disabled freezes the interaction the stage exists to show.`,
};
