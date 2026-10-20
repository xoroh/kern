import { Carousel } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Carousel examples — a bounded set of items, one shown at a time.
 *
 * The point of this example is what the component REFUSES to do: there is no
 * `autoplay` prop, because motion that moves content out from under a reader
 * is an accessibility failure, not an enhancement. A host that wants one
 * composes it outside the component.
 *
 * WEB composition. The native carousel takes a different item shape, so the
 * mobile page carries its own live demo.
 */
export const CAROUSEL_EXAMPLES: ExampleSpec[] = [
  {
    id: "carousel-slides",
    title: "A bounded set of slides, one shown at a time",
    description:
      "Each slide carries its own accessible name and its position, and only the active slide is exposed to assistive technology — a hidden slide that is still announced reads as duplicate content.",
    render: () => (
      <Carousel
        label="Release notes"
        showIndicators
        items={[
          <div
            key="green"
            className="flex h-32 items-center justify-center rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container) p-6"
          >
            Build 482 is green.
          </div>,
          <div
            key="lint"
            className="flex h-32 items-center justify-center rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container) p-6"
          >
            Build 481 failed on lint.
          </div>,
        ]}
      />
    ),
    code: `<Carousel
  label="Release notes"
  showIndicators
  items={[
    <div key="green" className="p-6">Build 482 is green.</div>,
    <div key="lint" className="p-6">Build 481 failed on lint.</div>,
  ]}
/>`,
  },
];
