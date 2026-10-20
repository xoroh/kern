import { Table } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Table examples — a semantic data table.
 *
 * A real `<table>`, so the row and column relationships are the browser's
 * rather than a grid of divs pretending. The header cells carry
 * `scope="col"`, and the caption is a real `<caption>` — the table's own
 * summary, not a paragraph placed above it.
 *
 * WEB composition. The native table is the documented web-parity counterpart
 * and renders a flat list; the mobile page carries its own live demo.
 */
export const TABLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "table-semantic-grid",
    title: "A table the browser understands",
    description:
      'The caption summarises what the table holds and the header cells are scoped to their column, so a screen reader can say "Service, column 1 of 3" instead of reading a grid of boxes.',
    render: () => (
      <div className="w-full max-w-lg">
        <Table.Root>
          <Table.Caption>Recent deploys</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.Header>Service</Table.Header>
              <Table.Header>Status</Table.Header>
              <Table.Header>Duration</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>site</Table.Cell>
              <Table.Cell>Live</Table.Cell>
              <Table.Cell>42s</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>api</Table.Cell>
              <Table.Cell>Live</Table.Cell>
              <Table.Cell>1m 12s</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
    ),
    code: `<Table.Root>
  <Table.Caption>Recent deploys</Table.Caption>
  <Table.Head>
    <Table.Row>
      <Table.Header>Service</Table.Header>
      <Table.Header>Status</Table.Header>
      <Table.Header>Duration</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>site</Table.Cell>
      <Table.Cell>Live</Table.Cell>
      <Table.Cell>42s</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`,
  },
];
