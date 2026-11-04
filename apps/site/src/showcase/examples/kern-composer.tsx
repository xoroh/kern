import {
  Button,
  ComposerAttachmentTray,
  ComposerCannedPicker,
  ComposerModeBar,
  ComposerReplyBar,
  InviteAccept,
  KernComposer,
  ShareLinkRow,
} from "@xoroh/kern";
import { useState } from "react";
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
  cannedInserts={[{ id: "eta", title: "Delay notice", body: "Late." }]}
  onSend={() => {}}
/>`,
  },
];
export const INVITE_ACCEPT_EXAMPLES: ExampleSpec[] = [
  {
    id: "invite-accept",
    title: "Invite review",
    description:
      "MS-037 invite review — role picker plus an optional note, composed on the overlay.",
    render: function InviteAcceptDemo() {
      const [open, setOpen] = useState(false);
      return (
        <div className="w-full max-w-xl">
          <Button variant="tonal" onClick={() => setOpen(true)}>
            Review invite
          </Button>
          <InviteAccept
            open={open}
            onOpenChange={setOpen}
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
        </div>
      );
    },
    code: `<InviteAccept
  invite={{ workspaceName: "Acme", inviterName: "Faroeq", role: "Dispatcher" }}
  roleOptions={[{ value: "driver", label: "Driver" }]}
  onAccept={() => {}}
/>`,
  },
];
export const SHARE_LINK_ROW_EXAMPLES: ExampleSpec[] = [
  {
    id: "share-link-row",
    title: "Scoped share link",
    description:
      "MS-005/MS-024 share row — scope picker, copy, and revoke behind a confirm.",
    render: () => (
      <div className="w-full max-w-xl">
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
    code: `<ShareLinkRow
  link={{ id: "l1", label: "Trip 42", url: "https://go.example/t/42", scope: "View" }}
  scopes={[{ value: "view", label: "View only" }]}
  onCopy={() => {}}
  onRevoke={() => {}}
/>`,
  },
];
export const COMPOSER_MODE_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "composer-mode-bar",
    title: "Visibility modes",
    description:
      "Public, internal, note — real radios in one group, so arrow-key travel comes free.",
    render: () => (
      <div className="w-full max-w-xl">
        <ComposerModeBar defaultMode="internal" />
      </div>
    ),
    code: `<ComposerModeBar defaultMode="internal" onModeChange={() => {}} />`,
  },
];
export const COMPOSER_REPLY_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "composer-reply-bar",
    title: "Quoted reply strip",
    description: "Author plus excerpt with a real-button dismiss.",
    render: () => (
      <div className="w-full max-w-xl">
        <ComposerReplyBar
          replyTo={{ author: "Ada", excerpt: "Running 10 minutes late." }}
        />
      </div>
    ),
    code: `<ComposerReplyBar
  replyTo={{ author: "Ada", excerpt: "Running late." }}
  onDismissReply={() => {}}
/>`,
  },
];
export const COMPOSER_ATTACHMENT_TRAY_EXAMPLES: ExampleSpec[] = [
  {
    id: "composer-attachment-tray",
    title: "Attachment chips",
    description: "One chip per file with a real remove button each.",
    render: () => (
      <div className="w-full max-w-xl">
        <ComposerAttachmentTray
          attachments={[{ id: "a1", label: "invoice.pdf" }]}
        />
      </div>
    ),
    code: `<ComposerAttachmentTray
  attachments={[{ id: "a1", label: "invoice.pdf" }]}
  onRemoveAttachment={() => {}}
/>`,
  },
];
export const COMPOSER_CANNED_PICKER_EXAMPLES: ExampleSpec[] = [
  {
    id: "composer-canned-picker",
    title: "Canned inserts",
    description:
      "The picker's rows are the option buttons; insertion into the draft stays host-owned.",
    render: () => (
      <div className="w-full max-w-xl">
        <ComposerCannedPicker
          inserts={[
            { id: "eta", title: "Delay notice", body: "Running late." },
          ]}
        />
      </div>
    ),
    code: `<ComposerCannedPicker
  inserts={[{ id: "eta", title: "Delay notice", body: "Running late." }]}
  onCannedSelect={() => {}}
/>`,
  },
];
