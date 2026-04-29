/* ════════════════════════════════════════
   TuZhi Deco — matrix-frame
   Static ring of Matrix-style glitch chars
   Characters fixed in place, only flicker
   Canvas: 150×150  |  CX/CY: 75  |  R: 52
   ════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  const GREEN1 = '#00ff41';  /* bright */
  const GREEN2 = '#00c832';  /* mid    */
  const GREEN3 = '#007a1f';  /* dim    */
  const GLOW   = '#00ff41';

  /* Matrix character pool */
  const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'.split('');

  function rndChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  /* ── outer ring: 20 chars evenly placed ── */
  const OUTER_COUNT = 20;
  const outer = Array.from({ length: OUTER_COUNT }, (_, i) => ({
    angle  : (i / OUTER_COUNT) * Math.PI * 2,
    orbit  : R + 2,
    char   : rndChar(),
    timer  : Math.floor(Math.random() * 40),
    speed  : 18 + Math.floor(Math.random() * 22),   /* frames between char change */
    bright : Math.random() < 0.25,                   /* 25% are bright/lead */
    alpha  : 0.55 + Math.random() * 0.45,
    size   : 8 + Math.floor(Math.random() * 4),
  }));

  /* ── inner ring: 12 chars, slightly inside ── */
  const INNER_COUNT = 12;
  const inner = Array.from({ length: INNER_COUNT }, (_, i) => ({
    angle  : (i / INNER_COUNT) * Math.PI * 2 + (Math.PI / INNER_COUNT),
    orbit  : R - 12,
    char   : rndChar(),
    timer  : Math.floor(Math.random() * 40),
    speed  : 28 + Math.floor(Math.random() * 30),
    bright : false,
    alpha  : 0.18 + Math.random() * 0.2,
    size   : 6 + Math.floor(Math.random() * 3),
  }));

  /* ── corner accents: 4 bright chars at cardinal positions ── */
  const accents = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map(a => ({
    angle  : a,
    orbit  : R + 2,
    char   : rndChar(),
    timer  : 0,
    speed  : 8,
    alpha  : 1,
    size   : 11,
    accent : true,
  }));

  let t = 0;

  function drawChar(x, y, ch, alpha, size, bright, accent) {
    ctx.save();
    ctx.font = `${accent ? 'bold ' : ''}${size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (accent) {
      ctx.shadowColor = GLOW;
      ctx.shadowBlur  = 18;
      ctx.fillStyle   = GREEN1;
      ctx.globalAlpha = alpha;
      ctx.fillText(ch, x, y);
      /* second pass for stronger glow */
      ctx.shadowBlur  = 28;
      ctx.globalAlpha = alpha * 0.4;
      ctx.fillText(ch, x, y);
    } else if (bright) {
      ctx.shadowColor = GLOW;
      ctx.shadowBlur  = 14;
      ctx.fillStyle   = GREEN1;
      ctx.globalAlpha = alpha;
      ctx.fillText(ch, x, y);
    } else {
      ctx.shadowColor = GREEN2;
      ctx.shadowBlur  = 5;
      ctx.fillStyle   = GREEN3;
      ctx.globalAlpha = alpha;
      ctx.fillText(ch, x, y);
    }

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    /* 1. ambient green glow ring */
    const aura = ctx.createRadialGradient(CX, CY, R - 14, CX, CY, R + 8);
    aura.addColorStop(0, 'rgba(0,255,65,0)');
    aura.addColorStop(0.55, 'rgba(0,255,65,0.07)');
    aura.addColorStop(1, 'rgba(0,255,65,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, R + 8, 0, Math.PI * 2);
    ctx.fillStyle = aura;
    ctx.fill();

    /* 2. inner dim glow */
    const inner2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R - 8);
    inner2.addColorStop(0, 'rgba(0,200,50,0.05)');
    inner2.addColorStop(1, 'rgba(0,200,50,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, R - 8, 0, Math.PI * 2);
    ctx.fillStyle = inner2;
    ctx.fill();

    /* 3. outer ring chars */
    outer.forEach(c => {
      c.timer++;
      if (c.timer >= c.speed) {
        c.char  = rndChar();
        c.timer = 0;
        /* random brightness flip occasionally */
        if (Math.random() < 0.15) c.bright = !c.bright;
      }
      const x = CX + Math.cos(c.angle) * c.orbit;
      const y = CY + Math.sin(c.angle) * c.orbit;
      /* flicker: brief dim on char change */
      const flicker = c.timer < 2 ? 0.3 : c.alpha;
      drawChar(x, y, c.char, flicker, c.size, c.bright, false);
    });

    /* 4. inner ring chars */
    inner.forEach(c => {
      c.timer++;
      if (c.timer >= c.speed) { c.char = rndChar(); c.timer = 0; }
      const x = CX + Math.cos(c.angle) * c.orbit;
      const y = CY + Math.sin(c.angle) * c.orbit;
      drawChar(x, y, c.char, c.alpha, c.size, false, false);
    });

    /* 5. accent chars at top/right/bottom/left */
    accents.forEach(c => {
      c.timer++;
      if (c.timer >= c.speed) { c.char = rndChar(); c.timer = 0; }
      const x = CX + Math.cos(c.angle) * c.orbit;
      const y = CY + Math.sin(c.angle) * c.orbit;
      const flicker = c.timer < 2 ? 0.5 : 1;
      drawChar(x, y, c.char, flicker, c.size, true, true);
    });

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
         
