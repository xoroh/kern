import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type { StatusTone } from "@xoroh/kern-tokens";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../utils/cn";
import { cnState } from "../utils/cnState";
import { statusToneClassNames } from "./status-pill";

const avatarVariants = cva(
  "kern-avatar relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        sm: "size-8 rounded-(--sys-shape-corner-full) text-xs",
        default: "size-10 rounded-(--sys-shape-corner-full) text-sm",
        lg: "size-14 rounded-(--sys-shape-corner-full) text-base",
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
> & {
  /**
   * Registry tone (KernStatus, CL-010) for the initials disc. Default
   * `primary` preserves the existing look; deterministic per-user color
   * comes from `avatarToneFor` in `@xoroh/kern-tokens` mapped onto this
   * prop by the host. Replaces per-app HSL-disc copies.
   */
  tone?: StatusTone;
};

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

export function AvatarFallback({
  tone = "primary",
  className,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-tone={tone}
      className={cnState(
        "kern-avatar-fallback flex size-full items-center justify-center font-medium",
        statusToneClassNames(tone, "solid"),
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
