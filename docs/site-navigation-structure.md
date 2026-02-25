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
| Process | `process.html` |
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
