/**
 * How it works — install, theme, build, in the order a reader does them.
 *
 * This band orients; the getting-started guide instructs, linked once at the
 * end. The step bodies name the real artifacts (per-platform packages, the
 * stylesheet import, the theme studio) rather than linking each one — three
 * doors to the same guide would be wayfinding noise.
 */
import { Kicker } from "../chrome/kicker";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL_LG,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../systems/type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Install",
    body: "One package per platform — @xoroh/kern for the web, @xoroh/kern-native for mobile. Take only what you use.",
  },
  {
    n: "2",
    title: "Theme",
    body: "One stylesheet import sets the CSS vars every component reads. Pick a preset or seed your own in the studio.",
  },
  {
    n: "3",
    title: "Build",
    body: "Render components that wire their own accessibility and resolve the same tokens on both renderers.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="px-4 py-4 sm:px-6 sm:py-6"
      aria-labelledby="how-it-works-heading"
    >
      <div className="rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
        <header className="flex flex-col gap-3">
          <Kicker>How it works</Kicker>
          <h2 id="how-it-works-heading" className={`m-0 ${T_SECTION} ${INK}`}>
            Install, theme, build
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Three moves from an empty project to a themed screen. The
            getting-started guide walks each one with snippets compiled against
            the shipped packages.
          </p>
        </header>
        <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5"
            >
              <span
                aria-hidden="true"
                className={`flex size-8 items-center justify-center rounded-full bg-(--md-sys-color-secondary-container) ${T_LABEL_LG} text-(--md-sys-color-on-secondary-container)`}
              >
                {step.n}
              </span>
              <p className={`m-0 ${T_SMALL_TITLE} ${INK}`}>{step.title}</p>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className={`m-0 mt-6 ${T_BODY} ${INK_SOFT}`}>
          <a
            href="/getting-started"
            className={`${T_LABEL_LG} text-(--md-sys-color-primary) no-underline hover:underline`}
          >
            Walk the guide →
          </a>
        </p>
      </div>
    </section>
  );
}
