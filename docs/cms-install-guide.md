# CMS Install Guide — Keisuke Portfolio
**Version:** 1.0
**Status:** Planning — Ready for Phase 1
**Last updated:** 2026-02-27

This guide walks through setting up the full CMS stack from zero to a deployed, visually editable portfolio. Follow phases in order. Do not skip steps.

---

## Prerequisites

Before starting, confirm you have:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Git configured with GitHub credentials
- [ ] GitHub account with access to `keisukeshingu/keisuke-portfolio`
- [ ] Sanity.io account (free tier works) — https://sanity.io
- [ ] Vercel account (free tier works) — https://vercel.com
- [ ] `npm` or `pnpm` (pnpm recommended for speed)

---

## Phase 1 — Project Scaffold

### 1.1 Create new Next.js app in a separate branch

```bash
# In the portfolio repo root
git checkout -b cms-migration

# Scaffold Next.js in a temporary directory
npx create-next-app@latest keisuke-cms \
  --typescript \
  --tailwind=false \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

# Move contents into repo (not the folder itself)
cp -r keisuke-cms/* .
cp -r keisuke-cms/.* . 2>/dev/null || true
rm -rf keisuke-cms
```

### 1.2 Install dependencies

```bash
# Core
npm install next-sanity @sanity/image-url @portabletext/react

# Sanity Studio (embedded in Next.js)
npm install sanity @sanity/vision

# Types
npm install -D @types/node
```

### 1.3 Copy existing styles

```bash
# Preserve the current design system
cp css/tokens.css styles/tokens.css
cp css/base.css styles/base.css
cp css/nav.css styles/nav.css
cp css/footer.css styles/footer.css
cp css/case-study.css styles/case-study.css
```

### 1.4 Copy static assets

```bash
# Logos stay as static files (no CMS needed)
cp -r logos public/logos
```

---

## Phase 2 — Sanity Project Setup

### 2.1 Create Sanity project

```bash
# Install Sanity CLI globally
npm install -g sanity

# Login
sanity login

# Initialize Sanity inside the repo
sanity init --project-id new --dataset production --output-path sanity
```

When prompted:
- Project name: `keisuke-portfolio`
- Dataset: `production`
- Template: **Clean project with no predefined schemas**

Record the **Project ID** — you'll need it for environment variables.

### 2.2 Configure Sanity client

Create `lib/sanity/client.ts`:

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
```

Create `lib/sanity/image.ts`:

```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

### 2.3 Environment variables

Create `.env.local` (never commit this file):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_TOKEN=                   # add after creating token in step 2.4
SANITY_WEBHOOK_SECRET=              # add after creating webhook in Phase 5
```

Add `.env.local` to `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

### 2.4 Create Sanity API token

1. Go to https://sanity.io/manage → your project → API → Tokens
2. Click **Add API token**
3. Name: `next-revalidation`
4. Permission: **Editor**
5. Copy token → paste into `.env.local` as `SANITY_API_TOKEN`

---

## Phase 3 — Sanity Schema Setup

### 3.1 Create schema index

Create `sanity/schemas/index.ts`:

```typescript
import siteSettings from './documents/siteSettings'
import caseStudy from './documents/caseStudy'
import article from './documents/article'
import imageWithCaption from './objects/imageWithCaption'
import linkItem from './objects/linkItem'
import csSection from './objects/csSection'
import portableText from './objects/portableText'
import recognitionItem from './objects/recognitionItem'
import flowNode from './objects/flowNode'
import metricItem from './objects/metricItem'

export const schemaTypes = [
  // Documents
  siteSettings,
  caseStudy,
  article,
  // Objects
  imageWithCaption,
  linkItem,
  csSection,
  portableText,
  recognitionItem,
  flowNode,
  metricItem,
]
```

### 3.2 Core schemas (create each file)

**`sanity/schemas/objects/imageWithCaption.ts`**
```typescript
export default {
  name: 'imageWithCaption',
  type: 'object',
  fields: [
    { name: 'image', type: 'image', options: { hotspot: true } },
    { name: 'alt', type: 'string', title: 'Alt text' },
    { name: 'caption', type: 'string', title: 'Caption' },
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
  },
}
```

**`sanity/schemas/objects/linkItem.ts`**
```typescript
export default {
  name: 'linkItem',
  type: 'object',
  fields: [
    { name: 'label',      type: 'string'  },
    { name: 'url',        type: 'url'     },
    { name: 'isExternal', type: 'boolean', initialValue: false },
    { name: 'openInNew',  type: 'boolean', initialValue: false },
  ],
}
```

**`sanity/schemas/documents/caseStudy.ts`**
```typescript
export default {
  name: 'caseStudy',
  type: 'document',
  title: 'Case Study',
  fields: [
    { name: 'slug',           type: 'slug', options: { source: 'title' } },
    { name: 'title',          type: 'string'  },
    { name: 'client',         type: 'string'  },
    { name: 'year',           type: 'string'  },
    { name: 'tags',           type: 'array', of: [{ type: 'string' }] },
    { name: 'sortOrder',      type: 'number'  },
    {
      name: 'status',
      type: 'string',
      options: { list: ['live', 'coming-soon', 'nda'] },
      initialValue: 'coming-soon',
    },
    { name: 'heroStatement',  type: 'text'              },
    { name: 'heroImage',      type: 'imageWithCaption'  },
    { name: 'thumbnail',      type: 'imageWithCaption'  },
    {
      name: 'sections',
      type: 'array',
      of: [{ type: 'csSection' }],
    },
    {
      name: 'recognition',
      type: 'array',
      of: [{ type: 'recognitionItem' }],
    },
    {
      name: 'prevCase',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      title: '← Newer Work',
    },
    {
      name: 'nextCase',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      title: 'Earlier Work →',
    },
    { name: 'metaTitle',       type: 'string' },
    { name: 'metaDescription', type: 'text'   },
    { name: 'ogImage',         type: 'image'  },
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'thumbnail.image' },
  },
}
```

### 3.3 Configure Sanity Studio

Create `sanity/sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'keisuke-portfolio',
  title: 'Keisuke Portfolio CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool(),      // GROQ query playground — useful for debugging
  ],
  schema: {
    types: schemaTypes,
  },
})
```

### 3.4 Embed Studio in Next.js

Create `app/studio/[[...tool]]/page.tsx`:

```tsx
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

This makes Sanity Studio available at `yoursite.com/studio` — no separate studio deployment needed.

---

## Phase 4 — Next.js Page Setup

### 4.1 Root layout with design tokens

Create `app/layout.tsx`:

```tsx
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/nav.css'
import '@/styles/footer.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### 4.2 Case study dynamic route

Create `app/case-studies/[slug]/page.tsx`:

```tsx
import { client } from '@/lib/sanity/client'
import { caseStudyQuery } from '@/lib/sanity/queries/caseStudy'
import CsHero from '@/components/case-study/CsHero'
import CsContent from '@/components/case-study/CsContent'

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "caseStudy"].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await client.fetch(caseStudyQuery, { slug: params.slug })
  return (
    <>
      <CsHero data={caseStudy} />
      <CsContent sections={caseStudy.sections} recognition={caseStudy.recognition} />
    </>
  )
}
```

### 4.3 next.config.ts — allow Sanity CDN images

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}
export default nextConfig
```

---

## Phase 5 — Deployment (Vercel)

### 5.1 Connect repo to Vercel

1. Go to https://vercel.com/new
2. Import `keisukeshingu/keisuke-portfolio`
3. Framework: **Next.js** (auto-detected)
4. Root directory: `/` (repo root)
5. Add environment variables (copy from `.env.local`):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_TOKEN`
   - `SANITY_WEBHOOK_SECRET`
6. Click **Deploy**

### 5.2 Set up Sanity webhook (publish → auto-deploy)

Create the revalidation API route in Next.js:

```
app/api/revalidate/route.ts
```

```typescript
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('sanity-webhook-signature')
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }
  revalidateTag('sanity')
  return NextResponse.json({ revalidated: true })
}
```

Then in Sanity:
1. Go to https://sanity.io/manage → your project → API → Webhooks
2. Click **Add webhook**
3. Name: `vercel-redeploy`
4. URL: `https://your-vercel-url.vercel.app/api/revalidate`
5. Trigger on: **Publish**
6. Secret: generate a random string → paste into Vercel env as `SANITY_WEBHOOK_SECRET`
7. Save

From now on: **Publish in Sanity → site rebuilds automatically in ~30 seconds.**

### 5.3 Configure custom domain (optional)

1. Vercel → your project → Settings → Domains
2. Add `keisukeshingu.com` (or current domain)
3. Update DNS records as shown
4. Update GitHub Pages redirect if previously used

---

## Phase 6 — Content Migration

### 6.1 Create Sanity documents for each page

In Sanity Studio (`/studio`):
1. Create one `siteSettings` document (nav + footer links)
2. Create 14 `caseStudy` documents (one per HTML file)
3. Create `homePage`, `projectsPage`, `aboutPage`, `processPage` documents
4. Create 5 `article` documents

### 6.2 Content migration order

Migrate in this order to unblock QA early:

1. `siteSettings` — nav + footer (affects every page)
2. `ai-workflow` case study (most complete, use as reference)
3. `denon-marantz`, `miselu`, `quarkxpress` (other live cases)
4. Home page
5. Projects, About, Process, Contact
6. Remaining case studies
7. Articles

### 6.3 Image migration

For each image currently in `img/library/`:
1. In Sanity Studio, open the relevant document
2. Click the image field → **Upload** → select the file from `img/library/`
3. Sanity uploads to CDN automatically
4. Verify the image renders in the preview

No need to change image filenames or paths — Sanity assigns its own CDN URLs.

---

## Phase 7 — Visual Editor Setup (Sanity Presentation)

### 7.1 Install Presentation plugin

```bash
npm install @sanity/presentation
```

### 7.2 Add to Sanity config

```typescript
import { presentationTool } from '@sanity/presentation'

export default defineConfig({
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: { enable: '/api/draft' },
      },
    }),
    visionTool(),
  ],
})
```

### 7.3 Enable draft mode in Next.js

Create `app/api/draft/route.ts`:

```typescript
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  draftMode().enable()
  const { searchParams } = new URL(req.url)
  redirect(searchParams.get('redirect') || '/')
}
```

### 7.4 Add edit overlays to components

Wrap each editable component with `VisualEditing`:

```tsx
// In any component that should be visually editable
import { stegaEncode } from '@sanity/client/stega'

// Example: CsHero.tsx
<h1 data-sanity={stegaEncode({ id: caseStudy._id, path: 'title' })}>
  {caseStudy.title}
</h1>
```

After this setup, opening `yoursite.com/studio` → Presentation shows click-to-edit overlays on the live preview.

---

## Local Development

```bash
# Install dependencies
npm install

# Start Next.js dev server
npm run dev
# → http://localhost:3000

# Sanity Studio is at:
# → http://localhost:3000/studio

# Build for production
npm run build
npm start
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID is not defined` | Check `.env.local` exists and has correct values |
| Images not loading from Sanity CDN | Add `cdn.sanity.io` to `next.config.ts` remotePatterns |
| Studio shows blank page | Verify `projectId` matches the project in sanity.io/manage |
| Webhook not triggering rebuild | Check webhook secret matches `SANITY_WEBHOOK_SECRET` env var |
| `generateStaticParams` returns empty | Confirm documents exist in Sanity with valid slugs |
| CSS not applying | Confirm `tokens.css` is imported before all other styles in `layout.tsx` |
| Draft mode not working | Confirm `/api/draft` route exists and `SANITY_API_TOKEN` has editor permission |

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-02-27 | Initial planning guide |

---

*Questions or blockers → update this doc with solutions found during implementation.*
