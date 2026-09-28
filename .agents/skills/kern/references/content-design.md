> **Kern note:** MD3 content-design canon — writing, notifications, alt text, truncation. Structure and behavior only, no color impact. Highest value for dense operator UIs.

# MD3 Content Design

## Voice and Casing

AP style; sentence case everywhere (titles, headings, labels, menus, app bars, buttons). Scannable headings; explain consequences neutrally; write globally so strings localize.

## Notifications

User-centric, front-loaded. Title < 29 chars, collapsed < 40, expanded < 80. Buttons 1–2 words. Day-specific dates, never today/tomorrow. No product-name repeat. In-context opt-out. SMS < 160 Latin / < 134 non-Latin chars. Emoji sparingly, never for bad news. No dynamic text in headlines.

## Alt Text and Media

Decorative images get `alt=""`. Meaning over detail, ≤ 140 chars, no "image of" prefix, context-aware. Charts follow `Summary of [data] + [reason]` plus a data link. No essential text embedded in images; captions aid, never duplicate.

## Truncation and Resize

Wrap first with flexible containers; ellipsis only with a tooltip or link fallback. Text must survive truncation, wrap, zoom, and translation. One primary task per page with empty space around it; the CTA is the largest element; body copy 40–60 chars/line.

## Kern Audit Additions

Sentence case, scannable headings, alt-text presence and quality, truncation and resize resilience, notification caps. Type separates hierarchies; motion stays sparse so content stays primary.
