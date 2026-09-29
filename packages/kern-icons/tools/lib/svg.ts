/**
 * Minimal, dependency-free SVG reader for the icon pipeline.
 *
 * Icon sources are machine-generated (Material Symbols) or hand-authored to the
 * icon spec (brand set), so we only need enough XML to read the root `viewBox`,
 * enumerate shape elements, and collect their `d` attributes. Anything richer —
 * gradients, masks, filters, embedded rasters, text — is rejected by
 * `validate.ts` rather than silently mis-rendered.
 */

/**
 * Attribute bag. Values are `string | undefined` rather than `string`: an
 * attribute is optional by nature, and callers branch on its absence constantly.
 * Typing it as always-present would make every one of those guards look dead.
 */
export type SvgAttributes = Readonly<Record<string, string | undefined>>;

export interface SvgElement {
  readonly tag: string;
  readonly attrs: SvgAttributes;
}

export interface SvgDocument {
  readonly rootAttrs: SvgAttributes;
  readonly elements: ReadonlyArray<SvgElement>;
}

const ATTRIBUTE_RE = /([A-Za-z_:][-\w:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g;

function readAttributes(chunk: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  ATTRIBUTE_RE.lastIndex = 0;
  let match = ATTRIBUTE_RE.exec(chunk);
  while (match !== null) {
    // `RegExpExecArray` is typed `string[]`, but a group that did not
    // participate in the match reads back as `undefined` at runtime. Groups 3
    // and 4 are the two quote styles, so exactly one of them is always absent.
    const groups: ReadonlyArray<string | undefined> = match;
    const name = groups[1];
    const value = groups[3] ?? groups[4] ?? "";
    // Advance before any `continue`, so a skipped attribute cannot stall the scan.
    match = ATTRIBUTE_RE.exec(chunk);
    if (name === undefined) continue;
    attrs[name] = value;
  }
  return attrs;
}

/** Elements the pipeline understands as paintable geometry. */
export const SHAPE_TAGS = new Set([
  "path",
  "circle",
  "ellipse",
  "rect",
  "polygon",
  "polyline",
  "line",
]);

/** Elements that cannot be expressed as flat path data and therefore fail validation. */
export const UNSUPPORTED_TAGS = new Set([
  "lineargradient",
  "radialgradient",
  "pattern",
  "mask",
  "clippath",
  "filter",
  "image",
  "text",
  "foreignobject",
  "use",
  "symbol",
  "animate",
  "animatetransform",
  "set",
  "script",
  "style",
]);

/**
 * Strips comments, the XML declaration, `<!DOCTYPE>`, and CDATA wrappers, then
 * walks the remaining markup collecting the root `<svg>` attributes and every
 * descendant element with its attributes.
 */
export function parseSvg(source: string): SvgDocument {
  const clean = source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");

  const svgOpen = clean.match(/<svg\b([^>]*)>/i);
  if (!svgOpen) throw new Error("Not an SVG document: no <svg> root element");
  const rootAttrs = readAttributes(svgOpen[1] ?? "");

  const body = clean.slice(clean.indexOf(svgOpen[0]) + svgOpen[0].length);
  const end = body.search(/<\/svg\s*>/i);
  const inner = end === -1 ? body : body.slice(0, end);

  const elements: Array<SvgElement> = [];
  const tagRe = /<([A-Za-z][-\w:.]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let match = tagRe.exec(inner);
  while (match !== null) {
    const tag = (match[1] ?? "").toLowerCase();
    const rawAttrs = match[2] ?? "";
    // Advance before any `continue`, so a skipped tag cannot stall the scan.
    match = tagRe.exec(inner);
    if (tag === "svg") continue;
    // Structural groups carry no paint of their own; their children are walked.
    if (
      tag === "g" ||
      tag === "defs" ||
      tag === "title" ||
      tag === "desc" ||
      tag === "metadata"
    ) {
      continue;
    }
    elements.push({ tag, attrs: readAttributes(rawAttrs) });
  }

  return { rootAttrs, elements };
}

/** Reads `viewBox`, falling back to `width`/`height` when the attribute is absent. */
export function readViewBox(doc: SvgDocument): string | null {
  const explicit = doc.rootAttrs.viewBox ?? doc.rootAttrs.viewbox;
  if (explicit) return explicit;
  const w = Number.parseFloat(doc.rootAttrs.width ?? "");
  const h = Number.parseFloat(doc.rootAttrs.height ?? "");
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0)
    return `0 0 ${w} ${h}`;
  return null;
}

/** Converts a non-path primitive into equivalent path data. */
export function primitiveToPathData(el: SvgElement): string {
  const num = (key: string, fallback = 0): number => {
    const raw = el.attrs[key];
    if (raw === undefined) return fallback;
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  switch (el.tag) {
    case "path":
      return el.attrs.d ?? "";
    case "circle": {
      const cx = num("cx");
      const cy = num("cy");
      const r = num("r");
      if (r <= 0) return "";
      return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
    }
    case "ellipse": {
      const cx = num("cx");
      const cy = num("cy");
      const rx = num("rx");
      const ry = num("ry");
      if (rx <= 0 || ry <= 0) return "";
      return `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
    }
    case "rect": {
      const x = num("x");
      const y = num("y");
      const w = num("width");
      const h = num("height");
      if (w <= 0 || h <= 0) return "";
      const rx = Math.min(num("rx"), w / 2, h / 2);
      if (rx <= 0) return `M${x} ${y}h${w}v${h}h${-w}Z`;
      return (
        `M${x + rx} ${y}h${w - rx * 2}a${rx} ${rx} 0 0 1 ${rx} ${rx}v${h - rx * 2}` +
        `a${rx} ${rx} 0 0 1 ${rx} ${rx}h${-(w - rx * 2)}a${rx} ${rx} 0 0 1 ${rx} ${-rx}v${-(h - rx * 2)}` +
        `a${rx} ${rx} 0 0 1 ${rx} ${-rx}Z`
      );
    }
    case "polygon":
    case "polyline": {
      const points = (el.attrs.points ?? "")
        .trim()
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => Number.isFinite(n));
      if (points.length < 4) return "";
      let d = `M${points[0]} ${points[1]}`;
      for (let i = 2; i + 1 < points.length; i += 2)
        d += `L${points[i]} ${points[i + 1]}`;
      if (el.tag === "polygon") d += "Z";
      return d;
    }
    case "line":
      return `M${num("x1")} ${num("y1")}L${num("x2")} ${num("y2")}`;
    default:
      return "";
  }
}
