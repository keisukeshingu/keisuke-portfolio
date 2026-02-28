# Keisuke Portfolio — Project Status
**Last updated:** 2026-02-25
**Session:** Context Checkpoint #5 — GitHub Pages Launch + Mobile + Polish

---

## Live URL
**https://keisukeshingu.github.io/keisuke-portfolio/**

---

## Git Log (Recent)

```
d016fc4  Update Denon/Marantz card thumbnails to local collage image
407be63  fix: plexus animation covers full viewport on mobile scroll
a1240f0  feat: mobile-adaptive plexus animation with touch support
605d234  fix: match logo grid order on index.html to about page
7896f92  fix: match index.html logo grid to about page clients-grid style
...earlier commits...
0634fcc  Replace SVG placeholders with real product images across 25 pages
4c8163c  Add articles/ folder with 5 Design Thinking pieces; fix all internal links
7410072  Initial commit — clean portfolio repo
```

---

## Repository Structure

```
keisuke-portfolio/
├── index.html                   # Home: hero + plexus animation + heritage cards + logo grid
├── projects.html                # Project grid (case entries)
├── about.html                   # Bio + clients grid + portrait placeholder
├── design-thinking.html         # Editorial index (5 articles) + process content
├── contact.html                 # Contact form
│
├── case-studies/                # 14 case study pages
│   ├── slalom.html              # NDA — card/card blocked
│   ├── robot-heart.html         # Coming Soon
│   ├── techcrunch.html          # Coming Soon
│   ├── kyoto-archive.html       ✓ live
│   ├── ai-native-design.html    ✓ live (AI-Native Design Engineering)
│   ├── tdk.html                 ✓ live
│   ├── ai-workflow.html         ✓ live
│   ├── rakuten-fit.html         ✓ live
│   ├── ogilvy.html              # NDA — card blocked
│   ├── denon-marantz.html       ✓ live
│   ├── miselu.html              ✓ live
│   ├── beatport-ni.html         # Coming Soon
│   ├── festivals.html           # Coming Soon
│   └── quarkxpress.html         ✓ live
│
├── articles/                    # Design Thinking editorial pieces (5)
├── js/
│   ├── plexus-bg.js             # Canvas particle animation (mobile-adaptive)
│   ├── micro-anim.js
│   ├── scroll-reveal.js
│   └── weather-hero.js
│
├── css/
│   ├── tokens.css               # Design tokens
│   ├── base.css                 # Reset + global
│   ├── nav.css
│   ├── footer.css
│   └── case-study.css
│
├── img/
│   └── library/
│       ├── denon/               # Denon/Marantz collage images (148a–e, 149a–e, etc.)
│       ├── quark/               # QuarkXPress case study images
│       └── ...                  # Other case study images
│
├── logos/                       # 36 SVG client/brand logos
├── _archive/                    # Old files (not served)
├── STATUS.md                    # ← this file
└── .gitignore                   # Excludes: img/library/quark/045-gill-sans-specimen.svg (118MB)
```

---

## Card State System

### NDA Cards (content blocked, not clickable)
Cards converted from `<a>` to `<div>` with `.case-entry--nda` / `.heritage-card--nda` modifier.
Clicking shows a frosted-glass toast: *"This project is under NDA."*

| Page | Card |
|------|------|
| index.html | Ogilvy/Slalom heritage card |
| projects.html | Ogilvy case entry |
| projects.html | Slalom case entry |

### Coming Soon Cards (content in progress, not clickable)
Cards converted from `<a>` to `<div>` with `.case-entry--soon` / `.heritage-card--soon` modifier.
Red shu-accent badge shown. Clicking shows toast: *"Coming soon — check back later."*

| Page | Card |
|------|------|
| index.html | Beatport heritage card |
| projects.html | Beatport, Robot Heart, TechCrunch, Festivals case entries |

**Toast implementation:** Both toasts use a shared frosted-glass dark overlay at bottom of screen.
Functions: `showNDAToast()`, `showSoonToast()` — inline script in each HTML file.

---

## Prev / Next Navigation Chain (Chronological, Dead-End)

Live pages only. Chain does **not** wrap — first and last entries have a single link.

| # | Page | ← Newer Work | Earlier Work → |
|---|------|-------------|----------------|
| 1 | `ai-native-design.html` | — (dead end) | ai-workflow |
| 2 | `ai-workflow.html` | ai-native-design | tdk |
| 3 | `tdk.html` | ai-workflow | rakuten-fit |
| 4 | `rakuten-fit.html` | tdk | denon-marantz |
| 5 | `denon-marantz.html` | rakuten-fit | miselu |
| 6 | `miselu.html` | denon-marantz | quarkxpress |
| 7 | `quarkxpress.html` | miselu | kyoto-archive |
| 8 | `kyoto-archive.html` | quarkxpress | — (dead end) |

Non-live pages (NDA/Soon) link to the nearest live neighbor. Re-wire when they go live.

---

## Plexus Background Animation (`js/plexus-bg.js`)

Canvas-based particle animation with full mobile support.

### Mobile Detection & Config
```javascript
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
              || (window.innerWidth < 768);

const CFG = {
  count:        isMobile ? 30  : 90,
  speed:        isMobile ? 0.25 : 0.3,
  radius:       isMobile ? 2.0  : 1.8,
  linkDist:     isMobile ? 100  : 150,
  mouseRadius:  isMobile ? 160  : 220,
  mouseForce:   isMobile ? 0.035 : 0.025,
  pulseNodes:   isMobile ? 4    : 8,
  dotAlpha:     isMobile ? 0.55 : 0.45,
  lineAlphaMax: isMobile ? 0.18 : 0.14,
};
```

### Mobile Height Fix (address bar aware)
```javascript
function getViewportHeight() {
  if (window.visualViewport) return Math.ceil(window.visualViewport.height);
  return window.innerHeight;
}
function resize() {
  var canvasH = isMobile ? Math.max(H, window.screen.height) : H;
  // canvas covers full scroll height on mobile
}
if (window.visualViewport) window.visualViewport.addEventListener('resize', resize);
```

### Touch Support
```javascript
document.addEventListener('touchstart', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchmove',  e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend',   () => { setTimeout(() => { mouse.x = -9999; mouse.y = -9999; }, 800); }, { passive: true });
```

---

## Logo Grid (index.html & about.html)

Both pages use identical `.clients-grid` pattern — static 5-column grid, no labels, logo-only cells.
Logo order on index.html matches about.html exactly:
apple, google, linux, microsoft, qt, denon, marantz, dolby, dts, yamaha,
pioneer, jvc-kenwood, monotype, qualcomm, soundunited, miselu, native-instruments,
beatport, tidal, quark, ogilvy, slalom, miro, figma, anthropic

---

## Image Inventory

### Denon / Marantz (`img/library/denon/`)
| File | Description |
|------|-------------|
| 143-marantz-lookbook-hero.jpg | Marantz amps on wood credenza, marble wall — cinematic |
| 144-porthole-volume-visualizer.jpg | Basic Concept #2 — VU meter concept slide |
| 145-porthole-ui-grid.jpg | Basic Concept #2 — UI parameter grid slide |
| 146-design-system-collage.jpg | Mixed brand collage — Denon + Marantz overview |
| 148a-denon-identity.jpg | Logo executions + color palette |
| **148b-denon-digital.jpg** | ← **Current thumbnail** — Website, color palette, type sample |
| 148c-denon-type.jpg | Typography system — Usual typeface |
| 148d-denon-product.jpg | Product editorial — type + photography |
| 148e-denon-system.jpg | Full brand system overview |
| 149a-marantz-brand.jpg | Marantz Look Book cover + lifestyle |
| 149b-marantz-dark.jpg | Dark editorial — porthole close-ups, model posters |
| 149c-marantz-range.jpg | Copper logo + product range overview |
| 149d-marantz-editorial.jpg | Full poster lineup + lifestyle photography |
| 149e-marantz-copper.jpg | Hero macro — champagne gold amp + copper knob |

### QuarkXPress (`img/library/quark/`)
| File | Description |
|------|-------------|
| quark-xml-author.png | XML Author screenshot — used in Morisawa/Research Lab section |
| grid-systems-book-cover.png | Orange Grid Systems book cover (Müller-Brockmann) |
| 041-apple-laserwriter.jpg | Apple LaserWriter — Macworld 2005 section |
| 045-gill-sans-specimen.svg | EXCLUDED via .gitignore (118MB — exceeds GitHub limit) |

---

## Known Issues / Workarounds

### .gitignore Exclusion
`img/library/quark/045-gill-sans-specimen.svg` excluded — 118MB exceeds GitHub's 100MB file limit.

### Broken External Hotlinks (Fixed)
Three Wikimedia hotlinks on quarkxpress.html were blocked on GitHub Pages. Replaced with local images above.

### Macworld / Steve Jobs Photo (Deferred)
User requested an exciting Macworld keynote photo on quarkxpress.html. No suitable local file exists.
**Action needed:** User to provide an image file → save to `img/library/quark/` → update `quarkxpress.html` hero image src.

### ai-workflow.html Partner Logos (Removed)
The Tool Ecosystem partner logo section was removed — logos were hand-drawn SVG placeholders
(Figma circle, Claude asterisk, Antigravity circle), not recognizable as real brand marks.
The text paragraphs about tools remain; only the visual logo block was removed.

### Portrait Photo (Pending)
`about.html` still uses a placeholder for the portrait. User to provide photo → save to `img/` → update src.

---

## Completed Work (This Session)

| Item | Status |
|------|--------|
| NDA card state (Ogilvy, Slalom) | ✅ |
| Coming Soon card state (Beatport, Robot Heart, TechCrunch, Festivals) | ✅ |
| GitHub Pages deployment | ✅ live |
| Committed img/ folder (192MB, 193 files) | ✅ |
| Fixed broken Wikimedia hotlinks on quarkxpress.html | ✅ |
| Quark XML Author image + narrative | ✅ |
| Grid Systems orange book cover | ✅ |
| Logo grid (index.html) — replaced marquee with static grid | ✅ |
| Logo order matched to about.html | ✅ |
| Company name labels removed from logo grid | ✅ |
| Plexus animation — mobile adaptive config | ✅ |
| Plexus animation — touch event support | ✅ |
| Plexus animation — full viewport height on mobile scroll | ✅ |
| Denon/Marantz thumbnail — replaced broken Denon.com hotlink with 148b-denon-digital.jpg | ✅ |
| Removed process.html — content merged into design-thinking.html | ✅ |
| Cleaned all process.html nav/footer links from 6 article pages | ✅ |
| Renamed fabrion.html → ai-native-design.html; purged all "Fabrion" from live site | ✅ |
| Renamed Kyoto Archive page title → "Kyoto University of the Arts — Media Lab" | ✅ |
| Prev/next chain rewired: chronological, dead-end, live-pages-only | ✅ |
| Non-live pages (NDA/Soon) prev/next links pointed to nearest live neighbors | ✅ |

---

## Backlog / Next Steps

### Content
- [ ] Macworld/Steve Jobs photo for quarkxpress.html hero
- [ ] Real portrait photo for about.html
- [ ] Process images / diagrams inside case study `inline-image` containers
- [ ] Proprietary placeholder images: ai-native-design.html, rakuten-fit.html

### Roadmap (Planned Architecture)
- [ ] Lighthouse audit (target: 95+ all metrics)
- [ ] WebP image optimization pipeline
- [ ] OG meta tags per page (social sharing previews)
- [ ] Custom domain setup
- [ ] Phase 5 — Editorial CMS (Next.js + Sanity.io — queued for planning session)
  - User stories first → design specs → separated data/backend/frontend architecture

---

## Naming Conventions

| File Slug | Display Name | Rule |
|-----------|-------------|------|
| `ai-native-design.html` | **AI-Native Design Engineering** | Renamed from `fabrion.html`. Never use "Fabrion" in any user-facing text, nav, card, copy, or filenames. |
| `kyoto-archive.html` | **Kyoto University of the Arts — Media Lab** | Page title updated. File slug unchanged. |

> **Important:** The word "Fabrion" must not appear anywhere on the live site — not in titles, cards, nav, body copy, or meta tags. Always use "AI-Native Design Engineering" or "AI Agent Platform" as the display name.

---

## Design System Reference

**Tokens** (`css/tokens.css`):
- Type: Noto Serif JP (display) + system-ui (body)
- Dark base: `#0D0D0F`
- Accent: shu-red for badges/NDA/Soon states
- Spacing: 4px grid
- Easing: `--ease` cubic-bezier

**CSS Architecture:** tokens → base → component → page-specific inline styles

**Hosting:** GitHub Pages from `main` branch root
**Repo:** https://github.com/keisukeshingu/keisuke-portfolio

---

*Status maintained by Claude (Cowork mode) in collaboration with Keisuke Shingu.*
