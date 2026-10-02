import type { ComponentDoc } from "../types";

export const nativeSelect: ComponentDoc = {
  slug: "native-select",
  name: "Native select",
  oneLiner:
    "Native selects are the browser's own dropdown, styled to sit with the rest of a form.",
  features:
    "Reach for a native select when the platform's own picker is better than a custom one: on mobile the browser's wheel or sheet is faster and more familiar than anything drawn on top of it. It is a real `<select>`, so autofill, validation and the mobile picker all work without help. The trade is the opposite of `Select` — you get the platform's behaviour and lose control of how the list looks. Choose it deliberately: for a short list on a phone, the native picker usually wins.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `NativeSelect` — on a native surface the platform picker
    // IS the only picker, so the distinction does not exist there.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["NativeSelect"],
  customization: {
    supported: [
      "`className` is passed through and merged after the select's own classes.",
      "It forwards the `<select>` element's props, so `value`, `onChange` and `multiple` are the browser's.",
      "Height and border match the `Input`, so a native select sits level with the other fields in a form.",
    ],
    notSupported: [
      "There is no `renderValue` or `itemTemplate` prop. How the list looks is the browser's — that is the trade this component makes.",
      "There is no `searchable` prop. The native picker's own behaviour is what you get.",
      "There is no `size` or `variant` prop beyond the styling that matches `Input`.",
    ],
  },
  api: [
    {
      name: "value",
      type: "string | string[]",
      note: "Controlled value. A single string, or several with `multiple`. It is the browser's select semantics unchanged.",
    },
    {
      name: "defaultValue",
      type: "string | string[]",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onChange",
      type: "(event: ChangeEvent<HTMLSelectElement>) => void",
      note: "The browser's change handler. Unlike the custom `Select`, this is `onChange` with an event — the two components deliberately differ because one wraps a primitive and one is the element.",
    },
    {
      name: "multiple",
      type: "boolean",
      note: "Allows more than one selection. Native behaviour, including how the list shows it.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the select's own classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLSelectElement>",
      note: "Forwarded to the underlying `<select>`.",
    },
  ],
  aria: [
    "A real `<select>`, so its roles, its keyboard behaviour and its announcement are the platform's — which is the reason to choose it.",
    "It needs a label like any other field; the element supplies the semantics and not the name.",
    "On a phone the platform picker opens, which is a better experience than a custom list drawn over the screen.",
  ],
};
