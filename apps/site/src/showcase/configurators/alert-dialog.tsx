import { AlertDialog, Button } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * AlertDialog configurator — the twenty-ninth Part-4 configurator
 * (move #32), last of the dialog family past Dialog (move #1) and Sheet
 * (move #4). One genuine knob: `open` (whether the dialog mounts open —
 * the painted-verify axis; shut by default behind its trigger).
 * Everything else is fixed anatomy or app wiring by design: ALWAYS modal
 * (the Root type strips `modal` and `disablePointerDismissal` — there is
 * nothing to configure), and `handle`/`actionsRef`/`onOpenChange`/
 * `triggerId` are imperative or callbacks, not knobs. The stage shows the
 * documented anatomy whole — danger trigger, title, description, Cancel
 * ghost plus Delete danger closes — so the fence teaches it too. The
 * stage remounts by key on the knob so it cannot drift from the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.open === true;
}

function rootPropsOf(v: ConfigValues): string {
  return openOf(v) ? " defaultOpen" : "";
}

export const ALERT_DIALOG_CONFIGURATOR: ConfiguratorSpec = {
  id: "alert-dialog-knobs",
  title: "Configure the alert dialog",
  description:
    "Open at first paint, or shut behind its trigger. An alert dialog is always modal — unlike the dialog and the sheet there is no modal knob to turn off, which is the point: destructive confirmation keeps focus inside until it is answered. The knob describes the next mount (the stage remounts by key): answering the live dialog does not flip it back, so an answered stage with an untouched knob is by design.",
  controls: [
    {
      kind: "boolean",
      name: "open",
      label: "Open (initial state)",
      default: false,
    },
  ],
  render: (v) => (
    <AlertDialog.Root key={openOf(v) ? "open" : "shut"} defaultOpen={openOf(v)}>
      <AlertDialog.Trigger
        render={
          <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
            Delete project
          </Button>
        }
      />
      <AlertDialog.Content>
        <AlertDialog.Title>Delete this project?</AlertDialog.Title>
        <AlertDialog.Description>
          The project and its build history are removed. This cannot be undone.
        </AlertDialog.Description>
        <div className="mt-6 flex justify-end gap-2">
          <AlertDialog.Close render={<Button variant="ghost">Cancel</Button>} />
          <AlertDialog.Close
            render={
              <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
                Delete
              </Button>
            }
          />
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
  code: (v) =>
    `<AlertDialog.Root${rootPropsOf(v)}>\n  <AlertDialog.Trigger render={<Button>Delete project</Button>} />\n  <AlertDialog.Content>\n    <AlertDialog.Title>Delete this project?</AlertDialog.Title>\n    <AlertDialog.Description>\n      The project and its build history are removed. This cannot be undone.\n    </AlertDialog.Description>\n    <AlertDialog.Close render={<Button variant="ghost">Cancel</Button>} />\n    <AlertDialog.Close render={<Button>Delete</Button>} />\n  </AlertDialog.Content>\n</AlertDialog.Root>\n\n// Always modal: Root strips modal and disablePointerDismissal by design.\n// handle/actionsRef/onOpenChange/triggerId are app wiring, not props here.`,
};
