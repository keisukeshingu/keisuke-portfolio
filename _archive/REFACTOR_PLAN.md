# Portfolio Refactoring Plan

## Current State

- **44 HTML files**, all CSS inline — ~164 KB of duplicated styles
- **3 JS files** external: `micro-anim.js`, `weather-hero.js`, `case-study-icons.js`
- Nav & footer HTML repeated in every file with minor inconsistencies
- Mix of production pages, wireframes, component tests, and dead code
- No build system, no external CSS files

---

## Target Architecture

```
v1_animation/
├── css/
│   ├── tokens.css          # Design tokens (:root variables)
│   ├── base.css            # Reset, body, typography, scroll-reveal
│   ├── nav.css             # Fixed nav bar + responsive
│   ├── footer.css          # Footer block + responsive
│   ├── components.css      # Shared UI: .tag, .overline, .contact-btn, inline-image
│   └── case-study.css      # CS-specific: hero, overview-bar, tags-bar, key-highlight,
│                           #   brief-content, content-section, prev-next, pull-quote
├── js/
│   ├── micro-anim.js       # Canvas animation library (unchanged)
│   ├── weather-hero.js     # Particle weather system (unchanged)
│   └── scroll-reveal.js    # Extracted IntersectionObserver (new)
├── pages/
│   ├── index.html          # Portfolio_Preview → renamed
│   ├── projects.html       # Projects_Preview → renamed
│   ├── design-thinking.html
│   ├── about.html
│   └── contact.html
├── case-studies/
│   ├── CS_Slalom.html
│   ├── CS_RobotHeart.html
│   ├── CS_TechCrunch.html
│   ├── CS_KyotoArchive.html
│   ├── CS_Fabrion.html
│   ├── CS_TDK.html
│   ├── CS_AIWorkflow.html
│   ├── CS_RakutenFit.html
│   ├── CS_Ogilvy.html
│   ├── CS_DenonMarantz.html
│   ├── CS_Miselu.html
│   ├── CS_BeatportNI.html
│   ├── CS_Festivals.html
│   ├── CS_QuarkXPress.html
│   └── CS_KyotoArchive.html
├── logos/                  # SVG brand logos (unchanged)
├── _archive/               # Old wireframes, component tests, dead code
└── README.md               # Install guide + architecture overview
```

---

## Refactoring Steps

### Phase 1 — Extract shared CSS (removes ~1,200 lines per file)

1. **`css/tokens.css`** — Extract `:root` block (28 lines)
   - `--ink-*`, `--rule-*`, `--paper`, `--white`, `--nav-bg`, `--blur`, `--ease`, `--max-w`
   - `--shu`, `--shu-10`, `--shu-20` (Shu red accent)

2. **`css/base.css`** — Extract reset + body + scroll-reveal (~30 lines)
   - `*, *::before, *::after` reset
   - `html`, `body` base styles
   - `.reveal` / `.scroll-reveal` + `.visible` / `.active` animation
   - Google Fonts `@import` for Inter + Noto Serif JP

3. **`css/nav.css`** — Extract nav bar (~25 lines)
   - `.nav`, `.nav__inner`, `.nav__logo`, `.nav__links`
   - Responsive: tablet padding, mobile collapse

4. **`css/footer.css`** — Extract footer (~35 lines)
   - `.footer`, `.footer__inner`, `.footer__name`, `.footer__tagline`
   - `.footer__links`, `.footer__copy`
   - Responsive

5. **`css/components.css`** — Shared UI elements (~40 lines)
   - `.tag` pill
   - `.overline` label
   - `.inline-image` + modifiers (`--full`, `--dark`)
   - `.contact-btn`

6. **`css/case-study.css`** — CS page layout (~120 lines)
   - `.cs-hero`, `.cs-hero__back`, `.cs-hero__brand`, `.cs-hero__title`, `.cs-hero__role`, `.cs-hero__image`
   - `.overview-bar`, `.overview-bar__inner`, `.overview-item`
   - `.tags-bar`, `.tags-bar__inner`
   - `.key-highlight`, `.key-highlight__inner`, `.key-highlight__stat`
   - `.brief-content`, `.content-section`, `.content-section__overline/heading/body`
   - `.pull-quote`
   - `.prev-next`, `.prev-next__inner`, `.prev-next__item`
   - All responsive rules for CS pages

### Phase 2 — Extract shared JS

7. **`js/scroll-reveal.js`** — Extract the IntersectionObserver (~15 lines)
   - Currently duplicated inline in every page
   - Single external file, loaded with `defer`

### Phase 3 — Standardize HTML templates

8. **Normalize nav HTML** across all files to:
   ```html
   <header class="nav">
     <nav class="nav__inner">
       <a href="index.html" class="nav__logo">Keisuke Shingu</a>
       <ul class="nav__links">
         <li><a href="projects.html">Projects</a></li>
         <li><a href="design-thinking.html">Design Thinking</a></li>
         <li><a href="about.html">About</a></li>
         <li><a href="contact.html">Contact</a></li>
       </ul>
     </nav>
   </header>
   ```

9. **Normalize footer HTML** across all files to canonical version

10. **Update all `<head>` sections** — replace inline `<style>` with:
    ```html
    <link rel="stylesheet" href="css/tokens.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/nav.css">
    <link rel="stylesheet" href="css/footer.css">
    <!-- + page-specific CSS links -->
    ```

### Phase 4 — Rename and reorganize files

11. Rename preview pages: `Portfolio_Preview.html` → `pages/index.html`, etc.
12. Move all `CS_*.html` into `case-studies/` subfolder
13. Move all wireframe/test files into `_archive/`
14. Update all internal `href` links to reflect new paths

### Phase 5 — Documentation

15. **`README.md`** — Architecture overview, file map, setup guide
16. Clean inline comments in each page-specific `<style>` block

---

## Files to archive (move to `_archive/`)

These are wireframes, component tests, or superseded versions:
- `Phase2_Components.html`
- `Wireframe_Project_Detail.html`
- `logo_check.html`
- `logos/test-logos.html`
- `DT_Ma.html`, `DT_Example.html`, `DT_WabiSabi.html`, `DT_Kintsugi.html`
- `portfolio-weather-v2.html`
- `case-study-icons.js` (dead code — never loaded)

---

## What stays as page-specific inline CSS

Each page keeps a small `<style>` block for unique layout:

- **index.html**: Heritage grid, stats band, hero kanji accents, MicroAnim canvas groups
- **projects.html**: Era sections, `.era__grid`, `.case-entry` cards, accent animation systems
- **about.html**: Portrait grid, philosophy blocks, timeline, clients grid
- **design-thinking.html**: Category filters, post grid, featured post
- **contact.html**: Centered hero CTA
- **Each CS_*.html**: Hero image gradients/kanji, page-specific components (e.g. print-grid in Kyoto)

---

## Execution order

Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

Each phase is independently testable. No build tools required — pure static HTML/CSS/JS.
