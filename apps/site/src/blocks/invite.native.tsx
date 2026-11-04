/**
 * Invite block, native variant — workspace invite accept flow.
 *
 * Same contract as `invite.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add invite --platform native`. The sheet opens from its trigger
 * (never on mount), so embedding this block never hijacks the host screen.
 */
import { Button, InviteAccept } from "@xoroh/kern-native";
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
      <Button onPress={() => setOpen(true)}>View invite</Button>
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
