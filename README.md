# keisuke-portfolio

Personal portfolio website for Keisuke Shingu — Product UX, AI Systems, Creative Technology.

Static HTML/CSS/JS site. No build system required. Deploy directly to Vercel, Netlify, or GitHub Pages.

---

## Structure

```
keisuke-portfolio/
│
├── index.html                  # Home / Portfolio overview
├── projects.html               # All case studies by era
├── about.html                  # About + timeline + clients
├── design-thinking.html        # Articles + writing index
├── contact.html                # Contact CTA
│
├── case-studies/               # Individual project case studies
│   ├── slalom.html             # Gundam Metaverse · Slalom Consulting
│   ├── robot-heart.html        # Robot Heart · Burning Man
│   ├── techcrunch.html         # TechCrunch Disrupt · Studio ZIRO
│   ├── kyoto-archive.html      # Kunichika Digital Archive · Kyoto University
│   ├── fabrion.html            # Fabrion · AI Systems
│   ├── tdk.html                # TDK SensEI
│   ├── ai-workflow.html        # AI Workflow
│   ├── rakuten-fit.html        # Rakuten Fit
│   ├── ogilvy.html             # Beyond Screens · Ogilvy
│   ├── denon-marantz.html      # Denon / Marantz · Premium Audio
│   ├── miselu.html             # Miselu C.24 · Hardware Invention
│   ├── beatport-ni.html        # Beatport → Native Instruments
│   ├── festivals.html          # Festival Visuals · EDC / Ultra / Detroit
│   └── quarkxpress.html        # QuarkXPress · Publishing Platform
│
├── css/
│   ├── tokens.css              # Design tokens (:root CSS variables + Google Fonts)
│   ├── base.css                # Reset, body, typography, scroll-reveal
│   ├── nav.css                 # Fixed top navigation bar
│   ├── footer.css              # Footer block
│   └── case-study.css          # Shared layout for all case study pages
│
├── js/
│   ├── micro-anim.js           # Canvas animation library (50 animations)
│   ├── weather-hero.js         # 3D particle weather system
│   └── scroll-reveal.js        # IntersectionObserver for scroll animations
│
├── logos/                      # Brand SVG logos (36 files)
│
└── _archive/                   # Old wireframes, variants, prototypes (not deployed)
```

---

## Design System

### Tokens (`css/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--ink-100` | `#1D1D1F` | Primary text |
| `--ink-80` | `#6E6E73` | Secondary text |
| `--ink-60` | `#86868B` | Tertiary / labels |
| `--ink-40` | `#AEAEB2` | Placeholders |
| `--rule-40` | `#E8E8ED` | Borders, dividers |
| `--paper` | `#F5F5F7` | Surface backgrounds |
| `--shu` | `#B33A3A` | Brand red accent |
| `--max-w` | `1120px` | Max content width |
| `--ease` | `cubic-bezier(0.25,0.46,0.45,0.94)` | Easing curve |

### Typography
- **Body:** Inter 200–600 (Google Fonts)
- **Kanji accents:** Noto Serif JP 200–300 (Google Fonts)

### Content Alignment Rule
Text blocks (subtitles, excerpts, body copy) within a section must extend to the full width of the visual container or adjacent image edge — never arbitrarily narrowed with `max-width`. This ensures consistent left-right alignment across hero text, card bodies, and featured post content. Headings may be constrained for typographic balance (`text-wrap: balance`), but all secondary/body text should respect the parent container width.

### Breakpoints
- Desktop: default (`--max-w: 1120px`)
- Tablet: `@media (max-width: 1119px)` — reduce padding
- Mobile: `@media (max-width: 767px)` — stack layouts, hide nav links

---

## Animation Systems

### MicroAnim (`js/micro-anim.js`)
50 canvas-based looping animations. Used on the home and projects pages.

```html
<!-- Declare a canvas with data-anim index 0–49 -->
<canvas class="case-entry__anim" data-anim="14" width="120" height="120"></canvas>
```

```js
// Initialize (already in index.html and projects.html)
MicroAnim.init(devicePixelRatio, size);
```

**Animation index reference (selected):**

| # | Name | # | Name |
|---|---|---|---|
| 0 | Ripple | 14 | Ensō |
| 4 | Shu Flash | 15 | Wave |
| 7 | Float | 19 | Spiral |
| 9 | Constellate | 22 | Interfere |

### WeatherHero (`js/weather-hero.js`)
3D particle system (snow/rain/sakura). Requires a `#snow-zone` container.

```html
<div id="snow-zone">
  <!-- page content -->
</div>
<script src="js/weather-hero.js"></script>
<script>
  if (typeof WeatherHero !== 'undefined') WeatherHero.init(document.getElementById('snow-zone'));
</script>
```

---

## Adding a New Case Study

1. Duplicate the closest existing case study from `case-studies/`
2. Update: title, brand, role, overview bar values, tags, stats, narrative sections
3. Add a card entry in `projects.html` inside the appropriate era `<div class="era__grid">`
4. Update `prev-next` links in the adjacent case studies

**Case study card template (in projects.html):**
```html
<a href="case-studies/your-slug.html" class="case-entry">
  <div class="case-entry__top">
    <h2 class="case-entry__title">Project Title</h2>
    <p class="case-entry__brand">Brand · Company</p>
    <p class="case-entry__role">Your Role · Year</p>
  </div>
  <p class="case-entry__tags">
    Tag One<span class="dot">·</span>Tag Two<span class="dot">·</span>Tag Three
  </p>
  <div class="case-entry__image case-entry__image--placeholder" data-label="Caption" data-kanji="字">
    <canvas class="case-entry__anim" data-anim="14" width="120" height="120"></canvas>
  </div>
</a>
```

---

## Deployment

### Vercel (recommended)
1. Push this repo to GitHub
2. Connect repo to Vercel at vercel.com
3. No build settings needed — Vercel serves static files directly
4. Add custom domain in Vercel dashboard

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. Site available at `https://username.github.io/keisuke-portfolio`

### Local development
```bash
# Python (built-in)
python3 -m http.server 8000

# Then open http://localhost:8000
```

---

## Next Steps

- [ ] Replace placeholder hero images with real Figma exports / photos
- [ ] Finalize all case study text content
- [ ] Apply micro-animation hover effects across project cards
- [ ] Add Design Thinking article pages (`DT_*.html`)
- [ ] Connect custom domain
- [ ] (Future) Migrate to Next.js + Sanity for CMS-driven content

---

© 2026 Keisuke Shingu
