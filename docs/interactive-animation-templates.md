# Interactive Design Animation & Effect Templates

Reference guide for reusable animation patterns implemented across the portfolio. Each template includes the JS module, CSS requirements, and integration instructions for applying to any page.

---

## Template 01 — Plexus Connected-Particle Background

**File:** `js/plexus-bg.js`
**First used:** `design-thinking.html` (Feb 2026)
**Category:** Background ambient animation

### Description

Full-viewport canvas animation with floating particles connected by proximity lines. Creates a futuristic, data-network aesthetic. Particles drift autonomously and respond to mouse movement with gentle attraction. A subset of "pulse nodes" breathe with a glow effect for visual depth.

### Visual Characteristics

- 90 particles with soft drift and edge-wrapping
- Proximity lines fade in/out based on inter-particle distance (max 150px)
- 8 pulse nodes with oscillating glow (blue accent)
- Mouse attraction within 220px radius
- Respects `prefers-reduced-motion`

### Configuration (CFG object)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `count` | 90 | Total particle count |
| `speed` | 0.3 | Base drift velocity |
| `radius` | 1.8 | Particle dot radius (px) |
| `linkDist` | 150 | Max distance for line connections (px) |
| `linkWidth` | 0.8 | Connection line stroke width |
| `mouseRadius` | 220 | Mouse attraction radius (px) |
| `mouseForce` | 0.025 | Mouse attraction strength |
| `pulseNodes` | 8 | Number of glowing pulse particles |
| `pulseSpeed` | 0.012 | Pulse oscillation speed |
| `dotRGB` | [80, 100, 140] | Particle color (dark blue-grey) |
| `lineRGB` | [100, 120, 160] | Line color |
| `dotAlpha` | 0.45 | Base dot opacity |
| `lineAlphaMax` | 0.14 | Max line opacity at closest distance |
| `glowRGB` | [60, 100, 180] | Pulse node glow color |

### Integration Steps

**1. HTML — Wrap page content:**
```html
<div id="plexus-zone">
  <!-- all page content: nav, hero, sections, footer -->
</div>

<script src="js/plexus-bg.js"></script>
<script>
  if (typeof PlexusBg !== 'undefined') PlexusBg.init(document.getElementById('plexus-zone'));
</script>
```

**2. CSS — Frosted glass cards (required for visibility):**

Cards, panels, and content blocks that sit over the animation need translucent backgrounds with backdrop blur so particles show through:

```css
.your-card {
  background: rgba(245, 245, 247, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
}
```

**3. CSS — Page body background:**

Override the default white body to a very light blue-grey for better particle contrast:

```css
body { background: #FAFBFC; }
```

### Design Pairing Notes

- Works best with light (#F5F5F7 / #FAFBFC) page backgrounds
- For dark backgrounds, invert `dotRGB` / `lineRGB` to lighter values (e.g., [180, 200, 220])
- The frosted glass card pattern (`backdrop-filter: blur`) is essential — without it, solid card backgrounds hide the animation
- Nav already uses `rgba(255,255,255,0.92)` + blur by default — particles show through automatically
- Footer has no background — particles visible by default

### Performance

- Canvas uses `position: fixed` at `z-index: 0` — no layout reflows
- HiDPI-aware (capped at 2x DPR)
- O(n²) link calculation is acceptable at 90 particles (~4,000 checks/frame)
- For mobile, consider reducing `count` to 40–50 via media query or JS check

### Cleanup

```js
PlexusBg.destroy();  // removes canvas, stops animation loop, clears events
```

---

## Template 02 — WeatherHero 3D Particle System

**File:** `js/weather-hero.js`
**First used:** Case study pages (robot-heart.html, festivals.html)
**Category:** Hero section ambient animation

### Description

3D falling particle system (snow/rain/sakura). Per-particle wind drift, wobble, pulse, mouse attraction, and ripple effects on ground impact.

### Integration

```html
<div id="snow-zone">
  <!-- page content -->
</div>
<script src="js/weather-hero.js"></script>
<script>
  if (typeof WeatherHero !== 'undefined') WeatherHero.init(document.getElementById('snow-zone'));
</script>
```

*(See `js/weather-hero.js` header comments for full configuration.)*

---

## Template 03 — MicroAnim Canvas Library

**File:** `js/micro-anim.js`
**First used:** `index.html`, `projects.html`
**Category:** Hover/idle micro-interactions

### Description

50 canvas-based looping micro-animations. Used as decorative elements on project cards and icons. Each animation is indexed 0–49.

### Integration

```html
<canvas class="case-entry__anim" data-anim="14" width="120" height="120"></canvas>
```

```js
MicroAnim.init(devicePixelRatio, size);
```

*(See README.md for full animation index reference.)*

---

*Last updated: February 2026*
*Maintained by Keisuke Shingu + Claude (Cowork mode)*
