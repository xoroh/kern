import type { ComponentDoc } from "../types";

export const slider: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  oneLiner:
    "Sliders pick a value from a range by feel, showing where it sits along the way.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/sliders",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Slider",
    // No variant axis. The value is the axis.
    variants: [],
    // M3 places "slider" at resting level 0, and level 0 is `shadow: none`.
    // kern ships no elevation token on Slider, which is the conformant state —
    // the gate asserts the absence, so adding an unearned shadow later fails.
    elevation: 0,
  },
  parts: ["Slider", "SliderRoot", "SliderThumb", "SliderLabel", "SliderValue"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Arrow keys",
      action: "Moves the handle by one step. PageUp/PageDown jump further.",
    },
    {
      key: "Home / End",
      action: "Jumps to the minimum or maximum value.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the slider. Disabled sliders are skipped.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The active track and the thumb are the primary roles, so a theme moves every slider at once.",
      "State is exposed as `data-disabled` and the primitive's own attributes, so a stylesheet can restyle without new props.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One thickness, one treatment.",
      "There is no `orientation` prop. This is a horizontal slider; a vertical one is the root's `className` and its own layout.",
      "There is no `showValue` boolean. The value is its own part — render `SliderValue` where you want it and omit it where you do not.",
    ],
  },
  api: [
    {
      name: "value",
      for: ["SliderRoot"],
      type: "number | number[]",
      note: "Controlled value on `SliderRoot`. A single number for one thumb, an array for a range with two — the shape says whether you are picking a point or a span.",
    },
    {
      name: "defaultValue",
      for: ["SliderRoot"],
      type: "number | number[]",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["SliderRoot"],
      type: "(value, eventDetails: object) => void",
      note: "Fires as the value moves, including while dragging.",
    },
    {
      name: "min",
      for: ["SliderRoot"],
      type: "number",
      note: "Lower end of the track.",
    },
    {
      name: "max",
      for: ["SliderRoot"],
      type: "number",
      note: "Upper end of the track.",
    },
    {
      name: "step",
      for: ["SliderRoot"],
      type: "number",
      note: "How fine the movement is, and how far one arrow key press travels. Set it to the smallest difference that matters.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["SliderRoot", "SliderThumb"],
      type: "boolean",
      note: "Blocks interaction and dims the control.",
    },
    {
      name: "format",
      for: ["SliderRoot"],
      type: "NumberFormatOptions | undefined",
      note: "Options for `Intl.NumberFormat` when rendering the value. The locale comes from `locale`.",
    },
    {
      name: "locale",
      for: ["SliderRoot"],
      type: "LocalesArgument",
      note: "Locale for `Intl.NumberFormat` when rendering the value. Defaults to the runtime locale.",
    },
    {
      name: "minStepsBetweenValues",
      for: ["SliderRoot"],
      type: "number | undefined",
      note: "Minimum steps kept between thumbs on a range slider. Thumbs cannot be dragged closer than this.",
    },
    {
      name: "name",
      for: ["SliderRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "form",
      for: ["SliderRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the slider inputs, so the control can live outside the `<form>` and still submit with it.",
    },
    {
      name: "orientation",
      for: ["SliderRoot"],
      type: "Orientation | undefined",
      note: "Whether the track runs horizontal or vertical.",
    },
    {
      name: "largeStep",
      for: ["SliderRoot"],
      type: "number | undefined",
      note: "Step jumped by Page Up/Page Down or Shift+Arrow. Fine adjust stays on the arrow keys.",
    },
    {
      name: "thumbAlignment",
      for: ["SliderRoot"],
      type: '"center" | "edge" | "edge-client-only" | undefined',
      note: "How thumbs sit against the track ends at min/max: centered on the edge, inset inside it, or the inset rendered client-side only to trim the server bundle.",
    },
    {
      name: "thumbCollisionBehavior",
      for: ["SliderRoot"],
      type: '"none" | "push" | "swap" | undefined',
      note: "What range thumbs do on contact while dragging: stop (`none`), push each other without snapping back (`push`, default), or trade places (`swap`).",
    },
    {
      name: "onValueCommitted",
      for: ["SliderRoot"],
      type: "((value: number | readonly number[], eventDetails: SliderRootCommitEventDetails) => void) | undefined",
      note: "Fires when a value change commits — drag, track press, keyboard, or hidden-input change — with a `reason` saying which. Skips unchanged or cancelled changes. Where persistence belongs, not in `onValueChange`.",
    },
    {
      name: "ref",
      for: ["SliderRoot"],
      type: "Ref<HTMLDivElement> | undefined",
      note: "Ref to the root element. For per-thumb access use `inputRef` on the thumb.",
    },
    {
      name: "tabIndex",
      for: ["SliderThumb"],
      type: "number | undefined",
      note: "Tab index forwarded to the thumb's hidden input. Leave unset for the natural order.",
    },
    {
      name: "aria-valuetext",
      for: ["SliderThumb"],
      type: "string | undefined",
      note: "Spoken value forwarded to the input's `aria-valuetext`. Ignored when `getAriaValueText` computes it. A bare number is announced as-is; this is where units live.",
    },
    {
      name: "onFocus",
      for: ["SliderThumb"],
      type: "FocusEventHandler<HTMLInputElement> | undefined",
      note: "Focus handler forwarded to the thumb's hidden input.",
    },
    {
      name: "onBlur",
      for: ["SliderThumb"],
      type: "FocusEventHandler<HTMLInputElement> | undefined",
      note: "Blur handler forwarded to the thumb's hidden input.",
    },
    {
      name: "onKeyDown",
      for: ["SliderThumb"],
      type: "KeyboardEventHandler<HTMLInputElement> | undefined",
      note: "Keydown handler forwarded to the thumb's hidden input. Arrow-key stepping is built in; this is for the rest.",
    },
    {
      name: "inputRef",
      for: ["SliderThumb"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the thumb's hidden input element.",
    },
    {
      name: "index",
      for: ["SliderThumb"],
      type: "number | undefined",
      note: "Which value in the array this thumb owns. Required for server-rendered range sliders so hydration matches without measuring the DOM.",
    },
    {
      name: "getAriaValueText",
      for: ["SliderThumb"],
      type: "((formattedValue: string, value: number, index: number) => string) | null | undefined",
      note: "Computes the spoken value for the input's `aria-valuetext` — what screen reader users hear instead of the bare number. Receives the formatted string, the raw value and the thumb index.",
    },
    {
      name: "getAriaLabel",
      for: ["SliderThumb"],
      type: "((index: number) => string) | null | undefined",
      note: "Computes the `aria-label` for the thumb's input, so each thumb in a range names itself.",
    },
    {
      name: "children",
      for: ["SliderValue"],
      type: "((formattedValues: readonly string[], values: readonly number[]) => ReactNode) | null | undefined",
      note: "How the value label renders: a function receiving the formatted strings (after `format` and `locale`) and the raw numbers.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `SliderRootState` on the root, `SliderThumbState` on a thumb, `SliderRootState` on the label, `SliderValueState` on the value.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
  ],
  aria: [
    "The thumb is a slider-role control with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so its position is announced as a number rather than a pixel.",
    "Arrow keys move by one step, Page Up/Down by a larger jump, Home and End to the extremes — the WAI-ARIA slider pattern.",
    "`SliderLabel` names it and `SliderValue` shows the number, so the value is available both visually and to assistive tech.",
    "Dragging works, but every value is reachable by keyboard too — a slider that is pointer-only is unusable for many people.",
  ],
};
