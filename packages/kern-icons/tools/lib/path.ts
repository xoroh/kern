/**
 * SVG path-data parsing and affine transformation.
 *
 * Icons ship as raw `d` strings on a 24x24 grid so both the web and the
 * React Native renderer can emit a single `<path>` element. Upstream Material
 * Symbols are authored on a 960x960 grid with a `0 -960 960 960` viewBox, so
 * every path has to be re-based onto the 24-unit grid at build time.
 *
 * The scanner is deliberately strict: it follows the SVG 1.1 path grammar
 * (comma-or-whitespace separators, sign-as-separator, `1.5.5` number splitting,
 * single-digit arc flags) and throws on anything it cannot parse rather than
 * emitting silently corrupted geometry.
 */

/** Number of coordinate arguments each path command consumes, per group. */
const ARG_COUNT: Readonly<Record<string, number>> = {
  m: 2,
  l: 2,
  t: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  a: 7,
  z: 0,
};

const COMMANDS = new Set(Object.keys(ARG_COUNT));

export interface PathTransform {
  /** Uniform scale applied to every coordinate. */
  readonly scale: number;
  /** Translation applied to absolute X coordinates only. */
  readonly translateX: number;
  /** Translation applied to absolute Y coordinates only. */
  readonly translateY: number;
  /** Decimal places kept after scaling. Default 3. */
  readonly precision?: number;
}

export interface ViewBox {
  readonly minX: number;
  readonly minY: number;
  readonly width: number;
  readonly height: number;
}

/** Parses an SVG `viewBox` attribute value. Returns `null` when absent/malformed. */
export function parseViewBox(raw: string | null | undefined): ViewBox | null {
  if (!raw) return null;
  const parts = raw
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  const [minX, minY, width, height] = parts;
  if (
    minX === undefined ||
    minY === undefined ||
    width === undefined ||
    height === undefined
  ) {
    return null;
  }
  if (width <= 0 || height <= 0) return null;
  return { minX, minY, width, height };
}

/**
 * Builds the transform that maps an arbitrary source viewBox onto the canonical
 * `0 0 size size` grid, preserving aspect ratio and centring the artwork when
 * the source is not square.
 */
export function viewBoxToTransform(box: ViewBox, size: number): PathTransform {
  const scale = Math.min(size / box.width, size / box.height);
  const scaledWidth = box.width * scale;
  const scaledHeight = box.height * scale;
  return {
    scale,
    translateX: (size - scaledWidth) / 2 - box.minX * scale,
    translateY: (size - scaledHeight) / 2 - box.minY * scale,
  };
}

class PathScanner {
  #pos = 0;
  readonly #input: string;

  constructor(input: string) {
    this.#input = input;
  }

  /**
   * Whether the input is exhausted.
   *
   * Deliberately a method, not a getter: `peekCommand` and the readers advance
   * `#pos`, so a property access would be narrowed by control-flow analysis
   * across those calls and TypeScript would conclude the later checks are dead.
   */
  isDone(): boolean {
    return this.#pos >= this.#input.length;
  }

  #skipSeparators(): void {
    while (this.#pos < this.#input.length) {
      const c = this.#input.charCodeAt(this.#pos);
      // space, tab, newline, carriage return, form feed, comma
      if (c === 32 || c === 9 || c === 10 || c === 13 || c === 12 || c === 44) {
        this.#pos++;
        continue;
      }
      break;
    }
  }

  peekCommand(): string | null {
    this.#skipSeparators();
    if (this.isDone()) return null;
    const c = this.#input[this.#pos];
    return c !== undefined && COMMANDS.has(c.toLowerCase()) ? c : null;
  }

  takeCommand(): string {
    const c = this.peekCommand();
    if (!c) throw new Error(`Expected a path command at index ${this.#pos}`);
    this.#pos++;
    return c;
  }

  /** Arc large-arc / sweep flags are single digits and may be run together. */
  readFlag(): 0 | 1 {
    this.#skipSeparators();
    const c = this.#input[this.#pos];
    if (c !== "0" && c !== "1") {
      throw new Error(
        `Expected an arc flag at index ${this.#pos}, got ${JSON.stringify(c)}`,
      );
    }
    this.#pos++;
    return c === "1" ? 1 : 0;
  }

  readNumber(): number {
    this.#skipSeparators();
    const start = this.#pos;
    const s = this.#input;

    if (s[this.#pos] === "+" || s[this.#pos] === "-") this.#pos++;

    let digits = 0;
    while (
      this.#pos < s.length &&
      (s[this.#pos] ?? "") >= "0" &&
      (s[this.#pos] ?? "") <= "9"
    ) {
      this.#pos++;
      digits++;
    }
    if (s[this.#pos] === ".") {
      this.#pos++;
      while (
        this.#pos < s.length &&
        (s[this.#pos] ?? "") >= "0" &&
        (s[this.#pos] ?? "") <= "9"
      ) {
        this.#pos++;
        digits++;
      }
    }
    if (digits === 0) {
      this.#pos = start;
      throw new Error(
        `Expected a number at index ${start} in ${JSON.stringify(s.slice(start, start + 24))}`,
      );
    }

    // Exponent. A leading `-` only belongs to the exponent when we already saw `e`.
    if (s[this.#pos] === "e" || s[this.#pos] === "E") {
      const mark = this.#pos;
      this.#pos++;
      if (s[this.#pos] === "+" || s[this.#pos] === "-") this.#pos++;
      let expDigits = 0;
      while (
        this.#pos < s.length &&
        (s[this.#pos] ?? "") >= "0" &&
        (s[this.#pos] ?? "") <= "9"
      ) {
        this.#pos++;
        expDigits++;
      }
      if (expDigits === 0) this.#pos = mark;
    }

    return Number(s.slice(start, this.#pos));
  }
}

function roundTo(value: number, precision: number): string {
  const factor = 10 ** precision;
  const rounded = Math.round(value * factor) / factor;
  // Avoid `-0` and exponent notation; coordinates live in [0, 24] after scaling.
  if (Object.is(rounded, -0)) return "0";
  return String(rounded);
}

/**
 * Minimal serializer that drops separators wherever the SVG grammar allows it.
 * A separator may be omitted before a leading `-`, and before a leading `.`
 * only when the previous number had no fractional part (`12` + `.5` would
 * otherwise collapse into the single number `12.5`).
 */
class PathWriter {
  #out = "";
  #lastWasNumber = false;
  #lastHadFraction = false;

  toString(): string {
    return this.#out;
  }

  command(c: string): void {
    this.#out += c;
    this.#lastWasNumber = false;
    this.#lastHadFraction = false;
  }

  number(raw: string): void {
    const startsNegative = raw[0] === "-";
    const startsFraction = raw[0] === ".";
    const canOmit =
      startsNegative ||
      (startsFraction && this.#lastWasNumber && !this.#lastHadFraction);
    if (this.#out.length > 0 && !canOmit && this.#lastWasNumber)
      this.#out += " ";
    this.#out += raw;
    this.#lastWasNumber = true;
    this.#lastHadFraction = raw.includes(".");
  }
}

/**
 * Re-bases SVG path data onto the 24-unit grid.
 *
 * Relative commands are scaled but never translated; absolute commands are
 * scaled and translated. Arc radii are scaled, the x-axis rotation is left
 * alone, and both arc flags are copied verbatim.
 */
export function transformPathData(d: string, t: PathTransform): string {
  const precision = t.precision ?? 3;
  const scanner = new PathScanner(d);
  const writer = new PathWriter();
  let isFirstCommand = true;

  const sx = (v: number, relative: boolean) =>
    roundTo(v * t.scale + (relative ? 0 : t.translateX), precision);
  const sy = (v: number, relative: boolean) =>
    roundTo(v * t.scale + (relative ? 0 : t.translateY), precision);

  while (!scanner.isDone()) {
    const command = scanner.peekCommand();
    if (command === null) {
      if (scanner.isDone()) break;
      throw new Error(
        `Unexpected trailing input in path data: ${JSON.stringify(d)}`,
      );
    }
    scanner.takeCommand();
    writer.command(command);

    const lower = command.toLowerCase();
    if (lower === "z") {
      isFirstCommand = false;
      continue;
    }

    // SVG 1.1: "If a relative moveto (m) appears as the first element of the
    // path, then it is treated as a pair of absolute coordinates." The pen
    // starts at the origin so the delta reads the same either way — but the
    // viewBox translation must still be applied, or the whole glyph lands
    // off-grid. ~9% of Material Symbols open with a lowercase `m`.
    //
    // This applies to the *first coordinate pair only*: `m1 2 3 4` is an
    // absolute moveto followed by a relative lineto, so the flag is per group.
    const leadingMoveto = isFirstCommand && lower === "m" && command === lower;
    isFirstCommand = false;

    const argc = ARG_COUNT[lower];
    let firstGroup = true;

    // Argument groups repeat the command implicitly; `m` degrades to `l`, which
    // is a renderer concern, not ours — we never rewrite the command letter.
    for (;;) {
      const args: Array<number> = [];
      for (let i = 0; i < (argc ?? 0); i++) {
        args.push(
          lower === "a" && (i === 3 || i === 4)
            ? scanner.readFlag()
            : scanner.readNumber(),
        );
      }

      const relative = command === lower && !(leadingMoveto && firstGroup);
      firstGroup = false;

      if (lower === "a") {
        const rx = args[0] ?? 0;
        const ry = args[1] ?? 0;
        const rotation = args[2] ?? 0;
        const largeArc = args[3] ?? 0;
        const sweep = args[4] ?? 0;
        const x = args[5] ?? 0;
        const y = args[6] ?? 0;
        writer.number(roundTo(rx * t.scale, precision));
        writer.number(roundTo(ry * t.scale, precision));
        writer.number(roundTo(rotation, precision));
        writer.number(String(largeArc));
        writer.number(String(sweep));
        writer.number(sx(x, relative));
        writer.number(sy(y, relative));
      } else if (lower === "h") {
        writer.number(sx(args[0] ?? 0, relative));
      } else if (lower === "v") {
        writer.number(sy(args[0] ?? 0, relative));
      } else {
        for (let i = 0; i < args.length; i += 2) {
          writer.number(sx(args[i] ?? 0, relative));
          writer.number(sy(args[i + 1] ?? 0, relative));
        }
      }

      // Another group follows only if the next non-separator token is a number
      // (or a run-together negative/fraction) rather than a new command.
      const next = scanner.peekCommand();
      if (next !== null) break;
      if (scanner.isDone()) break;
    }
  }

  return writer.toString();
}

/** Concatenates several `d` strings into one. Valid because each starts a new subpath. */
export function concatPathData(parts: ReadonlyArray<string>): string {
  return parts.filter((p) => p.length > 0).join("");
}

/**
 * Structural sanity check for emitted path data.
 *
 * Catches the failure modes a transform can actually produce — a non-finite
 * coordinate leaking in as `NaN`/`Infinity`, an empty result, or output that no
 * longer starts with a moveto — without re-implementing a full parser.
 */
export function inspectPathData(d: string): string | null {
  if (d.length === 0) return "path data is empty";
  if (d.includes("NaN")) return "path data contains NaN";
  if (d.includes("Infinity")) return "path data contains Infinity";
  if (d.includes("undefined")) return "path data contains undefined";
  if (!/^[Mm]/.test(d))
    return `path data must start with a moveto, got "${d.slice(0, 8)}"`;

  const scanner = new PathScanner(d);
  try {
    // A full re-parse proves the serialization round-trips: separator omission
    // is only legal in specific places, and this is what catches a mistake.
    let commands = 0;
    while (!scanner.isDone()) {
      const command = scanner.peekCommand();
      if (command === null) {
        if (scanner.isDone()) break;
        return "path data has trailing input that is not a command";
      }
      scanner.takeCommand();
      commands++;
      const lower = command.toLowerCase();
      if (lower === "z") continue;
      const argc = ARG_COUNT[lower];
      for (;;) {
        for (let i = 0; i < (argc ?? 0); i++) {
          const value =
            lower === "a" && (i === 3 || i === 4)
              ? scanner.readFlag()
              : scanner.readNumber();
          if (!Number.isFinite(value))
            return "path data contains a non-finite coordinate";
        }
        if (scanner.peekCommand() !== null || scanner.isDone()) break;
      }
    }
    if (commands === 0) return "path data contains no commands";
  } catch (err) {
    return `path data does not re-parse: ${err instanceof Error ? err.message : String(err)}`;
  }

  return null;
}

export interface PathBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

/**
 * Bounding box of a path's **on-curve** points.
 *
 * Relative commands are resolved against the running current point, so this
 * measures where the pen actually goes — unlike scanning raw numbers, where a
 * relative delta can legitimately be larger than the icon itself.
 *
 * Two documented approximations, both deliberate:
 * - Bézier control points are excluded. They can sit outside the curve, so
 *   including them would over-report and fail healthy icons.
 * - Arcs contribute their endpoints only, not the bulge between them.
 *
 * The result is therefore a subset of the true ink box, which makes it correct
 * for the invariant we assert in tests ("nothing wanders off the grid") and
 * wrong for tight layout metrics. Use `resolveIconSize` for layout.
 */
export function pathBounds(d: string): PathBounds {
  const scanner = new PathScanner(d);
  let x = 0;
  let y = 0;
  let subpathX = 0;
  let subpathY = 0;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const mark = (px: number, py: number): void => {
    if (px < minX) minX = px;
    if (py < minY) minY = py;
    if (px > maxX) maxX = px;
    if (py > maxY) maxY = py;
  };

  while (!scanner.isDone()) {
    const command = scanner.peekCommand();
    if (command === null) break;
    scanner.takeCommand();
    const lower = command.toLowerCase();
    // Lowercase command letter == relative. (Uppercase is absolute.)
    const relative = command === lower;

    if (lower === "z") {
      x = subpathX;
      y = subpathY;
      mark(x, y);
      continue;
    }

    const argc = ARG_COUNT[lower];
    let firstGroup = true;
    // Argument groups repeat the command implicitly, so keep consuming until the
    // next token is a command letter or the input ends.
    for (;;) {
      const a: Array<number> = [];
      for (let i = 0; i < (argc ?? 0); i++) {
        a.push(
          lower === "a" && (i === 3 || i === 4)
            ? scanner.readFlag()
            : scanner.readNumber(),
        );
      }

      const abs = (value: number, current: number): number =>
        relative ? current + value : value;

      switch (lower) {
        case "m":
          x = abs(a[0] ?? 0, x);
          y = abs(a[1] ?? 0, y);
          // Only the first pair is a moveto; implicit repeats are linetos and
          // must not move the subpath start, or a later `z` closes to the wrong
          // point and every following relative command drifts.
          if (firstGroup) {
            subpathX = x;
            subpathY = y;
          }
          mark(x, y);
          break;
        case "l":
        case "t":
          x = abs(a[0] ?? 0, x);
          y = abs(a[1] ?? 0, y);
          mark(x, y);
          break;
        case "h":
          x = abs(a[0] ?? 0, x);
          mark(x, y);
          break;
        case "v":
          y = abs(a[0] ?? 0, y);
          mark(x, y);
          break;
        case "c":
          // Endpoint is the last pair; the two control points are skipped (see
          // the doc comment above).
          x = abs(a[4] ?? 0, x);
          y = abs(a[5] ?? 0, y);
          mark(x, y);
          break;
        case "s":
        case "q":
          x = abs(a[2] ?? 0, x);
          y = abs(a[3] ?? 0, y);
          mark(x, y);
          break;
        case "a":
          x = abs(a[5] ?? 0, x);
          y = abs(a[6] ?? 0, y);
          mark(x, y);
          break;
        default:
          break;
      }

      firstGroup = false;
      if (scanner.peekCommand() !== null || scanner.isDone()) break;
    }
  }

  return { minX, minY, maxX, maxY };
}

/** Inverse of {@link viewBoxToTransform}, used to prove a transform round-trips. */
export function invertTransform(t: PathTransform): PathTransform {
  const scale = 1 / t.scale;
  return {
    scale,
    translateX: -t.translateX * scale,
    translateY: -t.translateY * scale,
    precision: t.precision,
  };
}
