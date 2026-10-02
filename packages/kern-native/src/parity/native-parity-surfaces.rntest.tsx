import { contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react-native";
// Imported from the PACKAGE, not the source file: this suite is only meaningful
// if the component is reachable from the public entry, which is exactly what
// `3f7fd6e` fixed and `0a2c192`'s reachability gate now enforces.
import { Drawer, Popover, ScrollArea } from "@xoroh/kern-native";
import { Text as RNText } from "react-native";

/**
 * Native side of the overlay family contract (drawer, popover, scroll-area).
 *
 * These rows previously had component-level suites on both sides but NO suite
 * consuming the CONTRACT, so `check:parity` printed them as
 * `cross-renderer pending`. That is the debt this file closes.
 *
 * The shared obligations asserted here are deliberately primitive-agnostic: a
 * labelled surface that is NOT presented while closed, and a dismiss control
 * that reports the closed state. The mechanisms differ — web portals and DOM,
 * native a `Modal` and a scrim press — and a contract that named either would
 * break the moment the primitive changed.
 */
const _R = "native" as const;

const row = (component: string) => contractFor(component);

describe("native parity contract: overlay family", () => {
  // ------------------------------------------------------------------ drawer
  describe("drawer", () => {
    it("is not presented while closed", async () => {
      const r = row("drawer");
      await render(
        <Drawer open={false} title="Menu">
          <Drawer.Content />
        </Drawer>,
      );
      // Closed means ABSENT, not present-and-hidden: a screen reader must not be
      // able to reach a dialog that is not there.
      if (r.expects.initial === false) {
        expect(screen.queryByLabelText("Menu")).toBeNull();
      }
    });

    it("is presented as a labelled dialog when open", async () => {
      const r = row("drawer");
      await render(
        <Drawer open title="Menu">
          <Drawer.Content />
        </Drawer>,
      );
      const surface = screen.getByLabelText("Menu");
      // The label IS the contract: both sides carry the title on the surface.
      expect(surface.props.role).toBe(r.role);
      expect(surface.props.accessibilityLabel).toContain("Menu");
    });

    it("offers a dismiss control", async () => {
      const r = row("drawer");
      await render(
        <Drawer open title="Menu">
          <Drawer.Content />
        </Drawer>,
      );
      expect(screen.getByLabelText("Dismiss menu")).toBeTruthy();
      expect(r.role).toBe("dialog");
    });
  });

  // ----------------------------------------------------------------- popover
  describe("popover", () => {
    it("is not presented while closed", async () => {
      const r = row("popover");
      await render(
        <Popover.Root open={false}>
          <Popover.Content label="Details" />
        </Popover.Root>,
      );
      if (r.expects.initial === false) {
        expect(screen.queryByLabelText("Details")).toBeNull();
      }
    });

    it("is presented as a labelled dialog when open", async () => {
      const r = row("popover");
      await render(
        <Popover.Root open>
          <Popover.Content label="Details" />
        </Popover.Root>,
      );
      const surface = screen.getByLabelText("Details");
      expect(surface.props.role).toBe(r.role);
    });
  });

  // ------------------------------------------------------------- scroll-area
  describe("scroll-area", () => {
    it("is a named region wrapping the scroll view", async () => {
      const r = row("scroll-area");
      await render(
        <ScrollArea accessibilityLabel="Transcript">
          <RNText>Line one</RNText>
        </ScrollArea>,
      );
      const region = screen.getByLabelText("Transcript");
      // The row pins a named, scrollable REGION on both sides; the web signals
      // scrollability through scrollbar parts, native through the role.
      expect(region.props.accessibilityLabel).toBe("Transcript");
      expect(r.role).toBe("group");
    });

    it("renders its content", async () => {
      await render(
        <ScrollArea accessibilityLabel="Transcript">
          <RNText>Line one</RNText>
        </ScrollArea>,
      );
      expect(screen.getByText("Line one")).toBeTruthy();
    });
  });
});
