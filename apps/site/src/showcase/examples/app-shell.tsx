import { AppShell, Text } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * App shell examples — the frame around everything else.
 *
 * Every region is optional and every supplied one becomes a NAMED landmark,
 * so a screen-reader user can jump between regions instead of walking the
 * whole tree. The navigation sits BESIDE the body, never above it.
 */
export const APP_SHELL_EXAMPLES: ExampleSpec[] = [
  {
    id: "app-shell-regions",
    title: "Four named regions, one frame",
    description:
      "The header, the navigation, the body and the footer are slots, and each supplied one is a named landmark. The navigation is laid out beside the body — a column there would stack the menu above the content.",
    package: "@xoroh/kern-native",
    render: () => (
      <AppShell
        header={<Text>Settings</Text>}
        navigation={<Text>Menu</Text>}
        body={<Text>Content</Text>}
        footer={<Text>Status</Text>}
      />
    ),
    code: `<AppShell
  header={<Text>Settings</Text>}
  navigation={<Text>Menu</Text>}
  body={<Text>Content</Text>}
  footer={<Text>Status</Text>}
/>`,
  },
];
