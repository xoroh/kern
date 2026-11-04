import { Button, KernOverlay } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * KernOverlay examples — ONE overlay system: modal, sheet, drawer,
 * side-sheet, alert, tabbed-dialog, dock. Trigger opens, title names the
 * surface, Escape always dismisses; the × renders only with `onClose`.
 */
export const KERN_OVERLAY_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-overlay-modal",
    title: "Modal with footer actions",
    description:
      "Centered dialog, trigger opens, footer carries the decision. Alert keeps the M3 2-action law: one confirm plus one dismiss.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <KernOverlay
          variant="modal"
          title="Invite driver"
          description="The driver gets a link scoped to this workspace."
          trigger={<Button variant="tonal">Invite driver</Button>}
          onClose={() => {}}
          footer={<button type="button">Send invite</button>}
        >
          Invite details go here.
        </KernOverlay>
        <KernOverlay
          variant="alert"
          title="Revoke this link?"
          description="Recipients lose access immediately. This cannot be undone."
          trigger={<Button variant="tonal">Revoke link</Button>}
          footer={<button type="button">Revoke</button>}
        />
      </div>
    ),
    code: `<KernOverlay
  variant="modal"
  title="Invite driver"
  description="The driver gets a link scoped to this workspace."
  trigger={<Button variant="tonal">Invite driver</Button>}
  onClose={() => {}}
  footer={<button type="button">Send invite</button>}
>
  Invite details go here.
</KernOverlay>`,
  },
  {
    id: "kern-overlay-tabbed-dialog",
    title: "Tabbed dialog scaffold",
    description:
      "One modal with a tab strip under the title — the scaffold the avatar-tab copies converge onto. Tab labels accept any node.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <KernOverlay
          variant="tabbed-dialog"
          title="Workspace"
          trigger={<Button variant="tonal">Open settings</Button>}
          onClose={() => {}}
          tabs={[
            { key: "general", label: "General", panel: "General pane." },
            { key: "members", label: "Members", panel: "Members pane." },
          ]}
        />
      </div>
    ),
    code: `<KernOverlay
  variant="tabbed-dialog"
  title="Workspace"
  trigger={<Button variant="tonal">Open settings</Button>}
  onClose={() => {}}
  tabs={[
    { key: "general", label: "General", panel: "General pane." },
    { key: "members", label: "Members", panel: "Members pane." },
  ]}
/>`,
  },
];
