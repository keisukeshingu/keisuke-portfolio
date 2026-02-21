# Keisuke Portfolio — Project Status
**Last updated:** 2026-02-21
**Session:** Context Checkpoint #2

---

## Git History

```
4c8163c  Add articles/ folder with 5 Design Thinking pieces; fix all internal links
c5a293a  Update image placeholders across all pages
7410072  Initial commit — clean portfolio repo
```

---

## Repository Structure

```
keisuke-portfolio/
├── index.html                   # Home / hero + weather widget
├── projects.html                # Project grid
├── about.html                   # Bio + portrait placeholder
├── design-thinking.html         # Editorial index (5 articles)
├── contact.html                 # Contact form
│
├── case-studies/                # 14 case study pages
│   ├── slalom.html              # Side-G · Virtual Space Colony
│   ├── robot-heart.html         # Robot Heart · Burning Man
│   ├── techcrunch.html          # TechCrunch Disrupt SF 2016
│   ├── kyoto-archive.html       # Kyoto Archive
│   ├── fabrion.html             # Fabrion
│   ├── tdk.html                 # TDK
│   ├── ai-workflow.html         # AI Workflow
│   ├── rakuten-fit.html         # Rakuten Fit
│   ├── ogilvy.html              # Ogilvy · Beyond Screens
│   ├── denon-marantz.html       # Denon/Marantz
│   ├── miselu.html              # Miselu · Music keyboard
│   ├── beatport-ni.html         # Beatport × Native Instruments
│   ├── festivals.html           # Festivals
│   └── quarkxpress.html         # QuarkXPress
│
├── articles/                    # Design Thinking editorial pieces
│   ├── agents-cognitive-prosthetics.html
│   ├── ma-negative-space.html
│   ├── design-tokens.html
│   ├── 60fps-performance.html
│   └── confidence-calibration.html
│
├── css/
│   ├── tokens.css               # Design tokens (color, type, spacing)
│   ├── base.css                 # Reset + global styles
│   ├── nav.css                  # Navigation
│   ├── footer.css               # Footer
│   └── case-study.css           # Case study layout + image placeholders
│
├── js/
│   ├── micro-anim.js            # Micro-interactions
│   ├── scroll-reveal.js         # Scroll-based reveals
│   └── weather-hero.js          # Hero weather widget
│
├── logos/                       # 36 SVG client/brand logos
├── _archive/                    # Old files (not served)
├── README.md
├── STATUS.md                    # ← this file
└── .gitignore
```

---

## Completed Work

### Phase 1 — Repo Setup
- Initialized clean git repo from working files
- Extracted CSS into 5 modular files (`tokens.css`, `base.css`, `nav.css`, `footer.css`, `case-study.css`)
- JS organized into `js/` folder
- SVG logos in `logos/`
- Old/prototype files moved to `_archive/`

### Phase 2 — Image Placeholders (`c5a293a`)
All 14 case studies and main pages have proper image placeholder elements:

**Hero images** — `.cs-hero__image` div with:
- Per-project gradient background (inline `style`)
- Japanese kanji watermark via `data-kanji` attribute + CSS `::before`
- `--hero-kanji-color` CSS variable for dark/light contrast adaptation
- `.cs-hero__image-label` caption span

**Per-project kanji + gradient mapping:**
| Page | Kanji | Meaning | Gradient |
|------|-------|---------|----------|
| slalom | 宇 | space/cosmos | #070710 → #110A24 |
| robot-heart | 心 | heart/mind | #120808 → #200A0A |
| techcrunch | 革 | revolution | #050D18 → #0A1830 |
| kyoto-archive | 記 | record/memory | #140E06 → #241808 |
| fabrion | 察 | observe | #060A10 → #0C1420 |
| tdk | 感 | feeling/sense | #080808 → #141414 |
| ai-workflow | 流 | flow/stream | #020A14 → #051020 |
| rakuten-fit | 健 | health | #080C14 → #101828 |
| ogilvy | 見 | vision/see | #0A0806 → #1A140E |
| denon-marantz | 音 | sound | #040404 → #0A0A0A |
| miselu | 奏 | play music | #E4E4E8 → #CECECE (light) |
| beatport-ni | 律 | rhythm/law | #060606 → #101010 |
| festivals | 祭 | festival | #080010 → #14001E |
| quarkxpress | 版 | print/publish | #EEE8DF → #DDD5C8 (light) |

**About page:** Portrait placeholder with 敬 kanji (warm parchment bg)
**Design Thinking page:** 5 article thumbnails, each with unique kanji (知/間/系/速/信) + themed gradient

**prev-next navigation fixes:**
- `denon-marantz.html`: added ← Previous → `slalom.html`
- `fabrion.html`: added ← Previous → `denon-marantz.html`
- `quarkxpress.html`: fixed empty Next → `kyoto-archive.html`

### Phase 3 — Link Audit & Articles (`4c8163c`)
- Python link audit across all 25 pages (with HTML comment stripping for false-positive prevention)
- Found 5 broken links in `design-thinking.html` (all pointing to `DT_*.html` moved to `_archive/`)
- Created `articles/` directory; migrated 5 DT files with kebab-case names
- Updated all internal nav links within articles (`Portfolio_Preview.html` → `../index.html`, etc.)
- Updated `design-thinking.html` links to `articles/` folder
- **Result: ✓ Zero broken links across all 25 pages**

---

## Known Issues / Workarounds

### Git Lock Files
`.git/index.lock` and `.git/refs/heads/master.lock` are 0-byte stale files from sandbox that cannot be deleted (filesystem restriction). All git commits use this workaround:
```bash
cp .git/index /tmp/git-index-portfolio
GIT_INDEX_FILE=/tmp/git-index-portfolio git add <files>
TREE=$(GIT_INDEX_FILE=/tmp/git-index-portfolio git write-tree)
COMMIT=$(git commit-tree "$TREE" -p "$(cat .git/refs/heads/master)" -m "message")
python3 -c "open('.git/refs/heads/master','w').write('$COMMIT\n')"
```

### Browser Preview
- The MCP `navigate` tool prepends `https://` to `file://` URLs (breaks navigation)
- Python HTTP server in VM is not accessible from macOS Chrome (different network namespace)
- **Use `computer://` links in Claude Desktop to open files directly**

---

## Next Steps (Backlog)

### Immediate
- [ ] Replace image placeholders with real photography/screenshots as assets become available
- [ ] Add real portrait photo in `about.html`

### Phase 4 — Content & Copy
- [ ] Audit all case study body copy for completeness
- [ ] Add process images / diagrams inside case study `inline-image` containers
- [ ] Write missing article body content (articles currently have placeholder text)

### Phase 5 — Editorial CMS (Planned Architecture)
- [ ] User stories for content management
- [ ] Design specs for CMS-backed editorial flow
- [ ] Tech stack decision: Next.js + Sanity.io (queued for planning session)
- [ ] Architecture doc: data layer, backend, application logic, frontend separation

### Phase 6 — Performance & Launch
- [ ] Lighthouse audit (target: 95+ on all metrics)
- [ ] Image optimization pipeline (WebP conversion, lazy loading)
- [ ] Meta tags / OG images per page
- [ ] Deploy target: Vercel or Netlify

---

## Design System Reference

**Tokens** (defined in `css/tokens.css`):
- Type scale: Noto Serif JP (display) + system-ui (body)
- Color: dark base `#0D0D0F`, accent tokens via CSS custom properties
- Spacing: 4px grid
- Easings: `--ease` cubic-bezier for transitions
- Border: `--rule-40` for subtle dividers

**CSS Architecture:** Cascade layers — tokens → base → component → page-specific inline styles

---

*Status maintained by Claude (Cowork mode) in collaboration with Keisuke Shingu.*
