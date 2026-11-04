import { InviteAccept, KernComposer, ShareLinkRow } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Composer examples — one composer, two blocks. The composer merges the
 * desk/mobile/Kern composer forks (mode bar, reply strip, attachments,
 * canned inserts, knowledge flyout, scheduling, draft state, OOO);
 * InviteAccept and ShareLinkRow compose it with the overlay and picker.
 */
export const KERN_COMPOSER_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-composer",
    title: "One composer, every slot",
    description:
      "Enter sends, Shift+Enter keeps the newline. Mode, reply, panels, canned inserts and knowledge travel as slots; scheduling, draft state and out-of-office render only when the host opts in.",
    render: () => (
      <div className="w-full max-w-xl">
        <KernComposer
          replyTo={{ author: "Ada", excerpt: "Running 10 minutes late." }}
          cannedInserts={[
            { id: "eta", title: "Delay notice", body: "Running late." },
          ]}
          draftStatus="unsaved"
        />
      </div>
    ),
    code: `<KernComposer
  replyTo={{ author: "Ada", excerpt: "Running late." }}
  cannedInserts={canned}
  onSend={sendMessage}
/>`,
  },
  {
    id: "kern-composer-blocks",
    title: "Invite accept and share links",
    description:
      "MS-037 invite review (role picker + optional note) and MS-005/MS-024 share rows (scope picker, copy, revoke behind a confirm) — overlay, picker and pill compositions, no new primitives.",
    render: () => (
      <div className="flex w-full max-w-xl flex-col gap-4">
        <InviteAccept
          defaultOpen
          invite={{
            workspaceName: "Acme Taxis",
            inviterName: "Faroeq",
            role: "Dispatcher",
          }}
          roleOptions={[
            { value: "dispatcher", label: "Dispatcher" },
            { value: "driver", label: "Driver" },
          ]}
        />
        <div className="flex flex-col gap-px overflow-hidden rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container)">
          <ShareLinkRow
            link={{
              id: "l1",
              label: "Trip 42 tracking",
              url: "https://go.example/t/42",
              scope: "View only",
            }}
            scopes={[
              { value: "view", label: "View only" },
              { value: "manage", label: "Manage" },
            ]}
          />
        </div>
      </div>
    ),
    code: `<InviteAccept defaultOpen invite={invite} roleOptions={roles} onAccept={accept} />
<ShareLinkRow link={link} onCopy={copy} onRevoke={revoke} />`,
  },
];
