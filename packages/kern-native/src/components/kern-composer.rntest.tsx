import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import {
  ComposerCannedPicker,
  InviteAccept,
  KernComposer,
  ShareLinkRow,
} from "./kern-composer";

const CANNED = [
  { id: "eta", title: "Delay notice", body: "Running 10 minutes late." },
];

describe("KernComposer", () => {
  it("types and sends through the send pressable", async () => {
    const onSend = jest.fn();
    await render(<KernComposer onSend={onSend} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-composer-input"), "Hello");
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-composer-send"));
    });
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("switches modes through the mode bar", async () => {
    const onModeChange = jest.fn();
    await render(<KernComposer onModeChange={onModeChange} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("radio", { name: "Internal" }));
    });
    expect(onModeChange).toHaveBeenCalledWith("internal");
  });

  it("dismisses the reply bar", async () => {
    const onDismissReply = jest.fn();
    await render(
      <KernComposer
        replyTo={{ author: "Ada", excerpt: "Where are you?" }}
        onDismissReply={onDismissReply}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Dismiss reply" }));
    });
    expect(onDismissReply).toHaveBeenCalledTimes(1);
  });

  it("reports canned picks without owning an option list", async () => {
    const onCannedSelect = jest.fn();
    await render(
      <ComposerCannedPicker inserts={CANNED} onCannedSelect={onCannedSelect} />,
    );
    // The canned picker composes the sheet picker: the trigger opens it.
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Canned responses"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Delay notice"));
    });
    expect(onCannedSelect).toHaveBeenCalledWith(CANNED[0]);
  });

  it("toggles scheduling and out-of-office affordances", async () => {
    const onScheduledChange = jest.fn();
    const onOutOfOfficeChange = jest.fn();
    await render(
      <KernComposer
        onScheduledChange={onScheduledChange}
        onOutOfOfficeChange={onOutOfOfficeChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-composer-schedule-toggle"));
    });
    expect(onScheduledChange).toHaveBeenCalledWith(expect.any(Date));
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Out of office"));
    });
    expect(onOutOfOfficeChange).toHaveBeenCalledWith(true);
  });

  it("shows draft state with save/discard actions", async () => {
    const onSaveDraft = jest.fn();
    const onDiscardDraft = jest.fn();
    await render(
      <KernComposer
        draftStatus="unsaved"
        onSaveDraft={onSaveDraft}
        onDiscardDraft={onDiscardDraft}
      />,
    );
    expect(screen.getByText("Unsaved changes")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save draft" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Discard draft" }));
    });
    expect(onSaveDraft).toHaveBeenCalledTimes(1);
    expect(onDiscardDraft).toHaveBeenCalledTimes(1);
  });
});

describe("InviteAccept (MS-037, sheet physics)", () => {
  it("accepts with the note and requests close", async () => {
    const onAccept = jest.fn();
    const onOpenChange = jest.fn();
    await render(
      <InviteAccept
        defaultOpen
        invite={{ workspaceName: "Acme", inviterName: "Faroeq", role: "Staff" }}
        messageEnabled
        onAccept={onAccept}
        onOpenChange={onOpenChange}
      />,
    );
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-composer-input"), "Hi");
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Accept invite" }));
    });
    expect(onAccept).toHaveBeenCalledWith("Hi");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("ShareLinkRow (MS-005/MS-024)", () => {
  const LINK = { id: "l1", label: "Trip 42", url: "https://go.example/t/42" };

  it("copies and revokes behind a confirm", async () => {
    const onCopy = jest.fn();
    const onRevoke = jest.fn();
    await render(
      <ShareLinkRow link={LINK} onCopy={onCopy} onRevoke={onRevoke} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Copy" }));
    });
    expect(onCopy).toHaveBeenCalledWith(LINK);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Revoke" }));
    });
    // The alert confirms through its N expression (confirm/cancel labels);
    // scope the query: the row Revoke stays mounted behind the sheet.
    const alert = screen.getByTestId("kern-share-link-revoke-l1");
    await act(async () => {
      fireEvent.press(within(alert).getByRole("button", { name: "Revoke" }));
    });
    expect(onRevoke).toHaveBeenCalledWith(LINK);
  });

  it("marks revoked links and hides their actions", async () => {
    await render(
      <ShareLinkRow
        link={{ ...LINK, revoked: true }}
        onCopy={jest.fn()}
        onRevoke={jest.fn()}
      />,
    );
    expect(screen.getByText("Revoked")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
  });

  it("renders knowledge content on demand", async () => {
    await render(<KernComposer knowledge={<RNText>Fare policy v3.</RNText>} />);
    expect(screen.queryByText("Fare policy v3.")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Knowledge base" }));
    });
    expect(screen.getByText("Fare policy v3.")).toBeTruthy();
  });
});
