/**
 * Signup block, native variant — full sign-up page, wired with mock submit.
 *
 * Same contract as `signup.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add signup --platform native`.
 */
import { Button, Card, Field } from "@xoroh/kern-native";
import { useState } from "react";

export function SignupBlock({
  onSubmit,
}: {
  onSubmit?: (email: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <Card variant="filled">
      <Field.Root label="Full name">
        <Field.Control
          placeholder="Ada Lovelace"
          value={name}
          onChangeText={setName}
        />
      </Field.Root>
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
      <Button onPress={() => onSubmit?.(email)}>Create account</Button>
    </Card>
  );
}
