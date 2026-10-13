import ts from "typescript";

/** Remove comments, but preserve quoted tokens and original line positions. */
export function elevationCode(source) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    source,
  );
  const comments = [];
  for (
    let token = scanner.scan();
    token !== ts.SyntaxKind.EndOfFileToken;
    token = scanner.scan()
  ) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      comments.push([scanner.getTokenPos(), scanner.getTextPos()]);
    }
  }
  let code = source;
  for (const [start, end] of comments.reverse()) {
    code =
      code.slice(0, start) +
      code.slice(start, end).replace(/[^\r\n]/g, " ") +
      code.slice(end);
  }
  return code;
}

/** Every measured level must be allowed; one matching variant is insufficient. */
export function classifyElevation(spec, levels) {
  if (
    levels?.some((level) => !Number.isInteger(level) || level < 0 || level > 5)
  ) {
    throw new Error(
      "Invalid elevation measurement: expected integer levels 0–5",
    );
  }
  if (!spec) return "NO-SPEC";
  if (levels?.length)
    return levels.every((level) => spec.variants.includes(level))
      ? "ASSERTED"
      : "MISMATCH";
  return spec.variants.includes(0) ? "ABSENT-0" : "GAP";
}
