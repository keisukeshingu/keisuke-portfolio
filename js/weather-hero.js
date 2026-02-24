// ═══════════════════════════════════════════════════════════════
// WeatherHero — 3D Snow particle system (looking up at sky)
// v4: More particles, wider spread, per-particle wind direction,
//     independent chaotic motion — snow blown by shifting winds
// ═══════════════════════════════════════════════════════════════

const WeatherHero = (function () {
  'use strict';

  // ── State ──
  let cvP, cvR, ctxP, ctxR;
  let W = 0, H = 0, dpr = 1;
  let running = false;
  let container = null;
  let wrapper = null;
  let animId = null;
  let globalTime = 0;

  // ── Mouse tracking ──
  let mouseX = -9999, mouseY = -9999;
  let mouseActive = false;

  // ── Click-summon: one Shu particle flies to click point ──
  var summon = {
    active: false,
    particle: null,
    startWx: 0, startWy: 0, startWz: 0,
    targetWx: 0, targetWy: 0, targetWz: 120, // shallow depth near viewer
    startTime: 0,
    duration: 4000,  // ms
    cooldownUntil: 0, // timestamp — no summon allowed until this time
    cooldown: 5000,   // ms between summons
  };

  // ── Constants ──
  const SHU = [179, 58, 58];
  const INK = [0, 0, 0];
  const FL = 550;          // focal length — perspective strength
  const Z_FAR = 900;       // far spawn depth
  const PI = Math.PI;
  const TAU = PI * 2;

  // ── Config ──
  const CFG = {
    maxP: 61,               // 15% reduction from 72
    spawnRate: 0.46,         // proportional reduction
    maxShu: 2,
    shuChance: 0.08,
    faceHitChance: 0.04,
    baseVz: [-0.3, -0.3],
    faceVz: [-0.7, -0.4],
    baseSize: [1.2, 2.2],
    faceSizeBonus: [1.0, 2.0],
    damping: 0.991,          // slightly more drag for wind-blown feel
    fadeRate: 0.955,
    fadeFaceRate: 0.965,
    wobbleScale: 0.004,      // more wobble
    sizeWeightPow: 2.0,
    mouseRadius: 250,
    mouseStrength: 0.15,
    rippleDuration: 2200,
    rippleMaxR: 28,
  };

  // ── Noise ──
  function n3(x, y, z) {
    return Math.sin(x*1.1+y*0.6+z*0.8)*0.45 +
           Math.sin(x*0.4-y*1.2+z*0.5+2.3)*0.3 +
           Math.sin(x*2.3+y*1.5-z*0.9-1.1)*0.15 +
           Math.sin(x*0.7-y*0.3+z*1.7+3.9)*0.1;
  }

  // ── Easing ──
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }

  // ── 3D → 2D projection (looking up at sky) ──
  function project(wx, wy, wz) {
    var s = FL / (FL + wz);
    return {
      x: Math.round(W * 0.5 + wx * s),
      y: Math.round(H * 0.5 + wy * s),
      s: s
    };
  }

  // ── Unproject: screen coords → world coords at a given wz ──
  function unproject(sx, sy, wz) {
    var s = FL / (FL + wz);
    return {
      wx: (sx - W * 0.5) / s,
      wy: (sy - H * 0.5) / s
    };
  }

  // ── Object Pools ──
  var POOL_SIZE = 68;  // headroom for 61 max
  var particlePool = [];
  var activeParticles = [];
  var RIPPLE_POOL_SIZE = 32;
  var ripplePool = [];
  var activeRipples = [];
  var activeShuCount = 0;

  function createParticle() {
    return {
      wx: 0, wy: 0, wz: 0, vx: 0, vy: 0, vz: 0,
      isShu: false, isFaceHit: false,
      phase: 0, drag: 0, mass: 0, wobble: 0,
      baseSize: 0, opacity: 0, alive: false, spawnZ: 0,
      lifeT: 0,
      // Per-particle wind — each snowflake has its own wind direction
      windAngle: 0,         // unique drift angle (radians)
      windStrength: 0,      // unique drift strength
      windShiftRate: 0,     // how fast this particle's wind changes
    };
  }
  function createRipple() {
    return { x: 0, y: 0, born: 0, isShu: false, scaleMult: 1, alive: false, ringCount: 3 };
  }

  for (var i = 0; i < POOL_SIZE; i++) particlePool.push(createParticle());
  for (var i = 0; i < RIPPLE_POOL_SIZE; i++) ripplePool.push(createRipple());

  function acquireParticle() {
    if (particlePool.length === 0) return null;
    var p = particlePool.pop();
    p.alive = true;
    activeParticles.push(p);
    return p;
  }
  function releaseParticle(p) {
    p.alive = false;
    if (p.isShu) activeShuCount--;
    var idx = activeParticles.indexOf(p);
    if (idx !== -1) activeParticles.splice(idx, 1);
    particlePool.push(p);
  }
  function acquireRipple() {
    if (ripplePool.length === 0) return null;
    var r = ripplePool.pop();
    r.alive = true;
    activeRipples.push(r);
    return r;
  }
  function releaseRipple(r) {
    r.alive = false;
    var idx = activeRipples.indexOf(r);
    if (idx !== -1) activeRipples.splice(idx, 1);
    ripplePool.push(r);
  }

  // ── Wind system ──
  var gusts = [];
  var nextGustIn = 2 + Math.random() * 5;

  function spawnGust() {
    gusts.push({
      angle: Math.random() * TAU,
      strength: 0.02 + Math.random() * 0.08,
      duration: 1 + Math.random() * 4,
      timer: 0,
      cx: (Math.random() - 0.5) * 600,
      cy: (Math.random() - 0.5) * 400,
      radius: 200 + Math.random() * 400,
    });
  }

  function updateGusts(dt) {
    nextGustIn -= dt / 60;
    if (nextGustIn <= 0) { spawnGust(); nextGustIn = 1.5 + Math.random() * 8; }
    for (var i = gusts.length - 1; i >= 0; i--) {
      gusts[i].timer += dt / 60;
      if (gusts[i].timer >= gusts[i].duration) gusts.splice(i, 1);
    }
  }

  function getGustForce(wx, wy) {
    var fx = 0, fy = 0;
    for (var i = 0; i < gusts.length; i++) {
      var g = gusts[i];
      var dx = wx - g.cx, dy = wy - g.cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > g.radius) continue;
      var falloff = 1 - dist / g.radius;
      var p = g.timer / g.duration;
      var env = Math.sin(p * PI) * Math.pow(1 - p, 0.3);
      fx += Math.cos(g.angle) * g.strength * falloff * env;
      fy += Math.sin(g.angle) * g.strength * falloff * env;
    }
    return { fx: fx, fy: fy };
  }

  function windSnow(wx, wy, wz, t) {
    var spiralAngle = t * 0.03;
    var dist = Math.sqrt(wx * wx + wy * wy) || 1;
    var angle = Math.atan2(wy, wx);
    var tangS = 0.015 * Math.min(1, dist / 100);
    var radS = 0.003;
    var fx = Math.cos(angle + PI * 0.5 + spiralAngle) * tangS;
    var fy = Math.sin(angle + PI * 0.5 + spiralAngle) * tangS;
    fx += (wx / dist) * radS;
    fy += (wy / dist) * radS;
    fx += n3(wx * 0.004, wy * 0.004, t * 0.06) * 0.008;
    fy += n3(wx * 0.004 + 5, wy * 0.004 + 5, t * 0.06) * 0.006;
    return { fx: fx, fy: fy };
  }

  // ── Spawn ──
  var spawnAcc = 0;

  function spawnParticle(t, forceShu) {
    if (activeParticles.length >= CFG.maxP) return;
    var p = acquireParticle();
    if (!p) return;

    var z = Z_FAR + Math.random() * 500;
    var isFaceHit = Math.random() < CFG.faceHitChance;

    if (isFaceHit) {
      p.wx = (Math.random() - 0.5) * 60;
      p.wy = (Math.random() - 0.5) * 60;
    } else {
      // Wider spread — more spacing between particles
      var a = Math.random() * TAU;
      var r = Math.sqrt(Math.random());
      var rx = 700, ry = 580;
      p.wx = Math.cos(a) * r * rx + (Math.random() - 0.5) * rx * 0.5;
      p.wy = Math.sin(a) * r * ry + (Math.random() - 0.5) * ry * 0.5;
    }

    p.wz = z;
    // Wider initial velocity spread — each starts going its own way
    p.vx = (Math.random() - 0.5) * 0.4;
    p.vy = (Math.random() - 0.5) * 0.4;
    p.vz = isFaceHit
      ? CFG.faceVz[0] + Math.random() * CFG.faceVz[1]
      : CFG.baseVz[0] + Math.random() * CFG.baseVz[1];

    // Shu red — only if under max count
    p.isShu = (forceShu || (Math.random() < CFG.shuChance)) && activeShuCount < CFG.maxShu;
    if (p.isShu) activeShuCount++;

    p.isFaceHit = isFaceHit;
    p.phase = Math.random() * TAU;
    p.drag = 0.5 + Math.random();
    p.mass = 0.3 + Math.random() * 0.9;
    p.wobble = 0.2 + Math.random() * 0.8;

    // Per-particle wind — each snowflake blown in its own random direction
    p.windAngle = Math.random() * TAU;
    p.windStrength = 0.008 + Math.random() * 0.018;
    p.windShiftRate = 0.15 + Math.random() * 0.6; // how fast wind direction drifts

    var sizeRand = Math.pow(Math.random(), CFG.sizeWeightPow);
    p.baseSize = CFG.baseSize[0] + sizeRand * CFG.baseSize[1];
    if (isFaceHit) p.baseSize += CFG.faceSizeBonus[0] + Math.random() * CFG.faceSizeBonus[1];

    p.opacity = 0;
    p.spawnZ = z;
    p.lifeT = 0;
  }

  // ── Update ──
  function updateParticle(p, dt, t) {
    if (!p.alive) return;

    // ── Click-summon override: smooth fly to target over 1000ms ──
    if (summon.active && summon.particle === p) {
      var elapsed = performance.now() - summon.startTime;
      var progress = Math.min(1, elapsed / summon.duration);
      var e = easeInOutCubic(progress);

      p.wx = summon.startWx + (summon.targetWx - summon.startWx) * e;
      p.wy = summon.startWy + (summon.targetWy - summon.startWy) * e;
      p.wz = summon.startWz + (summon.targetWz - summon.startWz) * e;
      p.vx = 0; p.vy = 0; p.vz = 0;
      p.opacity = Math.min(1, p.opacity + 0.03 * dt);

      if (progress >= 1) {
        summon.active = false;
        summon.particle = null;
        summon.cooldownUntil = performance.now() + summon.cooldown;
        // Blow away from pointer as if caught by wind
        var blowAngle = Math.random() * TAU;
        var blowStrength = 0.3 + Math.random() * 0.25;
        p.vx = Math.cos(blowAngle) * blowStrength;
        p.vy = Math.sin(blowAngle) * blowStrength;
        p.vz = CFG.baseVz[0] + Math.random() * CFG.baseVz[1];
        // Boost its personal wind in the blow direction for continuity
        p.windAngle = blowAngle;
        p.windStrength = 0.015 + Math.random() * 0.012;
      }
      return; // skip normal physics while summoned
    }

    p.opacity = Math.min(1, p.opacity + 0.02 * dt);

    // Z approach (moving toward viewer)
    p.vz += -0.001 * dt;
    p.wz += p.vz * dt;

    // Lifecycle progress for color bloom (0=just spawned, 1=about to die)
    var totalZ = p.spawnZ + 60; // total Z range from spawn to death
    p.lifeT = Math.max(0, Math.min(1, 1 - (p.wz + 60) / totalZ));

    // Per-particle wind — each snowflake drifts in its own shifting direction
    p.windAngle += Math.sin(t * p.windShiftRate + p.phase) * 0.02 * dt;
    // Also add noise-based angle perturbation for organic randomness
    p.windAngle += n3(p.wx * 0.003, p.wy * 0.003, t * 0.08 + p.phase) * 0.015 * dt;

    var pWindFx = Math.cos(p.windAngle) * p.windStrength;
    var pWindFy = Math.sin(p.windAngle) * p.windStrength;

    // Global gusts still affect particles (but no coherent spiral wind)
    var gf = getGustForce(p.wx, p.wy);
    var inf = p.drag / p.mass;

    p.vx += (pWindFx + gf.fx) * inf * dt;
    p.vy += (pWindFy + gf.fy) * inf * dt;

    // Wobble — phase-offset so each particle wobbles independently
    p.vx += Math.sin(t * 0.6 + p.phase) * CFG.wobbleScale * p.wobble * dt;
    p.vy += Math.cos(t * 0.5 + p.phase * 1.3) * CFG.wobbleScale * p.wobble * dt;

    // Mouse attraction in world space
    if (mouseActive) {
      // Unproject mouse to this particle's depth
      var mw = unproject(mouseX, mouseY, p.wz);
      var dx = mw.wx - p.wx;
      var dy = mw.wy - p.wy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRadius && dist > 1) {
        var falloff = 1 - (dist / CFG.mouseRadius);
        var pull = falloff * falloff * CFG.mouseStrength;
        p.vx += (dx / dist) * pull * dt;
        p.vy += (dy / dist) * pull * dt;
      }
    }

    // Micro-impulse — random direction changes for chaotic wind feel
    if (Math.random() < 0.006) {
      p.vx += (Math.random() - 0.5) * 0.08;
      p.vy += (Math.random() - 0.5) * 0.06;
    }

    p.vx *= CFG.damping;
    p.vy *= CFG.damping;
    p.wx += p.vx * dt;
    p.wy += p.vy * dt;

    // Fade near camera
    if (p.wz < 60) {
      p.opacity *= p.isFaceHit ? CFG.fadeFaceRate : CFG.fadeRate;
    }

    // Death — passed through camera plane
    if (p.wz <= -60 || p.opacity <= 0.008) {
      // Cancel summon if this particle is being summoned
      if (summon.active && summon.particle === p) {
        summon.active = false;
        summon.particle = null;
      }
      var proj = project(p.wx, p.wy, Math.max(p.wz, 0));
      if (proj.x > -100 && proj.x < W + 100 && proj.y > -100 && proj.y < H + 100) {
        spawnRipple(proj.x, proj.y, p.isShu, p.isFaceHit ? proj.s * 1.8 : proj.s, p.lifeT);
      }
      releaseParticle(p);
    }
  }

  // ── Ripple ──
  function spawnRipple(x, y, isShu, scaleMult, lifeT) {
    var r = acquireRipple();
    if (!r) return;
    r.x = x; r.y = y; r.born = performance.now();
    r.isShu = isShu; r.scaleMult = scaleMult || 1;
    r.ringCount = isShu ? 4 : 3;
  }

  function updateRipple(r) {
    if (performance.now() - r.born > CFG.rippleDuration) releaseRipple(r);
  }

  function drawRipple(r, ctx) {
    if (!r.alive) return;
    var age = performance.now() - r.born;
    var t = age / CFG.rippleDuration;
    if (t >= 1) return;

    for (var i = 0; i < r.ringCount; i++) {
      var ringDelay = i * 0.15;
      var rt = Math.max(0, t - ringDelay);
      if (rt <= 0 || rt >= 1) continue;
      var eased = easeOutQuart(rt);
      var radius = eased * CFG.rippleMaxR * r.scaleMult * (1 + i * 0.3);
      var opacity = (1 - eased) * (1 - i * 0.25);
      if (opacity <= 0.01 || radius < 0.3) continue;

      var col = r.isShu ? SHU : INK;
      var baseA = r.isShu ? 0.16 : 0.035;
      var a = opacity * baseA;

      ctx.beginPath();
      ctx.arc(r.x, r.y, radius, 0, TAU);
      ctx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a + ')';
      ctx.lineWidth = r.isShu ? 0.7 : 0.4;
      ctx.stroke();
    }
  }

  // ── Draw particle — with Shu color bloom ──
  function drawParticle(p, ctx) {
    if (!p.alive || p.opacity <= 0.005) return;
    var proj = project(p.wx, p.wy, p.wz);

    // Face-hit bloom
    var sizeMult = 1;
    if (p.isFaceHit && p.wz < 200) {
      var close = 1 - Math.max(0, p.wz) / 200;
      sizeMult = 1 + close * close * 8;
    }

    // DOF blur
    var depthRatio = p.wz / (Z_FAR + 500);
    var dofBlur = 1 + depthRatio * 1.5;

    var size = p.baseSize * proj.s * 2 * sizeMult * dofBlur;
    if (size < 0.08) return;

    var a = p.opacity;

    // ── Color computation ──
    // Shu particles: always vivid red from birth
    var col;
    if (p.isShu) {
      col = SHU;
    } else {
      col = INK;
    }

    ctx.save();
    ctx.translate(proj.x, proj.y);

    if (p.isShu) {
      // Vivid red with glow halo — always visible
      var gr = size * (p.isFaceHit ? 5 : 3.5);
      var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, gr);
      grad.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.15) + ')');
      grad.addColorStop(0.3, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.05) + ')');
      grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, gr, 0, TAU);
      ctx.fill();

      // Core
      ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.45) + ')';
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, TAU);
      ctx.fill();
    } else {
      // Ink dot — feathered with DOF
      var fr = size * (p.isFaceHit ? 3.5 : 2.5) * dofBlur;
      var coreA = p.isFaceHit ? 0.05 : 0.07;
      var edgeA = p.isFaceHit ? 0.015 : 0.02;
      var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, fr);
      grad.addColorStop(0, 'rgba(0,0,0,' + (a * coreA / dofBlur) + ')');
      grad.addColorStop(0.35, 'rgba(0,0,0,' + (a * edgeA / dofBlur) + ')');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, fr, 0, TAU);
      ctx.fill();

      if (!p.isFaceHit || p.wz > 80) {
        ctx.fillStyle = 'rgba(0,0,0,' + (a * 0.08 / dofBlur) + ')';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, TAU);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ── Resize ──
  function resize() {
    if (!container) return;
    var rect = container.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    [cvP, cvR].forEach(function (cv) {
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    });
  }

  // ── Main loop ──
  var lastTs = 0;
  var frameCount = 0;
  var lastFpsCheck = 0;

  function animate(timestamp) {
    if (!running) return;

    var dt = lastTs ? Math.min((timestamp - lastTs) / 16.67, 3) : 1;
    lastTs = timestamp;
    globalTime = timestamp * 0.001;

    // FPS monitoring
    frameCount++;
    if (timestamp - lastFpsCheck > 2000) {
      var fps = (frameCount * 1000) / (timestamp - lastFpsCheck);
      frameCount = 0;
      lastFpsCheck = timestamp;
      if (fps < 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        [cvP, cvR].forEach(function (cv) {
          cv.width = W * dpr;
          cv.height = H * dpr;
          cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
        });
      }
    }

    // Clear
    ctxP.clearRect(0, 0, W, H);
    ctxR.clearRect(0, 0, W, H);

    // Wind
    updateGusts(dt);

    // Spawn
    var bc = globalTime * 0.07;
    var breath = Math.max(0, Math.sin(bc) * Math.sin(bc * 0.6));
    spawnAcc += CFG.spawnRate * (0.08 + breath * 0.92) * dt;
    while (spawnAcc >= 1 && activeParticles.length < CFG.maxP) {
      spawnParticle(globalTime);
      spawnAcc -= 1;
    }
    if (spawnAcc >= 1) spawnAcc = 0;

    // Update
    var snapshot = activeParticles.slice();
    for (var i = 0; i < snapshot.length; i++) updateParticle(snapshot[i], dt, globalTime);
    var ripSnap = activeRipples.slice();
    for (var i = 0; i < ripSnap.length; i++) updateRipple(ripSnap[i]);

    // Replenish Shu — always maintain 2 vivid red particles
    while (activeShuCount < CFG.maxShu && activeParticles.length < CFG.maxP) {
      spawnParticle(globalTime, true);
    }

    // Draw ripples
    for (var i = 0; i < activeRipples.length; i++) drawRipple(activeRipples[i], ctxR);

    // Draw particles (z-sorted, far first)
    activeParticles.sort(function (a, b) { return b.wz - a.wz; });
    for (var i = 0; i < activeParticles.length; i++) drawParticle(activeParticles[i], ctxP);

    animId = requestAnimationFrame(animate);
  }

  // ── Public API ──
  return {
    init: function (parentEl, opts) {
      if (!parentEl) { console.warn('WeatherHero: no parent element'); return; }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      opts = opts || {};
      container = parentEl;
      container.style.position = 'relative';

      // Create wrapper
      wrapper = document.createElement('div');
      wrapper.className = 'weather-hero';
      wrapper.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;pointer-events:none;overflow:hidden;';
      // Canvases pass-through; clicks handled on container

      cvP = document.createElement('canvas');
      cvR = document.createElement('canvas');
      cvP.style.cssText = cvR.style.cssText = 'position:absolute;top:0;left:0;display:block;';

      wrapper.appendChild(cvP);
      wrapper.appendChild(cvR);
      container.insertBefore(wrapper, container.firstChild);

      ctxP = cvP.getContext('2d');
      ctxR = cvR.getContext('2d');

      // Ensure hero content stays above
      Array.from(container.children).forEach(function (child) {
        if (child !== wrapper && child.style) {
          if (!child.style.position || child.style.position === 'static') {
            child.style.position = 'relative';
          }
          if (!child.style.zIndex) {
            child.style.zIndex = '1';
          }
        }
      });

      resize();
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && running) lastTs = 0;
      });

      // Mouse tracking
      container.addEventListener('mousemove', function (e) {
        var rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseActive = true;
      });
      container.addEventListener('mouseleave', function () {
        mouseActive = false;
      });

      // Click-summon: fly one Shu particle to click position (5s cooldown)
      container.addEventListener('click', function (e) {
        if (summon.active) return; // already summoning
        if (performance.now() < summon.cooldownUntil) return; // cooldown

        var rect = container.getBoundingClientRect();
        var sx = e.clientX - rect.left;
        var sy = e.clientY - rect.top;

        // Find nearest Shu particle
        var bestP = null, bestDist = Infinity;
        for (var i = 0; i < activeParticles.length; i++) {
          var ap = activeParticles[i];
          if (!ap.isShu || !ap.alive) continue;
          var proj = project(ap.wx, ap.wy, ap.wz);
          var dx = proj.x - sx, dy = proj.y - sy;
          var d = dx * dx + dy * dy;
          if (d < bestDist) { bestDist = d; bestP = ap; }
        }

        if (!bestP) return;

        // Unproject click to a shallow depth for the target
        var targetZ = 120;
        var tw = unproject(sx, sy, targetZ);

        summon.active = true;
        summon.particle = bestP;
        summon.startWx = bestP.wx;
        summon.startWy = bestP.wy;
        summon.startWz = bestP.wz;
        summon.targetWx = tw.wx;
        summon.targetWy = tw.wy;
        summon.targetWz = targetZ;
        summon.startTime = performance.now();
      });

      // Pre-seed particles across depth — snow visible on first frame
      for (var i = 0; i < 20; i++) {
        var p = acquireParticle();
        if (!p) break;
        var z = 100 + Math.random() * (Z_FAR + 300);
        var isShu = (i < 2) && activeShuCount < CFG.maxShu;
        if (isShu) activeShuCount++;
        var a = Math.random() * TAU;
        var r = Math.sqrt(Math.random());
        p.wx = Math.cos(a) * r * 700;
        p.wy = Math.sin(a) * r * 580;
        p.wz = z;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = (Math.random() - 0.5) * 0.4;
        p.vz = CFG.baseVz[0] + Math.random() * CFG.baseVz[1];
        p.isShu = isShu;
        p.isFaceHit = false;
        p.phase = Math.random() * TAU;
        p.drag = 0.5 + Math.random();
        p.mass = 0.3 + Math.random() * 0.9;
        p.wobble = 0.2 + Math.random() * 0.8;
        p.windAngle = Math.random() * TAU;
        p.windStrength = 0.008 + Math.random() * 0.018;
        p.windShiftRate = 0.15 + Math.random() * 0.6;
        var sizeRand = Math.pow(Math.random(), CFG.sizeWeightPow);
        p.baseSize = CFG.baseSize[0] + sizeRand * CFG.baseSize[1];
        p.opacity = 0.5 + Math.random() * 0.5;
        p.spawnZ = z;
        p.lifeT = 1 - (z + 60) / (Z_FAR + 560);
      }

      // Start immediately
      this.start();
      console.log('WeatherHero v4: initialized', W + 'x' + H, activeParticles.length + ' pre-seeded');
    },

    start: function () {
      if (running) return;
      running = true;
      lastTs = 0;
      lastFpsCheck = performance.now();
      frameCount = 0;
      animId = requestAnimationFrame(animate);
    },

    stop: function () {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    },

    destroy: function () {
      this.stop();
      if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      window.removeEventListener('resize', resize);
      activeParticles.length = 0;
      activeRipples.length = 0;
    }
  };
})();
