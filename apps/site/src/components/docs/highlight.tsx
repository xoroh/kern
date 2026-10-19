import type { ReactNode } from "react";

/**
 * Token-derived syntax highlighting — no highlighter dependency.
 *
 * The review's #1 finding was flat grey code blocks. shadcn/Radix/Vercel all
 * ship themed highlighting; this is the site's answer, built to M3 rules:
 * the tokenizer below only *classifies* source text (`tok-keyword`,
 * `tok-string`, …) and every color comes from a `--sys-color-*` role in
 * `styles.css` (light values + `.dark` overrides). No hex lives here or in
 * the theme, so the code blocks repaint with the same tokens the components
 * read — dogfooding, not a vendored TextMate theme.
 *
 * Coverage is deliberately narrow: TSX (every component snippet), bash
 * (install commands), CSS (the one theme import) and JSON (the MCP host
 * config snippets). Anything else renders in the base ink rather than a
 * wrong color — an uncolored token is honest, a miscolored one teaches
 * the wrong grammar.
 */

export type HighlightLanguage = "tsx" | "bash" | "css" | "json";

type Token = { text: string; cls: string | null };

const TSX_KEYWORDS = new Set(
  "import,from,export,default,function,return,const,let,var,new,typeof,if,else,for,while,switch,case,break,continue,in,of,do,try,catch,finally,throw,interface,type,extends,implements,class,enum,as,satisfies,keyof,infer,readonly,async,await,this,super,delete,void,with".split(
    ",",
  ),
);

const TSX_BOOLEANS = new Set(["true", "false", "null", "undefined"]);

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_$]/.test(ch);
}

function isIdentPart(ch: string): boolean {
  return /[A-Za-z0-9_$-]/.test(ch);
}

function isDigit(ch: string): boolean {
  return /[0-9]/.test(ch);
}

/** Read a quoted string starting at `i` (quote already verified). */
function readString(src: string, i: number): { text: string; end: number } {
  const quote = src[i];
  let j = i + 1;
  while (j < src.length) {
    const ch = src[j];
    if (ch === "\\") {
      j += 2;
      continue;
    }
    if (ch === quote) return { text: src.slice(i, j + 1), end: j + 1 };
    // A template literal's ${} stays inside the string token: splitting it
    // would need a nested grammar for one nicety. The fence still reads as
    // a string, which is what it is.
    j += 1;
  }
  return { text: src.slice(i), end: src.length };
}

/** TSX/TS/JS/JSX — one pass, no nesting except comments and strings. */
function tokenizeTsx(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = src.length;
  const push = (text: string, cls: string | null) => {
    if (text) out.push({ text, cls });
  };

  while (i < n) {
    const ch = src[i];
    const next = src[i + 1] ?? "";

    // Line and block comments, plus HTML comments in CDN fences.
    if (ch === "/" && next === "/") {
      let j = i + 2;
      while (j < n && src[j] !== "\n") j += 1;
      push(src.slice(i, j), "tok-comment");
      i = j;
      continue;
    }
    if (ch === "/" && next === "*") {
      const close = src.indexOf("*/", i + 2);
      const end = close < 0 ? n : close + 2;
      push(src.slice(i, end), "tok-comment");
      i = end;
      continue;
    }
    if (ch === "<" && src.startsWith("<!--", i)) {
      const close = src.indexOf("-->", i + 4);
      const end = close < 0 ? n : close + 3;
      push(src.slice(i, end), "tok-comment");
      i = end;
      continue;
    }

    // Strings.
    if (ch === '"' || ch === "'" || ch === "`") {
      const { text, end } = readString(src, i);
      push(text, "tok-string");
      i = end;
      continue;
    }

    // JSX tags: <Name, </Name, <name — the name takes the tag role, and an
    // attribute name before `=` takes the attr role. Member expressions
    // (<Field.Root) color the whole dotted path as one tag.
    if (
      ch === "<" &&
      (isIdentStart(next) || (next === "/" && isIdentStart(src[i + 2] ?? "")))
    ) {
      let j = i + 1;
      if (src[j] === "/") j += 1;
      let k = j;
      while (k < n && (isIdentPart(src[k]) || src[k] === ".")) k += 1;
      push(src.slice(i, j), null);
      push(src.slice(j, k), "tok-tag");
      i = k;
      continue;
    }
    if (
      isIdentStart(ch) &&
      // Attribute position: identifier followed by optional space then `=`
      // opening a quoted or braced value (`variant="x"`, `onClick={() =>}`).
      // A bare `= value` is an assignment or default, not an attribute
      // (`const on = true`, `count = 0`) — those stay neutral.
      (() => {
        let k = i + 1;
        while (k < n && isIdentPart(src[k])) k += 1;
        let m = k;
        while (src[m] === " " || src[m] === "\t") m += 1;
        if (src[m] !== "=" || src[m + 1] === "=" || src[m + 1] === ">")
          return false;
        let v = m + 1;
        while (src[v] === " " || src[v] === "\t") v += 1;
        return (
          src[v] === '"' || src[v] === "'" || src[v] === "{" || src[v] === "`"
        );
      })()
    ) {
      let k = i + 1;
      while (k < n && isIdentPart(src[k])) k += 1;
      push(src.slice(i, k), "tok-attr");
      i = k;
      continue;
    }

    // Numbers.
    if (isDigit(ch) || (ch === "." && isDigit(next))) {
      let k = i + 1;
      while (k < n && /[0-9_.]/.test(src[k])) k += 1;
      push(src.slice(i, k), "tok-number");
      i = k;
      continue;
    }

    // Identifiers: keywords, booleans, types (capitalized), the rest plain.
    // Capitalized words at a text position — line start or right after `>`
    // — stay plain: that is prose inside a text node (`<p>Enter an email.`,
    // panel copy), not a type reference. `import { Button }` still colors
    // because the name follows `{ `, not a text boundary.
    if (isIdentStart(ch)) {
      let k = i + 1;
      while (k < n && isIdentPart(src[k])) k += 1;
      const word = src.slice(i, k);
      let j = i - 1;
      while (src[j] === " " || src[j] === "\t") j -= 1;
      const atTextStart = j < 0 || src[j] === "\n" || src[j] === ">";
      if (TSX_KEYWORDS.has(word)) push(word, "tok-keyword");
      else if (TSX_BOOLEANS.has(word)) push(word, "tok-number");
      else if (/^[A-Z]/.test(word) && !atTextStart) push(word, "tok-type");
      else push(word, null);
      i = k;
      continue;
    }

    push(ch, null);
    i += 1;
  }
  return out;
}

/** Bash — install commands and shell fences. First word is the command. */
function tokenizeBash(src: string): Token[] {
  const out: Token[] = [];
  const lines = src.split("\n");
  lines.forEach((line, li) => {
    if (li > 0) out.push({ text: "\n", cls: null });
    const n = line.length;
    let i = 0;
    while (i < n && (line[i] === " " || line[i] === "\t")) i += 1;
    if (i > 0) out.push({ text: line.slice(0, i), cls: null });
    if (i >= n) return;
    // A `#` that opens the line (after indent) comments to end of line.
    if (line[i] === "#") {
      out.push({ text: line.slice(i), cls: "tok-comment" });
      return;
    }
    let first = true;
    while (i < n) {
      const ch = line[i];
      if (ch === " " || ch === "\t") {
        let k = i + 1;
        while (k < n && (line[k] === " " || line[k] === "\t")) k += 1;
        out.push({ text: line.slice(i, k), cls: null });
        i = k;
        continue;
      }
      // A `#` after whitespace starts a trailing comment; inside a word
      // (a URL fragment) it is just a character.
      if (ch === "#") {
        const prev = line[i - 1] ?? " ";
        if (prev === " " || prev === "\t") {
          out.push({ text: line.slice(i), cls: "tok-comment" });
          return;
        }
        out.push({ text: "#", cls: null });
        i += 1;
        continue;
      }
      if (ch === '"' || ch === "'") {
        const { text, end } = readString(line, i);
        out.push({ text, cls: "tok-string" });
        i = end;
        first = false;
        continue;
      }
      const two = line.slice(i, i + 2);
      if (two === "&&" || two === "||") {
        out.push({ text: two, cls: "tok-operator" });
        i += 2;
        first = true;
        continue;
      }
      if (ch === "|" || ch === "&" || ch === ";") {
        out.push({ text: ch, cls: "tok-operator" });
        i += 1;
        first = true;
        continue;
      }
      if (ch === "\\") {
        out.push({ text: ch, cls: "tok-operator" });
        i += 1;
        continue;
      }
      let k = i;
      while (k < n && !/[\s"'#|&;\\]/.test(line[k])) k += 1;
      const word = line.slice(i, k);
      if (word.startsWith("-") && word.length > 1) {
        out.push({ text: word, cls: "tok-flag" });
      } else if (first) {
        out.push({ text: word, cls: "tok-command" });
        first = false;
      } else {
        out.push({ text: word, cls: null });
      }
      i = k;
    }
  });
  return out;
}

/** CSS — the theme import fence. Properties, at-rules, strings, comments. */
function tokenizeCss(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    const next = src[i + 1] ?? "";
    if (ch === "/" && next === "*") {
      const close = src.indexOf("*/", i + 2);
      const end = close < 0 ? n : close + 2;
      out.push({ text: src.slice(i, end), cls: "tok-comment" });
      i = end;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const { text, end } = readString(src, i);
      out.push({ text, cls: "tok-string" });
      i = end;
      continue;
    }
    if (ch === "@" && isIdentStart(next)) {
      let k = i + 1;
      while (k < n && isIdentPart(src[k])) k += 1;
      out.push({ text: src.slice(i, k), cls: "tok-keyword" });
      i = k;
      continue;
    }
    // Property position: identifier followed by optional space then `:`.
    if (isIdentStart(ch) || (ch === "-" && isIdentStart(next))) {
      let k = i + (ch === "-" ? 1 : 0);
      while (k < n && (isIdentPart(src[k]) || src[k] === "-")) k += 1;
      let m = k;
      while (src[m] === " ") m += 1;
      if (src[m] === ":") {
        if (ch === "-") out.push({ text: "-", cls: null });
        out.push({
          text: src.slice(ch === "-" ? i + 1 : i, k),
          cls: "tok-attr",
        });
        i = k;
        continue;
      }
      out.push({ text: src.slice(i, k), cls: null });
      i = k;
      continue;
    }
    if (ch === "." || ch === "#") {
      let k = i + 1;
      while (k < n && (isIdentPart(src[k]) || src[k] === "-")) k += 1;
      if (k > i + 1) {
        out.push({ text: src.slice(i, k), cls: "tok-tag" });
        i = k;
        continue;
      }
    }
    out.push({ text: ch, cls: null });
    i += 1;
  }
  return out;
}

/**
 * JSON — one small scanner for the config snippets the MCP page emits
 * (host config, `.kern` manifests). Strings stay `tok-string` unless a
 * lookahead colon makes them object keys (`tok-type`), `true/false/null`
 * read as keywords, and `//` comments are tolerated JSONC-style because
 * every snippet on the docs uses them to point at what to edit.
 */
function tokenizeJson(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === '"') {
      let k = i + 1;
      while (k < n && src[k] !== '"') {
        if (src[k] === "\\") k += 1;
        k += 1;
      }
      const end = Math.min(k + 1, n);
      let m = end;
      while (src[m] === " ") m += 1;
      out.push({
        text: src.slice(i, end),
        cls: src[m] === ":" ? "tok-type" : "tok-string",
      });
      i = end;
      continue;
    }
    if (ch === "/" && src[i + 1] === "/") {
      let k = i;
      while (k < n && src[k] !== "\n") k += 1;
      out.push({ text: src.slice(i, k), cls: "tok-comment" });
      i = k;
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === "-" && /[0-9]/.test(src[i + 1] ?? ""))) {
      let k = i + 1;
      while (k < n && /[0-9.eE+]/.test(src[k])) k += 1;
      out.push({ text: src.slice(i, k), cls: "tok-number" });
      i = k;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let k = i;
      while (k < n && /[A-Za-z_.]/.test(src[k])) k += 1;
      out.push({
        text: src.slice(i, k),
        cls: /^(true|false|null)$/.test(src.slice(i, k)) ? "tok-keyword" : "tok-type",
      });
      i = k;
      continue;
    }
    out.push({ text: ch, cls: null });
    i += 1;
  }
  return out;
}

export function tokenize(source: string, language: HighlightLanguage): Token[] {
  if (language === "bash") return tokenizeBash(source);
  if (language === "css") return tokenizeCss(source);
  if (language === "json") return tokenizeJson(source);
  return tokenizeTsx(source);
}

/**
 * The highlighted body shared by every code surface (the `Code` block, the
 * Example Code tab, install commands). Tokens become spans — text stays
 * exact, so copy and the page-markdown export read the same characters the
 * reader sees. React escapes text nodes, so a fence containing `<` can never
 * become markup.
 */
export function HighlightedCode({
  code,
  language = "tsx",
}: {
  code: string;
  language?: HighlightLanguage;
}) {
  const tokens = tokenize(code, language);
  const nodes: ReactNode[] = [];
  let key = 0;
  let buf = "";
  const flush = () => {
    if (buf) {
      nodes.push(buf);
      buf = "";
    }
  };
  for (const t of tokens) {
    if (t.cls === null) {
      buf += t.text;
    } else {
      flush();
      nodes.push(
        <span key={key++} className={t.cls}>
          {t.text}
        </span>,
      );
    }
  }
  flush();
  return <code>{nodes}</code>;
}
