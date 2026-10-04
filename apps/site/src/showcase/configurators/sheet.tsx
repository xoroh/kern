import { Button, Sheet } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Sheet configurator — the fourth Part-4 configurator (Part 4e), first past
 * the Button/Switch/Dialog flagships and the first to exercise the harness's
 * `select` control: `side` ("right" | "left", default "right") on
 * `SheetContent`, plus the open-state axis (`defaultOpen` + Base UI `modal`)
 * on `SheetRoot`. Sheet has no variant, size, or `dismissible` axis (the
 * component doc rules all three out), so these three knobs are the whole
 * surface. Only non-default positions are emitted into the fence; the stage
 * passes everything explicitly, same values object either way.
 *
 * Two deliberate choices, same as Dialog: the stage shows the documented
 * anatomy whole — trigger, title, description, close — so the fence teaches
 * it too, and `defaultOpen` is uncontrolled initial state, so the stage
 * remounts on every knob (`key`) and cannot drift from the fence. The knobs
 * describe the next open: dismissing the live sheet with Escape or a scrim
 * click does not flip them back, so a closed stage with open knobs is by
 * design. `SheetContent` takes `modal` (default true, per `f8b257f`) and it
 * MUST track the root — so the stage and the fence thread it explicitly,
 * same as Dialog.
 */
function sideOf(v: ConfigValues): "right" | "left" {
  return v.side === "left" ? "left" : "right";
}

function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function modalOf(v: ConfigValues): boolean {
  return v.modal !== false;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (openOf(v)) out.push("defaultOpen");
  if (!modalOf(v)) out.push("modal={false}");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

function contentPropsOf(v: ConfigValues): string {
  return (
    (sideOf(v) === "left" ? ' side="left"' : "") +
    (!modalOf(v) ? " modal={false}" : "")
  );
}

export const SHEET_CONFIGURATOR: ConfiguratorSpec = {
  id: "sheet-knobs",
  title: "Configure the sheet",
  description:
    "Placement plus open state — which edge the panel enters from, open at first paint or not, modal or not. The trigger, title, description and close are part of the pattern, not knobs. An open modal sheet traps focus and inerts the page; Escape or a scrim click dismisses it. The knobs describe the next open (the stage remounts by key): dismissing the live sheet does not flip them back, so a closed stage with open knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "side",
      label: "Side",
      options: ["right", "left"],
      default: "right",
    },
    {
      kind: "boolean",
      name: "defaultOpen",
      label: "Open (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "modal",
      label: "Modal",
      default: true,
    },
  ],
  render: (v) => (
    <Sheet.Root
      key={`${openOf(v) ? "open" : "shut"}-${modalOf(v) ? "modal" : "bare"}-${sideOf(v)}`}
      defaultOpen={openOf(v)}
      modal={modalOf(v)}
    >
      {/* `render`, not nesting: the trigger already renders a native button,
          so a Button child would be button-in-button (React refuses to
          hydrate that). The render element carries the trigger behaviour. */}
      <Sheet.Trigger render={<Button variant="tonal">Open sheet</Button>} />
      <Sheet.Content side={sideOf(v)} modal={modalOf(v)}>
        <Sheet.Title>Filters</Sheet.Title>
        <Sheet.Description>Narrow the result set.</Sheet.Description>
        <Sheet.Close render={<Button variant="ghost">Close</Button>} />
      </Sheet.Content>
    </Sheet.Root>
  ),
  code: (v) =>
    `<Sheet.Root${rootPropsOf(v)}>\n  <Sheet.Trigger render={<Button variant="tonal">Open sheet</Button>} />\n  <Sheet.Content${contentPropsOf(v)}>\n    <Sheet.Title>Filters</Sheet.Title>\n    <Sheet.Description>\n      Narrow the result set.\n    </Sheet.Description>\n    <Sheet.Close render={<Button variant="ghost">Close</Button>} />\n  </Sheet.Content>\n</Sheet.Root>`,
};
