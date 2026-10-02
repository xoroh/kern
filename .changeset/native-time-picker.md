---
"@xoroh/kern-native": minor
---

Native `TimePicker` — three roving fields, one normalised 24-hour value.

The second consumer of the roving primitive, and the **opposite shape** from
Carousel: the web contract is a roving tabindex *per field*, so three fields are
**three** tab stops. One roving model per field is what produces that; a shared
axis would make the whole picker one stop and a keyboard user could never reach
the minutes.

The value is always 24-hour internally — choosing "9" + PM reports `hours: 21`.
12-hour rendering is presentation and never state.

**A platform gap recorded rather than papered over:** React Native's `Role` union
has **no `listbox`**. It carries `list`, `listitem`, `option` and `menuitem`, so
a listbox of options is announced natively as a **list**, which does not carry
the selection semantics a listbox does. A screen reader on native hears "list"
where the web says "listbox". The per-option `selected` state carries the
selection itself, so the information survives — only the container's implicit
promise is lost.