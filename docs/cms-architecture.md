# CMS Architecture — Keisuke Portfolio
**Version:** 1.0
**Author:** Keisuke Shingu
**Status:** Planning — Approved for Implementation
**Last updated:** 2026-02-27

---

## 1. Overview

This document defines the architecture for migrating the Keisuke Portfolio from a static HTML/CSS/JS site to a CMS-backed, visually editable web application. The system is designed around four core user stories:

| # | User Story | Solved By |
|---|---|---|
| US1 | Inline text editing with git sync on save | Sanity Studio + Vercel webhook → GitHub deploy |
| US2 | Image replacement from local files, auto-saved to CMS | Sanity Asset Pipeline + CDN |
| US3 | All page links visible and editable per page | Sanity link schema + Presentation overlay |
| US4 | Any page element editable | Sanity structured content + visual editor |

---

## 2. Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        AUTHORING LAYER                       │
│                                                              │
│   Sanity Studio (visual editor + content management)        │
│   ├── Presentation Tool  (edit overlays on live preview)    │
│   ├── Asset Pipeline     (image upload, optimize, CDN)      │
│   └── Content Lake       (structured data, versioned)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ publish webhook
┌──────────────────────────────▼──────────────────────────────┐
│                       DEPLOYMENT LAYER                       │
│                                                              │
│   Vercel                                                     │
│   ├── Triggers Next.js build on webhook                     │
│   ├── Deploys static + edge pages                           │
│   └── Publishes to production URL                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ builds from
┌──────────────────────────────▼──────────────────────────────┐
│                      FRONTEND LAYER                          │
│                                                              │
│   Next.js 14 (App Router, TypeScript)                       │
│   ├── /app                  (pages + layouts)               │
│   ├── /components           (React component library)       │
│   ├── /lib/sanity           (GROQ queries + client)         │
│   └── /styles               (migrated design tokens + CSS)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ code lives in
┌──────────────────────────────▼──────────────────────────────┐
│                        CODE LAYER                            │
│                                                              │
│   GitHub — keisukeshingu/keisuke-portfolio                  │
│   ├── main branch           (production)                    │
│   ├── dev branch            (development)                   │
│   └── Vercel auto-deploys on push to main                   │
└─────────────────────────────────────────────────────────────┘
```

### Stack Decisions

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | TypeScript-first, ISR/SSG, Vercel-native |
| CMS | Sanity.io | Visual editor, best-in-class image pipeline, GROQ |
| Visual editing | Sanity Presentation Tool | In-context overlay editing (US1, US3, US4) |
| Deployment | Vercel | Zero-config Next.js, instant preview URLs, webhook triggers |
| Image CDN | Sanity CDN (imgix-compatible) | Auto-resize, WebP conversion, no manual upload step |
| Styling | CSS Modules + existing tokens.css | Preserves existing design system, no breaking changes |

---

## 3. Content Architecture

### 3.1 Schema Types

All content is modeled as Sanity document types. Each maps to a page or reusable block.

```
sanity/
└── schemas/
    ├── documents/
    │   ├── siteSettings.ts       ← global nav, footer, social links
    │   ├── homePage.ts           ← index.html
    │   ├── projectsPage.ts       ← projects.html
    │   ├── aboutPage.ts          ← about.html
    │   ├── designThinkingPage.ts ← design-thinking.html
    │   ├── contactPage.ts        ← contact.html
    │   ├── processPage.ts        ← process.html
    │   ├── caseStudy.ts          ← case-studies/*.html (all 14)
    │   └── article.ts            ← articles/*.html
    │
    └── objects/
        ├── portableText.ts       ← rich text block (headings, bold, lists, links)
        ├── imageWithCaption.ts   ← image + caption + alt (US2)
        ├── linkItem.ts           ← url + label + isExternal (US3)
        ├── csSection.ts          ← stard-section block (title + body + image)
        ├── csArtifact.ts         ← image artifact block (cs-artifact treatment)
        ├── baInline.ts           ← before/after inline image pair
        ├── flowNode.ts           ← flow pipeline node
        ├── metricItem.ts         ← metric block (number + label)
        └── recognitionItem.ts    ← award/recognition entry
```

### 3.2 Case Study Schema (Key Type)

```typescript
// schemas/documents/caseStudy.ts
export default {
  name: 'caseStudy',
  type: 'document',
  fields: [
    // Identity
    { name: 'slug',        type: 'slug'   },
    { name: 'title',       type: 'string' },
    { name: 'client',      type: 'string' },
    { name: 'year',        type: 'string' },
    { name: 'status',      type: 'string', options: { list: ['live','coming-soon','nda'] } },

    // Hero
    { name: 'heroStatement',  type: 'text'             },
    { name: 'heroImage',      type: 'imageWithCaption' },
    { name: 'heroBadge',      type: 'string'           },

    // Table of contents (auto-generated from sections)
    { name: 'sections',    type: 'array', of: [{ type: 'csSection' }] },

    // Recognition
    { name: 'recognition', type: 'array', of: [{ type: 'recognitionItem' }] },

    // Navigation
    { name: 'prevCase',    type: 'reference', to: [{ type: 'caseStudy' }] },
    { name: 'nextCase',    type: 'reference', to: [{ type: 'caseStudy' }] },

    // Page meta
    { name: 'metaTitle',       type: 'string' },
    { name: 'metaDescription', type: 'text'   },
    { name: 'ogImage',         type: 'image'  },
  ]
}
```

### 3.3 Link Schema (US3)

Every internal and external link on the site is modeled as a `linkItem` object, making all destinations visible and editable in Sanity Studio.

```typescript
// schemas/objects/linkItem.ts
export default {
  name: 'linkItem',
  type: 'object',
  fields: [
    { name: 'label',      type: 'string'  },
    { name: 'url',        type: 'url'     },
    { name: 'isExternal', type: 'boolean' },
    { name: 'openInNew',  type: 'boolean' },
  ]
}
```

Navigation items, prev/next case links, footer links, and in-text links all use this type — centralized, auditable, and changeable without code.

---

## 4. Visual Editing Architecture (US1 + US4)

Sanity's **Presentation Tool** enables in-context editing: overlays appear on the live rendered Next.js page, and clicking any element opens the corresponding Sanity Studio field. Changes appear in the preview in real time.

```
┌──────────────────────────────────────────────────────┐
│  Sanity Studio — Presentation Tool                   │
│                                                      │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │  Field Panel  │  │   Live Page Preview          │ │
│  │               │  │                              │ │
│  │ • Hero Text   │  │  [✏ Hero heading]            │ │
│  │ • Body Copy   │  │  [✏ Section 1 body]          │ │
│  │ • Image       │  │  [✏ Image block]             │ │
│  │ • Links       │  │  [✏ CTA link]                │ │
│  │               │  │                              │ │
│  │ [Publish] ──────────────────────────────────►   │ │
│  │               │  │   Webhook → Vercel build     │ │
│  └──────────────┘  └──────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Visual editing requires:
1. `sanity-overlays` React component wrapping every editable element
2. Each component annotated with `data-sanity` encoding document ID + field path
3. Sanity Studio iframe rendering the Next.js preview URL

---

## 5. Image Pipeline (US2)

```
User picks file from local disk
         │
         ▼
Sanity Studio file picker / drag-drop
         │
         ▼
Sanity Asset Pipeline
  ├── Validates format (JPG, PNG, WebP, SVG, GIF)
  ├── Stores original in Sanity CDN
  ├── Generates responsive variants (320, 640, 1280, 2560)
  ├── Converts to WebP automatically
  └── Returns asset reference + CDN URL
         │
         ▼
Next.js <Image> component
  ├── Uses next/image with Sanity CDN loader
  ├── Serves correct size for viewport
  ├── Lazy loads below the fold
  └── No manual file move required ✓
```

The user never needs to:
- Move files into `img/library/`
- Resize or optimize manually
- Update `src` attributes in HTML

---

## 6. Deployment Flow

```
Author edits content in Sanity Studio
         │
         ▼
Clicks "Publish"
         │
         ▼
Sanity fires webhook → Vercel API
         │
         ▼
Vercel triggers Next.js build
  ├── Fetches all content via GROQ from Sanity Content Lake
  ├── Generates static pages (SSG) for all routes
  └── Deploys to Vercel Edge Network
         │
         ▼
Production URL updated (~30 seconds)
         │
         ▼
Vercel deploy log links to GitHub commit (code changes tracked)
```

### Git Strategy

| What | Where | Branch |
|---|---|---|
| Frontend code (Next.js, components, styles) | GitHub | `main` / `dev` |
| Content (text, images, links) | Sanity Content Lake | Sanity versioning |
| Deployments | Vercel | Triggered by git push OR Sanity publish |

---

## 7. Directory Structure (Next.js)

```
keisuke-portfolio/          ← GitHub repo root
│
├── app/                    ← Next.js App Router
│   ├── layout.tsx          ← Root layout (Nav + Footer)
│   ├── page.tsx            ← Home (index.html)
│   ├── projects/
│   │   └── page.tsx        ← Projects grid
│   ├── about/
│   │   └── page.tsx
│   ├── process/
│   │   └── page.tsx
│   ├── design-thinking/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── case-studies/
│       └── [slug]/
│           └── page.tsx    ← Dynamic case study (all 14)
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   ├── case-study/
│   │   ├── CsHero.tsx
│   │   ├── CsContent.tsx   ← grid wrapper (cs-content)
│   │   ├── TocSidebar.tsx
│   │   ├── StardSection.tsx
│   │   ├── CsArtifact.tsx
│   │   ├── BaInline.tsx
│   │   ├── FlowPipeline.tsx
│   │   ├── MetricsGrid.tsx
│   │   └── Recognition.tsx
│   ├── home/
│   │   ├── PlexusBg.tsx
│   │   ├── HeritageCard.tsx
│   │   └── LogoGrid.tsx
│   └── ui/
│       ├── ScrollReveal.tsx
│       ├── NdaToast.tsx
│       └── SoonToast.tsx
│
├── lib/
│   └── sanity/
│       ├── client.ts       ← Sanity client config
│       ├── image.ts        ← Image URL builder
│       └── queries/
│           ├── caseStudy.ts
│           ├── home.ts
│           └── siteSettings.ts
│
├── sanity/                 ← Sanity Studio (embedded)
│   ├── sanity.config.ts
│   └── schemas/
│       ├── index.ts
│       ├── documents/
│       └── objects/
│
├── styles/
│   ├── tokens.css          ← migrated from css/tokens.css (unchanged)
│   ├── base.css
│   ├── nav.css
│   ├── footer.css
│   └── case-study.css
│
├── public/
│   └── logos/              ← static SVGs (no CMS needed)
│
├── next.config.ts
├── sanity.cli.ts
└── package.json
```

---

## 8. Data Separation Principle

Following the project's architecture principle: **code is strictly separate from data**.

| Layer | What lives here | Changed by |
|---|---|---|
| **Data** | All text, images, links, page content | Sanity Studio (no code required) |
| **Backend / API** | GROQ queries, Sanity client, webhook handler | Next.js `/lib/sanity/` |
| **Application logic** | Page routing, ISR, build pipeline | Next.js `app/` |
| **Frontend** | React components, animations, CSS | `components/` + `styles/` |

---

## 9. Environment Variables

```bash
# .env.local (never committed to git)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_TOKEN=sk...          # write token for ISR revalidation
SANITY_WEBHOOK_SECRET=whsec_... # validates Sanity → Vercel webhook
```

---

## 10. Migration Plan (Phases)

| Phase | Scope | Effort |
|---|---|---|
| **1 — Foundation** | Next.js scaffold, Sanity project, design tokens migrated, deploy to Vercel | 2–3 days |
| **2 — Core pages** | Home, Projects, About, Contact — Sanity schemas + Next.js pages | 2–3 days |
| **3 — Case studies** | All 14 case studies — dynamic `[slug]` route, full schema, content migration | 4–5 days |
| **4 — Visual editor** | Sanity Presentation Tool overlays on all editable components | 2 days |
| **5 — Image pipeline** | next/image + Sanity CDN loader, WebP optimization, responsive srcset | 1 day |
| **6 — Link manager** | All nav/footer/in-text/prev-next links centralized in Sanity | 1 day |
| **7 — QA + launch** | Lighthouse audit, cross-browser, mobile, content parity check | 2 days |

**Total estimated effort:** ~15–18 days
**Current static site remains live throughout migration.**

---

*Document maintained in `/docs/` — update on any architectural decision change.*
