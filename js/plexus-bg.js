/* =============================================================
   PLEXUS BACKGROUND — Futuristic connected-particle animation
   keisuke-portfolio / js/plexus-bg.js

   Usage:
     <div id="plexus-zone"> ... page content ... </div>
     <script src="js/plexus-bg.js"></script>
     <script>PlexusBg.init(document.getElementById('plexus-zone'));</script>

   Creates a fixed full-viewport canvas behind content with
   floating particles connected by proximity lines. Subtle,
   performant, and respects prefers-reduced-motion.
   ============================================================= */

const PlexusBg = (() => {
  'use strict';

  let canvas, ctx, W, H, dpr;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let raf;
  let time = 0;

  /* ---------- Config ---------- */
  const CFG = {
    count:        90,        // particle count
    speed:        0.3,       // base drift speed
    radius:       1.8,       // particle dot radius
    linkDist:     150,       // max distance for line connections
    linkWidth:    0.8,       // line stroke width
    mouseRadius:  220,       // mouse attraction radius
    mouseForce:   0.025,     // mouse attraction strength
    pulseNodes:   8,         // number of "bright pulse" nodes
    pulseSpeed:   0.012,     // pulse oscillation speed
    /* Colors tuned for light (#F5F5F7) background */
    dotRGB:       [80, 100, 140],     // dark blue-grey dots
    lineRGB:      [100, 120, 160],    // slightly lighter blue-grey lines
    dotAlpha:     0.45,               // base dot opacity
    lineAlphaMax: 0.14,               // max line opacity at closest distance
    glowRGB:      [60, 100, 180],     // pulse glow color (blue accent)
  };

  /* ---------- Particle ---------- */
  class Particle {
    constructor(isPulse) {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * CFG.speed * 2;
      this.vy = (Math.random() - 0.5) * CFG.speed * 2;
      this.r  = CFG.radius * (0.6 + Math.random() * 0.8);
      this.isPulse = isPulse || false;
      this.phase   = Math.random() * Math.PI * 2;
    }

    update() {
      /* Mouse attraction */
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRadius && dist > 1) {
        this.vx += (dx / dist) * CFG.mouseForce;
        this.vy += (dy / dist) * CFG.mouseForce;
      }

      /* Drift */
      this.x += this.vx;
      this.y += this.vy;

      /* Gentle friction */
      this.vx *= 0.997;
      this.vy *= 0.997;

      /* Wrap edges with buffer */
      if (this.x < -30)    this.x = W + 30;
      if (this.x > W + 30) this.x = -30;
      if (this.y < -30)    this.y = H + 30;
      if (this.y > H + 30) this.y = -30;

      /* Pulse phase */
      this.phase += CFG.pulseSpeed;
    }

    draw() {
      const [dr, dg, db] = CFG.dotRGB;
      const sinPhase = Math.sin(this.phase);

      if (this.isPulse) {
        const alpha = 0.35 + 0.45 * sinPhase;
        const r = this.r * (1 + 0.5 * sinPhase);

        /* Outer glow */
        const [gr, gg, gb] = CFG.glowRGB;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${0.04 + 0.03 * sinPhase})`;
        ctx.fill();

        /* Core dot */
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${alpha})`;
        ctx.fill();
      } else {
        /* Standard particle */
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dr}, ${dg}, ${db}, ${CFG.dotAlpha})`;
        ctx.fill();
      }
    }
  }

  /* ---------- Draw links ---------- */
  function drawLinks() {
    const [r, g, b] = CFG.lineRGB;
    for (let i = 0; i < particles.length; i++) {
      const pi = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const pj = particles[j];
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const distSq = dx * dx + dy * dy;
        const maxSq = CFG.linkDist * CFG.linkDist;
        if (distSq < maxSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / CFG.linkDist) * CFG.lineAlphaMax;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = CFG.linkWidth;
          ctx.stroke();
        }
      }
    }
  }

  /* ---------- Frame ---------- */
  function frame() {
    ctx.clearRect(0, 0, W, H);
    time++;
    drawLinks();
    for (const p of particles) {
      p.update();
      p.draw();
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Resize ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------- Init ---------- */
  function init(container) {
    if (!container) {
      console.warn('[PlexusBg] No container found');
      return;
    }

    /* Respect reduced motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    canvas = document.createElement('canvas');
    canvas.id = 'plexus-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');
    resize();

    /* Spawn particles */
    particles = [];
    for (let i = 0; i < CFG.count; i++) {
      particles.push(new Particle(i < CFG.pulseNodes));
    }

    /* Events */
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    console.log('[PlexusBg] Initialized — ' + CFG.count + ' particles');
    frame();
  }

  /* ---------- Destroy ---------- */
  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    particles = [];
  }

  return { init, destroy };
})();
