/**
 * Block: auth-form — a sign-in card composed from shipped components.
 *
 * Category: Auth. Install with `kern add auth-form`.
 * Dependencies: @xoroh/kern, react.
 */
import { Button, Card, Field, Input } from "@xoroh/kern";
import { type ChangeEvent, useState } from "react";

export function AuthForm({ onSubmit }: { onSubmit?: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <Card variant="filled" style={{ padding: 24, maxWidth: 400 }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(email);
        }}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Field.Control
            placeholder="you@example.com"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
          />
          <Field.Description>We only use this for sign-in.</Field.Description>
        </Field.Root>
        <Input type="password" aria-label="Password" placeholder="Password" />
        <Button type="submit">Sign in</Button>
      </form>
    </Card>
  );
}
