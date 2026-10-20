import { ListDetail, Text } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * List detail examples — the phone-width master–detail pattern.
 *
 * Only ONE pane is in the tree at a time, so the reading order never crosses
 * a hidden pane. Selection is the host's: the component owns the swap, not
 * the selection.
 */
export const LIST_DETAIL_EXAMPLES: ExampleSpec[] = [
  {
    id: "list-detail-panes",
    title: "One pane at a time, and a way back",
    description:
      "`showingDetail` is the host's selection state; the component owns the swap. The back affordance renders only when `onBack` is passed — navigation is the host's, not the layout's.",
    package: "@xoroh/kern-native",
    render: () => (
      <ListDetail
        list={<Text>Inbox</Text>}
        detail={<Text>Message</Text>}
        showingDetail
        onBack={() => {}}
        backLabel="Inbox"
      />
    ),
    code: `<ListDetail
  list={<Text>Inbox</Text>}
  detail={<Text>Message</Text>}
  showingDetail
  onBack={() => {}}
  backLabel="Inbox"
/>`,
  },
];
