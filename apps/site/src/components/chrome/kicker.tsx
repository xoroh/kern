/**
 * Shared eyebrow kicker — the small uppercase line above a page title.
 *
 * Five pages typed the same small medium-weight wide-tracked uppercase line
 * by hand; this is the one definition. The voice is the `label-large` token with
 * the wide eyebrow spacing baked in (`T_KICKER`), so the size still resolves
 * from the scale rather than being re-typed at every call site.
 */
import type { ReactNode } from "react";
import { T_KICKER } from "../../systems/type-scale";

export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`m-0 ${T_KICKER} text-(--md-sys-color-on-surface-variant) uppercase ${className}`.trim()}
    >
      {children}
    </p>
  );
}
