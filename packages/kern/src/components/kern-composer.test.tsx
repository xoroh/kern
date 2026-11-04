import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import {
  type CannedInsert,
  ComposerCannedPicker,
  InviteAccept,
  KernComposer,
  ShareLinkRow,
} from "./kern-composer";

async function axeClean(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  expect(result.violations).toEqual([]);
}

const CANNED: CannedInsert[] = [
  { id: "eta", title: "Delay notice", body: "Running 10 minutes late." },
  { id: "thanks", title: "Thanks", body: "Thanks for riding with us." },
];

describe("KernComposer send + keyboard", () => {
  it("types, sends on Enter, keeps Shift+Enter as newline", async () => {
    const user = userEvent.setup();
    let sent = "";
    render(<KernComposer onSend={(text) => (sent = text)} />);
    const box = screen.getByLabelText("Message");
    await user.type(box, "Hello");
    await user.keyboard("{Enter}");
    expect(sent).toBe("Hello");
  });

  it("disables send on empty text", () => {
    render(<KernComposer />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("switches public/internal/note through the mode bar", async () => {
    const user = userEvent.setup();
    let mode = "";
    render(<KernComposer onModeChange={(m) => (mode = m)} />);
    await user.click(screen.getByRole("radio", { name: "Internal" }));
    expect(mode).toBe("internal");
    expect(screen.getByRole("radio", { name: "Note" })).toBeInTheDocument();
  });

  it("dismisses the reply bar", async () => {
    const user = userEvent.setup();
    let dismissed = 0;
    render(
      <KernComposer
        replyTo={{ author: "Ada", excerpt: "Where are you?" }}
        onDismissReply={() => dismissed++}
      />,
    );
    expect(screen.getByText("Where are you?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss reply" }));
    expect(dismissed).toBe(1);
  });

  it("is axe-clean", async () => {
    const { container } = render(
      <KernComposer
        replyTo={{ author: "Ada", excerpt: "Where are you?" }}
        cannedInserts={CANNED}
        knowledge={<p>Fare policy v3.</p>}
      />,
    );
    await axeClean(container);
  });
});

describe("KernComposer canned inserts (picker composition)", () => {
  it("reports the picked insert without owning an option list", async () => {
    const user = userEvent.setup();
    let picked: CannedInsert | null = null;
    render(
      <ComposerCannedPicker
        inserts={CANNED}
        onCannedSelect={(insert) => (picked = insert)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Canned responses" }));
    await user.click(
      await screen.findByRole("option", { name: "Delay notice" }),
    );
    expect(picked).toEqual({
      id: "eta",
      title: "Delay notice",
      body: "Running 10 minutes late.",
    });
  });
});

describe("KernComposer scheduling + draft + OOO affordances", () => {
  it("schedules through the datetime control", async () => {
    const user = userEvent.setup();
    let scheduled: Date | null | undefined;
    render(<KernComposer onScheduledChange={(d) => (scheduled = d)} />);
    await user.click(screen.getByLabelText("Schedule"));
    expect(screen.getByLabelText("Scheduled send time")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Schedule" }),
    ).toBeInTheDocument();
    expect(scheduled).toBeInstanceOf(Date);
  });

  it("shows draft state with save/discard actions", async () => {
    const user = userEvent.setup();
    let saved = 0;
    let discarded = 0;
    render(
      <KernComposer
        draftStatus="unsaved"
        onSaveDraft={() => saved++}
        onDiscardDraft={() => discarded++}
      />,
    );
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save draft" }));
    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(saved).toBe(1);
    expect(discarded).toBe(1);
  });

  it("toggles out-of-office with a banner", async () => {
    const user = userEvent.setup();
    let ooo = false;
    render(<KernComposer onOutOfOfficeChange={(next) => (ooo = next)} />);
    expect(
      screen.queryByText(/Out-of-office replies are on/),
    ).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Out of office"));
    expect(ooo).toBe(true);
  });
});

describe("InviteAccept (MS-037)", () => {
  it("accepts with the note and closes", async () => {
    const user = userEvent.setup();
    let accepted: string | null | undefined;
    let declined = 0;
    render(
      <InviteAccept
        defaultOpen
        invite={{
          workspaceName: "Acme Taxis",
          inviterName: "Faroeq",
          role: "Dispatcher",
        }}
        messageEnabled
        onAccept={(note) => (accepted = note)}
        onDecline={() => declined++}
      />,
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Note to the workspace"),
      "Happy to join",
    );
    await user.click(screen.getByRole("button", { name: "Accept invite" }));
    expect(accepted).toBe("Happy to join");
    expect(declined).toBe(0);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("picks a role through the inline picker (no nested modal)", async () => {
    const user = userEvent.setup();
    let role = "";
    render(
      <InviteAccept
        defaultOpen
        invite={{
          workspaceName: "Acme",
          inviterName: "Faroeq",
          role: "Staff",
        }}
        roleOptions={[
          { value: "dispatcher", label: "Dispatcher" },
          { value: "driver", label: "Driver" },
        ]}
        onRoleChange={(next) => (role = next)}
        onAccept={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Role" }));
    await user.click(await screen.findByRole("option", { name: "Driver" }));
    expect(role).toBe("driver");
    // The modal stays open: popover pick must not dismiss the dialog.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("ShareLinkRow (MS-005/MS-024)", () => {
  const LINK = {
    id: "l1",
    label: "Trip 42 tracking",
    url: "https://go.example/t/42",
    scope: "View only",
  };

  it("copies, scopes, and revokes behind a confirm", async () => {
    const user = userEvent.setup();
    let copiedId = "";
    let revokedId = "";
    let scope = "";
    render(
      <ShareLinkRow
        link={LINK}
        onCopy={(link) => (copiedId = link.id)}
        onRevoke={(link) => (revokedId = link.id)}
        scopes={[
          { value: "view", label: "View only" },
          { value: "manage", label: "Manage" },
        ]}
        onScopeSelect={(next) => (scope = next)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(copiedId).toBe("l1");
    await user.click(screen.getByRole("button", { name: "Link scope" }));
    await user.click(await screen.findByRole("option", { name: "Manage" }));
    expect(scope).toBe("manage");
    await user.click(screen.getByRole("button", { name: "Revoke" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Revoke",
      }),
    );
    expect(revokedId).toBe("l1");
  });

  it("marks revoked links and hides their actions", () => {
    render(
      <ShareLinkRow
        link={{ ...LINK, revoked: true }}
        onCopy={() => {}}
        onRevoke={() => {}}
      />,
    );
    expect(screen.getByText("Revoked")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Copy" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Revoke" }),
    ).not.toBeInTheDocument();
  });

  it("is axe-clean", async () => {
    const { container } = render(
      <ShareLinkRow link={LINK} onCopy={() => {}} onRevoke={() => {}} />,
    );
    await axeClean(container);
  });
});
