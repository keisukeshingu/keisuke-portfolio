# CMS Test Plan — Keisuke Portfolio
**Version:** 1.0
**Status:** Planning
**Last updated:** 2026-02-27

This test plan covers all four user stories and ensures the CMS migration produces zero visual regression from the static site. Tests are organized by phase and can be executed manually or automated with Playwright.

---

## Test Environments

| Environment | URL | Purpose |
|---|---|---|
| Local dev | `http://localhost:3000` | Component development |
| Vercel preview | Auto-generated per PR | Integration testing |
| Production | `https://keisukeshingu.github.io/keisuke-portfolio` | Regression baseline |
| Sanity Studio | `http://localhost:3000/studio` | CMS authoring tests |

---

## US1 — Inline Text Editing with Git/Deploy Sync

**User story:** I want to manually edit texts for all pages. Text box should be editable, being able to update to git after I save the text field.

### TC-US1-01: Edit hero statement on a case study
- **Setup:** Open `/studio` → Presentation → navigate to `/case-studies/ai-workflow`
- **Steps:**
  1. Click the hero statement text in the preview
  2. Confirm the right panel jumps to the `heroStatement` field
  3. Edit the text to a test value: `"TEST HERO TEXT 001"`
  4. Click **Publish**
- **Expected:** Within 30 seconds, `keisukeshingu.github.io` shows the updated text
- **Pass criteria:** Live site reflects the change. No manual git commit required by user.

### TC-US1-02: Edit a body paragraph inside a section
- **Steps:**
  1. Open Presentation → any case study
  2. Click body paragraph text in preview
  3. Confirm Portable Text editor opens in panel
  4. Change `<strong>` word to plain text, add new sentence
  5. Publish
- **Expected:** Change renders on live page with correct HTML (no `<strong>` around de-bolded word)

### TC-US1-03: Edit hero statement on home page
- **Steps:**
  1. Studio → Presentation → home page
  2. Click hero heading
  3. Edit text
  4. Publish
- **Expected:** `index.html` equivalent renders updated heading

### TC-US1-04: Edit text on process page
- **Pass criteria:** Hero sub, section bodies, all editable without code changes

### TC-US1-05: Rich text formatting preserved
- **Steps:**
  1. Edit a paragraph that contains `<strong>` text
  2. Verify bold mark persists through publish cycle
  3. Add a new `<strong>` mark to a word
  4. Publish
- **Expected:** Bold renders on live page

### TC-US1-06: Webhook fires on publish
- **Steps:**
  1. Open Vercel dashboard → Deployments
  2. Publish any change in Sanity Studio
  3. Observe Deployments list
- **Expected:** New deployment appears within 5 seconds of publish

---

## US2 — Image Replacement from Local Files

**User story:** The image box should be able to replace images from my local files. The replaced image should be saved in CMS image directory automatically so I don't need to move by myself.

### TC-US2-01: Replace a cs-artifact image
- **Setup:** Open Studio → any case study document → find an `imageWithCaption` field
- **Steps:**
  1. Click the current image → click **Replace**
  2. Select a JPG file from local disk (e.g., from Desktop)
  3. Confirm upload progress bar appears
  4. Confirm image thumbnail updates in Sanity Studio
  5. Publish
- **Expected:**
  - Image appears on live page
  - No file was manually moved to `img/library/`
  - Image served from `cdn.sanity.io` domain

### TC-US2-02: Upload a new image to an empty image field
- **Steps:**
  1. Open a case study with an empty `artifact` slot
  2. Click **Upload** on the empty image field
  3. Select a PNG file
  4. Publish
- **Expected:** Image renders with `cs-artifact` styling (border-radius, overflow hidden, border)

### TC-US2-03: Image is served as WebP with correct srcset
- **Steps:**
  1. Open Chrome DevTools → Network → filter `img`
  2. Navigate to a case study with a Sanity CDN image
- **Expected:**
  - Image URL contains `cdn.sanity.io`
  - Response `Content-Type: image/webp`
  - `<img>` element has `srcset` with at least 2 width variants

### TC-US2-04: Hotspot/crop works for thumbnail images
- **Steps:**
  1. Open a `caseStudy.thumbnail` image field in Studio
  2. Click **Edit** → set hotspot to center of subject
  3. Publish
- **Expected:** Thumbnail crop honors hotspot on projects page card

### TC-US2-05: Large image upload (>10MB)
- **Steps:** Upload a 15MB uncompressed TIFF or PNG
- **Expected:** Sanity accepts file, compresses it, serves WebP. No error shown.

### TC-US2-06: Alt text saved with image
- **Steps:**
  1. Upload image in Studio
  2. Fill in `alt` field: `"Denon brand system overview"`
  3. Publish
- **Expected:** Rendered `<img alt="Denon brand system overview">` in HTML source

---

## US3 — Link Management

**User story:** All page links should be visible for me in each page, and change the destination easily.

### TC-US3-01: View all nav links in Sanity Studio
- **Steps:**
  1. Open Studio → Site Settings document
  2. Inspect `navItems[]` array
- **Expected:** All 5 nav links visible (Home, Work, About, Thinking, Contact) with label + URL

### TC-US3-02: Change a nav link destination
- **Steps:**
  1. Studio → Site Settings → navItems → click "Work"
  2. Change URL from `/projects` to `/projects-new`
  3. Publish
- **Expected:** Nav link on live site points to new URL. Revert after test.

### TC-US3-03: View prev/next links per case study
- **Steps:**
  1. Studio → open `ai-workflow` case study document
  2. Find `prevCase` and `nextCase` fields
- **Expected:** Both show reference dropdowns with linked case study names visible

### TC-US3-04: Change prev/next destination
- **Steps:**
  1. Change `nextCase` on `ai-workflow` to `miselu`
  2. Publish
  3. Check `ai-workflow` page on live site
- **Expected:** "Earlier Work →" now links to miselu. Revert after test.

### TC-US3-05: Edit an in-body link (Portable Text link annotation)
- **Steps:**
  1. Open any case study section body in Studio
  2. Select linked text → click link icon in toolbar
  3. Change destination URL
  4. Publish
- **Expected:** Updated link renders in page body

### TC-US3-06: All links on a page are auditable without opening HTML
- **Pass criteria:** Every link on a page (nav, body, footer, prev/next) has a corresponding field visible in Sanity Studio without needing to inspect source HTML.

---

## US4 — Any Page Element Editable

**User story:** Any other page elements should be able to edit.

### TC-US4-01: Edit page meta title and description
- **Steps:**
  1. Studio → any case study → `metaTitle`, `metaDescription` fields
  2. Update both
  3. Publish
- **Expected:** `<title>` and `<meta name="description">` updated in page source

### TC-US4-02: Edit case study year and tags
- **Steps:**
  1. Studio → case study → change `year` field
  2. Publish
- **Expected:** Hero meta row shows updated year

### TC-US4-03: Edit recognition items
- **Steps:**
  1. Studio → case study → `recognition[]` array
  2. Edit award title and org
  3. Publish
- **Expected:** Recognition section on page shows updated award

### TC-US4-04: Edit case study status (live → nda)
- **Steps:**
  1. Studio → case study → set `status` to `nda`
  2. Publish
  3. Check projects page card
- **Expected:** Card converts to NDA state (non-clickable, frosted toast on click)

### TC-US4-05: Add a new section to a case study
- **Steps:**
  1. Studio → case study → `sections[]` → click **Add item**
  2. Add title: `"New Test Section"`
  3. Add body paragraph
  4. Publish
- **Expected:** New section appears in case study content and in TOC sidebar

### TC-US4-06: Edit footer content
- **Steps:**
  1. Studio → Site Settings → footer fields
  2. Edit copyright text or contact email
  3. Publish
- **Expected:** Footer on all pages reflects changes

### TC-US4-07: Reorder sections in a case study
- **Steps:**
  1. Studio → case study → `sections[]`
  2. Drag section 3 above section 1
  3. Publish
- **Expected:** Sections render in new order on page. TOC order also updates.

---

## Visual Regression Tests

These tests confirm zero visual difference between the static site and the CMS version.

### TC-VR-01: Homepage pixel comparison
- **Tool:** Playwright + Percy or manual screenshot diff
- **Steps:**
  1. Screenshot `https://keisukeshingu.github.io/keisuke-portfolio/index.html`
  2. Screenshot `https://[vercel-preview].vercel.app/`
  3. Diff
- **Pass criteria:** No visible layout differences. Minor anti-aliasing deltas acceptable.

### TC-VR-02: Case study layout (ai-workflow)
- **Pass criteria:** `cs-content` grid renders correctly: TOC sidebar at 200px, content column fills remainder

### TC-VR-03: cs-artifact component
- **Pass criteria:** `border-radius: 10px`, `overflow: hidden`, `border: 1px solid var(--rule-40)`, caption strip renders

### TC-VR-04: ba-inline component
- **Pass criteria:** Two images side by side, 1px red divider between them, correct border-radius on corners

### TC-VR-05: Flow pipeline animation
- **Pass criteria:** Ring animations trigger with correct stagger delays (0s, 0.6s, 1.2s for nodes 1, 3, 5)

### TC-VR-06: Recognition section at bottom
- **Pass criteria:** Renders after all sections, above prev/next navigation

### TC-VR-07: Mobile responsive (375px)
- **Pass criteria:** cs-content grid collapses to single column, TOC hidden or repositioned, type scales correctly

---

## Performance Tests

### TC-PERF-01: Lighthouse audit — Homepage
- **Target:** Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- **Tool:** Chrome DevTools → Lighthouse → Mobile

### TC-PERF-02: Lighthouse audit — Case study page
- **Same targets as TC-PERF-01**

### TC-PERF-03: Image format — all case study images served as WebP
- **Tool:** Chrome DevTools → Network → filter Img
- **Pass criteria:** 0 images served as JPG or PNG (all converted by Sanity CDN)

### TC-PERF-04: Core Web Vitals
- **Tool:** Vercel Speed Insights (auto-enabled)
- **Pass criteria:** LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## Sanity Studio Usability Tests

These confirm the CMS is actually usable without technical knowledge.

### TC-UX-01: Non-engineer can find and edit hero text
- **Steps:** Open `/studio`, navigate to a case study, find hero statement field, edit it without guidance
- **Pass criteria:** Completed in < 60 seconds without referencing documentation

### TC-UX-02: Non-engineer can upload and replace an image
- **Steps:** Find an image field in Studio, replace it with a local file
- **Pass criteria:** Completed in < 90 seconds, no file manager or terminal required

### TC-UX-03: Non-engineer can see all links on a page
- **Steps:** Open Site Settings → navItems in Studio
- **Pass criteria:** All nav links visible in one panel without navigating multiple documents

---

## Regression — Existing Features Must Still Work

| Feature | Test | Pass criteria |
|---|---|---|
| NDA toast | Click Ogilvy card | Frosted glass toast appears |
| Coming Soon toast | Click Beatport card | Toast appears |
| Plexus animation | Visit home page | Canvas animation runs, mouse interaction works |
| Scroll reveal | Scroll any case study | Sections fade in as they enter viewport |
| TOC sticky | Scroll case study | TOC sidebar stays visible, active section highlighted |
| Prev/next loop | Navigate all 4 live cases | Loop is correct: ai-workflow → denon → miselu → quarkxpress → ai-workflow |
| Mobile nav | Resize to 375px | Hamburger menu works |

---

## Test Sign-off

| Phase | Tester | Date | Result |
|---|---|---|---|
| US1 — Text editing | | | |
| US2 — Image pipeline | | | |
| US3 — Link management | | | |
| US4 — Element editing | | | |
| Visual regression | | | |
| Performance | | | |
| Usability | | | |
| Regression — existing features | | | |

**All rows must show PASS before CMS version goes live.**

---

*Update this document with actual test results during each implementation phase.*
