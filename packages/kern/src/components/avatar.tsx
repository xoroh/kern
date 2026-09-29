import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../utils/cn";
import { cnState } from "../utils/cnState";

const avatarVariants = cva(
  "kern-avatar relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        sm: "size-8 rounded-(--md-sys-shape-corner-full) text-xs",
        default: "size-10 rounded-(--md-sys-shape-corner-full) text-sm",
        lg: "size-14 rounded-(--md-sys-shape-corner-full) text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type AvatarRootProps = ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;
export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
export type AvatarFallbackProps = ComponentProps<
  typeof AvatarPrimitive.Fallback
>;

export function AvatarRoot({ size, className, ...props }: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cnState(
        "kern-avatar-image aspect-square size-full",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cnState(
        "kern-avatar-fallback flex size-full items-center justify-center bg-(--md-sys-color-primary) font-medium text-(--md-sys-color-on-primary)",
        className,
      )}
      {...props}
    />
  );
}

/** Identity image with initials fallback. */
export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};

export { avatarVariants };
