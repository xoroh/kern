---
"@xoroh/kern-mcp": patch
---

Mark `design_audit` advisory-only: the tool description no longer promises
scoring, and the payload carries `advisoryOnly: true` beside the twelve
categories. Nothing measured changes — the categories name what to check,
and agents must treat the output as inspection headings, not an audit
result.
