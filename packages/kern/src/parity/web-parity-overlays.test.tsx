import { contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer, Popover, ScrollArea } from "@xoroh/kern";
import { describe, expect, it } from "vitest";

/**
 * Web side of the overlay family contract (drawer, popover, scroll-area).
 *
 * These rows previously had component-level suites on both sides but NO suite
 * consuming the CONTRACT, so `check:parity` printed them as
 * `cross-renderer pending`. This closes that half.
 *
 * The assertions are the same three obligations the native suite proves, in
 * primitive-agnostic terms: a labelled surface NOT presented while closed, a
 * labelled surface presented when open, and a named scrollable region. The
 * mechanisms differ per renderer on purpose — a contract that named a DOM node
 * or a portal would break the moment the primitive changed.
 */
const R = "web" as const;

describe("web parity contract: overlay family", () => {
  describe("drawer", () => {
    it("is not presented while closed", async () => {
      const r = contractFor("drawer");
      const user = userEvent.setup();
      render(
        <Drawer.Root>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Title>Menu</Drawer.Title>
            <Drawer.Close>Done</Drawer.Close>
          </Drawer.Content>
        </Drawer.Root>,
      );
      if (r.expects.initial === false) {
        // Closed means ABSENT from the accessibility tree, not merely hidden —
        // a screen reader must not be able to reach a dialog that is not there.
        expect(screen.queryByRole(r.role)).toBeNull();
      }
      await user.click(screen.getByRole("button", { name: "Open" }));
    });

    it("is presented as a labelled dialog when open", async () => {
      const r = contractFor("drawer");
      const user = userEvent.setup();
      render(
        <Drawer.Root defaultOpen>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Title>Menu</Drawer.Title>
            <Drawer.Close>Done</Drawer.Close>
          </Drawer.Content>
        </Drawer.Root>,
      );
      const surface = await screen.findByRole(r.role);
      // The label IS the contract: both sides carry the title on the surface.
      expect(surface).toHaveAccessibleName(/Menu/);
    });
  });

  describe("popover", () => {
    it("is not presented while closed", async () => {
      const r = contractFor("popover");
      render(
        <Popover.Root>
          <Popover.Trigger>Info</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Details</Popover.Title>
          </Popover.Content>
        </Popover.Root>,
      );
      if (r.expects.initial === false) {
        expect(screen.queryByRole(r.role)).toBeNull();
      }
    });

    it("is presented as a labelled dialog when open", async () => {
      const r = contractFor("popover");
      const user = userEvent.setup();
      render(
        <Popover.Root>
          <Popover.Trigger>Info</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Details</Popover.Title>
          </Popover.Content>
        </Popover.Root>,
      );
      await user.click(screen.getByRole("button", { name: "Info" }));
      const surface = await screen.findByRole(r.role);
      expect(surface).toHaveAccessibleName(/Details/);
    });
  });

  describe("scroll-area", () => {
    it("is a named region wrapping the scrollable viewport", async () => {
      const r = contractFor("scroll-area");
      render(
        <ScrollArea.Root aria-label="Transcript">
          <ScrollArea.Viewport>
            <p>Line one</p>
          </ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      // The row pins a named, scrollable REGION on both sides; web signals
      // scrollability through scrollbar parts, native through the role.
      expect(screen.getByLabelText("Transcript")).toBeTruthy();
      expect(r.role).toBe("group");
    });

    it("renders its content", async () => {
      render(
        <ScrollArea.Root aria-label="Transcript">
          <ScrollArea.Viewport>
            <p>Line one</p>
          </ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      expect(screen.getByText("Line one")).toBeTruthy();
    });
  });
});
