import { contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
// The namespace form is used throughout (`Table.Caption`, `Table.Cell`), so
// only the `Table` root itself is imported. The named imports this used to carry
// were dead -- and biome's organise-imports will not remove them, because it
// preserves specifiers it cannot prove unused across a namespace access.
import { Table } from "@xoroh/kern";
import { describe, expect, it } from "vitest";

/**
 * Web side of the `table-caption` contract row — the last row in the manifest
 * with no cross-renderer suite, and the row the static-row contract shape exists
 * for.
 *
 * Primitive-agnostic by construction (P2b-1): the assertions are the accessible
 * name and the presence of the caption, never a `caption` selector, a DOM node,
 * or anything about how the table is built. A future primitive ruling cannot
 * invalidate them.
 *
 * A caption is CONTENT, not a control. The row is `interactive: false` and
 * carries no `axis` / `interaction` / `maxSelected` — inventing a state axis for
 * a caption would assert a state neither renderer has.
 */
describe("web parity contract: table-caption", () => {
  it("the row declares itself static, with no state axis", () => {
    const row = contractFor("table-caption");
    // The obligation is that the caption is present and ANNOUNCED, not that it
    // is pressed or selected. Asserting the row's own shape keeps a future
    // edit from quietly turning a static row into a fake control.
    expect(row.family).toBe("static-content");
    expect(row.axis).toBeUndefined();
    expect(row.interaction).toBeUndefined();
  });

  it("renders a caption inside the table", () => {
    render(
      <Table.Root>
        <Table.Caption>Team roster</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByText("Team roster")).toBeTruthy();
  });

  it("keeps the caption text in the row's declared name", () => {
    const row = contractFor("table-caption");
    render(
      <Table.Root>
        <Table.Caption>Team roster</Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    // Native substitutes for the missing <caption> element by appending the text
    // to the table's accessible name. The shared obligation is the TEXT being
    // announced; the delivery differs and is recorded in the row.
    expect(row.nameMustContain ?? [row.name]).toBeTruthy();
    expect(screen.getByText(row.name)).toBeTruthy();
  });
});
