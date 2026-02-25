# Design Guide — Hero Typography

**Status:** Canonical
**Last updated:** 2026-02-25

---

## Hero Text Width Rule

Hero quote / headline text spans the **full content column width** — no additional `max-width` constraint on the text itself. The parent container's padding defines the right edge.

The text naturally wraps at the same right edge as the body content below it, creating visual alignment between the hero and the page body.

### Content area geometry (all pages)

```
Page max-width:   var(--max-w) = 1120px
Horizontal pad:   64px left + 64px right
Content width:    992px  (1120 − 128)
```

---

## Per-element rules

| Element | `max-width` | Notes |
|---|---|---|
| Hero headline / quote (`clamp(32px–52px)`) | **none** — fills full content width | `text-wrap: balance` handles line breaks |
| Hero subtitle / body copy (`17px`) | **none** — fills full content width | Right edge aligns with quote above and body below |
| Section headings inside body | inherited from column `1fr` | |

---

## Applied pages

| Page | Headline class | Width |
|---|---|---|
| `index.html` | `.hero__heading` | `max-width: 680px` ¹ |
| `projects.html` | `.hero__heading` | `max-width: 680px` ¹ |
| `process.html` | `.process-hero__quote` | no `max-width` — full content width |

¹ `index.html` and `projects.html` share a slightly shorter heading because the headline text is shorter (single phrase). When the headline is a full sentence spanning two natural lines, remove the `max-width` cap so the right edge reaches the content boundary.

**Rule of thumb:** if the headline wraps to 2+ lines at the target font size, remove `max-width`. If it's a short single phrase, `680px` is fine.

---

## `text-wrap: balance` requirement

All hero headlines must include `text-wrap: balance`. This prevents orphaned single words on the last line and distributes text across lines evenly without a manual `<br>`.

Never use a hard `<br>` in hero text — let the browser balance it.

---

## Color tokens for hero text

| Role | Token | Value |
|---|---|---|
| Headline (light weight) | `var(--ink-60)` | `#86868B` |
| Headline emphasis (bold) | `var(--ink-100)` | `#1D1D1F` |
| Subtitle / body | `var(--ink-80)` | `#6E6E73` |
| Quote / aside | `var(--ink-60)` | `#86868B` |

---

## Font scale reference

```css
/* Hero headline — all pages */
font-size: clamp(32px, 4vw, 52px);
font-weight: 200;
line-height: 1.08–1.12;
letter-spacing: -0.03em;

/* Hero subtitle */
font-size: 17px;
font-weight: 300;
line-height: 1.65;
```
