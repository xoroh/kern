import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import React, { act, type ReactElement } from "react";
import { Pressable, Text } from "react-native";
import { defaultScheme } from "../theme";
import {
  SnackbarProvider,
  SnackbarViewport,
  snackbarStyles,
  useSnackbar,
} from "./snackbar";

/**
 * WP1b P1/P2 (native snackbar: tests + a11y). Queue behaviour itself is
 * pinned in overlays.rntest ("native Snackbar queue via Axis Toast"); this
 * suite pins the WP1b surface contract: M3 inverse-surface styling, the
 * action slot, and dismiss — the transient-message pattern every app
 * reuses instead of a local snackbar copy.
 */
function renderWithHost(element: ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

function Trigger({
  label,
  toast,
}: {
  label: string;
  toast: Parameters<ReturnType<typeof useSnackbar>["add"]>[0];
}) {
  const sb = useSnackbar();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => sb.add(toast)}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

describe("Snackbar (P1 tests)", () => {
  it("shows a queued message with an action", async () => {
    const onAction = jest.fn();
    await renderWithHost(
      <SnackbarProvider>
        <Trigger
          label="Show"
          toast={{
            message: "Saved",
            duration: 0,
            actionLabel: "Undo",
            onAction,
          }}
        />
        <SnackbarViewport testID="sb-actions" />
      </SnackbarProvider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show"));
    });
    expect(screen.getByText("Saved")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByText("Undo"));
    });
    expect(onAction).toHaveBeenCalled();
  });

  it("dismisses a toast on demand", async () => {
    function Dismisser() {
      const sb = useSnackbar();
      const idRef = React.useRef<string | null>(null);
      return (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show"
            onPress={() => {
              idRef.current = sb.add({ message: "Once", duration: 0 });
            }}
          >
            <Text>Show</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hide"
            onPress={() => {
              if (idRef.current) sb.dismiss(idRef.current);
            }}
          >
            <Text>Hide</Text>
          </Pressable>
        </>
      );
    }
    await renderWithHost(
      <SnackbarProvider>
        <Dismisser />
        <SnackbarViewport testID="sb-dismiss" />
      </SnackbarProvider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show"));
    });
    expect(screen.getByText("Once")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Hide"));
    });
    expect(screen.queryByText("Once")).toBeNull();
  });
});

describe("Snackbar (P2 a11y + M3 surface)", () => {
  it("paints the inverse-surface level-3 shell (M3, not a tone)", async () => {
    const scheme = defaultScheme();
    const styles = snackbarStyles(scheme);
    expect(styles.backgroundColor).toBe(scheme.color.inverseSurface);
    expect(styles.elevation).toBe(6);
  });

  it("exposes the queued message to assistive tech (not hidden)", async () => {
    await renderWithHost(
      <SnackbarProvider>
        <Trigger label="Show" toast={{ message: "Announced", duration: 0 }} />
        <SnackbarViewport testID="sb-a11y" />
      </SnackbarProvider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show"));
    });
    const node = screen.getByText("Announced");
    // The message must stay in the accessibility tree: a toast hidden
    // from AT announces nothing, which defeats the surface.
    expect(node.props.accessibilityElementsHidden).not.toBe(true);
    expect(node.props.importantForAccessibility).not.toBe(
      "no-hide-descendants",
    );
  });
});
