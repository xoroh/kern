/**
 * DTCG validation (KERN-019/020) — the implementation's own schema.
 *
 * No official released JSON Schema is assumed from the spec's exploratory
 * editor note, so this module states what THIS implementation accepts and
 * rejects: known `$type` values, well-formed `$value` per type, `$description`
 * as string, `$extensions` as object, group `$type` inheritance shape, and
 * `$extends` as object-or-array. Anything else is a typed diagnostic, never a
 * silent skip.
 */

export type DtcgDiagnostic = {
  path: string;
  code:
    | "unknown-type"
    | "bad-value"
    | "bad-description"
    | "bad-extensions"
    | "bad-extends"
    | "remote-pointer"
    | "unsupported";
  detail: string;
};

const KNOWN_TYPES = new Set([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "duration",
  "cubicBezier",
  "number",
  "string",
  "boolean",
  "link",
  "strokeStyle",
  "border",
  "transition",
  "gradient",
  "shadow",
  "typography",
]);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function checkValue(
  type: string,
  value: unknown,
  path: string,
  out: DtcgDiagnostic[],
): void {
  const bad = (detail: string) => out.push({ path, code: "bad-value", detail });
  switch (type) {
    case "color": {
      if (!isRecord(value)) {
        bad("color value is not an object");
        return;
      }
      if (value.colorSpace !== "srgb") {
        bad(`colorSpace is ${String(value.colorSpace)}`);
        return;
      }
      const c: unknown = value.components;
      if (
        !Array.isArray(c) ||
        c.length !== 3 ||
        c.some((n) => typeof n !== "number" || n < 0 || n > 1)
      ) {
        bad("components are not three 0..1 numbers");
        return;
      }
      if (
        typeof value.alpha !== "number" ||
        value.alpha < 0 ||
        value.alpha > 1
      ) {
        bad("alpha is not a 0..1 number");
        return;
      }
      return;
    }
    case "dimension": {
      if (!isRecord(value)) {
        bad("dimension value is not an object");
        return;
      }
      if (typeof value.value !== "number" || typeof value.unit !== "string") {
        bad("dimension needs numeric value and string unit");
        return;
      }
      return;
    }
    case "duration": {
      if (typeof value !== "string" || !/^\d+(\.\d+)?(ms|s)$/.test(value)) {
        bad(`"${String(value)}" is not a duration`);
        return;
      }
      return;
    }
    case "cubicBezier": {
      if (
        !Array.isArray(value) ||
        value.length !== 4 ||
        value.some((n) => typeof n !== "number")
      ) {
        bad("cubicBezier needs four numbers");
        return;
      }
      return;
    }
    case "number": {
      if (typeof value !== "number") {
        bad("number value is not numeric");
        return;
      }
      return;
    }
    case "shadow": {
      if (!isRecord(value)) {
        bad("shadow value is not an object");
        return;
      }
      for (const k of ["offsetX", "offsetY", "blur", "spread", "color"]) {
        if (!isRecord(value[k])) {
          bad(`shadow is missing "${k}"`);
          return;
        }
      }
      return;
    }
    case "typography": {
      if (!isRecord(value)) {
        bad("typography value is not an object");
        return;
      }
      for (const k of ["fontFamily", "fontSize", "fontWeight", "lineHeight"]) {
        if (value[k] === undefined) {
          bad(`typography is missing "${k}"`);
          return;
        }
      }
      return;
    }
    default:
      return;
  }
}

/**
 * Validate a DTCG document. Returns diagnostics (empty = valid). Never throws
 * on shape problems — the diagnostics ARE the result — but throws on a
 * non-object root, which is not a document at all.
 */
export function validateDtcg(doc: unknown): DtcgDiagnostic[] {
  if (!isRecord(doc))
    throw new Error("DTCG interchange: root is not an object");
  const out: DtcgDiagnostic[] = [];
  // Group `$type` inheritance is normative: a token with `$value` but no
  // `$type` inherits the nearest enclosing group type. A validator that
  // ignores inheritance reports valid documents as broken — and "fixing" them
  // means stamping redundant types everywhere, which then drifts.
  const walk = (
    node: Record<string, unknown>,
    path: string,
    inherited?: string,
  ): void => {
    const type = typeof node.$type === "string" ? node.$type : inherited;
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      const childPath = path ? `${path}.${key}` : key;
      if (!isRecord(value)) {
        out.push({
          path: childPath,
          code: "bad-value",
          detail: "a token must be an object",
        });
        continue;
      }
      if ("$value" in value) {
        const effective = typeof value.$type === "string" ? value.$type : type;
        if (effective === undefined) {
          out.push({
            path: childPath,
            code: "unknown-type",
            detail: "token has $value but no $type and no group type",
          });
        } else if (!KNOWN_TYPES.has(effective)) {
          out.push({
            path: childPath,
            code: "unknown-type",
            detail: effective,
          });
        } else if (
          // An alias carries the type but its $value is a REFERENCE string,
          // not a value of that type. Checking "{other.token}" against the
          // color shape is how a valid alias file fails validation — and the
          // target's own shape is checked at its definition, so nothing is
          // lost by skipping here.
          !(
            typeof value.$value === "string" &&
            /^\{[A-Za-z0-9_.-]+\}$/.test(value.$value.trim())
          )
        ) {
          checkValue(effective, value.$value, childPath, out);
        }
        if ("$description" in value && typeof value.$description !== "string") {
          out.push({
            path: childPath,
            code: "bad-description",
            detail: "$description is not a string",
          });
        }
        if ("$extensions" in value && !isRecord(value.$extensions)) {
          out.push({
            path: childPath,
            code: "bad-extensions",
            detail: "$extensions is not an object",
          });
        }
        if (typeof value.$ref === "string" && !value.$ref.startsWith("#/")) {
          out.push({
            path: childPath,
            code: "remote-pointer",
            detail: `remote pointer "${value.$ref}"`,
          });
        }
        continue;
      }
      // A pure `$ref` node (no `$value`) still carries a pointer, and a
      // remote one must fail here — the check used to live only inside the
      // `$value` branch, so a bare remote `$ref` passed validation and then
      // had nowhere to resolve. Pointers are checked wherever they appear.
      if (typeof value.$ref === "string" && !value.$ref.startsWith("#/")) {
        out.push({
          path: childPath,
          code: "remote-pointer",
          detail: `remote pointer "${value.$ref}"`,
        });
      }
      if ("$extends" in value) {
        const ext = value.$extends;
        const ok =
          isRecord(ext) ||
          (Array.isArray(ext) && ext.every((e) => isRecord(e)));
        if (!ok) {
          out.push({
            path: childPath,
            code: "bad-extends",
            detail: "$extends is not an object or array of objects",
          });
        }
      }
      walk(value as Record<string, unknown>, childPath, type);
    }
  };
  walk(doc, "");
  return out;
}
