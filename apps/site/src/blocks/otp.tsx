/**
 * OTP block — one-time code entry with verify action, wired with mock
 * completion.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). Six boxed inputs in a filled card with a
 * verify button — copy it, then replace the mock `onComplete` with a real
 * verification call.
 */
import { Button, Card, InputOTP } from "@xoroh/kern";
import { useState } from "react";

export function OtpBlock({
  onComplete,
}: {
  onComplete?: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  return (
    <Card variant="filled" style={{ padding: 24, maxWidth: 400 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p className="text-(--sys-typescale-title-medium-font-size) font-(--sys-typescale-title-medium-font-weight)">
          Check your email
        </p>
        <p className="text-(--sys-typescale-body-small-font-size) opacity-70">
          Enter the 6-digit code we sent you.
        </p>
        <InputOTP.Root
          length={6}
          aria-label="One-time code"
          value={code}
          onValueChange={setCode}
        >
          <InputOTP.Input />
          <InputOTP.Input />
          <InputOTP.Input />
          <InputOTP.Input />
          <InputOTP.Input />
          <InputOTP.Input />
        </InputOTP.Root>
        <Button disabled={code.length < 6} onClick={() => onComplete?.(code)}>
          Verify
        </Button>
      </div>
    </Card>
  );
}
