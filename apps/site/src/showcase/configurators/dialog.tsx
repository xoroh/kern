import { Button, Dialog } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Dialog configurator — the third flagship (Part 4d).
 *
 * Dialog has no variant or size axis (the component doc rules both out, plus
 * `dismissible`), so the knobs are the open-state axis: uncontrolled
 * `defaultOpen` plus Base UI `modal` (default true). Only non-default
 * positions are emitted into the fence; the stage passes everything
 * explicitly, same values object either way.
 *
 * Two deliberate choices, same as Switch: the stage shows the documented
 * anatomy whole — trigger, title, description, close — so the fence teaches
 * it too, and `defaultOpen` is uncontrolled initial state, so the stage
 * remounts on that knob (`key`) and cannot drift from the fence. Opening the
 * dialog traps focus and inerts the page — that is what modal means, and
 * Escape dismisses it; the knob positions describe the next open.
 */
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

export const DIALOG_CONFIGURATOR: ConfiguratorSpec = {
  id: "dialog-knobs",
  title: "Configure the dialog",
  description:
    "Open state is the only axis — open at first paint or not, modal or not. The trigger, title, description and close are part of the pattern, not knobs. An open modal traps focus and inerts the page; Escape dismisses it. The knobs describe the next open (the stage remounts by key): dismissing the live dialog does not flip them back, so a closed stage with open knobs is by design.",
  controls: [
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
    <Dialog.Root
      key={`${openOf(v) ? "open" : "shut"}-${modalOf(v) ? "modal" : "bare"}`}
      defaultOpen={openOf(v)}
      modal={modalOf(v)}
    >
      {/* `render`, not nesting: the trigger already renders a native button,
          so a Button child would be button-in-button (React refuses to
          hydrate that). The render element carries the trigger behaviour. */}
      <Dialog.Trigger
        render={<Button variant="tonal">Open dialog</Button>}
      />
      <Dialog.Content>
        <Dialog.Title>Delete this project?</Dialog.Title>
        <Dialog.Description>
          This removes the project and its build history. It cannot be undone.
        </Dialog.Description>
        <div className="mt-6 flex justify-end gap-2">
          <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
          <Dialog.Close
            render={
              <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
                Delete
              </Button>
            }
          />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  ),
  code: (v) =>
    `<Dialog.Root${rootPropsOf(v)}>\n  <Dialog.Trigger render={<Button variant="tonal">Open dialog</Button>} />\n  <Dialog.Content>\n    <Dialog.Title>Delete this project?</Dialog.Title>\n    <Dialog.Description>\n      This removes the project and its build history. It cannot be undone.\n    </Dialog.Description>\n    <div className="mt-6 flex justify-end gap-2">\n      <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />\n      <Dialog.Close\n        render={\n          <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">\n            Delete\n          </Button>\n        }\n      />\n    </div>\n  </Dialog.Content>\n</Dialog.Root>`,
};
