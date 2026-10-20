import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import { act } from "react";
import { AlertDialog } from "./alert-dialog";

function renderWithPortal(element: React.ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

describe("AlertDialog native component", () => {
  it("renders title, message, and action buttons", async () => {
    await renderWithPortal(
      <AlertDialog
        open={true}
        title="Delete item?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
      />,
    );

    expect(screen.getByText("Delete item?")).toBeTruthy();
    expect(screen.getByText("This action cannot be undone.")).toBeTruthy();
    expect(screen.getByLabelText("Delete")).toBeTruthy();
    expect(screen.getByLabelText("Keep")).toBeTruthy();
  });

  it("exposes all compound parts on AlertDialog", () => {
    expect(AlertDialog.Root).toBeDefined();
    expect(AlertDialog.Trigger).toBeDefined();
    expect(AlertDialog.Portal).toBeDefined();
    expect(AlertDialog.Backdrop).toBeDefined();
    expect(AlertDialog.Popup).toBeDefined();
    expect(AlertDialog.Title).toBeDefined();
    expect(AlertDialog.Description).toBeDefined();
    expect(AlertDialog.Close).toBeDefined();
  });

  it("calls onConfirm and closes", async () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    await renderWithPortal(
      <AlertDialog
        open={true}
        title="Confirm action"
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
      />,
    );

    const confirmBtn = screen.getByLabelText("Confirm");
    await act(async () => {
      fireEvent.press(confirmBtn);
    });

    expect(onConfirm).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onCancel and closes", async () => {
    const onCancel = jest.fn();
    const onOpenChange = jest.fn();
    await renderWithPortal(
      <AlertDialog
        open={true}
        title="Cancel action"
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />,
    );

    const cancelBtn = screen.getByLabelText("Cancel");
    await act(async () => {
      fireEvent.press(cancelBtn);
    });

    expect(onCancel).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
