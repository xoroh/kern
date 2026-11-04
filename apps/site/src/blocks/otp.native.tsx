/**
 * OTP block, native variant — one-time code entry with verify action.
 *
 * Same contract as `otp.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add otp --platform native`.
 */
import { Button, Card, InputOTP, Text } from "@xoroh/kern-native";
import { useState } from "react";

export function OtpBlock({
  onComplete,
}: {
  onComplete?: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  return (
    <Card variant="filled">
      <Text>Check your email</Text>
      <Text>Enter the 6-digit code we sent you.</Text>
      <InputOTP
        length={6}
        value={code}
        onValueChange={setCode}
        onComplete={onComplete}
      />
      <Button disabled={code.length < 6} onPress={() => onComplete?.(code)}>
        Verify
      </Button>
    </Card>
  );
}
