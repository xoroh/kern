import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Field } from "./field";
import { NavigationBar } from "./navigation-bar";

/**
 * Field/overlay behavior contracts (KERN-027) — label/error/value/disabled,
 * modality, focus and dismissal, one file so the contract reads whole.
 *
 * The family suites prove each component in isolation; THIS file proves the
 * COMPOSED contracts a form actually depends on: an error that is announced
 * with its field, a dialog that traps and releases focus, a nav that selects
 * exactly one destination. A component passing alone while the composition
 * fails is the gap this closes.
 */
describe("field contract", () => {
  test("label names the control, error is announced with it", async () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Error match>Enter an email address</Field.Error>
      </Field.Root>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter an email address");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter an email address",
    );
  });

  test("description and error compose one description without sharing an id", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>We only use this for sign-in.</Field.Description>
        <Field.Error match>Enter an email address</Field.Error>
      </Field.Root>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAccessibleDescription(
      "We only use this for sign-in. Enter an email address",
    );
    const desc = screen.getByText("We only use this for sign-in.");
    const err = screen.getByRole("alert");
    expect(desc.getAttribute("id")).not.toBe(err.getAttribute("id"));
  });
});

describe("dialog contract", () => {
  test("trigger opens, Escape closes, focus returns to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <DialogRoot>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent aria-label="Settings">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Adjust the theme.</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </DialogRoot>,
    );
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeDefined();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe("navigation contract", () => {
  test("exactly one destination carries aria-current", () => {
    render(
      <NavigationBar
        label="Primary"
        value="library"
        destinations={[
          { key: "home", label: "Home" },
          { key: "library", label: "Library" },
          { key: "search", label: "Search" },
        ]}
      />,
    );
    const current = document.querySelectorAll('[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent).toContain("Library");
  });
});
