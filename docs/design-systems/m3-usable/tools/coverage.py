#!/usr/bin/env python3
"""Coverage proof: docs/components.md rows x package exports x live pages."""
import re, subprocess, sys

rows = {"web": [], "mobile": []}
sec = None
for line in open("docs/components.md", encoding="utf-8"):
    if line.startswith("## Web"):
        sec = "web"
    elif line.startswith("## Native"):
        sec = "mobile"
    elif line.startswith("## "):
        sec = None
    m = re.match(r"\| `([^`]+)` \| `([^`]+)` \| (real|stub) \|$", line.strip())
    if m and sec:
        rows[sec].append((m.group(1), m.group(2), m.group(3)))

web_index = open("packages/kern/src/components/index.ts", encoding="utf-8").read()
import glob as _glob
web_start = "\n".join(
    open(f, encoding="utf-8").read()
    for f in _glob.glob("packages/kern/src/start/*.tsx")
    if "test" not in f
)
nat_files = "\n".join(
    open(f, encoding="utf-8").read()
    for f in _glob.glob("packages/kern-native/src/components/*.tsx")
)
nat_index = open("packages/kern-native/src/index.ts", encoding="utf-8").read()

def has_export(src, name):
    return re.search(r"\b" + re.escape(name) + r"\b", src) is not None

def page_status(slug):
    try:
        r = subprocess.run(["curl", "-sL", "-o", "/dev/null", "-w", "%{http_code}",
                            "--max-time", "15", f"http://127.0.0.1:3000/components/{slug}"],
                           capture_output=True, text=True, timeout=30)
        return r.stdout.strip()
    except Exception:
        return "ERR"

print(f"inventory rows: web={len(rows['web'])} mobile={len(rows['mobile'])}")
issues = []
live_ok = 0
for plat, srcs in (("web", [web_index, web_start]), ("mobile", [nat_index, nat_files])):
    for name, export, status in rows[plat]:
        in_code = any(has_export(s, export) for s in srcs if s)
        code = "ok" if in_code else ("STUB-OK" if status == "stub" else "MISSING-EXPORT")
        page = page_status(f"{plat}/{name}")
        if page == "200":
            live_ok += 1
        flag = ""
        if code != "ok" or (status == "real" and page != "200"):
            flag = "  <-- ISSUE"
            issues.append((plat, name, export, status, code, page))
        print(f"{plat:6} {name:28} {export:28} {status:4} code={code:12} page={page}{flag}")

print(f"\nlive pages 200: {live_ok}")
print(f"issues: {len(issues)}")
for i in issues:
    print("ISSUE:", i)
