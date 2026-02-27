# Design System Mapping — Static → CMS
**Version:** 1.0
**Status:** Planning
**Last updated:** 2026-02-27

This document maps every element of the current static design system to its Next.js component equivalent and Sanity content schema. It is the source of truth for migration engineers and ensures zero visual regression during the CMS transition.

---

## 1. Design Tokens

The existing `css/tokens.css` is **preserved unchanged** and imported globally in Next.js. No token values change. Components reference the same CSS custom properties.

```
css/tokens.css  →  styles/tokens.css  (copy, no edits)
css/base.css    →  styles/base.css
css/nav.css     →  styles/nav.css
css/footer.css  →  styles/footer.css
css/case-study.css → styles/case-study.css
```

In `app/layout.tsx`:
```tsx
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/nav.css'
import '@/styles/footer.css'
```

---

## 2. Global Layout Components

### 2.1 Navigation (`<nav>`)

| Static HTML | Next.js Component | Sanity Schema |
|---|---|---|
| `<nav>` block in every `<head>` | `components/layout/Nav.tsx` | `siteSettings.navItems[]` |
| Hardcoded `<a href="...">` links | `linkItem` rendered from Sanity data | `linkItem { label, url, isExternal }` |
| Active state via `class="active"` | `usePathname()` hook comparison | — |

**Editable fields in Sanity:**
- Nav item label
- Nav item destination URL
- Nav item order

### 2.2 Footer

| Static HTML | Next.js Component | Sanity Schema |
|---|---|---|
| Hardcoded copyright + links | `components/layout/Footer.tsx` | `siteSettings.footer` |
| Email address string | Sanity plain text field | `siteSettings.contactEmail` |
| Social links | `linkItem[]` array | `siteSettings.socialLinks[]` |

---

## 3. Page-Level Mapping

### 3.1 Home (`index.html` → `app/page.tsx`)

| Element | Component | Sanity Field |
|---|---|---|
| Hero heading | `<h1>` in page | `homePage.heroHeading` |
| Hero subtext | `<p>` in page | `homePage.heroSubtext` |
| Plexus animation | `components/home/PlexusBg.tsx` | — (static JS, no CMS) |
| Heritage cards | `components/home/HeritageCard.tsx` | `homePage.heritageCards[]` |
| Card title | — | `heritageCard.title` |
| Card year | — | `heritageCard.year` |
| Card href | — | `heritageCard.link (linkItem)` |
| Card NDA state | — | `heritageCard.status` (live/nda/soon) |
| Logo grid | `components/home/LogoGrid.tsx` | `siteSettings.clientLogos[]` |
| Logo SVG | — | `clientLogo.file (SVG asset)` |
| Logo label | — | `clientLogo.name` |

### 3.2 Projects (`projects.html` → `app/projects/page.tsx`)

| Element | Component | Sanity Field |
|---|---|---|
| Case entry card | `components/home/CaseEntry.tsx` | Auto-generated from `caseStudy` docs |
| Card thumbnail | — | `caseStudy.thumbnail (imageWithCaption)` |
| Card title | — | `caseStudy.title` |
| Card tags | — | `caseStudy.tags[]` |
| Card status (NDA/soon) | — | `caseStudy.status` |
| Card href | — | Auto: `/case-studies/${caseStudy.slug}` |

### 3.3 About (`about.html` → `app/about/page.tsx`)

| Element | Component | Sanity Field |
|---|---|---|
| Portrait image | `<Image>` | `aboutPage.portrait (imageWithCaption)` |
| Bio heading | — | `aboutPage.bioHeading` |
| Bio body | `<PortableText>` | `aboutPage.bioCopy (portableText)` |
| Clients grid | `components/home/LogoGrid.tsx` | `siteSettings.clientLogos[]` (shared with home) |
| Timeline items | — | `aboutPage.timeline[]` |

### 3.4 Process (`process.html` → `app/process/page.tsx`)

| Element | Component | Sanity Field |
|---|---|---|
| Hero heading | — | `processPage.heroHeading` |
| Hero sub | — | `processPage.heroSub (portableText)` |
| Sections | `StardSection.tsx` | `processPage.sections[]` |
| Section title | — | `csSection.title` |
| Section body | `<PortableText>` | `csSection.body (portableText)` |
| Section image | `CsArtifact.tsx` | `csSection.artifact (imageWithCaption)` |

---

## 4. Case Study Component Mapping

This is the most complex mapping. All 14 case studies use the same component tree, populated from a single `caseStudy` Sanity document.

### 4.1 Layout Grid (cs-content)

```
CSS class: .cs-content (grid: 200px 1fr)
→ Component: components/case-study/CsContent.tsx

CSS class: .toc
→ Component: components/case-study/TocSidebar.tsx
→ Sanity: auto-generated from caseStudy.sections[].title

CSS class: .content-col
→ Inner div in CsContent.tsx, receives section children
```

### 4.2 Hero Section

| Static HTML class | Component | Sanity Field |
|---|---|---|
| `.cs-hero` | `CsHero.tsx` | — |
| `.cs-hero__label` | — | `caseStudy.client` |
| `.cs-hero__title` | `<h1>` | `caseStudy.title` |
| `.cs-hero__statement` | `<p>` | `caseStudy.heroStatement` |
| `.cs-hero__meta` | metadata row | `caseStudy.year`, `caseStudy.tags[]` |
| `.cs-hero__img` | `<Image>` | `caseStudy.heroImage (imageWithCaption)` |

### 4.3 Stard Section (`.stard-section`)

| Static HTML | Component | Sanity Schema |
|---|---|---|
| `<section class="stard-section">` | `StardSection.tsx` | `csSection` object |
| `<h2 id="...">` title | auto from slug | `csSection.title` |
| Body `<p>` tags | `<PortableText>` | `csSection.body (portableText)` |
| Inline image | `CsArtifact.tsx` | `csSection.artifact (imageWithCaption)` |
| Before/After pair | `BaInline.tsx` | `csSection.baInline (baInline)` |
| Flow pipeline | `FlowPipeline.tsx` | `csSection.flowPipeline (flowNode[])` |
| Metrics grid | `MetricsGrid.tsx` | `csSection.metrics (metricItem[])` |

### 4.4 Image Artifact (`.cs-artifact`)

| Static HTML | Component | Sanity Field |
|---|---|---|
| `<div class="cs-artifact">` | `CsArtifact.tsx` | `imageWithCaption` object |
| `<img src="...">` | `<Image>` (next/image) | `imageWithCaption.image` |
| `.cs-artifact__caption` | `<figcaption>` | `imageWithCaption.caption` |
| `alt` attribute | — | `imageWithCaption.alt` |

**Image editing (US2):** In Sanity Studio, clicking any `CsArtifact` block opens a file picker. The selected image uploads directly to Sanity CDN. No manual file management required.

### 4.5 Before/After Inline (`.ba-inline`)

| Static HTML | Component | Sanity Schema |
|---|---|---|
| `<div class="ba-inline">` | `BaInline.tsx` | `baInline` object |
| Left image + label | `<Image>` + `<span>` | `baInline.before (imageWithCaption)` |
| Right image + label | `<Image>` + `<span>` | `baInline.after (imageWithCaption)` |
| Red 1px divider | CSS `.ba-inline` background | — |

### 4.6 Recognition (`.recognition`)

| Static HTML | Component | Sanity Schema |
|---|---|---|
| `<div class="recognition">` | `Recognition.tsx` | `recognitionItem[]` |
| Award title | `<p>` | `recognitionItem.title` |
| Award org + year | `<span>` | `recognitionItem.org`, `recognitionItem.year` |

### 4.7 Prev / Next Navigation

| Static HTML | Component | Sanity Field |
|---|---|---|
| `← Newer Work` link | `CasePrevNext.tsx` | `caseStudy.prevCase (reference)` |
| `Earlier Work →` link | — | `caseStudy.nextCase (reference)` |

References are Sanity document references — changing a destination is a dropdown selection in Studio, not a code change.

---

## 5. Rich Text (Portable Text)

All body copy currently written as raw `<p>`, `<strong>`, `<ul>` tags in HTML becomes **Portable Text** in Sanity — a structured rich text format that renders to any HTML target.

### Supported marks in the portfolio:
| HTML element | Portable Text annotation |
|---|---|
| `<strong>` | `strong` mark |
| `<em>` | `em` mark |
| `<a href>` | `link` annotation (uses `linkItem` schema) |
| `<h2>` | `h2` block style |
| `<h3>` | `h3` block style |
| `<p>` | `normal` block style |
| `<ul>/<li>` | `bullet` list |

### Rendering:
```tsx
import { PortableText } from '@portabletext/react'

const components = {
  marks: {
    link: ({ value, children }) => (
      <a href={value.url} target={value.openInNew ? '_blank' : undefined}>
        {children}
      </a>
    ),
  },
}

<PortableText value={section.body} components={components} />
```

---

## 6. Animation Components

Animations are React components wrapping the existing JavaScript logic. They receive no Sanity data — they are purely presentational and remain as static code.

| Static JS | Next.js Component | CMS involvement |
|---|---|---|
| `js/plexus-bg.js` | `PlexusBg.tsx` | None |
| `js/micro-anim.js` | `MicroAnim.tsx` | None |
| `js/scroll-reveal.js` | `ScrollReveal.tsx` (uses IntersectionObserver) | None |
| `.flow-node` CSS animations | Inside `FlowPipeline.tsx` styles | None |
| `#snow-zone` | `SnowZone.tsx` | None |

---

## 7. Link Centralization (US3)

Every link type in the current site maps to a Sanity-managed field:

| Link type | Current location | Sanity location |
|---|---|---|
| Main nav links | Hardcoded in every HTML file | `siteSettings.navItems[]` |
| Footer links | Hardcoded in every HTML file | `siteSettings.footerLinks[]` |
| Heritage card links | Hardcoded in `index.html` | `homePage.heritageCards[].link` |
| Case entry card links | Hardcoded in `projects.html` | Auto from `caseStudy.slug` |
| In-body `<a>` links | Inline in HTML paragraphs | Portable Text `link` annotations |
| Prev/next case links | Hardcoded on each case study | `caseStudy.prevCase / nextCase` references |
| TOC anchor links | Auto-generated from `id` attributes | Auto-generated from `csSection.title` slugify |
| Social/external links | Hardcoded in footer | `siteSettings.socialLinks[]` |

**In Sanity Studio, the "Links" panel for any page shows all links on that page — label, destination, and internal/external status — in a single editable list.**

---

## 8. CSS Class → Component Prop Mapping

For engineers implementing the component library:

| CSS class | Component | Prop |
|---|---|---|
| `.cs-content` | `CsContent` | — (structural wrapper) |
| `.toc` | `TocSidebar` | `sections` (array of {id, title}) |
| `.stard-section` | `StardSection` | `id`, `title`, `body`, `artifact?` |
| `.cs-artifact` | `CsArtifact` | `image`, `caption`, `alt` |
| `.ba-inline` | `BaInline` | `before`, `after` |
| `.flow-pipeline` | `FlowPipeline` | `nodes[]` |
| `.metrics` | `MetricsGrid` | `items[]`, `columns` |
| `.recognition` | `Recognition` | `items[]` |
| `.reveal` | `ScrollReveal` | `children` |
| `.cs-hero` | `CsHero` | `title`, `statement`, `heroImage`, `meta` |
| `.heritage-card--nda` | `HeritageCard` | `status="nda"` |
| `.heritage-card--soon` | `HeritageCard` | `status="soon"` |

---

## 9. No-regression Checklist

Before launching the CMS version, verify every item:

- [ ] All CSS tokens render identically (visual diff screenshot comparison)
- [ ] Plexus animation functional on desktop and mobile
- [ ] All 14 case studies accessible at correct `/case-studies/[slug]` URLs
- [ ] TOC sidebar anchors scroll to correct sections
- [ ] Prev/next loop correct: ai-workflow ↔ denon-marantz ↔ miselu ↔ quarkxpress
- [ ] NDA toast fires on Ogilvy + Slalom cards
- [ ] Coming Soon toast fires on Beatport, Robot Heart, TechCrunch, Festivals
- [ ] All logo SVGs render in client grid
- [ ] Image CDN serving WebP with correct srcset
- [ ] `cs-artifact` border-radius, overflow, caption strip render correctly
- [ ] `ba-inline` 1px red divider renders correctly
- [ ] `flow-node` ring animations fire with correct stagger delays
- [ ] Scroll-reveal animations trigger on viewport entry
- [ ] Mobile responsive breakpoints match static site
- [ ] Lighthouse score ≥ 95 on all four metrics

---

*This document is the migration contract between design and engineering. Do not skip the no-regression checklist.*
