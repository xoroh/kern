/**
 * Signup block — full sign-up page, wired with mock submit.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). Name, email and password fields in a filled
 * card with a submit action — copy it, then replace the mock `onSubmit`
 * with a real account creation call.
 */
import { Button, Card, Field, Input } from "@xoroh/kern";
import { type ChangeEvent, useState } from "react";

export function SignupBlock({
  onSubmit,
}: {
  onSubmit?: (email: string) => void;
}) {
  const [name, setName] = useState("");
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
          <Field.Label>Full name</Field.Label>
          <Field.Control
            placeholder="Ada Lovelace"
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
          />
        </Field.Root>
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
        <Button type="submit">Create account</Button>
      </form>
    </Card>
  );
}
