/**
 * Invite block — workspace invite accept flow, wired with mock invite.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `InviteAccept` with a
 * realistic invite (workspace, inviter, role, expiry) — copy it, then
 * replace the mock invite and the accept/decline handlers with real calls.
 * The dialog opens from its trigger (never on mount), so embedding this
 * block never hijacks the host page.
 */
import { Button, InviteAccept } from "@xoroh/kern";
import { useState } from "react";

export function InviteBlock({
  onAccept,
  onDecline,
}: {
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>View invite</Button>
      <InviteAccept
        open={open}
        onOpenChange={setOpen}
        invite={{
          workspaceName: "Acme Taxi",
          inviterName: "Faroeq",
          role: "Dispatcher",
          expiresAt: "Dec 31",
        }}
        roleOptions={[{ value: "dispatcher", label: "Dispatcher" }]}
        defaultRoleValue="dispatcher"
        onAccept={() => {
          setOpen(false);
          onAccept?.();
        }}
        onDecline={() => {
          setOpen(false);
          onDecline?.();
        }}
      />
    </>
  );
}
