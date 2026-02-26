# Design Guide — Case Study Layout System

**Last updated:** February 2026
**Applies to:** All pages in `case-studies/`

---

## Overview

All case studies use the STARD layout system: a two-column grid with a sticky Table of Contents sidebar on the left and a scrollable content column on the right. All shared CSS lives in `css/case-study.css`. Each case study page holds only page-specific overrides in its inline `<style>` block.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  NAV                                                │
├─────────────────────────────────────────────────────┤
│  HERO (.cs-hero)                                    │
├─────────────────────────────────────────────────────┤
│  OVERVIEW BAR (.overview-bar)                       │
├─────────────────────────────────────────────────────┤
│  TAGS + METRICS                                     │
├──────────────┬──────────────────────────────────────┤
│  TOC         │  content-col                         │
│  (200px)     │  (1fr)                               │
│  sticky      │  ┌──────────────────────────────┐   │
│              │  │  .stard-section (×N)          │   │
│              │  │  .recognition                 │   │
│              │  └──────────────────────────────┘   │
├──────────────┴──────────────────────────────────────┤
│  PREV / NEXT                                        │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

Grid definition: `display: grid; grid-template-columns: 200px 1fr; gap: 64px`

---

## The #1 Layout Rule

**All content sections must live inside the `content-col` markers.**
Anything placed outside will break the two-column layout.

```html
<!-- ── content-col START ─────────────────────────────────── -->
<div>

  <div id="my-section" class="stard-section reveal">
    ...
  </div>

  <div id="recognition" class="recognition reveal">
    ...
  </div>

</div>
<!-- ── content-col END ───────────────────────────────────── -->
```

The full wrapper structure with landmarks:

```html
<!-- ═══ cs-content: LAYOUT GRID (toc sidebar | content column) ═══ -->
<div class="cs-content">

  <aside class="toc reveal">...</aside>

  <!-- ── content-col START ─────────────────────────────────── -->
  <div>
    ... all stard-sections here ...
  </div>
  <!-- ── content-col END ───────────────────────────────────── -->

</div>
<!-- ═══ /cs-content ══════════════════════════════════════════ -->
```

---

## CSS Architecture

### Shared stylesheet: `css/case-study.css`

All of the following classes are defined here — **do not redefine them inline**:

| Class group | Classes |
|---|---|
| Layout grid | `.cs-content` |
| TOC | `.toc`, `.toc__label`, `.toc__list`, `.toc__list a` |
| Sections | `.stard-section`, `__overline`, `__title`, `__body` |
| Before/After | `.ba-inline`, `__cell`, `__label`, `__text` |
| Artifact image | `.cs-artifact`, `__caption` |
| Metrics | `.metrics`, `__grid`, `__item`, `__value`, `__label` |
| Recognition | `.recognition`, `__title`, `__list` |
| Flow nodes | `.flow-node`, `.flow-pipeline`, `.flow-connector`, `.flow-dot` |
| Animation | `@keyframes ring-outer/inner/kanji-breathe/dot-flow` |
| Snow layer | `#snow-zone` |
| Scroll reveal | `.reveal.visible` |
| Responsive | All `@media` rules for the above |

### Page-specific inline `<style>`

Keep inline only what is unique to the page:

```html
<style>
  /* ── Page-specific: metrics 3-col ── */
  .metrics__grid { grid-template-columns: repeat(3, 1fr); }

  /* ── Page-specific: hero glow ── */
  .hero-glow { ... }
</style>
```

**Metrics column counts by page:**

| Page | Columns |
|---|---|
| ai-workflow, fabrion, ogilvy, rakuten-fit, denon-marantz | 4 (default) |
| tdk, miselu, robot-heart, techcrunch | 3 (override inline) |

---

## Section Components

### `stard-section` — standard content section

```html
<div id="[section-id]" class="stard-section reveal">
  <p class="stard-section__overline">Overline Label</p>
  <h2 class="stard-section__title">Section Title</h2>
  <div class="stard-section__body">
    <p>Body copy paragraph.</p>
  </div>
</div>
```

The first `stard-section` inside `content-col` automatically has no top border (`stard-section:first-child { border-top: none }`).

### `ba-inline` — Before / After comparison

```html
<div class="ba-inline">
  <div class="ba-inline__cell">
    <p class="ba-inline__label ba-inline__label--before">Before</p>
    <p class="ba-inline__text">Description of the old state.</p>
  </div>
  <div class="ba-inline__cell">
    <p class="ba-inline__label ba-inline__label--after">After</p>
    <p class="ba-inline__text">Description of the new state.</p>
  </div>
</div>
```

### `cs-artifact` — Image artifact with caption

```html
<div class="cs-artifact">
  <img src="../img/library/[project]/[image].png"
       alt="[Descriptive alt text]" loading="lazy">
  <p class="cs-artifact__caption">Caption text · Sub-label</p>
</div>
```

### `recognition` — always the last block inside `content-col`

```html
<div id="recognition" class="recognition reveal">
  <p class="recognition__title">Recognition</p>
  <ul class="recognition__list">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

---

## Creating a New Case Study

1. Copy `docs/case-study-template.html` → `case-studies/[project].html`
2. Fill in all `[PLACEHOLDER]` values
3. Add/remove `stard-section` blocks **inside `content-col` only**
4. Keep inline `<style>` to page-specific overrides only
5. Update TOC `href` anchors to match section `id` attributes
6. Add the page link to `docs/site-navigation-structure.md`

---

## Related Docs

- `docs/case-study-template.html` — canonical HTML scaffold
- `docs/site-navigation-structure.md` — page link registry
- `docs/design-guide-hero-typography.md` — hero text rules
- `css/case-study.css` — all shared case study styles
