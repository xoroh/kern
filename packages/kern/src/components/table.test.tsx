import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./table";

/**
 * U5 (kern-oss-upstream-v1): table density + header pinning for ops queues.
 * Defaults render byte-identically to the pre-density table (comfortable
 * padding, static head); compact tightens cells and stickyHeader pins the
 * head row on vertical scroll.
 */
function queue() {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Booking</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>BK-001</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

describe("Table density + pinning (U5)", () => {
  it("renders comfortable by default with a static head", () => {
    const { container } = render(queue());
    expect(container.querySelector("[data-density]")).toHaveAttribute(
      "data-density",
      "comfortable",
    );
    expect(screen.getByText("BK-001")).toHaveClass("px-4", "py-3");
    expect(screen.getByText("Booking")).toHaveClass("px-4", "py-3");
    const head = container.querySelector("thead");
    expect(head?.className).not.toMatch("sticky");
  });

  it("compacts cells under density=compact", () => {
    render(
      <Table.Root density="compact">
        <Table.Head>
          <Table.Row>
            <Table.Header>Booking</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>BK-001</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByText("BK-001")).toHaveClass("px-3", "py-2");
    expect(screen.getByText("Booking")).toHaveClass("px-3", "py-2");
  });

  it("pins the head row under stickyHeader", () => {
    const { container } = render(
      <Table.Root stickyHeader>
        <Table.Head>
          <Table.Row>
            <Table.Header>Booking</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>BK-001</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const head = container.querySelector("thead");
    expect(head?.className).toMatch("sticky");
    expect(head?.className).toMatch("top-0");
  });
});
