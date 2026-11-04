/**
 * Invite block — workspace invite accept flow, wired with mock invite.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `InviteAccept` with a
 * realistic invite (workspace, inviter, role, expiry) — copy it, then
 * replace the mock invite and the accept/decline handlers with real calls.
 */
import { InviteAccept } from "@xoroh/kern";

export function InviteBlock({
  onAccept,
  onDecline,
}: {
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  return (
    <InviteAccept
      defaultOpen
      invite={{
        workspaceName: "Acme Taxi",
        inviterName: "Faroeq",
        role: "Dispatcher",
        expiresAt: "Dec 31",
      }}
      roleOptions={[{ value: "dispatcher", label: "Dispatcher" }]}
      defaultRoleValue="dispatcher"
      onAccept={onAccept}
      onDecline={onDecline}
    />
  );
}
