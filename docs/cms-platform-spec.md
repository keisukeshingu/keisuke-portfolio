# Platform Technical Specification
## Keisuke Shingu — Portfolio CMS + Multimedia Platform

**Version:** 2.1
**Author:** Keisuke Shingu
**Status:** Planning — Supersedes cms-architecture.md v1.0
**Last updated:** 2026-02-27
**Format:** Figma Make implementation-ready specification

---

## Document Purpose

This specification defines the complete platform architecture for migrating the Keisuke Portfolio from a static HTML/CSS/JS site to a CMS-backed, multimedia-rich web application with audio, video, 3D, and advanced motion capabilities. It is structured for direct implementation inside Figma Make and serves as the single source of truth for all engineering decisions.

### User Stories (Governing Requirements)

| # | Story | Acceptance Criteria |
|---|---|---|
| US1 | Inline text editing with deploy-on-save | Click any text on live preview → edit → Publish → live in ≤30s |
| US2 | Image replacement from local files, auto-saved to CMS | Upload in Studio → CDN-served WebP → no manual file moves |
| US3 | All page links visible and editable per page | Every link (nav, body, footer, prev/next) in one Studio panel |
| US4 | Any page element editable | All content, metadata, media, and structure managed in CMS |

### Multimedia Requirements

The platform must support the following media types natively, integrated into the CMS content model so authors can embed them without code changes:

| Media Type | Use Cases | Framework |
|---|---|---|
| Audio (self-hosted) | Ambient soundscapes, music project demos, podcast clips | Web Audio API + Howler.js |
| Audio (SoundCloud) | Embedded SoundCloud tracks/playlists, artist portfolio pieces | SoundCloud Widget API (oEmbed) |
| Background music | Page-level ambient audio that plays while browsing a case study | Howler.js (looped, crossfade) |
| Audio-reactive visuals | Plexus, snow, and canvas animations respond to audio frequency/amplitude | Web Audio API AnalyserNode |
| Video | Case study walkthroughs, prototype demos, process recordings | Mux Video (adaptive HLS) |
| 3D | Product visualizations, spatial interfaces, interactive sculptures | Three.js (R128+) |
| Data visualization | Metrics, workflows, system diagrams, design token maps | D3.js |
| Motion graphics | Page transitions, scroll choreography, micro-interactions | Motion (Framer Motion) |
| Node-based diagrams | AI pipelines, design system flows, architecture diagrams | React Flow |
| Sequenced animation | SVG morphs, timeline-based storytelling, attention guides | Anime.js |

---

## Section 1 — Information Architecture

### 1.1 Complete Sitemap

```
keisukeshingu.com/
│
├── /                               HOME
│   ├── Hero (heading, sub, kanji)
│   ├── Heritage Grid (featured work cards)
│   ├── Divider Animations
│   └── Client Logo Grid
│
├── /projects                       WORK INDEX
│   ├── Era: AI Systems (2023–Present)
│   │   ├── /case-studies/ai-workflow
│   │   ├── /case-studies/tdk
│   │   └── /case-studies/fabrion
│   ├── Era: Agency & Consulting
│   │   ├── /case-studies/slalom        [NDA]
│   │   └── /case-studies/ogilvy        [NDA]
│   ├── Era: Premium Audio & Hardware
│   │   ├── /case-studies/denon-marantz
│   │   ├── /case-studies/miselu
│   │   └── /case-studies/rakuten-fit
│   ├── Era: Music & Live Performance
│   │   ├── /case-studies/beatport-ni
│   │   ├── /case-studies/robot-heart
│   │   ├── /case-studies/festivals
│   │   └── /case-studies/techcrunch
│   └── Era: Publishing & Typography
│       └── /case-studies/quarkxpress
│
├── /case-studies/[slug]            CASE STUDY (dynamic)
│   ├── Hero (title, statement, kanji watermark, hero image)
│   ├── Overview Bar (role, timeline, platform, scope)
│   ├── Tags Bar
│   ├── Metrics Grid
│   ├── TOC Sidebar + Content Sections
│   │   ├── Narrative sections (text + images)
│   │   ├── Before/After comparisons
│   │   ├── Flow pipeline diagrams
│   │   ├── Media embeds (audio, video, 3D)
│   │   └── Data visualizations
│   ├── Recognition
│   └── Prev/Next Navigation
│
├── /process                        DESIGN PROCESS
│   ├── Hero Quote
│   ├── First Principles
│   ├── Token Pipeline Diagram
│   ├── Design Principles Grid
│   └── Tools Grid
│
├── /design-thinking                EDITORIAL INDEX
│   └── /articles/[slug]           ARTICLE (dynamic)
│
├── /about                          ABOUT
│   ├── Portrait + Bio
│   ├── Philosophy Blocks
│   ├── Career Timeline
│   └── Client Grid
│
├── /contact                        CONTACT
│
├── /studio                         SANITY STUDIO (auth-gated)
│
└── /api/                           INTERNAL API
    ├── /api/revalidate             Sanity webhook handler
    ├── /api/draft                  Draft mode toggle
    └── /api/og                     Dynamic OG image generation
```

### 1.2 Page Hierarchy

```
Level 0 (Global)
├── Navigation (persistent)
├── Footer (persistent)
└── Plexus Background (home + design-thinking)

Level 1 (Top-Level Pages)
├── Home /
├── Work Index /projects
├── Process /process
├── Design Thinking /design-thinking
├── About /about
└── Contact /contact

Level 2 (Content Pages)
├── Case Study /case-studies/[slug]    ×14 pages
└── Article /articles/[slug]           ×5 pages

Level 3 (Utility)
├── Sanity Studio /studio
└── API Routes /api/*
```

### 1.3 Logical Groupings

| Group | Pages | Shared Layout | Shared CSS |
|---|---|---|---|
| **Marketing** | Home, About, Contact | `MarketingLayout` | base.css |
| **Work** | Projects, Case Studies (×14) | `WorkLayout` | case-study.css |
| **Editorial** | Design Thinking, Articles (×5) | `EditorialLayout` | article.css |
| **Process** | Process | `ProcessLayout` | process.css |
| **Admin** | Studio | `StudioLayout` | Sanity default |

### 1.4 Content Status Model

Every case study and article has a `status` field governing visibility:

| Status | Card Behavior | Page Behavior | Prev/Next |
|---|---|---|---|
| `live` | Clickable, full card | Rendered, indexed | Included in chain |
| `coming-soon` | Red badge, toast on click | 404 | Excluded |
| `nda` | Grey badge, toast on click | 404 | Excluded |
| `draft` | Hidden from all listings | 404 | Excluded |

**Current live chain:** ai-workflow → denon-marantz → miselu → quarkxpress → ai-workflow
**Direction convention:** Left (←) = Newer Work, Right (→) = Earlier Work

---

## Section 2 — User Journey Mapping

### 2.1 Journey A — Recruiter / Hiring Manager

**Entry:** LinkedIn profile link → Home
**Goal:** Evaluate design leadership capability in ≤3 minutes

```
HOME
  │  Scans heritage cards (5s)
  │  Notices: Apple, Google, Denon/Marantz logos
  ▼
HERITAGE CARD CLICK → /case-studies/ai-workflow
  │  Reads hero statement (10s)
  │  Scans overview bar: Role, Timeline, Platform (5s)
  │  Scrolls metrics grid — sees quantified impact (5s)
  │  Skims 2–3 sections via TOC sidebar jumps (30s)
  │  ▸ Watches embedded process video (30s)
  │  ▸ Interacts with 3D product model (15s)
  │  Reads recognition section (10s)
  ▼
PREV/NEXT → /case-studies/denon-marantz
  │  Second case study confirms breadth (60s)
  ▼
NAV → /about
  │  Reads bio, scans career timeline (30s)
  │  Sees client grid — confirms enterprise experience
  ▼
NAV → /contact
  │  Clicks email CTA
  ▼
CONVERSION: Email initiated
```

**Critical path elements:** Heritage cards (above fold), hero statement, metrics grid, recognition, contact CTA
**Time to conversion target:** ≤3 minutes
**Multimedia touchpoints:** Embedded video (ai-workflow), 3D model (miselu/denon), data viz (metrics)

### 2.2 Journey B — Design Team Collaborator / Engineer

**Entry:** Direct URL shared in Slack → /case-studies/ai-workflow
**Goal:** Understand design-engineering workflow and tools used

```
/case-studies/ai-workflow
  │  Reads hero + overview bar (15s)
  │  Jumps via TOC to "Three Tools, One Conversation" (5s)
  │  Reads Claude Code / Antigravity / Figma MCP sections (60s)
  │  ▸ Explores interactive React Flow pipeline diagram (30s)
  │  ▸ Inspects before/after code comparisons (20s)
  │  Reads "AI Agent Stories" section (30s)
  │  ▸ Plays audio clip of design reasoning narration (45s)
  ▼
NAV → /process
  │  Reads First Principles section (30s)
  │  Explores interactive token pipeline diagram (30s)
  │  Scans tools grid — recognizes shared toolset (15s)
  ▼
NAV → /design-thinking
  │  Reads 1–2 articles on design philosophy (120s)
  ▼
CONVERSION: Bookmarks site, shares link in team Slack
```

**Critical path elements:** TOC navigation, pipeline diagram (interactive), process page, articles
**Time to conversion target:** ≤5 minutes for initial engagement
**Multimedia touchpoints:** React Flow diagram, audio narration, animated pipeline

### 2.3 Journey C — Potential Client / Stakeholder

**Entry:** Google search → /case-studies/denon-marantz (SEO)
**Goal:** Validate design quality for premium brand engagement

```
/case-studies/denon-marantz (SEO landing)
  │  Hero image: premium audio hardware (3s)
  │  Reads hero statement (10s)
  │  Scrolls: brand identity system, before/after redesign (30s)
  │  ▸ Rotates 3D product visualization of Marantz amp (20s)
  │  ▸ Watches brand evolution video walkthrough (45s)
  │  Scans recognition: industry awards (10s)
  ▼
PREV/NEXT → /case-studies/miselu
  │  Sees hardware invention — broadens scope impression
  │  ▸ Views patent diagram in zoomable SVG (15s)
  ▼
NAV → /projects
  │  Scans full portfolio — sees enterprise clients
  │  Notices NDA cards (Ogilvy, Slalom) — signals premium tier
  ▼
NAV → /about
  │  Confirms 20+ years experience, Tokyo/SF base
  ▼
NAV → /contact
  │  Submits inquiry
  ▼
CONVERSION: Contact form submission
```

**Critical path elements:** SEO-optimized case study landing, premium imagery, 3D product viz, client logos, contact form
**Time to conversion target:** ≤5 minutes
**Multimedia touchpoints:** 3D product model, brand video, zoomable SVG

---

## Section 3 — Data Architecture

### 3.1 Entity Relationship Diagram

```
                                    ┌──────────────────┐
                               ┌───▸│  siteSettings    │
                               │    │  (singleton)      │
                               │    ├──────────────────┤
                               │    │ navItems[]       │──▸ linkItem
                               │    │ footerLinks[]    │──▸ linkItem
                               │    │ socialLinks[]    │──▸ linkItem
                               │    │ clientLogos[]    │──▸ logoAsset
                               │    │ contactEmail     │
                               │    └──────────────────┘
                               │
┌──────────────┐    ref        │    ┌──────────────────┐
│  homePage    │───────────────┼───▸│  caseStudy       │
│  (singleton) │               │    │  (×14 documents) │
├──────────────┤               │    ├──────────────────┤
│ heroHeading  │               │    │ slug             │
│ heroSubtext  │               │    │ title            │
│ heroKanji    │               │    │ client           │
│ heritageCards│──▸ ref ───────┘    │ year             │
│   .link      │──▸ linkItem        │ status           │
│   .status    │                    │ sortOrder        │
└──────────────┘                    │ heroStatement    │
                                    │ heroImage        │──▸ imageWithMeta
┌──────────────┐                    │ heroKanji        │
│ projectsPage │                    │ thumbnail        │──▸ imageWithMeta
│ (singleton)  │                    │ overviewBar[]    │──▸ overviewItem
├──────────────┤                    │ tags[]           │
│ title        │                    │ metrics[]        │──▸ metricItem
│ eras[]       │──▸ eraGroup        │ sections[]       │──▸ csSection ──────────┐
└──────────────┘    │               │ recognition[]    │──▸ recognitionItem      │
                    │               │ backgroundAudio  │──▸ backgroundAudio      │
                    │               │ prevCase         │──▸ ref (caseStudy)      │
                    └──▸ ref ──────▸│ nextCase         │──▸ ref (caseStudy)      │
                                    │ metaTitle        │                         │
                                    │ metaDescription  │                         │
                                    │ ogImage          │──▸ image                │
                                    └──────────────────┘                         │
                                                                                 │
┌──────────────┐    ┌──────────────────────────────────┐                         │
│  aboutPage   │    │            csSection              │◂────────────────────────┘
│  (singleton) │    ├──────────────────────────────────┤
├──────────────┤    │ title          (string)           │
│ portrait     │    │ overline       (string)           │
│ bioHeading   │    │ body           (portableText)     │──▸ marks: strong, em, link
│ bioCopy      │    │ artifact       (imageWithMeta)    │──▸ image + caption + alt
│ philosophy[] │    │ baInline       (baInline)         │──▸ before/after images
│ timeline[]   │    │ flowPipeline   (flowNode[])       │──▸ icon + kanji + label
│ clientLogos  │    │ metrics        (metricItem[])     │
└──────────────┘    │ dataViz        (dataVizEmbed)     │──▸ type + config JSON
                    │ audioEmbed     (audioEmbed)       │──▸ Sanity file + waveform
                    │ soundcloudEmbed (soundcloudEmbed)│──▸ SC URL + player config
┌──────────────┐    │ videoEmbed     (videoEmbed)       │──▸ Mux playback ID
│ processPage  │    │ threeScene     (threeSceneEmbed)  │──▸ model URL + camera JSON
│ (singleton)  │    │ reactFlowDiag  (reactFlowEmbed)   │──▸ nodes[] + edges[] JSON
├──────────────┤    │ animeSequence  (animeEmbed)       │──▸ timeline config JSON
│ heroQuote    │    └──────────────────────────────────┘
│ sections[]   │
│ principles[] │    ┌──────────────────────────────────┐
│ tools[]      │    │         article                   │
└──────────────┘    ├──────────────────────────────────┤
                    │ slug, title, publishDate          │
                    │ excerpt, body (portableText)      │
                    │ heroImage, tags[], author         │
                    └──────────────────────────────────┘
```

### 3.2 Schema Models — Document Types

#### 3.2.1 `siteSettings` (singleton)

```typescript
{
  name: 'siteSettings',
  type: 'document',
  fields: [
    { name: 'siteTitle',     type: 'string'                    },
    { name: 'navItems',      type: 'array', of: ['linkItem']   },
    { name: 'footerLinks',   type: 'array', of: ['linkItem']   },
    { name: 'socialLinks',   type: 'array', of: ['linkItem']   },
    { name: 'contactEmail',  type: 'string'                    },
    { name: 'clientLogos',   type: 'array', of: ['logoAsset']  },
    { name: 'metaDefaults',  type: 'object', fields: [
        { name: 'title',       type: 'string' },
        { name: 'description', type: 'text'   },
        { name: 'ogImage',     type: 'image'  },
      ]
    },
  ]
}
```

#### 3.2.2 `caseStudy` (×14)

```typescript
{
  name: 'caseStudy',
  type: 'document',
  fields: [
    // Identity
    { name: 'slug',            type: 'slug', options: { source: 'title' }       },
    { name: 'title',           type: 'string'                                    },
    { name: 'client',          type: 'string'                                    },
    { name: 'year',            type: 'string'                                    },
    { name: 'tags',            type: 'array', of: [{ type: 'string' }]          },
    { name: 'sortOrder',       type: 'number'                                    },
    { name: 'status',          type: 'string',
      options: { list: ['live', 'coming-soon', 'nda', 'draft'] }                },

    // Hero
    { name: 'heroStatement',   type: 'text'                                      },
    { name: 'heroImage',       type: 'imageWithMeta'                             },
    { name: 'heroKanji',       type: 'string'                                    },
    { name: 'heroKanjiColor',  type: 'string'                                    },
    { name: 'thumbnail',       type: 'imageWithMeta'                             },

    // Overview
    { name: 'overviewBar',     type: 'array', of: [{ type: 'overviewItem' }]    },
    { name: 'metrics',         type: 'array', of: [{ type: 'metricItem' }]      },

    // Content — array of polymorphic sections
    { name: 'sections',        type: 'array', of: [{ type: 'csSection' }]       },

    // Recognition
    { name: 'recognition',     type: 'array', of: [{ type: 'recognitionItem' }] },

    // Background Audio (page-level ambient music)
    { name: 'backgroundAudio', type: 'backgroundAudio'                           },

    // Navigation
    { name: 'prevCase',        type: 'reference', to: [{ type: 'caseStudy' }]   },
    { name: 'nextCase',        type: 'reference', to: [{ type: 'caseStudy' }]   },

    // SEO
    { name: 'metaTitle',       type: 'string'                                    },
    { name: 'metaDescription', type: 'text'                                      },
    { name: 'ogImage',         type: 'image'                                     },
  ]
}
```

#### 3.2.3 `csSection` (object — polymorphic content block)

This is the most important schema in the system. Each section can contain any combination of text, images, and multimedia embeds:

```typescript
{
  name: 'csSection',
  type: 'object',
  fields: [
    { name: 'title',           type: 'string'                                    },
    { name: 'overline',        type: 'string'                                    },
    { name: 'body',            type: 'portableText'                              },
    { name: 'artifact',        type: 'imageWithMeta'                             },
    { name: 'baInline',        type: 'baInline'                                  },
    { name: 'flowPipeline',    type: 'array', of: [{ type: 'flowNode' }]        },
    { name: 'metrics',         type: 'array', of: [{ type: 'metricItem' }]      },

    // Multimedia embeds (optional per section)
    { name: 'audioEmbed',      type: 'audioEmbed'                                },
    { name: 'soundcloudEmbed', type: 'soundcloudEmbed'                           },
    { name: 'videoEmbed',      type: 'videoEmbed'                                },
    { name: 'threeScene',      type: 'threeSceneEmbed'                           },
    { name: 'reactFlowDiag',   type: 'reactFlowEmbed'                           },
    { name: 'dataViz',         type: 'dataVizEmbed'                              },
    { name: 'animeSequence',   type: 'animeEmbed'                                },
  ]
}
```

### 3.3 Schema Models — Multimedia Object Types

#### 3.3.1 `audioEmbed`

```typescript
{
  name: 'audioEmbed',
  type: 'object',
  fields: [
    { name: 'file',          type: 'file', options: { accept: 'audio/*' }       },
    { name: 'title',         type: 'string'                                      },
    { name: 'artist',        type: 'string'                                      },
    { name: 'duration',      type: 'string'                                      },
    { name: 'waveformData',  type: 'array', of: [{ type: 'number' }]            },
    { name: 'autoplay',      type: 'boolean', initialValue: false                },
    { name: 'ambient',       type: 'boolean', initialValue: false                },
  ]
}
```

#### 3.3.2 `soundcloudEmbed`

```typescript
{
  name: 'soundcloudEmbed',
  type: 'object',
  fields: [
    { name: 'url',           type: 'url',
      description: 'SoundCloud track or playlist URL'                             },
    { name: 'title',         type: 'string'                                      },
    { name: 'visual',        type: 'boolean', initialValue: true,
      description: 'Use SoundCloud visual player (large artwork) vs compact'     },
    { name: 'color',         type: 'string', initialValue: '#B33A3A',
      description: 'Player accent color (default: shu red)'                      },
    { name: 'autoPlay',      type: 'boolean', initialValue: false                },
    { name: 'showArtwork',   type: 'boolean', initialValue: true                 },
    { name: 'showUser',      type: 'boolean', initialValue: true                 },
    { name: 'showComments',  type: 'boolean', initialValue: false                },
    { name: 'maxHeight',     type: 'number', initialValue: 166,
      description: 'Compact player = 166px, Visual player = 450px'              },
    { name: 'caption',       type: 'string'                                      },
  ]
}
```

**Rendering strategy:** The `SoundCloudPlayer` component uses the SoundCloud oEmbed API to resolve the track URL into an iframe embed. The Widget API (`SC.Widget`) provides JavaScript control for play/pause/seek from custom UI if needed.

```
SoundCloud URL (from Sanity)
         │
         ▼
oEmbed API: https://soundcloud.com/oembed?url={url}&format=json
         │
         ▼
Returns: { html: '<iframe ...>', title, thumbnail_url, author_name }
         │
         ▼
Render <iframe> inside cs-artifact treatment (border-radius, caption)
         │
         ▼
Optional: SC.Widget(iframe) for JS control (play, pause, seek, getPosition)
```

#### 3.3.3 `backgroundAudio`

This is a **page-level** field (not section-level). It provides ambient background music that plays while the user is browsing a case study or any page.

```typescript
{
  name: 'backgroundAudio',
  type: 'object',
  fields: [
    { name: 'source',        type: 'string', options: {
        list: ['file', 'soundcloud']
      }, initialValue: 'file'                                                    },
    { name: 'file',          type: 'file', options: { accept: 'audio/*' },
      description: 'Self-hosted audio file (MP3/OGG/WAV)'                       },
    { name: 'soundcloudUrl', type: 'url',
      description: 'SoundCloud track URL (used when source = soundcloud)'        },
    { name: 'title',         type: 'string'                                      },
    { name: 'artist',        type: 'string'                                      },
    { name: 'volume',        type: 'number', initialValue: 0.3,
      description: 'Initial volume 0.0–1.0 (default: 0.3 for ambient)'          },
    { name: 'fadeInDuration', type: 'number', initialValue: 3000,
      description: 'Fade-in time in ms when user opts in'                        },
    { name: 'fadeOutDuration', type: 'number', initialValue: 2000,
      description: 'Fade-out on page exit or pause'                              },
    { name: 'loop',          type: 'boolean', initialValue: true                 },
    { name: 'crossfadeDuration', type: 'number', initialValue: 4000,
      description: 'Crossfade duration in ms when transitioning between pages'   },

    // Audio-reactive animation settings
    { name: 'audioReactivity', type: 'audioReactivity'                           },
  ]
}
```

**Background Audio UX contract:**

```
User arrives on page with backgroundAudio configured
         │
         ▼
Floating mini-player appears (bottom-right, above footer)
  ┌──────────────────────────────────────┐
  │  ♫ Track Title — Artist              │
  │  [▶ Play]  ───●──────── 0:30 / 3:45 │
  │  🔊 ━━━━●━━━━━                       │
  └──────────────────────────────────────┘
         │
         ▼
Audio does NOT autoplay (browser policy + UX respect)
User clicks [▶ Play] to opt in
         │
         ▼
Howler.js fades in at configured volume (default 0.3)
Audio loops seamlessly
         │
         ▼
User navigates to another page:
  ├── Next page HAS backgroundAudio → crossfade (4s default)
  └── Next page has NO backgroundAudio → fade out (2s)
         │
         ▼
User clicks [⏸ Pause] → fade out, remember paused state
User clicks [✕ Close] → stop audio, hide player for session
```

**Key principles:**
- Never autoplay. Always require user opt-in (respects browser autoplay policy and user preference).
- Persist playback state across page navigations using React context or Zustand store.
- Mini-player persists in layout (not per-page) so audio is uninterrupted during Next.js route transitions.
- Volume, position, and playing state survive navigation.
- `prefers-reduced-motion` does not disable audio, but the mini-player animation is static.

#### 3.3.4 `audioReactivity` (CMS-editable per page)

When background audio is playing, canvas animations (plexus particles, snow/weather, micro-animations) can respond to the music in real time. Every parameter is editable in Sanity Studio so the author can tune the visual response per page without code changes.

```typescript
{
  name: 'audioReactivity',
  type: 'object',
  fields: [
    { name: 'enabled',          type: 'boolean', initialValue: true,
      description: 'Master toggle — disable to keep audio without visual response' },

    // FFT analysis config
    { name: 'fftSize',          type: 'number', initialValue: 256,
      description: 'FFT window size (64–2048). Larger = finer freq resolution, more CPU' },
    { name: 'smoothingTimeConstant', type: 'number', initialValue: 0.8,
      description: '0.0–1.0. Higher = smoother (less jittery). Lower = more reactive' },

    // Frequency band mapping
    { name: 'bands',            type: 'object', fields: [
        { name: 'bass',        type: 'object', fields: [
            { name: 'rangeHz',      type: 'string', initialValue: '20-250'       },
            { name: 'sensitivity',  type: 'number', initialValue: 1.2,
              description: '0.0–3.0. Multiplier for this band response'          },
          ]                                                                      },
        { name: 'mid',         type: 'object', fields: [
            { name: 'rangeHz',      type: 'string', initialValue: '250-4000'     },
            { name: 'sensitivity',  type: 'number', initialValue: 1.0            },
          ]                                                                      },
        { name: 'treble',      type: 'object', fields: [
            { name: 'rangeHz',      type: 'string', initialValue: '4000-20000'   },
            { name: 'sensitivity',  type: 'number', initialValue: 0.8            },
          ]                                                                      },
      ]                                                                          },

    // Per-animation target mapping
    { name: 'plexusMapping',    type: 'object', fields: [
        { name: 'enabled',         type: 'boolean', initialValue: true           },
        { name: 'particleCount',   type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'bass',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 60              },
            { name: 'max',         type: 'number', initialValue: 140             },
          ], description: 'Particle count scales between min–max with band energy' },
        { name: 'linkDistance',    type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'mid',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 80              },
            { name: 'max',         type: 'number', initialValue: 220             },
          ], description: 'Connection distance breathes with mid frequencies'     },
        { name: 'speed',          type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'bass',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.15            },
            { name: 'max',         type: 'number', initialValue: 0.8             },
          ], description: 'Drift speed pulses with bass kicks'                    },
        { name: 'glowIntensity',  type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'treble',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.3             },
            { name: 'max',         type: 'number', initialValue: 1.0             },
          ], description: 'Pulse node glow reacts to treble shimmer'              },
        { name: 'lineAlpha',      type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'average',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.06            },
            { name: 'max',         type: 'number', initialValue: 0.28            },
          ], description: 'Line opacity breathes with overall energy'             },
      ]                                                                          },

    { name: 'weatherMapping',   type: 'object', fields: [
        { name: 'enabled',         type: 'boolean', initialValue: true           },
        { name: 'particleCount',   type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'average',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 20              },
            { name: 'max',         type: 'number', initialValue: 120             },
          ], description: 'Snow/rain density scales with overall volume'          },
        { name: 'windForce',      type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'bass',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.0             },
            { name: 'max',         type: 'number', initialValue: 2.5             },
          ], description: 'Horizontal wind drift reacts to bass drops'            },
        { name: 'fallSpeed',      type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'mid',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.5             },
            { name: 'max',         type: 'number', initialValue: 3.0             },
          ], description: 'Fall velocity rises with mid energy'                   },
        { name: 'wobbleAmplitude', type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'treble',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.5             },
            { name: 'max',         type: 'number', initialValue: 4.0             },
          ], description: 'Particle wobble intensifies with treble'               },
      ]                                                                          },

    { name: 'flowNodeMapping',  type: 'object', fields: [
        { name: 'enabled',         type: 'boolean', initialValue: true           },
        { name: 'ringScale',      type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'bass',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 1.0             },
            { name: 'max',         type: 'number', initialValue: 1.25            },
          ], description: 'Ring outer scale pulses on bass'                       },
        { name: 'kanjiOpacity',   type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'mid',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 0.4             },
            { name: 'max',         type: 'number', initialValue: 1.0             },
          ], description: 'Kanji character breathes with mid frequencies'          },
        { name: 'dotFlowSpeed',   type: 'object', fields: [
            { name: 'band',        type: 'string', initialValue: 'treble',
              options: { list: ['bass', 'mid', 'treble', 'average'] }            },
            { name: 'min',         type: 'number', initialValue: 1.0             },
            { name: 'max',         type: 'number', initialValue: 3.0             },
          ], description: 'Connector dot pulse speed tracks treble'               },
      ]                                                                          },
  ]
}
```

**Audio-reactive pipeline (runtime architecture):**

```
Background Audio Source (Howler.js or SoundCloud)
         │
         ▼
Web Audio API — AudioContext
         │
         ▼
AnalyserNode (fftSize from CMS, smoothing from CMS)
         │
         ├──▸ getByteFrequencyData(Uint8Array)
         │         │
         │         ▼
         │    FrequencyBandSplitter
         │    ├── bass:    avg of bins 20–250 Hz    → 0.0–1.0 normalized
         │    ├── mid:     avg of bins 250–4000 Hz  → 0.0–1.0 normalized
         │    ├── treble:  avg of bins 4000–20k Hz  → 0.0–1.0 normalized
         │    └── average: avg of all bins           → 0.0–1.0 normalized
         │              │
         │              ▼
         │    Sensitivity multiplier (from CMS per band)
         │              │
         │              ▼
         │    AudioReactiveStore (Zustand)
         │    { bass: 0.72, mid: 0.45, treble: 0.31, average: 0.49 }
         │              │
         │    ┌─────────┼─────────────────────┐
         │    ▼         ▼                     ▼
         │  PlexusBg  WeatherHero         FlowPipeline
         │    │         │                     │
         │    ▼         ▼                     ▼
         │  Reads mapping from CMS:       Reads mapping from CMS:
         │  speed.band = 'bass'           ringScale.band = 'bass'
         │  speed.min = 0.15              ringScale.min = 1.0
         │  speed.max = 0.8               ringScale.max = 1.25
         │    │                               │
         │    ▼                               ▼
         │  lerp(0.15, 0.8, store.bass)   lerp(1.0, 1.25, store.bass)
         │  = 0.62 → applied to drift     = 1.18 → applied to transform
         │
         └──▸ 60fps RAF loop — all animations read from shared store
```

**Howler.js → Web Audio bridge:**

Howler.js manages playback (crossfade, volume, loop), but we tap into its internal `AudioContext` to create the `AnalyserNode`. Howler exposes `Howler.ctx` (the shared AudioContext) and each sound's internal `_node` array. The bridge connects the Howler source node to an AnalyserNode without interrupting playback:

```typescript
// AudioReactiveBridge.ts
const analyser = Howler.ctx.createAnalyser()
analyser.fftSize = cmsConfig.fftSize        // from Sanity
analyser.smoothingTimeConstant = cmsConfig.smoothingTimeConstant

// Connect Howler's master output → analyser → destination
Howler.masterGain.connect(analyser)
analyser.connect(Howler.ctx.destination)
```

**SoundCloud → Web Audio bridge:**

For SoundCloud background audio, the SC.Widget iframe cannot share an AudioContext (cross-origin). Instead, the system uses a hybrid approach: the SoundCloud Widget plays the audio, but we use its `SC.Widget.Events.PLAY_PROGRESS` callback to approximate energy from playback position + pre-analyzed waveform data (stored in Sanity as `waveformData[]`).

For full-fidelity audio reactivity with SoundCloud, the preferred path is to also upload the audio file to Sanity (self-hosted source) and use the SoundCloud URL only as a display/attribution link. The self-hosted file feeds Web Audio API while the SoundCloud player remains visible as a branded embed.

**CMS editing experience in Sanity Studio:**

```
caseStudy → backgroundAudio → audioReactivity
  │
  ├── [✓] Enabled
  ├── FFT Size: [256 ▾]
  ├── Smoothing: [0.8] ━━━━━━●━━━
  │
  ├── ▼ Frequency Bands
  │   ├── Bass (20–250 Hz)    Sensitivity: [1.2]
  │   ├── Mid (250–4000 Hz)   Sensitivity: [1.0]
  │   └── Treble (4k–20k Hz)  Sensitivity: [0.8]
  │
  ├── ▼ Plexus Animation
  │   ├── [✓] Enabled
  │   ├── Particle Count:  Band [bass ▾]   Min [60]  Max [140]
  │   ├── Link Distance:   Band [mid ▾]    Min [80]  Max [220]
  │   ├── Speed:           Band [bass ▾]   Min [0.15] Max [0.8]
  │   ├── Glow Intensity:  Band [treble ▾] Min [0.3] Max [1.0]
  │   └── Line Alpha:      Band [average▾] Min [0.06] Max [0.28]
  │
  ├── ▼ Snow / Weather
  │   ├── [✓] Enabled
  │   ├── Particle Count:  Band [average▾] Min [20]  Max [120]
  │   ├── Wind Force:      Band [bass ▾]   Min [0.0] Max [2.5]
  │   ├── Fall Speed:      Band [mid ▾]    Min [0.5] Max [3.0]
  │   └── Wobble:          Band [treble ▾] Min [0.5] Max [4.0]
  │
  └── ▼ Flow Pipeline Nodes
      ├── [✓] Enabled
      ├── Ring Scale:      Band [bass ▾]   Min [1.0] Max [1.25]
      ├── Kanji Opacity:   Band [mid ▾]    Min [0.4] Max [1.0]
      └── Dot Flow Speed:  Band [treble ▾] Min [1.0] Max [3.0]
```

Every slider, dropdown, and toggle is a Sanity field. The author can fine-tune how each animation responds to each frequency band without touching code.

#### 3.3.5 `videoEmbed`

```typescript
{
  name: 'videoEmbed',
  type: 'object',
  fields: [
    { name: 'muxPlaybackId', type: 'string'                                      },
    { name: 'title',         type: 'string'                                      },
    { name: 'poster',        type: 'image'                                       },
    { name: 'aspectRatio',   type: 'string', options: {
        list: ['16:9', '4:3', '1:1', '9:16', '21:9']
      }, initialValue: '16:9'                                                    },
    { name: 'autoplay',      type: 'boolean', initialValue: false                },
    { name: 'loop',          type: 'boolean', initialValue: false                },
    { name: 'muted',         type: 'boolean', initialValue: true                 },
    { name: 'captions',      type: 'file', options: { accept: '.vtt' }           },
  ]
}
```

#### 3.3.3 `threeSceneEmbed`

```typescript
{
  name: 'threeSceneEmbed',
  type: 'object',
  fields: [
    { name: 'modelFile',     type: 'file', options: { accept: '.glb,.gltf' }    },
    { name: 'environmentMap', type: 'image'                                      },
    { name: 'cameraPosition', type: 'object', fields: [
        { name: 'x', type: 'number' },
        { name: 'y', type: 'number' },
        { name: 'z', type: 'number' },
      ]                                                                          },
    { name: 'cameraTarget',  type: 'object', fields: [
        { name: 'x', type: 'number' },
        { name: 'y', type: 'number' },
        { name: 'z', type: 'number' },
      ]                                                                          },
    { name: 'autoRotate',    type: 'boolean', initialValue: true                 },
    { name: 'rotateSpeed',   type: 'number', initialValue: 0.5                  },
    { name: 'backgroundColor', type: 'string', initialValue: '#0D0D0F'          },
    { name: 'enableZoom',    type: 'boolean', initialValue: true                 },
    { name: 'enablePan',     type: 'boolean', initialValue: false                },
    { name: 'lightingPreset', type: 'string', options: {
        list: ['studio', 'outdoor', 'product', 'dramatic', 'minimal']
      }, initialValue: 'studio'                                                  },
    { name: 'caption',       type: 'string'                                      },
    { name: 'fallbackImage', type: 'image'                                       },
  ]
}
```

#### 3.3.4 `reactFlowEmbed`

```typescript
{
  name: 'reactFlowEmbed',
  type: 'object',
  fields: [
    { name: 'nodes',         type: 'text',
      description: 'JSON array of React Flow nodes'                              },
    { name: 'edges',         type: 'text',
      description: 'JSON array of React Flow edges'                              },
    { name: 'direction',     type: 'string', options: {
        list: ['LR', 'TB', 'RL', 'BT']
      }, initialValue: 'LR'                                                      },
    { name: 'interactive',   type: 'boolean', initialValue: true                 },
    { name: 'minimap',       type: 'boolean', initialValue: false                },
    { name: 'fitView',       type: 'boolean', initialValue: true                 },
    { name: 'caption',       type: 'string'                                      },
  ]
}
```

#### 3.3.5 `dataVizEmbed`

```typescript
{
  name: 'dataVizEmbed',
  type: 'object',
  fields: [
    { name: 'vizType',       type: 'string', options: {
        list: ['bar', 'line', 'radar', 'sankey', 'treemap', 'force', 'arc']
      }                                                                          },
    { name: 'data',          type: 'text', description: 'JSON data payload'      },
    { name: 'config',        type: 'text', description: 'D3 config overrides'    },
    { name: 'colorScheme',   type: 'string', options: {
        list: ['ink', 'shu', 'particle', 'mono', 'custom']
      }, initialValue: 'ink'                                                     },
    { name: 'caption',       type: 'string'                                      },
    { name: 'height',        type: 'number', initialValue: 400                   },
    { name: 'responsive',    type: 'boolean', initialValue: true                 },
  ]
}
```

#### 3.3.6 `animeEmbed`

```typescript
{
  name: 'animeEmbed',
  type: 'object',
  fields: [
    { name: 'svgContent',    type: 'text', description: 'Inline SVG markup'      },
    { name: 'timeline',      type: 'text', description: 'Anime.js timeline JSON' },
    { name: 'trigger',       type: 'string', options: {
        list: ['scroll', 'hover', 'click', 'autoplay', 'intersection']
      }, initialValue: 'intersection'                                            },
    { name: 'loop',          type: 'boolean', initialValue: false                },
    { name: 'duration',      type: 'number', initialValue: 2000                  },
    { name: 'caption',       type: 'string'                                      },
  ]
}
```

### 3.4 Portable Text — Rich Text Model

All body text uses Sanity Portable Text with the following annotation types:

| Mark | HTML Output | Purpose |
|---|---|---|
| `strong` | `<strong>` | Emphasis (bold) |
| `em` | `<em>` | Italic |
| `link` | `<a href>` | Inline hyperlink (uses `linkItem`) |
| `code` | `<code>` | Inline code |
| `highlight` | `<mark>` | Shu-red text highlight |

| Block Style | HTML Output | Purpose |
|---|---|---|
| `normal` | `<p>` | Body paragraph |
| `h2` | `<h2>` | Section heading |
| `h3` | `<h3>` | Subsection heading |
| `blockquote` | `<blockquote>` | Pull quote |
| `bullet` | `<ul>/<li>` | Bullet list |
| `number` | `<ol>/<li>` | Numbered list |

---

## Section 4 — API Surface Definition

### 4.1 Data Fetching — GROQ Queries

All content is fetched from Sanity Content Lake via GROQ (Graph-Relational Object Queries). There are no custom REST endpoints for content — Sanity serves as both the data store and API.

| Query | Route | Purpose | Cache |
|---|---|---|---|
| `siteSettingsQuery` | Every page (layout) | Nav, footer, logos | ISR: 3600s |
| `homePageQuery` | `/` | Hero, heritage cards | ISR: 60s |
| `projectsPageQuery` | `/projects` | All case studies (sorted) | ISR: 60s |
| `caseStudyBySlugQuery` | `/case-studies/[slug]` | Single case study + all sections | ISR: 60s |
| `allCaseStudySlugsQuery` | Build time | `generateStaticParams` | Build |
| `aboutPageQuery` | `/about` | Bio, timeline, philosophy | ISR: 3600s |
| `processPageQuery` | `/process` | Sections, principles, tools | ISR: 3600s |
| `articleBySlugQuery` | `/articles/[slug]` | Single article | ISR: 60s |
| `allArticlesQuery` | `/design-thinking` | Article index list | ISR: 60s |

### 4.2 Internal API Routes

```
app/api/
├── revalidate/
│   └── route.ts          POST — Sanity webhook → on-demand ISR
├── draft/
│   └── route.ts          GET  — Enable Next.js draft mode for Presentation Tool
└── og/
    └── route.ts          GET  — Dynamic OG image generation (@vercel/og)
```

#### 4.2.1 `/api/revalidate` (POST)

```typescript
// Triggered by Sanity webhook on content publish
// Validates webhook signature against SANITY_WEBHOOK_SECRET
// Calls revalidateTag('sanity') to bust ISR cache
// Returns: { revalidated: true, now: Date.now() }
```

#### 4.2.2 `/api/draft` (GET)

```typescript
// Enables Next.js draftMode() for Sanity Presentation preview
// Params: ?redirect=/case-studies/ai-workflow
// Redirects to target page with draft cookies set
```

#### 4.2.3 `/api/og` (GET)

```typescript
// Generates dynamic OpenGraph images using @vercel/og (Satori)
// Params: ?title=Design-to-Code&client=AI-Workflow&kanji=流
// Returns: 1200×630 PNG with brand styling
// Uses: Inter font, ink/shu tokens, dark background
```

### 4.3 External Integrations

| Service | Purpose | Auth Method | Rate Limit |
|---|---|---|---|
| Sanity Content Lake | Content API | Project ID + dataset (public read) | 250 req/s |
| Sanity Asset CDN | Image/file delivery | None (public CDN) | Unlimited |
| Sanity Studio | Admin authoring | Google/GitHub OAuth | N/A |
| Mux Video | Adaptive video streaming | API token (server-side) | 10 req/s |
| Vercel | Hosting + edge functions | Deploy token | N/A |
| GitHub | Source code repository | SSH key | N/A |

### 4.4 Authentication Logic

```
PUBLIC (no auth):
  All page routes
  Sanity CDN assets
  Mux video playback (signed URLs)

AUTHENTICATED (Sanity account):
  /studio — Sanity Studio (Google/GitHub OAuth)
  /api/draft — Draft mode (validates Sanity session)
  /api/revalidate — Webhook (validates SANITY_WEBHOOK_SECRET)

SERVER-ONLY (env vars):
  SANITY_API_TOKEN — ISR revalidation + draft content
  SANITY_WEBHOOK_SECRET — Webhook signature validation
  MUX_TOKEN_ID + MUX_TOKEN_SECRET — Video asset management
```

---

## Section 5 — Component Inventory

### 5.1 Layout Components (6)

| # | Component | Purpose | Props |
|---|---|---|---|
| 01 | `RootLayout` | HTML shell, global styles, meta | `children` |
| 02 | `Nav` | Sticky top navigation bar | `navItems[]`, `currentPath` |
| 03 | `Footer` | Site footer with links + copyright | `footerLinks[]`, `socialLinks[]` |
| 04 | `PlexusBg` | Full-viewport particle canvas | `zone`, `config?` |
| 05 | `ScrollReveal` | IntersectionObserver wrapper | `children`, `delay?` |
| 06 | `PageTransition` | Motion page enter/exit | `children` |

### 5.2 Home Components (5)

| # | Component | Purpose | Props |
|---|---|---|---|
| 07 | `HeroHome` | Home hero heading + kanji | `heading`, `subtitle`, `kicker`, `kanji` |
| 08 | `HeritageGrid` | Featured work card grid | `cards[]` |
| 09 | `HeritageCard` | Individual featured card | `title`, `period`, `domain`, `kanji`, `image`, `status`, `link` |
| 10 | `DividerStrip` | Animated canvas divider | `animIds[]` |
| 11 | `LogoGrid` | Client logo grid | `logos[]` |

### 5.3 Projects Components (3)

| # | Component | Purpose | Props |
|---|---|---|---|
| 12 | `EraGroup` | Era header + case entry grid | `label`, `period`, `kanji`, `entries[]` |
| 13 | `CaseEntry` | Project card in grid | `title`, `brand`, `role`, `tags`, `image`, `kanji`, `status`, `href` |
| 14 | `StatusToast` | NDA / Coming Soon overlay | `type: 'nda' \| 'soon'` |

### 5.4 Case Study Components (12)

| # | Component | Purpose | Props |
|---|---|---|---|
| 15 | `CsHero` | Case study hero block | `title`, `brand`, `statement`, `role`, `kanji`, `heroImage` |
| 16 | `OverviewBar` | Role/Timeline/Platform strip | `items[]` |
| 17 | `TagsBar` | Tag pills row | `tags[]` |
| 18 | `MetricsGrid` | Key metric cards | `items[]`, `columns` |
| 19 | `CsContent` | TOC + content grid wrapper | `sections[]`, `recognition[]` |
| 20 | `TocSidebar` | Sticky TOC navigation | `sections[]`, `activeId` |
| 21 | `StardSection` | Standard content section | `id`, `title`, `overline`, `body`, `children` |
| 22 | `CsArtifact` | Image with border + caption | `image`, `caption`, `alt` |
| 23 | `BaInline` | Before/After comparison grid | `before`, `after` |
| 24 | `FlowPipeline` | Animated flow node diagram | `nodes[]` |
| 25 | `Recognition` | Awards/recognition list | `items[]` |
| 26 | `CasePrevNext` | Prev/Next navigation pair | `prev`, `next` |

### 5.5 Multimedia Components (10)

| # | Component | Purpose | Props |
|---|---|---|---|
| 27 | `AudioPlayer` | Waveform audio player (self-hosted files) | `file`, `title`, `artist`, `waveformData`, `ambient` |
| 28 | `SoundCloudPlayer` | Embedded SoundCloud track/playlist player | `url`, `visual`, `color`, `showArtwork`, `caption` |
| 29 | `BackgroundAudioPlayer` | Persistent mini-player for page-level ambient music | `source`, `file`, `soundcloudUrl`, `volume`, `loop`, `crossfade` |
| 30 | `VideoPlayer` | Adaptive HLS video with poster | `muxPlaybackId`, `poster`, `aspectRatio`, `autoplay`, `captions` |
| 31 | `ThreeScene` | Interactive 3D model viewer | `modelUrl`, `camera`, `lighting`, `autoRotate`, `fallback` |
| 32 | `ReactFlowDiagram` | Interactive node/edge diagram | `nodes`, `edges`, `direction`, `interactive`, `minimap` |
| 33 | `D3Viz` | Data visualization container | `vizType`, `data`, `config`, `colorScheme`, `height` |
| 34 | `AnimeSequence` | SVG animation timeline | `svg`, `timeline`, `trigger`, `loop` |
| 35 | `MediaFallback` | Static image fallback for reduced-motion or SSR | `fallbackImage`, `alt` |
| 36 | `AudioContextProvider` | React context for cross-page audio state persistence | `children` |
| 37 | `AudioReactiveBridge` | Connects Howler/SC audio source → Web Audio AnalyserNode → Zustand store | `fftSize`, `smoothing`, `bands` |
| 38 | `AudioReactiveProvider` | Zustand store providing `{ bass, mid, treble, average }` to all animations | `children`, `audioReactivity` |

### 5.6 About / Process / Editorial Components (5)

| # | Component | Purpose | Props |
|---|---|---|---|
| 39 | `PortraitGrid` | Bio portrait + text layout | `portrait`, `name`, `title`, `bio` |
| 40 | `PhilosophyBlock` | Philosophy essay card | `heading`, `body` |
| 41 | `Timeline` | Career timeline | `entries[]` |
| 42 | `ToolsGrid` | Tools used grid with icons | `tools[]` |
| 43 | `ArticleCard` | Editorial article preview | `title`, `excerpt`, `date`, `slug` |

### 5.7 Utility Components (4)

| # | Component | Purpose | Props |
|---|---|---|---|
| 44 | `PortableTextRenderer` | Sanity rich text → HTML | `value`, `components` |
| 45 | `SanityImage` | next/image with Sanity CDN | `image`, `alt`, `sizes`, `priority` |
| 46 | `SeoHead` | Per-page meta + OG tags | `title`, `description`, `ogImage`, `url` |
| 47 | `SkipToContent` | Accessibility skip link | — |

**Total: 47 components**

---

## Section 6 — Page Blueprints

### 6.1 Home (`/`)

```
┌─────────────────────────────────────────────────┐
│  Nav (sticky, translucent, blur)                │
├─────────────────────────────────────────────────┤
│  PlexusBg (full viewport, z-index: 0)           │
│                                                  │
│  ┌─ HeroHome ────────────────────────────────┐  │
│  │  .hero__kicker   "Product UX Planning..."  │  │
│  │  .hero__heading  "Every new medium..."     │  │
│  │  .hero__subtitle "I design products at..." │  │
│  │  .hero__kanji    "間 · 朱 · 雪"           │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌─ HeritageGrid ────────────────────────────┐  │
│  │  ┌── HeritageCard ─┐ ┌── HeritageCard ─┐  │  │
│  │  │ AI Systems       │ │ Ogilvy [NDA]    │  │  │
│  │  │ 2023–Present     │ │                 │  │  │
│  │  │ img preview      │ │ frosted overlay │  │  │
│  │  └─────────────────┘ └─────────────────┘  │  │
│  │  ┌── HeritageCard ─┐ ┌── HeritageCard ─┐  │  │
│  │  │ Premium Audio    │ │ Beatport [Soon] │  │  │
│  │  └─────────────────┘ └─────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  DividerStrip (canvas micro-animations)          │
│                                                  │
│  ┌─ LogoGrid ────────────────────────────────┐  │
│  │  [Apple] [Google] [Linux] [Microsoft] [Qt]│  │
│  │  [Denon] [Marantz] [Dolby] [DTS] [Yamaha]│  │
│  │  ... 25 total, 5-column grid ...          │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**Motion layer:** PageTransition (Motion) on route change. ScrollReveal on each card and grid row. Plexus particles visible through frosted-glass card backgrounds.

### 6.2 Projects (`/projects`)

```
┌─────────────────────────────────────────────────┐
│  Nav                                             │
├─────────────────────────────────────────────────┤
│                                                  │
│  Page Title "Selected Work"                      │
│                                                  │
│  ┌─ EraGroup: AI Systems (2023–Present) ─────┐  │
│  │  ┌─ CaseEntry ────┐ ┌─ CaseEntry ────┐    │  │
│  │  │ AI Workflow     │ │ TDK SensEI     │    │  │
│  │  │ hero img        │ │ hero img       │    │  │
│  │  │ tags: Claude... │ │ tags: MEMS...  │    │  │
│  │  └────────────────┘ └────────────────┘    │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌─ EraGroup: Premium Audio & Hardware ──────┐  │
│  │  ┌─ CaseEntry ────┐ ┌─ CaseEntry ────┐    │  │
│  │  │ Denon/Marantz   │ │ Miselu C.24    │    │  │
│  │  └────────────────┘ └────────────────┘    │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ... additional eras ...                         │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**Motion layer:** ScrollReveal per card (staggered). Hover: card lifts with Motion spring. CaseEntry image kanji watermark pulses on hover (Anime.js).

### 6.3 Case Study (`/case-studies/[slug]`)

```
┌─────────────────────────────────────────────────┐
│  Nav                                             │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─ CsHero ─────────────────────────────────┐   │
│  │  ← Projects                               │   │
│  │  .brand    "AI-Native Workflow"           │   │
│  │  .title    "Design-to-Code Without..."    │   │
│  │  .statement "Over the last 12 months..."  │   │
│  │  ┌──────────────────────────────────────┐ │   │
│  │  │ Hero Image (16:9, dark gradient)     │ │   │
│  │  │ data-kanji watermark (180px)         │ │   │
│  │  └──────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  OverviewBar: Role | Timeline | Platform | Scope │
│  TagsBar: [Claude Code] [Antigravity] [Figma]   │
│  MetricsGrid: [metric] [metric] [metric] [metric]│
│                                                  │
│  ┌─ CsContent ──────────────────────────────┐   │
│  │                                           │   │
│  │  ┌─ TocSidebar ─┐  ┌─ content-col ────┐  │   │
│  │  │ CONTENTS      │  │                  │  │   │
│  │  │ • Context     │  │  StardSection    │  │   │
│  │  │ • Work        │  │  ├ overline      │  │   │
│  │  │ • Impact      │  │  ├ title         │  │   │
│  │  │ • Reflection  │  │  ├ body (PT)     │  │   │
│  │  │ • Recognition │  │  ├ CsArtifact    │  │   │
│  │  │               │  │  ├ BaInline      │  │   │
│  │  │ (sticky       │  │  ├ VideoPlayer   │  │   │
│  │  │  top: 80px)   │  │  ├ ThreeScene    │  │   │
│  │  │               │  │  ├ ReactFlowDiag │  │   │
│  │  │               │  │  └ AudioPlayer   │  │   │
│  │  │               │  │                  │  │   │
│  │  │               │  │  StardSection    │  │   │
│  │  │               │  │  ...             │  │   │
│  │  │               │  │                  │  │   │
│  │  │               │  │  FlowPipeline   │  │   │
│  │  │               │  │  (animated)      │  │   │
│  │  │               │  │                  │  │   │
│  │  │               │  │  Recognition     │  │   │
│  │  └───────────────┘  └────────────────┘  │   │
│  │   200px              1fr                 │   │
│  │         gap: 64px                        │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  CasePrevNext: [← Newer Work] [Earlier Work →]   │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**Motion layer:** ScrollReveal per section. FlowPipeline ring animations (CSS @keyframes, staggered). ThreeScene orbit controls on hover. VideoPlayer fade-in on intersection. D3Viz animate-on-scroll.

### 6.4 About (`/about`)

```
┌─────────────────────────────────────────────────┐
│  Nav                                             │
├─────────────────────────────────────────────────┤
│                                                  │
│  PortraitGrid                                    │
│  ┌───────────────┐  ┌────────────────────────┐   │
│  │ Portrait Image │  │ Keisuke Shingu         │   │
│  │ + kanji overlay│  │ Product UX Planning... │   │
│  │                │  │ Tokyo / San Francisco  │   │
│  │                │  │                        │   │
│  │                │  │ Bio paragraphs...      │   │
│  └───────────────┘  └────────────────────────┘   │
│                                                  │
│  PhilosophyBlock × 3                             │
│  ┌────────────────────────────────────────────┐  │
│  │ "The Medium is the Message"                │  │
│  │ Marshall McLuhan paragraph...              │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  Timeline                                        │
│  ├── 2025–Present: AI Agent Platform             │
│  ├── 2023–2025: TDK SensEI                      │
│  ├── 2018–2023: Slalom Consulting                │
│  ├── ... career history ...                      │
│  └── 1995–2000: QuarkXPress                      │
│                                                  │
│  LogoGrid (shared with Home)                     │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**Motion layer:** ScrollReveal. Timeline entries stagger with Motion. Portrait parallel scroll effect.

### 6.5 Process (`/process`)

```
┌─────────────────────────────────────────────────┐
│  Nav                                             │
├─────────────────────────────────────────────────┤
│                                                  │
│  ProcessHero (full-width quote)                  │
│                                                  │
│  Section: First Principles                       │
│  ├── body text (Portable Text)                   │
│  └── CsArtifact (process diagram)                │
│                                                  │
│  Section: Token Pipeline                         │
│  ├── body text                                   │
│  └── ReactFlowDiagram (interactive pipeline)     │
│      ┌──────┐    ┌──────┐    ┌──────┐           │
│      │Figma │───▸│Style │───▸│Story-│           │
│      │      │    │Dict  │    │book  │           │
│      └──────┘    └──────┘    └──────┘           │
│          │           tier bridge                  │
│      ┌──────┐    ┌──────┐    ┌──────┐           │
│      │Claude│───▸│Anti- │───▸│ PoC  │           │
│      │Code  │    │grav  │    │      │           │
│      └──────┘    └──────┘    └──────┘           │
│                                                  │
│  Section: Design Principles (grid)               │
│  ToolsGrid: [Figma] [Claude] [React] ...        │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**Motion layer:** ReactFlowDiagram nodes glow on hover. ToolsGrid icons pulse with Anime.js. Pipeline tier bridge animates on scroll.

### 6.6 Design Thinking (`/design-thinking`)

```
┌─────────────────────────────────────────────────┐
│  Nav                                             │
├─────────────────────────────────────────────────┤
│  PlexusBg (shared with Home)                     │
│                                                  │
│  Page Title "Design Thinking"                    │
│                                                  │
│  ArticleCard × 5 (frosted glass over plexus)     │
│  ┌────────────────────────────────────────────┐  │
│  │ Article title                              │  │
│  │ Excerpt (2 lines)                          │  │
│  │ Date                                       │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

### 6.7 Contact (`/contact`)

```
┌─────────────────────────────────────────────────┐
│  Nav                                             │
├─────────────────────────────────────────────────┤
│                                                  │
│  Heading: "Let's Talk"                           │
│  Subtext: email + availability                   │
│                                                  │
│  Email CTA (primary action)                      │
│  Social Links row                                │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

---

## Section 7 — Technology Stack Recommendation

### 7.1 Complete Stack

```
LAYER            TECHNOLOGY           VERSION    PURPOSE
─────────────────────────────────────────────────────────────
Frontend         Next.js              14.x       App Router, ISR, TypeScript
                 React                18.x       Component framework
                 TypeScript           5.x        Type safety

Styling          CSS Modules          native     Scoped styles, existing tokens
                 tokens.css           custom     Design tokens (preserved 1:1)

Motion           Motion (Framer)      11.x       Page transitions, layout animation
                 Anime.js             3.x        SVG morphs, timeline sequences
                 scroll-reveal        custom     IntersectionObserver (preserved)

Visualization    D3.js                7.x        Data viz (bar, sankey, force, etc.)
                 React Flow           12.x       Node/edge diagrams, pipelines

3D               Three.js             r128+      Product models, spatial UI
                 @react-three/fiber   8.x        React bindings for Three.js
                 @react-three/drei    9.x        Helpers (OrbitControls, loaders)

Audio            Howler.js            2.x        Playback, spatial audio, background music
                 Web Audio API        native     AnalyserNode FFT for audio reactivity
                 SoundCloud Widget    1.x        oEmbed + SC.Widget JS control

Audio-reactive   Web Audio AnalyserNode native   FFT frequency band extraction (bass/mid/treble)
                 Zustand              4.x        Shared reactive store (60fps band energy values)

Video            Mux                  latest     Adaptive HLS, signed URLs
                 @mux/mux-player      latest     React player component

Canvas           plexus-bg.js         custom     Particle animation (preserved)
                 micro-anim.js        custom     50 micro-animations (preserved)
                 weather-hero.js      custom     3D particle weather system

CMS              Sanity.io            3.x        Content Lake + Studio
                 @sanity/presentation latest     Visual editing overlays
                 @portabletext/react  latest     Rich text rendering
                 @sanity/image-url    latest     CDN image builder

Hosting          Vercel               latest     Edge network, ISR, preview URLs
Image CDN        Sanity CDN           native     Auto WebP, responsive srcset
Video CDN        Mux CDN              native     HLS adaptive streaming

Code Repo        GitHub               —          Source control
CI/CD            Vercel Git Deploy    —          Auto-deploy on push
                 Sanity Webhooks      —          Auto-rebuild on publish
─────────────────────────────────────────────────────────────
```

### 7.2 Bundle Strategy

To keep performance within targets, multimedia libraries load conditionally:

| Library | Bundle | Load Strategy |
|---|---|---|
| React, Next.js, Motion | Main | Included in initial JS |
| D3.js | Lazy | `dynamic(() => import(...), { ssr: false })` |
| Three.js + Fiber + Drei | Lazy | Dynamic import on first ThreeScene in viewport |
| React Flow | Lazy | Dynamic import on first ReactFlowDiagram |
| Anime.js | Lazy | Dynamic import on first AnimeSequence |
| Howler.js | Lazy | Dynamic import on first AudioPlayer or BackgroundAudioPlayer |
| SoundCloud Widget | Lazy | `<script>` injected on first SoundCloudPlayer render |
| Mux Player | Lazy | Dynamic import on first VideoPlayer |
| Plexus, MicroAnim, Weather | Page-specific | Only on pages that use them |

### 7.3 Development Environment

```
Node.js      20 LTS
Package mgr  pnpm 9.x (lockfile, faster installs)
Linter       ESLint + @next/eslint-plugin-next
Formatter    Prettier
Type check   tsc --noEmit (CI gate)
Test         Vitest (unit) + Playwright (e2e)
```

---

## Section 8 — Performance Benchmarks

### 8.1 Core Web Vitals Targets

| Metric | Target | Measurement | Budget |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 1.8s | Hero image or heading | Sanity CDN + priority loading |
| **FID** (First Input Delay) | ≤ 80ms | First click/tap | Minimal main-thread JS |
| **CLS** (Cumulative Layout Shift) | ≤ 0.05 | All shifts above fold | Reserved image dimensions |
| **INP** (Interaction to Next Paint) | ≤ 150ms | All user interactions | Event handler optimization |
| **TTFB** (Time to First Byte) | ≤ 400ms | Vercel Edge | ISR + edge caching |
| **FCP** (First Contentful Paint) | ≤ 1.0s | Navigation text/background | Critical CSS inlined |

### 8.2 Page Load Budgets

| Page | Target Total JS | Target Total CSS | Target LCP Asset |
|---|---|---|---|
| Home | ≤ 180 KB | ≤ 25 KB | Hero heading (text LCP) |
| Projects | ≤ 150 KB | ≤ 20 KB | First card image |
| Case Study (text only) | ≤ 160 KB | ≤ 22 KB | Hero image (WebP, ≤200 KB) |
| Case Study (with 3D) | ≤ 350 KB initial + lazy 3D | ≤ 22 KB | Hero image; 3D loads on scroll |
| Case Study (with video) | ≤ 180 KB + lazy Mux | ≤ 22 KB | Hero image; video loads on play |
| About | ≤ 140 KB | ≤ 18 KB | Portrait image |
| Process | ≤ 200 KB | ≤ 20 KB | Pipeline diagram |

### 8.3 Image Optimization Strategy

| Format | Source | Delivery | Max Size |
|---|---|---|---|
| Hero images | Any (via Sanity upload) | WebP, quality 80, CDN | ≤200 KB at 1280w |
| Thumbnails | Any | WebP, quality 75, CDN | ≤80 KB at 640w |
| cs-artifact | Any | WebP, quality 80, CDN | ≤150 KB at 960w |
| Logo SVGs | Static `/public/logos/` | Direct file serve | ≤10 KB each |
| 3D model textures | Sanity file | Compressed .glb | ≤2 MB per model |

**Responsive srcset policy:**
```
sizes="(max-width: 767px) 100vw, (max-width: 1119px) 80vw, 960px"
srcSet: 320w, 640w, 960w, 1280w, 1920w
```

### 8.4 Lighthouse Targets

| Category | Target | Current Static | Measurement Condition |
|---|---|---|---|
| Performance | ≥ 95 | ~92 | Mobile, slow 4G throttle |
| Accessibility | ≥ 98 | ~85 | Automated audit |
| Best Practices | ≥ 95 | ~90 | — |
| SEO | ≥ 98 | ~80 | — |

### 8.5 Animation Performance

| Animation | Target FPS | Strategy |
|---|---|---|
| Plexus particles | 60fps | Canvas 2D, RAF loop, DPR capped at 2× |
| Flow node rings | 60fps | CSS @keyframes (GPU-composited) |
| Page transitions | 60fps | Motion: transform + opacity only |
| Three.js scenes | 60fps (30fps mobile) | requestAnimationFrame, adaptive quality |
| D3 visualizations | 60fps | SVG with GPU-composited transitions |
| Scroll reveals | 60fps | IntersectionObserver, CSS transform |
| React Flow | 60fps | Canvas renderer for large diagrams |

**Reduced motion policy:** All animations respect `prefers-reduced-motion: reduce`. Fallback: static images or single-frame renders. Audio/video still playable, auto-play disabled.

---

## Section 9 — SEO Framework

### 9.1 URL Conventions

```
Pattern                             Example
/                                   keisukeshingu.com/
/projects                           keisukeshingu.com/projects
/case-studies/[slug]                keisukeshingu.com/case-studies/ai-workflow
/articles/[slug]                    keisukeshingu.com/articles/design-tokens-primer
/process                            keisukeshingu.com/process
/design-thinking                    keisukeshingu.com/design-thinking
/about                              keisukeshingu.com/about
/contact                            keisukeshingu.com/contact
```

**URL rules:**
- Lowercase, hyphenated slugs
- No trailing slashes (Next.js default)
- No file extensions
- No query parameters for content (SSG)
- Slugs sourced from Sanity `slug` field (author-editable)
- Canonical URL set per page via `<link rel="canonical">`

### 9.2 Meta Structure

Every page includes the following `<head>` elements, populated from Sanity:

```html
<!-- Primary -->
<title>{page.metaTitle} — Keisuke Shingu</title>
<meta name="description" content="{page.metaDescription}">
<link rel="canonical" href="https://keisukeshingu.com{path}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="{page.metaTitle}">
<meta property="og:description" content="{page.metaDescription}">
<meta property="og:image" content="{page.ogImage || dynamicOG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://keisukeshingu.com{path}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{page.metaTitle}">
<meta name="twitter:description" content="{page.metaDescription}">
<meta name="twitter:image" content="{page.ogImage || dynamicOG}">

<!-- Robots -->
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow">
```

**Pages with `status !== 'live'`** receive `<meta name="robots" content="noindex, nofollow">`.

### 9.3 Structured Data (JSON-LD)

#### 9.3.1 Organization (global, on every page)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Keisuke Shingu",
  "jobTitle": "Product UX Planning & Design Engineering",
  "url": "https://keisukeshingu.com",
  "sameAs": [
    "https://linkedin.com/in/keisukeshingu",
    "https://github.com/keisukeshingu"
  ],
  "knowsAbout": [
    "User Experience Design",
    "AI Systems Design",
    "Design Engineering",
    "Product Strategy"
  ]
}
```

#### 9.3.2 Creative Work (per case study)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{caseStudy.title}",
  "author": {
    "@type": "Person",
    "name": "Keisuke Shingu"
  },
  "datePublished": "{caseStudy.year}",
  "description": "{caseStudy.metaDescription}",
  "image": "{caseStudy.ogImage}",
  "keywords": "{caseStudy.tags.join(', ')}",
  "provider": {
    "@type": "Organization",
    "name": "{caseStudy.client}"
  }
}
```

#### 9.3.3 Article (per editorial piece)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{article.title}",
  "author": {
    "@type": "Person",
    "name": "Keisuke Shingu"
  },
  "datePublished": "{article.publishDate}",
  "description": "{article.excerpt}",
  "image": "{article.heroImage}"
}
```

#### 9.3.4 BreadcrumbList (per page)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://keisukeshingu.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://keisukeshingu.com/projects"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{caseStudy.title}",
      "item": "https://keisukeshingu.com/case-studies/{slug}"
    }
  ]
}
```

### 9.4 Technical SEO

| Requirement | Implementation |
|---|---|
| Sitemap | `/sitemap.xml` via `next-sitemap` (auto-generated from Sanity slugs) |
| Robots.txt | `/robots.txt` allowing all crawlers, linking to sitemap |
| Canonical URLs | Set per-page, preventing duplicate content |
| Hreflang | `en` (primary), `ja` (future consideration for Japanese content) |
| Image alt text | Required field in all `imageWithMeta` schemas |
| Heading hierarchy | Enforced in components: one `<h1>` per page, sequential `<h2>`→`<h3>` |
| Internal linking | Portable Text `link` annotations for contextual cross-links |
| Page speed | See Section 8 — all within Google "good" thresholds |
| Mobile-first | Responsive breakpoints at 767px and 1119px |
| HTTPS | Vercel default (TLS 1.3) |
| Crawl budget | SSG pages = instant response, no rendering delay for bots |

### 9.5 Dynamic OG Image Generation

For pages without a custom `ogImage`, the `/api/og` endpoint generates branded preview images:

```
┌──────────────────────────────────────────┐
│  #0D0D0F background                      │
│                                          │
│  "Design-to-Code                         │
│   Without the Handoff"                   │
│                                          │
│  ── AI-Native Workflow ──                │
│                                          │
│  流                    Keisuke Shingu    │
│  (kanji watermark)     keisukeshingu.com │
└──────────────────────────────────────────┘
1200 × 630px
```

Font: Inter 600 (title) + Inter 300 (meta)
Colors: `--white` text on `--ink-100` background, `--shu` accent line

---

## Appendix A — Migration from v1.0 CMS Docs

This specification supersedes the following documents:
- `docs/cms-architecture.md` (v1.0)
- `docs/cms-design-system-mapping.md` (v1.0)
- `docs/cms-install-guide.md` (v1.0)
- `docs/cms-test-plan.md` (v1.0)

Those documents remain in the repo for reference but are no longer the active specification. This document (`cms-platform-spec.md`) is the single source of truth.

### Key additions in v2.0 → v2.1:

**v2.0:**
- Full Information Architecture with sitemap hierarchy
- Three user journey maps with multimedia touchpoints
- Complete entity relationship diagram
- Nine multimedia schema types (self-hosted audio, SoundCloud embed, background audio, video, 3D, React Flow, D3, Anime.js, data viz)
- SoundCloud oEmbed + Widget API integration with cs-artifact treatment
- Page-level background music system with crossfade, opt-in UX, persistent mini-player
- Structural wireframe blueprints for every page template
- Explicit performance budgets per page type
- Complete SEO framework with JSON-LD structured data
- Dynamic OG image generation spec
- Conditional bundle loading strategy for multimedia libraries

**v2.1:**
- Audio-reactive animation system: plexus, snow/weather, and flow pipeline animations respond to background music frequency bands (bass, mid, treble)
- Full `audioReactivity` CMS schema: every animation parameter (particle count, speed, glow, wind, wobble, ring scale) mapped to a frequency band with editable min/max ranges and per-band sensitivity
- Web Audio API AnalyserNode pipeline: Howler.js → AnalyserNode → FrequencyBandSplitter → Zustand store → 60fps animation loop
- SoundCloud → Web Audio hybrid bridge for cross-origin audio analysis
- Sanity Studio editing experience with sliders and dropdowns for all audio-reactive parameters
- Project separation strategy: original static repo preserved as-is, CMS built in new `keisuke-portfolio-cms` repository
- 47-component inventory (up from 45: added AudioReactiveBridge, AudioReactiveProvider)

---

## Appendix B — Figma Make Implementation Notes

This document is formatted for direct consumption by Figma Make. Component names, prop definitions, and layout dimensions correspond to Figma Auto Layout conventions:

| Spec Element | Figma Make Mapping |
|---|---|
| Component inventory (Section 5) | One Figma component per row |
| Page blueprints (Section 6) | Frame-level wireframes |
| Design tokens (referenced) | Figma variables from `tokens.css` |
| `grid-template-columns: 200px 1fr` | Auto Layout with fixed + fill |
| `gap: 64px` | Spacing property on Auto Layout |
| `border-radius: 12px` | Corner radius on frames |
| `var(--ink-100)` → `#1D1D1F` | Figma color variable |
| `var(--shu)` → `#B33A3A` | Figma color variable |
| `var(--paper)` → `#F5F5F7` | Figma color variable |

---

## Appendix C — Project Separation Strategy

The current static portfolio site remains untouched. The CMS platform is a **new project** in a **separate repository**. This preserves the original as a stable reference and production fallback.

### Repository Structure

```
GitHub: keisukeshingu/
│
├── keisuke-portfolio/              ← ORIGINAL (unchanged)
│   ├── Static HTML/CSS/JS
│   ├── GitHub Pages deployment
│   ├── All current docs, images, case studies
│   └── Stays live at keisukeshingu.github.io/keisuke-portfolio/
│
└── keisuke-portfolio-cms/          ← NEW (this spec)
    ├── Next.js 14 App Router
    ├── Sanity Studio (embedded)
    ├── All multimedia components
    ├── Audio-reactive animation system
    └── Deploys to Vercel → keisukeshingu.com
```

### Migration Rules

| Rule | Detail |
|---|---|
| **Original repo is read-only during migration** | No new features or breaking changes to the static site |
| **Content migration is copy, not move** | HTML content is copied into Sanity documents; original files untouched |
| **Images are re-uploaded, not linked** | Images go into Sanity CDN; original `img/` folder stays as-is |
| **Design tokens are cloned** | `css/tokens.css` is copied into `styles/tokens.css` in the new repo |
| **Current site stays live** | GitHub Pages serves the original until CMS site is verified and DNS switched |
| **DNS cutover is the final step** | Only after full QA sign-off does the domain point to Vercel |
| **Original repo becomes archive** | After DNS cutover, rename to `keisuke-portfolio-static-archive` |

### New Repo Initialization

```bash
# Create new repo
gh repo create keisukeshingu/keisuke-portfolio-cms --private --clone

# Bootstrap Next.js
cd keisuke-portfolio-cms
npx create-next-app@latest . --typescript --app --eslint

# Copy design tokens and docs from original
cp ../keisuke-portfolio/css/tokens.css styles/tokens.css
cp ../keisuke-portfolio/css/base.css styles/base.css
cp ../keisuke-portfolio/css/nav.css styles/nav.css
cp ../keisuke-portfolio/css/footer.css styles/footer.css
cp ../keisuke-portfolio/css/case-study.css styles/case-study.css
cp -r ../keisuke-portfolio/logos public/logos
cp -r ../keisuke-portfolio/docs docs/reference/

# Install dependencies
pnpm add next-sanity @sanity/image-url @portabletext/react
pnpm add sanity @sanity/vision @sanity/presentation
pnpm add howler @mux/mux-player three @react-three/fiber @react-three/drei
pnpm add reactflow d3 animejs framer-motion zustand
pnpm add -D @types/howler @types/d3 @types/three
```

### Parallel Development Flow

```
Phase 1–3 (Foundation + Pages):
  Original site: LIVE on GitHub Pages (production)
  CMS site: Development on Vercel preview URLs

Phase 4–6 (Visual Editor + Media + Links):
  Original site: LIVE (unchanged)
  CMS site: Staging on Vercel (*.vercel.app)

Phase 7 (QA):
  Original site: LIVE (fallback)
  CMS site: Final testing on preview domain

DNS Cutover:
  Original site: Archived
  CMS site: LIVE on keisukeshingu.com
```

### Version Correspondence

| Original File | CMS Equivalent |
|---|---|
| `index.html` | `app/page.tsx` + Sanity `homePage` |
| `projects.html` | `app/projects/page.tsx` + Sanity query |
| `case-studies/ai-workflow.html` | `app/case-studies/[slug]/page.tsx` + Sanity `caseStudy` doc |
| `css/tokens.css` | `styles/tokens.css` (1:1 copy) |
| `css/case-study.css` | `styles/case-study.css` (1:1 copy, then CSS Modules) |
| `js/plexus-bg.js` | `components/home/PlexusBg.tsx` (React wrapper + audio-reactive) |
| `js/weather-hero.js` | `components/case-study/WeatherHero.tsx` (React wrapper + audio-reactive) |
| `js/scroll-reveal.js` | `components/layout/ScrollReveal.tsx` (IntersectionObserver hook) |
| `docs/*.md` | `docs/reference/*.md` (copied for reference) |

---

*Document maintained in `/docs/` — update on any architectural decision change.*
*Version 2.1 — Keisuke Shingu + Claude (Cowork mode) — 2026-02-27*
