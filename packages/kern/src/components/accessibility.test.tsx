import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Field } from "./field";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";

describe("core web controls accessibility", () => {
  it("has no axe WCAG A/AA violations in a labeled form", async () => {
    const { container } = render(
      <main>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" required />
          <Field.Description>Work email address.</Field.Description>
        </Field.Root>
        <Checkbox label="Accept terms" />
        <Switch aria-label="Notifications" />
        <RadioGroup aria-label="Plan" defaultValue="free">
          <RadioGroupItem value="free">Free</RadioGroupItem>
          <RadioGroupItem value="pro">Pro</RadioGroupItem>
        </RadioGroup>
        <Button>Continue</Button>
      </main>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    expect(result.violations).toEqual([]);
  });
});
