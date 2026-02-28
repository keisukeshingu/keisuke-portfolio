# Site Navigation & Page Link Structure

**Status:** Default / Canonical
**Last updated:** 2026-02-25
**Commit:** b3c7164

---

## Global Navigation (all pages)

| Label | URL |
|---|---|
| Keisuke Shingu (logo) | `index.html` |
| Projects | `projects.html` |
| Design Thinking | `design-thinking.html` |
| About | `about.html` |
| Contact | `contact.html` |

---

## index.html — Featured Experiences Cards

Section title: **FEATURED EXPERIENCES**

| Card | Element | Target URL | Status |
|---|---|---|---|
| TDK → Design Engineering | `<a>` | `case-studies/ai-workflow.html` | ✅ Live |
| Ogilvy → Slalom | `<div>` (non-clickable) | — | ⏳ NDA / TBD |
| Director of UX — Denon / Marantz | `<a>` | `case-studies/denon-marantz.html` | ✅ Live |
| Miselu C.24 | `<a>` | `case-studies/miselu.html` | ✅ Live |
| Beatport → Native Instruments | `<div>` (non-clickable) | — | ⏳ Coming Soon |
| QuarkXPress | `<a>` | `case-studies/quarkxpress.html` | ✅ Live |

**See All Projects →** (red, end of section): `projects.html`

### Card modifier classes

| Class | Meaning |
|---|---|
| `heritage-card` | Default clickable card (rendered as `<a>`) |
| `heritage-card--nda` | NDA — greyed out, non-clickable `<div>`, shows NDA badge |
| `heritage-card--soon` | Coming soon — greyed out, non-clickable `<div>`, shows Soon badge |

---

## Case Study Pages

| File | URL path | Status |
|---|---|---|
| `case-studies/ai-workflow.html` | `/case-studies/ai-workflow.html` | ✅ Live |
| `case-studies/denon-marantz.html` | `/case-studies/denon-marantz.html` | ✅ Live |
| `case-studies/miselu.html` | `/case-studies/miselu.html` | ✅ Live |
| `case-studies/quarkxpress.html` | `/case-studies/quarkxpress.html` | ✅ Live |
| `case-studies/tdk.html` | — | 🔒 Not linked (excluded from prev/next) |
| `case-studies/rakuten-fit.html` | — | 🔒 Not linked |
| `case-studies/robot-heart.html` | — | 🔒 Not linked |
| `case-studies/ai-native-design.html` | — | AI-Native Design Engineering |
| `case-studies/ogilvy.html` | — | 🔒 NDA |
| `case-studies/slalom.html` | — | 🔒 NDA |
| `case-studies/beatport-ni.html` | — | 🔒 Not linked |
| `case-studies/techcrunch.html` | — | 🔒 Not linked |
| `case-studies/festivals.html` | — | 🔒 Not linked |
| `case-studies/kyoto-archive.html` | — | 🔒 Not linked |

### Prev / Next Navigation Loop (live pages only)

```
ai-workflow → denon-marantz → miselu → quarkxpress → ai-workflow
```

Only the 4 live pages form a closed loop. All other pages are excluded from the chain.

---

## projects.html — All Projects Index

Full project index page. Linked from:
- Global nav → "Projects"
- index.html → "See All Projects →"

---

## Footer Links (all pages)

| Label | URL |
|---|---|
| About | `about.html` |
| Contact | `contact.html` |

---

## Pending / Deferred

| Card | Next action |
|---|---|
| Ogilvy → Slalom | Assign URL when case study is written (remove `heritage-card--nda`, change `<div>` → `<a>`) |
| Beatport → Native Instruments | Assign URL when case study is written (remove `heritage-card--soon`, change `<div>` → `<a>`) |

---

## Conventions

- Clickable cards use `<a href="...">` as the root element.
- Non-clickable cards use `<div>` as root element (no href, no onclick).
- Case study pages live in `/case-studies/` subdirectory.
- The "See All Projects" link always points to `projects.html` (the index).
- Red accent color for CTA links uses CSS variable `var(--shu)`.
