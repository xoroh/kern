import type { ComponentDoc } from "../types";

export const toolbar: ComponentDoc = {
  slug: "toolbar",
  name: "Toolbar",
  oneLiner:
    "Toolbars hold a row of actions — labelled, optional, and individually disableable.",
  features:
    "Reach for a toolbar when a surface has a set of actions that belong to it and should sit together: a document's formatting actions, an editor's commands. Actions are data — `label`, optional `onPress`, optional `disabled` — so the row is a declaration and every action is named by construction. That last part matters more than it looks: a toolbar is the classic place for icon-only buttons with no names, and because `label` is required here, that failure is not reachable. Keep the actions to what the surface actually needs; a toolbar that grows into a menu is asking for `Menubar`.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Toolbar",
    variants: [],
    // Material 3 places `toolbar` at resting level 2.
    elevation: 2,
  },
  parts: ["Toolbar"],
  customization: {
    supported: [
      "`actions` are data — `label`, optional `onPress`, optional `disabled`.",
      "`accessibilityLabel` names the toolbar as a whole.",
      "`style` is a React Native `ViewStyle`, and `ViewProps` pass through.",
    ],
    notSupported: [
      "There is no `renderAction` and no icon slot. Actions are named text, which is what keeps them all named.",
      "There is no `orientation`. It is a row.",
      "There is no grouping or overflow. A toolbar that needs to collapse is a `Menubar`.",
    ],
  },
  api: [
    {
      name: "actions",
      type: "NativeToolbarAction[]",
      note: "`{ label, onPress?, disabled? }`. `label` is REQUIRED — so every action is named by construction and the icon-only-button trap is not reachable here.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the toolbar as a whole, so the row reads as one thing rather than as loose buttons.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an action: stops it and reports it, so an unavailable action is announced as unavailable.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `ViewProps` pass through.",
    },
  ],
  aria: [
    "Every action is named — `label` is required — which closes the icon-only-button trap at the type level rather than in review.",
    "`accessibilityLabel` names the row, so it announces as a toolbar rather than as a run of buttons.",
    "`disabled` actions stay visible and announce as disabled, so the action is discoverable even when it is unavailable.",
  ],
};
