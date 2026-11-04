/**
 * Invite block, native variant — workspace invite accept flow.
 *
 * Same contract as `invite.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add invite --platform native`.
 */
import { InviteAccept } from "@xoroh/kern-native";

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
