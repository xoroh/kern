/**
 * Auth-form block, native variant — sign-in card.
 *
 * Same contract as `auth-form.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add auth-form --platform native`.
 */
import { Button, Card, Field } from "@xoroh/kern-native";
import { useState } from "react";

export function AuthForm({ onSubmit }: { onSubmit?: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <Card variant="filled">
      <Field.Root
        label="Email address"
        description="We only use this for sign-in."
      >
        <Field.Control
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </Field.Root>
      <Field.Root label="Password">
        <Field.Control
          placeholder="Password"
          secureTextEntry
          onChangeText={() => {}}
        />
      </Field.Root>
      <Button onPress={() => onSubmit?.(email)}>Sign in</Button>
    </Card>
  );
}
