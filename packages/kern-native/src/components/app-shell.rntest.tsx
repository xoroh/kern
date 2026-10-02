import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { AppShell } from "./app-shell";

/**
 * Native application SHELL — the frame that hosts a whole app.
 *
 * Genuinely absent: native `shell.tsx` exports only `BootSplash` and
 * `ErrorBoundary`. There is no application frame, so this is real work rather
 * than a composition of things that already exist.
 *
 * The obligation is the one a shell actually has: its regions must be
 * DISTINGUISHABLE. An app shell that renders a header, a nav and a body but
 * gives each the same accessible name is three unlabelled boxes, and a screen
 * reader user cannot tell them apart — which is the whole failure mode of
 * "it renders".
 */

describe("AppShell", () => {
  it("exposes each region as a separately named landmark", async () => {
    await render(
      <AppShell
        header={<RNText>Header</RNText>}
        navigation={<RNText>Nav</RNText>}
        footer={<RNText>Footer</RNText>}
      />,
    );
    // Three named regions, not one merged blob.
    expect(screen.getByLabelText("Header")).toBeTruthy();
    expect(screen.getByLabelText("Navigation")).toBeTruthy();
    expect(screen.getByLabelText("Footer")).toBeTruthy();
  });

  it("renders its regions when supplied", async () => {
    await render(
      <AppShell
        header={<RNText>Header</RNText>}
        navigation={<RNText>Nav</RNText>}
        footer={<RNText>Footer</RNText>}
      />,
    );
    expect(screen.getByText("Header")).toBeTruthy();
    expect(screen.getByText("Nav")).toBeTruthy();
    expect(screen.getByText("Footer")).toBeTruthy();
  });

  it("omits a region that was not supplied", async () => {
    await render(<AppShell header={<RNText>Header</RNText>} />);
    // Absent, not empty: an unnamed empty rail still occupies a landmark slot
    // and still has to be skipped, which is a cost the caller should not pay
    // for a region they never asked for.
    expect(screen.queryByLabelText("Navigation")).toBeNull();
    expect(screen.queryByLabelText("Footer")).toBeNull();
  });

  it("lays the navigation beside the content, not above it", async () => {
    await render(
      <AppShell
        header={<RNText>Header</RNText>}
        navigation={<RNText>Nav</RNText>}
      />,
    );
    // The shell's whole point is a persistent side region. Rendering it in a
    // column would produce a correct-looking app with the navigation stacked on
    // top of the content -- the classic "responsive went wrong" failure, and
    // entirely invisible to the tests above.
    //
    // Asserted on the BODY container, not the root: the root is correctly a
    // COLUMN (header above, footer below). The row is the inner wrapper that
    // holds the navigation beside the content, and an earlier version of this
    // test asserted on the root and failed for a reason that had nothing to do
    // with the layout.
    const bodyRow = screen.getByTestId("kern-app-shell-body");
    expect(JSON.stringify(bodyRow.props.style)).toContain("row");
  });

  it("renders the body content", async () => {
    await render(<AppShell body={<RNText>Main</RNText>} />);
    expect(screen.getByText("Main")).toBeTruthy();
  });
});
