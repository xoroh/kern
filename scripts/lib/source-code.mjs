import ts from "typescript";

/**
 * Strip comments, leaving CODE alone — preserving newlines and every string /
 * template literal verbatim.
 *
 * Why not a naive `//` strip: these files carry class strings such as
 * `"kern-popover-popup w-64 …"`, and a `//` or `/*` inside any literal would
 * swallow real code after it. check-kern's law legs scan the result, so a regex
 * strip here silently changes which violations are reported — it makes the gate
 * quieter in exactly the way a gate must never become quieter.
 *
 * Scanner-based rather than string-walking: it understands template literals and
 * JSX text, so a `title="…themes/brand.json"` attribute and an explanatory
 * comment both drop out while the code that actually imports stays.
 */
export function codeOnly(source) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    /* skipTrivia */ false,
    ts.LanguageVariant.Standard,
    source,
  );
  let out = "";
  for (
    let token = scanner.scan();
    token !== ts.SyntaxKind.EndOfFileToken;
    token = scanner.scan()
  ) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      // Replace comment BODIES with spaces so line/column numbers survive.
      out += source
        .slice(scanner.getTokenPos(), scanner.getTextPos())
        .replace(/[^\r\n]/g, " ");
      continue;
    }
    out += scanner.getTokenText();
  }
  return out;
}
