// ═══════════════════════════════════════════════════════════════
// CaseStudyIcons — Hover-triggered micro-animation icon manager
// Uses MicroAnim library (micro-anim.js) as dependency
// Icons show static rest frame, animate on hover/touch
// ═══════════════════════════════════════════════════════════════

const CaseStudyIcons = (function () {
  'use strict';

  if (typeof MicroAnim === 'undefined') {
    console.warn('CaseStudyIcons: MicroAnim library not loaded');
    return { init: function(){}, place: function(){} };
  }

  const instances = [];
  let initialized = false;

  // ── Animation index reference ──
  // 0: Ripple, 1: Cluster, 2: Sonar, 3: Magnetic, 4: Shu Flash,
  // 5: Orbit, 6: Heartbeat, 7: Float, 8: Liquid, 9: Constellate,
  // 10: Radar, 11: Breathe, 12: Sq Ripple, 13: Explode, 14: Ensō,
  // 15: Wave, 16: Drop, 17: Stagger, 18: Bloom, 19: Spiral,
  // 20: Double, 21: Morph, 22: Interfere, 23: Bounce, 24: Fusion,
  // 25: Ping, 26: Pendulum, 27: DNA, 28: Shockwave, 29: Gravity,
  // 30: Rotate, 31: Typewriter, 32: Crosshair, 33: Glitch, 34: Tri Ripple,
  // 35: Scatter, 36: Sine, 37: Matrix, 38: Vortex, 39: Hex Ripple,
  // 40: Cascade, 41: Pulse Grid, 42: Comet, 43: Zip, 44: Iris,
  // 45: Sprinkle, 46: Lighthouse, 47: Molecule, 48: Wipe, 49: Aurora

  function init(canvasSize) {
    if (initialized) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    MicroAnim.init(DPR, canvasSize || 28);
    initialized = true;
  }

  function createIcon(animIndex, displaySize, options) {
    if (!initialized) return null;
    options = options || {};

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const canvasSize = (options.canvasSize || 28) * DPR;
    const restT = options.restT || 0;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = displaySize + 'px';
    canvas.style.height = displaySize + 'px';
    canvas.style.display = 'inline-block';
    canvas.style.verticalAlign = 'middle';
    canvas.style.marginRight = (options.marginRight !== undefined ? options.marginRight : 6) + 'px';
    canvas.style.flexShrink = '0';
    canvas.className = 'micro-icon';

    const ctx = canvas.getContext('2d');
    const anim = MicroAnim.lib[animIndex];
    if (!anim) return null;

    const [name, cycleMs, drawFn] = anim;
    let active = false;
    let startTs = null;
    let raf = null;

    // Scale context for canvas size vs MicroAnim internal size
    function drawFrame(t) {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.save();
      // MicroAnim uses its own internal coordinate system based on init()
      // We just call drawFn which uses MicroAnim's M (center) and Z (size)
      drawFn(ctx, t);
      ctx.restore();
    }

    // Draw rest state
    drawFrame(restT);

    function loop(ts) {
      if (!active) return;
      if (!startTs) startTs = ts;
      const t = ((ts - startTs) % cycleMs) / cycleMs;
      drawFrame(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (active) return;
      active = true;
      startTs = null;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      drawFrame(restT);
    }

    // Hover events
    canvas.addEventListener('mouseenter', start);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (active) stop(); else start();
    });

    return { canvas, start, stop, name };
  }

  function place(selector, animIndex, displaySize, options) {
    if (!initialized) return;
    options = options || {};

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    elements.forEach(function (el, idx) {
      const icon = createIcon(animIndex, displaySize, options);
      if (!icon) return;

      if (options.position === 'before') {
        el.insertBefore(icon.canvas, el.firstChild);
      } else if (options.position === 'after') {
        el.appendChild(icon.canvas);
      } else {
        // Default: prepend before first child
        el.insertBefore(icon.canvas, el.firstChild);
      }

      // Propagate hover from parent to icon
      if (options.parentHover !== false) {
        const hoverTarget = options.hoverTarget ? el.closest(options.hoverTarget) : el;
        if (hoverTarget) {
          hoverTarget.addEventListener('mouseenter', icon.start);
          hoverTarget.addEventListener('mouseleave', icon.stop);
        }
      }

      instances.push(icon);
    });
  }

  // Batch placement with config array
  function placeAll(configs) {
    if (!initialized) return;
    configs.forEach(function (cfg) {
      place(cfg.selector, cfg.anim, cfg.size, cfg.options || {});
    });
  }

  return {
    init: init,
    place: place,
    placeAll: placeAll,
    createIcon: createIcon,
  };
})();
