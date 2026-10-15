#!/usr/bin/env python3
"""Extract Kern-usable data from the untouched m3-archive into m3-usable/.

Reads ONLY from docs/design-systems/m3-archive/ (never writes there).
Writes into docs/design-systems/m3-usable/:
  tokens/*.md        concrete M3 token values (color/typography/shape/…)
  components/*.md    per-component specs, measurements, a11y, illustrations
  foundations/*.md   layout / interaction / content / tokens pipeline
  styles/*.md        color / type / shape / elevation / motion / icons / spacing
  react-native-paper.md  Paper v6 theme surface for kern-native
  parity-gaps.md     M3 part -> kern status table (codes B/W/N/G/R)

Usage: python3 docs/design-systems/m3-usable/tools/extract.py
"""
import json, os, re, html as htmllib

ARCH = os.path.join("docs", "design-systems", "m3-archive")
OUT = os.path.join("docs", "design-systems", "m3-usable")
MW = os.path.join(ARCH, "code", "material-web", "tokens")
MWV = os.path.join(MW, "versions", "v0_192")

NOISE_EXACT = {
    "link Copy link Link copied", "Copy link Link copied", "Copy link",
    "Skip to main content", "This website requires JavaScript.",
    "This site uses cookies from Google to deliver its services and to analyze traffic.",
    "Learn more Okay, got it", "Okay, got it",
    "menu_open", "arrow_back Main menu", "pause Pause animations",
    "dark_mode Switch to dark mode", "search", "Close",
    "arrow_left_alt", "arrow_right_alt", "vertical_align_top",
    "expand_all", "expand_more", "expand_less", "arrow_drop_down",
    "keyboard_arrow_down", "folder", "check", "star",
}

FOOTER_TAIL = "Material Design is an adaptable system of guidelines"

def clean_text(t):
    lines = t.split("\n")
    title = lines[0].strip() if lines else ""
    t = "\n".join(lines)
    # drop site chrome header: everything up to "On this page" (keep title)
    if "On this page" in t:
        t = title + "\n\n" + t.split("On this page", 1)[1]
    # drop footer nav + cookie banner tail
    t = re.split(r"arrow_left_alt Previous", t)[0]
    t = re.split(r"This site uses cookies", t)[0]
    out = []
    for ln in t.split("\n"):
        s = ln.strip()
        if not s:
            continue
        if s in NOISE_EXACT:
            continue
        if s.startswith("This site uses cookies"):
            continue
        out.append(ln.rstrip())
    t = "\n".join(out)
    t = re.sub(r"link Copy link Link copied", "", t)
    t = re.sub(r"Copy link Link copied", "", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    i = t.find(FOOTER_TAIL)
    if i > 0:
        t = t[:i].rstrip() + "\n"
    return t.strip()

def spec_page(*parts):
    p = os.path.join(ARCH, "spec", *parts)
    t = os.path.join(p, "text.txt")
    m = os.path.join(p, "meta.json")
    txt = open(t, encoding="utf-8").read() if os.path.exists(t) else ""
    meta = json.load(open(m, encoding="utf-8")) if os.path.exists(m) else {}
    return txt, meta

def dp_measurements(txt):
    found = []
    for m in re.finditer(r"(.{0,60}?\b\d+(?:\s*[x×]\s*\d+)?\s*dp\b.{0,40})", txt):
        s = re.sub(r"\s+", " ", m.group(1)).strip()
        if s not in found:
            found.append(s)
    return found

def illustrations_block(meta, ill_manifest):
    if not meta:
        return "_No archived media._\n"
    def usable(u):
        if len(u) > 500:
            return False
        if any(c in u for c in '"{} ,'):
            return False
        if "tokenName" in u or "displayName" in u or "createTime" in u:
            return False
        return True
    out = []
    shown = 0
    for u in meta.get("images", []):
        if not usable(u) or shown >= 25:
            continue
        shown += 1
        rec = ill_manifest.get(u)
        if rec:
            out.append(f"- `{rec['file']}` ← {u[:110]}")
        else:
            out.append(f"- _pending_ ← {u[:110]}")
    vids = [f"- `{u[:130]}`" for u in meta.get("videos", [])[:20]]
    s = ""
    if out:
        s += "\n".join(out) + "\n"
    if vids:
        s += "\nVideos:\n" + "\n".join(vids) + "\n"
    return s or "_No archived media._\n"

# ---------------------------------------------------------------- tokens
def parse_scss_map(path):
    """parse 'key': if($exclude-hardcoded-values, null, VALUE) version maps."""
    try:
        s = open(path, encoding="utf-8").read()
    except OSError:
        return []
    entries = re.findall(
        r"'([^']+)'\s*:\s*if\(\$exclude-hardcoded-values,\s*null,\s*((?:\([^()]*\)|[^()])+?)\)(?=,?\s*\n)", s)
    if not entries:  # fallback: plain 'key': value maps
        entries = re.findall(r"'([^']+)'\s*:\s*([^,;]+?)(?=\n\s*'|\n\s*\)|\Z)", s, re.S)
    return [(k.strip(), re.sub(r"\s+", " ", v).strip()) for k, v in entries]

def resolve_palette():
    pal = {}
    for f in os.listdir(MWV):
        if "ref-palette" in f and f.endswith(".scss"):
            for k, v in parse_scss_map(os.path.join(MWV, f)):
                pal[k] = v
    return pal

def write_tokens():
    d = os.path.join(OUT, "tokens")
    os.makedirs(d, exist_ok=True)
    pal = resolve_palette()

    # ---- color: resolve sys roles -> palette -> hex
    syscolor = os.path.join(MWV, "_md-sys-color.scss")
    s = open(syscolor, encoding="utf-8").read() if os.path.exists(syscolor) else ""
    # file order: values-dark() first, values-light() second
    dark_chunk, light_chunk = "", ""
    if "@function values-dark" in s:
        after_dark = s.split("@function values-dark", 1)[1]
        if "@function values-light" in after_dark:
            dark_chunk, light_chunk = after_dark.split("@function values-light", 1)
        else:
            dark_chunk = after_dark
    elif "@function values-light" in s:
        light_chunk = s.split("@function values-light", 1)[1]
    def roles(chunk):
        return dict(re.findall(r"'([\w-]+)'\s*:\s*map\.get\(\$deps,\s*'md-ref-palette',\s*'([\w-]+)'\)", chunk))
    light_roles = roles(light_chunk)
    dark_roles = roles(dark_chunk)
    hex_of = {}
    for f in os.listdir(MWV):
        if "ref-palette" in f:
            for k, v in parse_scss_map(os.path.join(MWV, f)):
                m = re.search(r"#[0-9a-fA-F]{3,8}", v)
                if m:
                    hex_of[k] = m.group(0)
    rows = []
    for role in sorted(set(light_roles) | set(dark_roles)):
        l = light_roles.get(role, "")
        dk = dark_roles.get(role, "")
        rows.append(f"| `{role}` | `{l}` {hex_of.get(l,'')} | `{dk}` {hex_of.get(dk,'')} |")
    open(os.path.join(d, "color.md"), "w", encoding="utf-8").write(
        "# M3 sys color — baseline roles → ref palette → hex\n\n"
        f"_Source: `m3-archive/code/material-web/tokens/versions/v0_192/_md-sys-color.scss` "
        f"(seed #6750A4 baseline). Dynamic schemes come from "
        f"`code/material-color-utilities/`. Kern mapping: `kern-tokens.md`._\n\n"
        "| role | light (palette → hex) | dark (palette → hex) |\n"
        "|------|----------------------|---------------------|\n" + "\n".join(rows) + "\n")

    # ---- other sys token files: dump supported tokens + versioned values
    for name, title in [
        ("typescale", "Typography scale"), ("shape", "Shape corners"),
        ("elevation", "Elevation"), ("motion", "Motion"),
        ("state", "State layers"),
    ]:
        sysf = os.path.join(MW, f"_md-sys-{name}.scss")
        sup = []
        if os.path.exists(sysf):
            m = re.search(r"\$supported-tokens:\s*\((.*?)\)", open(sysf, encoding="utf-8").read(), re.S)
            if m:
                sup = re.findall(r"'([^']+)'", m.group(1))
        valfile = next((os.path.join(MWV, f) for f in sorted(os.listdir(MWV))
                        if f.startswith(f"_md-sys-{name}")), None)
        vals = parse_scss_map(valfile) if valfile else []
        if not sup:  # some sys files declare no $supported-tokens; keys ARE the set
            sup = [k for k, _ in vals if not k.endswith(("-top", "-end", "-start"))]
        body = [f"# M3 {title} — tokens\n",
                f"_Sources: `code/material-web/tokens/_md-sys-{name}.scss` + `versions/v0_192/`._\n",
                "## Supported tokens\n"]
        body += [f"- `{t}`" for t in sup] or ["_(none parsed)_"]
        body.append("\n## Versioned values (v0_192)\n")
        body += [f"- `{k}` = `{v}`" for k, v in vals] or ["_(none parsed — read the version file directly)_"]
        open(os.path.join(d, f"{name}.md"), "w", encoding="utf-8").write("\n".join(body) + "\n")
    print("tokens done")

# ---------------------------------------------------------------- components
COMPONENTS = sorted([x for x in os.listdir(os.path.join(ARCH, "spec", "components"))
                     if os.path.isdir(os.path.join(ARCH, "spec", "components", x))])

def write_components(ill):
    d = os.path.join(OUT, "components")
    os.makedirs(d, exist_ok=True)
    for comp in COMPONENTS:
        if comp == "all-buttons":
            continue
        cdir = os.path.join(ARCH, "spec", "components", comp)
        subs = sorted([x for x in os.listdir(cdir) if os.path.isdir(os.path.join(cdir, x))])
        parts = ["# M3 component: " + comp + "\n",
                 f"_Archive: `m3-archive/spec/components/{comp}/` "
                 f"({', '.join(subs)}). Live: https://m3.material.io/components/{comp}/…_\n"]
        all_text = ""
        full = {}
        metas = {}
        for sub in ["overview", "specs", "guidelines", "accessibility"]:
            if sub not in subs:
                continue
            txt, meta = spec_page("components", comp, sub)
            txt = clean_text(txt)
            full[sub] = txt
            metas[sub] = meta
            all_text += "\n" + txt
        parts.append("## Overview (full text)\n\n" + full.get("overview", "_missing_") + "\n")
        dps = dp_measurements(all_text)
        parts.append("## Key measurements (dp, extracted)\n\n" +
                     ("\n".join(f"- {x}" for x in dps[:60]) or "_none found_") + "\n")
        parts.append("## Accessibility (full text)\n\n" + full.get("accessibility", "_missing_") + "\n")
        parts.append("## Specs (full text)\n\n" + full.get("specs", "_missing_") + "\n")
        parts.append("## Guidelines (full text)\n\n" + full.get("guidelines", "_missing_") + "\n")
        for sub in ["overview", "specs", "guidelines", "accessibility"]:
            if sub in metas:
                parts.append(f"## [{sub}] illustrations\n\n" +
                             illustrations_block(metas[sub], ill))
        doc = "\n".join(parts)
        # no truncation: the full M3 text corpus is only ~2.4MB — keep everything
        open(os.path.join(d, comp + ".md"), "w", encoding="utf-8").write(doc)
    print(f"components done ({len([c for c in COMPONENTS if c!='all-buttons'])})")

# ---------------------------------------------------------------- foundations + styles
SECTIONS = {
    "foundations": ["layout", "interaction", "content-design", "design-tokens",
                    "designing", "writing", "building-for-all", "overview",
                    "usability", "customization", "glossary"],
    "styles": ["color", "typography", "shape", "elevation", "motion", "icons", "spacing"],
}

def write_sections(ill):
    for top, subs in SECTIONS.items():
        d = os.path.join(OUT, top)
        os.makedirs(d, exist_ok=True)
        for sub in subs:
            sdir = os.path.join(ARCH, "spec", top, sub)
            if not os.path.isdir(sdir):
                continue
            pages = []
            for dp, dn, fn in os.walk(sdir):
                if "text.txt" in fn:
                    pages.append(dp)
            pages.sort()
            parts = [f"# M3 {top}: {sub}\n",
                     f"_Archive: `m3-archive/spec/{top}/{sub}/` ({len(pages)} pages — full texts below)._ \n"]
            for p in pages:
                rel = os.path.relpath(p, os.path.join(ARCH, "spec"))
                txt = open(os.path.join(p, "text.txt"), encoding="utf-8").read()
                meta = json.load(open(os.path.join(p, "meta.json"), encoding="utf-8"))
                parts.append(f"## {rel}\n\n{clean_text(txt)}\n")
                parts.append(illustrations_block(meta, ill))
            doc = "\n".join(parts)
            # no truncation: keep every page's full text
            open(os.path.join(d, sub + ".md"), "w", encoding="utf-8").write(doc)
    print("foundations/styles done")

# ---------------------------------------------------------------- react-native-paper
def write_paper():
    src = os.path.join(ARCH, "code", "react-native-paper", "src")
    parts = ["# React Native Paper v6 — theme surface for kern-native\n",
             "_Source: `m3-archive/code/react-native-paper/` (SHA in archive manifest) + "
             "`docs-rn-paper/site/` docs mirror._\n"]
    tdir = os.path.join(src, "theme")
    if os.path.isdir(tdir):
        parts.append("## `src/theme/` contents\n")
        for dp, dn, fn in os.walk(tdir):
            for f in sorted(fn):
                if f.endswith((".ts", ".tsx")) and "test" not in f.lower():
                    parts.append(f"- `{os.path.relpath(os.path.join(dp, f), src)}`")
    # theme keys: MD3 light theme file
    for cand in ["theme/themes/v3/LightTheme.tsx", "theme/themes/v3/LightTheme.ts",
                 "styles/themes/v3/LightTheme.tsx", "theme/LightTheme.tsx"]:
        p = os.path.join(src, cand)
        if os.path.exists(p):
            s = open(p, encoding="utf-8").read()
            keys = sorted(set(re.findall(r"^\s{2,}(\w+):", s, re.M)))[:80]
            parts.append(f"\n## MD3 LightTheme keys (`{cand}`)\n")
            parts += [f"- `{k}`" for k in keys]
            break
    comps = sorted([x for x in os.listdir(os.path.join(src, "components"))
                    if not x.startswith((".", "_"))])
    parts.append("\n## Component inventory (`src/components/`)\n")
    parts += [f"- `{c}`" for c in comps]
    open(os.path.join(OUT, "react-native-paper.md"), "w", encoding="utf-8").write("\n".join(parts) + "\n")
    print("paper done")

# ---------------------------------------------------------------- parity gaps
M3_TO_KERN = {
    "app-bars": "top-app-bar", "badges": "badge", "bottom-sheets": "sheet",
    "button-groups": "button-group", "buttons": "button", "cards": "card",
    "carousel": "carousel", "checkbox": "checkbox", "chips": "chip",
    "date-pickers": "calendar", "dialogs": "dialog", "divider": "separator",
    "extended-fab": "extended-fab", "fab-menu": "fab-menu",
    "floating-action-button": "fab", "icon-buttons": "icon-button",
    "lists": "list-item", "loading-indicator": "loader",
    "menus": "menu", "navigation-bar": "navigation-bar",
    "navigation-drawer": "navigation-drawer", "navigation-rail": "navigation-rail",
    "progress-indicators": "progress", "radio-button": "radio-group",
    "search": "search", "segmented-buttons": "segmented-button",
    "side-sheets": "sheet", "sliders": "slider", "snackbar": "snackbar",
    "split-button": "split-button", "switch": "switch", "tabs": "tabs",
    "text-fields": "input/field", "time-pickers": "time-picker",
    "toolbars": "toolbar", "tooltips": "tooltip",
}

def kern_has(name):
    hits = []
    pascal = "".join(w.capitalize() for w in re.split(r"[-/]", name))
    for pkg, plat in [("packages/kern/src/components", "web"),
                      ("packages/kern/src/start", "web"),
                      ("packages/kern-native/src/components", "native")]:
        if not os.path.isdir(pkg):
            continue
        found = False
        for f in os.listdir(pkg):
            base = f[:-4] if f.endswith(".tsx") else f
            if base == name or base.startswith(name + ".") or base.startswith(name + "-"):
                found = True
                break
        if not found:
            # Component living inside a family file (NavigationRail in
            # start/navigation.tsx, SegmentedButton in web-parity.tsx).
            for f in os.listdir(pkg):
                if not f.endswith(".tsx") or ".test." in f or ".rntest." in f:
                    continue
                try:
                    src = open(os.path.join(pkg, f), encoding="utf-8").read()
                except OSError:
                    continue
                if re.search(r"export\s+(function|const|class)\s+" + re.escape(pascal) + r"\b", src):
                    found = True
                    break
        if found:
            hits.append(plat)
    return hits

def write_gaps():
    rows = []
    for comp in sorted(M3_TO_KERN):
        k = M3_TO_KERN[comp]
        alts = [a.strip() for a in k.split("/")]
        plats = set()
        for a in alts:
            plats.update(kern_has(a))
        code = "B" if plats == {"web", "native"} else ("W" if plats == {"web"} else ("N" if plats == {"native"} else "G"))
        rows.append(f"| {comp} | {k} | **{code}** | `components/{comp}.md` |")
    body = ("# M3 → Kern parity gaps (generated, review before use)\n\n"
            "_Codes: **B** both renderers · **W** web only · **N** native only · "
            "**G** gap · **R** rent/wrap. Generated from the kern tree on "
            "2026-10-10 — verify each row against `docs/design-systems/matrix.md` "
            "and the package exports before planning work._\n\n"
            "| M3 part | kern name | status | usable spec |\n"
            "|---------|-----------|--------|-------------|\n" + "\n".join(rows) + "\n\n"
            "## System-level gaps (check, not generated)\n\n"
            "- Dynamic color (MCU `code/material-color-utilities/`) — Kern uses a fixed seed by design; track as non-goal or roadmap.\n"
            "- M3 Expressive variants (toggle buttons, morphing shapes, new sizes) — see per-component `specs` sections.\n"
            "- Date/time range pickers, data-grid beyond basic table, carousel expressive alignment — see `docs/design-systems/README.md` known gaps.\n")
    open(os.path.join(OUT, "parity-gaps.md"), "w", encoding="utf-8").write(body)
    print("gaps done")

def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(os.path.join(OUT, "tools"), exist_ok=True)
    ill = {}
    mp = os.path.join(ARCH, "illustrations", "manifest.json")
    if os.path.exists(mp):
        ill = json.load(open(mp, encoding="utf-8"))
    write_tokens()
    write_components(ill)
    write_sections(ill)
    write_paper()
    write_gaps()
    print("ALL DONE")

if __name__ == "__main__":
    main()
