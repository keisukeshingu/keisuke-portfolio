# Design Spec: Slalom Build Japan — Case Study Page Reframe

**Author:** Keisuke Shingu + Claude
**Date:** 2026-02-24
**Status:** Draft — Awaiting Review
**File:** `case-studies/slalom.html`

---

## 1. Strategic Rationale

### Current State
The existing `slalom.html` positions Keisuke as a contributor to a single Gundam Metaverse project. While visually strong, this undersells the actual scope of the role: **Director of Experience Design at Slalom Build Japan**, overseeing UX strategy across the entire Japan practice — multiple enterprise clients, cross-border team building, and frontier technology domains.

### Proposed Reframe
Reposition the page as a **leadership narrative** — the story of building and running a design practice that delivered digital transformation for Japan's most iconic heritage companies. Individual projects (Gundam, Kawasaki, JRCS, Takenaka, CTC) become proof points within that larger arc, not standalone case studies.

### Why This Matters for the Portfolio Audience
- **HR/Hiring Managers** see organizational leadership, not just project delivery
- **Design Directors** see practice-building across cultures and domains
- **Technical Leaders** see range — AI/ML, computer vision, spatial computing, agile methodology
- **Japanese Market Knowledge** — deep understanding of transforming legacy industries

---

## 2. Narrative Architecture

### Core Theme
**"Where Heritage Meets Disruption"**

Every Slalom Build Japan client was a heritage company — 70 years (JRCS), 100+ years (Kawasaki), 400+ years (Takenaka), 45-year IP franchise (Bandai Namco) — each facing a digital transformation inflection point. The design challenge wasn't just UX; it was bridging centuries of craft tradition with cutting-edge technology while respecting the culture that built these companies.

### Narrative Arc (Page Flow)

```
1. HERO
   "Leading Frontier Design Where Heritage Meets Disruption"
   Subtitle: Director of Experience Design · Slalom Build Japan

2. OVERVIEW BAR
   Role: Director of Experience Design
   Client: Slalom Build Japan (Multiple Enterprise Clients)
   Domain: AI/ML · Computer Vision · Spatial Computing · Agile Transformation

3. TAGS
   Slalom Build, Japan Practice, Enterprise UX, Digital Transformation,
   AI/ML Products, Computer Vision, Autonomous Systems, Agile Methodology,
   Cross-Border Teams, Heritage Industry Innovation

4. OPENING NARRATIVE
   The practice-building story — arriving in Tokyo to stand up a
   design function for frontier technology work. The unique challenge
   of bringing Silicon Valley product engineering methodology to
   Japanese enterprise clients who have 100-400 years of craft tradition.

5. CLIENT STORIES (subsections within the narrative)
   Each client = a different dimension of the leadership story:

   5a. JRCS — "From Waterfall to Autonomy"
       70-year marine hardware company → AI-powered autonomous vessels
       Deployed to Shimonoseki, ran agile workshops with CEO directly
       9-month delivery, fastest in industry
       Won IDC FutureEnterprise Award

   5b. KAWASAKI — "Intelligence on the Rails"
       100+ year heavy industry → AI/ML rail track maintenance
       Computer vision + maintenance route optimization
       Cross-border team: engineers came to Seattle Build Center
       Built internal agile team from 0 to 15 software engineers
       Customers: Union Pacific, BNSF Railway

   5c. TAKENAKA — "400 Years of Building, Reimagined"
       Japan's oldest architectural firm (est. 1610) → Agile methodology
       Built Tokyo Tower, Narita Airport, stakeholder in Kansai Airports
       "Throw out what you don't need" — new philosophy born from Agile
       Digital construction platform with AI, IoT, digital twins

   5d. BANDAI NAMCO — "45 Years of IP Become a World"
       Gundam Metaverse SIDE-G · $130M investment
       Fan experience architecture for virtual space colonies
       Avatar system as identity object, not customization feature
       Cross-media continuity across 45 years of franchise content

   5e. CTC (ITOCHU TECHNO-SOLUTIONS) — "The Multiplier Effect"
       Japan's leading IT services company
       7 engineers sent to Seattle to learn Product Engineering Methodology
       Built real-time translation app on AWS serverless
       CTC then established their own Build Center service in Japan
       Knowledge transfer → self-sustaining capability

6. PRACTICE & CULTURE SECTION
   The Slalom Build Tokyo story:
   - Opened Tokyo office late 2022
   - International team from 7 countries
   - English as common language
   - "Our core values will be a beacon, challenging norms about
     partnership, collaboration, and people"
   - Model for diversity and inclusion in Japanese corporate culture

7. KEY HIGHLIGHTS (metrics band)
   - 5 Enterprise Clients (heritage companies transformed)
   - 400+ Years (oldest client's heritage — Takenaka, est. 1610)
   - 9 Months (JRCS: fastest autonomous vessel product in industry)
   - TIME Best Invention (Smith Optics Imprint — Slalom Build methodology)

8. GLOBAL CONTEXT CALLOUT (optional)
   Brief mention of Slalom Build's global methodology proof points:
   - Smith Optics (US): 3D face scanning → custom goggles → TIME Best Invention 2022
   - Toyota Woven City: Smart city ecosystem partnership
   - NVIDIA: Real-time rendering infrastructure
   This contextualizes the Japan practice within the larger Build network.

9. PREV / NEXT NAV
```

---

## 3. Visual & Image Strategy

### Hero Image
**Option A:** Slalom Build Tokyo office / team photo (if available)
**Option B:** Tokyo skyline from existing library (`085-shinjuku-skyline.jpg`)
**Option C:** Keep Gundam Metaverse key visual but reframe caption as one project among many

### Second Image (currently the broken slot)
**Recommendation:** Use for the JRCS or Kawasaki story — these are the most visually compelling transformation narratives. Options:
- Shimonoseki harbor / vessel imagery for JRCS
- Rail infrastructure for Kawasaki
- `077-unicorn-gundam-odaiba.jpg` if keeping Gundam visual presence

### Client Logo Strip
Consider adding a small logo strip within the page showing all Japan client logos:
JRCS · Kawasaki · Takenaka · Bandai Namco · CTC

### Kanji Accents
Current: `宇` (universe) on hero, `機` (machine) on second image
**Proposed:**
- Hero: `匠` (takumi — master craftsman) — bridges heritage and craft
- JRCS section: `海` (umi — sea/ocean)
- Kawasaki section: `鉄` (tetsu — iron/rail)
- Takenaka section: `建` (ken — build/construct)
- Bandai Namco section: `宇` (uchū — universe)

---

## 4. Content Tone & Voice

### Principles
- **Leadership perspective** — "I led / I oversaw / My role was" not "We built"
- **Cultural intelligence** — Show understanding of Japanese business culture without exoticizing it
- **Transformation narrative** — Each client story should have a clear before/after
- **Technical credibility** — Name specific technologies, methodologies, outcomes
- **Respect for heritage** — Frame disruption as evolution, not replacement

### Writing Style
- Short paragraphs (2-3 sentences max)
- One pull quote per client story
- Metrics where available (9 months, $130M, 15 engineers, etc.)
- No jargon without context

---

## 5. Technical Implementation

### HTML Structure
```
<section class="cs-hero"> ... </section>
<div class="overview-bar"> ... </div>
<div class="tags"> ... </div>

<div class="brief-content">
  <!-- Opening narrative -->

  <div class="inline-image"> <!-- JRCS image --> </div>
  <!-- JRCS story -->
  <p class="pull-quote"> ... </p>

  <div class="inline-image"> <!-- Kawasaki image --> </div>
  <!-- Kawasaki story -->

  <!-- Takenaka story -->

  <div class="inline-image"> <!-- Gundam image --> </div>
  <!-- Bandai Namco story -->
  <p class="pull-quote"> ... </p>

  <!-- CTC story -->

  <!-- Practice & Culture section -->
</div>

<div class="key-highlight"> ... </div>
<div class="prev-next"> ... </div>
```

### CSS Changes
- No new CSS required — reuses existing `case-study.css` components
- May need a small client logo strip style (similar to marquee but static)

### Image Requirements
- Need to source or confirm: JRCS/maritime imagery, Kawasaki/rail imagery
- Existing: `077-unicorn-gundam-odaiba.jpg`, Tokyo cityscapes
- Request from Keisuke: Any Slalom Tokyo team/office photos?

---

## 6. Web References (Research Sources)

### Slalom Build — Official Case Studies
| Client | URL |
|--------|-----|
| JRCS | https://www.slalombuild.com/case-studies/jrcs |
| JRCS (Slalom.com) | https://www.slalom.com/us/en/customer-stories/jrcs-waterfalls-high-seas-turning-tides |
| Kawasaki | https://www.slalombuild.com/case-studies/kawasaki |
| CTC | https://www.slalombuild.com/case-studies/ctc |
| Smith Optics | https://www.slalombuild.com/case-studies/smith-optics |
| All Case Studies | https://www.slalombuild.com/case-studies |
| Outcomes | https://www.slalombuild.com/outcomes |

### Slalom Japan — Company & Culture
| Topic | URL |
|-------|-----|
| Japan Location | https://www.slalom.com/jp/en/who-we-are/locations/japan |
| Meet the Tokyo Team | https://prev.slalom.com/culture/meet-slalom-japan |
| Tokyo Leaders (LinkedIn) | https://www.linkedin.com/pulse/get-know-slalom-build-tokyos-leaders-slalom-build |
| Slalom on Japan Dev | https://japan-dev.com/companies/slalom |
| Microsoft Partnership | https://www.slalombuild.com/microsoft |
| AWS Partnership | https://www.slalombuild.com/aws |

### Slalom — Podcasts & Media
| Topic | URL |
|-------|-----|
| Takenaka Podcast | https://slalomconsulting.podbean.com/e/takenaka-japan-s-400-year-old-future-focused-builder/ |
| Kawasaki Press Release | https://www.globenewswire.com/en/news-release/2022/05/18/2446447/0/en/Slalom-supports-Kawasaki-s-IoT-innovation-to-address-the-challenge-of-rail-track-maintenance-in-North-America.html |
| Kawasaki (Slalom Newsroom) | https://www.slalom.com/jp/ja/who-we-are/newsroom/slalom-supports-kawasaki-iot-innovation |

### Client Companies — Background
| Company | URL |
|---------|-----|
| JRCS Official | https://www.jrcs.co.jp/en/ |
| JRCS Digital Innovation Lab | https://www.jrcs.co.jp/en/news/article/20180406/ |
| JRCS "infoceanus command" | https://www.jrcs.co.jp/en/news/article/20201120/ |
| JRCS × MOL AI Research | https://www.jrcs.co.jp/en/news/article/20211217/ |
| JRCS × Microsoft (Computer Weekly) | https://www.computerweekly.com/news/252438562/Microsoft-teams-up-with-Japans-JRCS-on-mixed-reality |
| JRCS × Microsoft (Stories Asia) | https://news.microsoft.com/apac/features/technology-and-the-sea-autonomous-ships-and-digital-captains/ |
| Kawasaki × NVIDIA | https://www.nvidia.com/en-us/customer-stories/reinventing-maintenance-operations-with-ai/ |
| Kawasaki (Global Construction Review) | https://www.globalconstructionreview.com/kawasaki-in-bid-to-bring-automatic-rail-track-monitoring-to-north-america/ |
| Takenaka Corporation | https://www.takenaka.co.jp/takenaka_e/ |
| Takenaka History (Asia) | https://takenaka.asia/company/history |
| Takenaka Wikipedia | https://en.wikipedia.org/wiki/Takenaka_Corporation |
| Takenaka Airports | https://www.takenaka.co.jp/takenaka_e/projects/airport/ |
| Takenaka × AWS | https://aws.amazon.com/solutions/case-studies/takenaka-case-study/ |
| CTC Official | https://www.ctc-g.co.jp/en/ |
| CTC America | https://www.ctc-america.com/ |

### Bandai Namco / Gundam Metaverse
| Topic | URL |
|-------|-----|
| SIDE-G Official | https://gmpj.bn-ent.net/en |
| Gundam Metaverse Announcement | https://gundamnews.org/bandai-namco-officially-announces-side-g-gundam-metaverse-project |
| $130M Investment (ANN) | https://www.animenewsnetwork.com/interest/2022-03-29/bandai-namco-offers-more-details-on-its-130m-gundam-metaverse-project/.184147 |
| Gundam Metaverse (Hypebeast) | https://hypebeast.com/2022/3/bandai-namco-mobile-suit-gundam-metaverse |
| Gundam Metaverse (Siliconera) | https://www.siliconera.com/bandai-namco-reveals-new-gundam-metaverse-details/ |

### Smith Optics / Imprint 3D
| Topic | URL |
|-------|-----|
| TIME Best Inventions 2022 | https://time.com/collection/best-inventions-2022/6229823/smithimprint/ |
| Smith Optics Product Page | https://www.smithoptics.com/en_US/p/goggle/IO-MAG-IMPRINT-3D-GOGGLES.html |
| SIA Announcement | https://www.snowsports.org/smith-i-o-mag-imprint-3d-goggle-named-to-times-list-of-best-inventions-of-2022/ |
| SnowBrains Coverage | https://snowbrains.com/smith-i-o-mag-imprint-3d-goggle-named-to-times-list-of-best-inventions-of-2022/ |

### Toyota Woven City
| Topic | URL |
|-------|-----|
| Woven City Official | https://www.woven-city.global/ |
| Toyota Launch Announcement | https://global.toyota/en/newsroom/corporate/43347785.html |
| Phase 1 Construction Complete | https://pressroom.toyota.com/toyota-woven-city-a-test-course-for-mobility-completes-phase-1-construction-and-prepares-for-launch/ |
| Consultant Perspectives | https://www.consultancy.asia/news/3842/consultants-on-toyotas-smart-city-of-the-future-woven-city |

### Kansai International Airport
| Topic | URL |
|-------|-----|
| Airport Overview | https://www.airport-technology.com/projects/kansai/ |
| Kansai Airport Wikipedia | https://en.wikipedia.org/wiki/Kansai_International_Airport |
| Kansai Airports About | https://www.kansai-airports.co.jp/en/company-profile/about-us/ |

---

## 7. Open Questions for Keisuke

1. **Hero image:** Do you have any Slalom Build Tokyo team/office photos we can use?
2. **Kansai Airport:** What is your specific connection to the Kansai airport project? Was it through Takenaka, Slalom, or another engagement?
3. **Toyota Woven City:** How much detail should we include? No public Slalom case study exists for this.
4. **Client story priority:** Which client stories resonate most with the roles you're targeting?
5. **Page title:** Preferences between:
   - "Leading Frontier Design Where Heritage Meets Disruption"
   - "Building Design Practice Across Japan's Innovation Frontier"
   - "Frontier Experience Design — Slalom Build Japan"
6. **NDA considerations:** Any restrictions on what can be shared about specific clients?
7. **Smith Optics inclusion:** Include as global context, or keep page focused on Japan?

---

## 8. Implementation Phases

### Phase 1: Content & Structure
- Rewrite hero section with new positioning
- Write opening narrative (practice-building story)
- Write 5 client subsections with pull quotes and metrics
- Add practice & culture section
- Update key highlights metrics

### Phase 2: Images & Visual
- Source/confirm images for each client section
- Update hero image
- Replace broken second image
- Add client logo strip (optional)
- Update kanji accents

### Phase 3: Polish & Test
- Review responsive behavior
- Cross-browser test
- Verify all image paths are local (no external URLs)
- Update meta title/description
- Update prev/next navigation labels
