import type { IconPaint } from "../core/resolve";
import { resolveIconPaint } from "../core/resolve";
import type { IconBaseProps } from "../core/types";

/**
 * `useIcon` — hook-form paint resolution, identical output to
 * `resolveIconPaint`.
 *
 * Deliberately stateless: resolution is a pure function over the committed
 * registry, so this is safe under SSR and concurrent rendering and cannot
 * cause a hydration mismatch. It exists so a custom renderer (canvas, map
 * marker, notification icon) can follow the hooks contract and still paint
 * exactly what `<Icon />` paints.
 */
export function useIcon(props: IconBaseProps): IconPaint | null {
  return resolveIconPaint(props);
}
