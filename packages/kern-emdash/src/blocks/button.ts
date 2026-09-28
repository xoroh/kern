import type { ButtonProps } from "@xoroh/kern";

/**
 * Kern Button as an EmDash/Portable Text custom block type.
 *
 * Props mirror the React component so the Studio and the docs stay in
 * sync: one prop schema drives the Gutenberg-style editor UI, the Astro
 * theme renderer, and the API validation.
 */
export const buttonBlock = {
  type: "kern.button",
  title: "Kern Button",
  props: {
    label: { type: "string", required: true },
    variant: {
      type: "string",
      enum: ["primary", "tonal", "ghost"],
      default: "primary",
    },
  },
  // Rendered by the theme with the React Button from `@xoroh/kern`.
  component: "@xoroh/kern: Button",
} satisfies {
  type: string;
  title: string;
  props: Record<string, unknown>;
  component: string;
};

export type KernButtonBlockProps = Pick<ButtonProps, "variant"> & {
  label: string;
};
