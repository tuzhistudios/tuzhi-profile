/* ════════════════════════════════════════════════════════
   TuZhi Deco — SOVEREIGN (Premium)
   Ornate geometric frame · Rune corners · Gold/Platinum
   Static frame · Shimmer engravings · Thread particles
   Canvas: 150×150  |  CX/CY: 75  |  R: 52
   ════════════════════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;
  const DPR = window.devicePixelRatio || 2;
  cv.width  = W * DPR; cv.height = H * DPR;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  /* ── palette ── */
  const GOLD   = '#c9a84c';
  const GOLD2  = '#e8c96d';
  const GOLD3  = '#f5e6a3';
  const PLAT   = '#d4dde8';
  const PLAT2  = '#eef2f7';
  const DARK   = '#1a1408';
  const GLOW_G = 'rgba(201,168,76,';
  const GLOW_P = 'rgba(212,221,232,';

  let t = 0;

  /* ══════════════════════════════════════
     GEOMETRY — octagonal frame
     8 outer points at R+14, clipped clean
  ══════════════════════════════════════ */
  const FRAME_R  = R + 13;   /* outer frame radius   */
  const FRAME_R2 = R + 7;    /* inner frame radius   */
  const FRAME_R3 = R + 2;    /* innermost thin ring  */
  const N = 8;               /* octagon sides        */

  function octPoints(r, offset = 0) {
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 + offset;
      return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
    });
  }

  /* ── draw octagon path ── */
  function octPath(r, offset = 0) {
    const pts = octPoints(r, offset);
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
  }

  /* ── frame segment lines (outer to inner at each vertex) ── */
  function drawFrameEdges(alpha) {
    const outer = octPoints(FRAME_R,  Math.PI / N);
    const inner = octPoints(FRAME_R2, Math.PI / N);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = GOLD2;
    ctx.lineWidth = 0.7;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 6;
    outer.forEach((op, i) => {
      ctx.beginPath();
      ctx.moveTo(op.x, op.y);
      ctx.lineTo(inner[i].x, inner[i].y);
      ctx.stroke();
    });
    ctx.restore();
  }

  /* ── ornate corner accent at each vertex ── */
  function drawCornerAccent(cx2, cy2, angle, alpha, shimmer) {
    ctx.save();
    ctx.translate(cx2, cy2);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;

    /* diamond shape */
    const sz = 5.5;
    ctx.beginPath();
    ctx.moveTo(0, -sz);
    ctx.lineTo(sz * 0.55, 0);
    ctx.lineTo(0, sz);
    ctx.lineTo(-sz * 0.55, 0);
    ctx.closePath();
    const dg = ctx.createLinearGradient(0, -sz, 0, sz);
    dg.addColorStop(0,   PLAT2);
    dg.addColorStop(0.35, GOLD3);
    dg.addColorStop(1,   GOLD);
    ctx.fillStyle = dg;
    ctx.shadowColor = shimmer > 0.6 ? PLAT2 : GOLD2;
    ctx.shadowBlur = 8 + shimmer * 10;
    ctx.fill();

    /* side fins */
    ctx.strokeStyle = GOLD2;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = alpha * 0.6;
    ctx.shadowBlur = 3;
    [[-sz * 0.55, 0], [sz * 0.55, 0]].forEach(([fx, fy]) => {
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx * 1.9, fy - sz * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx * 1.9, fy + sz * 0.5);
      ctx.stroke();
    });

    ctx.restore();
  }

  /* ── engraving lines between vertices (inner hex face) ── */
  function drawEngravings(alpha) {
    const pts = octPoints(FRAME_R2, Math.PI / N);
    ctx.save();
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = GOLD3;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2.5, 3.5]);
    ctx.shadowColor = GOLD2;
    ctx.shadowBlur = 4;
    /* connect alternating vertices for inner star pattern */
    for (let i = 0; i < N; i++) {
      const a = pts[i], b = pts[(i + 3) % N];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  /* ── rune symbols at 4 cardinal points ── */
  const RUNES = ['ᚱ', 'ᚦ', 'ᚹ', 'ᚷ'];
  const RUNE_ANGLES = [
    -Math.PI / 2,          /* top    */
     0,                    /* right  */
     Math.PI / 2,          /* bottom */
     Math.PI,              /* left   */
  ];

  function drawRunes(alpha) {
    RUNE_ANGLES.forEach((a, i) => {
      const x = CX + Math.cos(a) * (FRAME_R + 5);
      const y = CY + Math.sin(a) * (FRAME_R + 5);
      /* clamp within canvas */
      const cx2 = Math.max(8, Math.min(W - 8, x));
      const cy2 = Math.max(8, Math.min(H - 8, y));
      const shimmer = 0.5 + 0.5 * Math.sin(t * 0.035 + i * 1.57);
      ctx.save();
      ctx.globalAlpha = alpha * (0.55 + shimmer * 0.45);
      ctx.font = `bold ${7}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = shimmer > 0.65 ? PLAT2 : GOLD3;
      ctx.shadowColor = shimmer > 0.65 ? PLAT : GOLD2;
      ctx.shadowBlur = 6 + shimmer * 12;
      ctx.fillText(RUNES[i], cx2, cy2);
      ctx.restore();
    });
  }

  /* ── thin thread particles drifting from frame ── */
  function makeThread() {
    const vertexIdx = Math.floor(Math.random() * N);
    const baseAngle = (vertexIdx / N) * Math.PI * 2 + Math.PI / N;
    const bx = CX + Math.cos(baseAngle) * FRAME_R;
    const by = CY + Math.sin(baseAngle) * FRAME_R;
    return {
      x    : bx,
      y    : by,
      vx   : Math.cos(baseAngle) * (0.12 + Math.random() * 0.18) + (Math.random() - 0.5) * 0.1,
      vy   : Math.sin(baseAngle) * (0.12 + Math.random() * 0.18) + (Math.random() - 0.5) * 0.1,
      len  : 3 + Math.random() * 6,
      alpha: 0.6 + Math.random() * 0.4,
      life : 0,
      maxLife: 50 + Math.floor(Math.random() * 60),
      gold : Math.random() < 0.6,
    };
  }
  const threads = Array.from({ length: 18 }, () => {
    const th = makeThread();
    th.life = Math.floor(Math.random() * th.maxLife);
    return th;
  });

  function drawThread(th) {
    const p = th.life / th.maxLife;
    const a = p < 0.2 ? th.alpha * (p / 0.2) : p > 0.65 ? th.alpha * (1 - (p - 0.65) / 0.35) : th.alpha;
    if (a < 0.02) return;
    ctx.save();
    ctx.globalAlpha = a * 0.75;
    ctx.strokeStyle = th.gold ? GOLD2 : PLAT;
    ctx.lineWidth = 0.6;
    ctx.shadowColor = th.gold ? GOLD : PLAT2;
    ctx.shadowBlur = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(th.x, th.y);
    ctx.lineTo(th.x - th.vx * th.len, th.y - th.vy * th.len);
    ctx.stroke();
    ctx.restore();
  }

  /* ── center jewel ── */
  function drawCentreJewel(alpha) {
    /* only visible as thin ring — very subtle */
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(CX, CY, FRAME_R3, 0, Math.PI * 2);
    const ringG = ctx.createLinearGradient(CX - FRAME_R3, CY, CX + FRAME_R3, CY);
    ringG.addColorStop(0,    GOLD);
    ringG.addColorStop(0.3,  PLAT2);
    ringG.addColorStop(0.55, GOLD2);
    ringG.addColorStop(0.8,  PLAT);
    ringG.addColorStop(1,    GOLD);
    ctx.strokeStyle = ringG;
    ctx.lineWidth = 1.1;
    ctx.shadowColor = GOLD2;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  /* ── ambient dual glow ── */
  function drawAmbient() {
    /* gold outer */
    const og = ctx.createRadialGradient(CX, CY, FRAME_R - 4, CX, CY, FRAME_R + 12);
    og.addColorStop(0,   GLOW_G + '0.10)');
    og.addColorStop(0.6, GLOW_G + '0.05)');
    og.addColorStop(1,   GLOW_G + '0)');
    ctx.beginPath();
    ctx.arc(CX, CY, FRAME_R + 12, 0, Math.PI * 2);
    ctx.fillStyle = og;
    ctx.fill();

    /* platinum inner */
    const ig = ctx.createRadialGradient(CX, CY, FRAME_R2 - 6, CX, CY, FRAME_R2 + 2);
    ig.addColorStop(0,  GLOW_P + '0.07)');
    ig.addColorStop(1,  GLOW_P + '0)');
    ctx.beginPath();
    ctx.arc(CX, CY, FRAME_R2 + 2, 0, Math.PI * 2);
    ctx.fillStyle = ig;
    ctx.fill();
  }

  /* ══════════════
     MAIN LOOP
  ══════════════ */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    const masterAlpha = 1;

    /* 1. ambient glow */
    drawAmbient();

    /* 2. outer octagon fill — very dark, subtle */
    octPath(FRAME_R, Math.PI / N);
    ctx.save();
    const og2 = ctx.createRadialGradient(CX, CY, R, CX, CY, FRAME_R);
    og2.addColorStop(0, 'rgba(201,168,76,0.04)');
    og2.addColorStop(1, 'rgba(201,168,76,0.01)');
    ctx.fillStyle = og2;
    ctx.globalAlpha = masterAlpha;
    ctx.fill();
    ctx.restore();

    /* 3. outer octagon stroke */
    octPath(FRAME_R, Math.PI / N);
    ctx.save();
    const outerGrd = ctx.createLinearGradient(CX - FRAME_R, CY - FRAME_R, CX + FRAME_R, CY + FRAME_R);
    outerGrd.addColorStop(0,    PLAT2);
    outerGrd.addColorStop(0.25, GOLD3);
    outerGrd.addColorStop(0.5,  GOLD);
    outerGrd.addColorStop(0.75, GOLD2);
    outerGrd.addColorStop(1,    PLAT);
    ctx.strokeStyle = outerGrd;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 10 + 4 * Math.sin(t * 0.02);
    ctx.globalAlpha = masterAlpha * 0.92;
    ctx.stroke();
    ctx.restore();

    /* 4. inner octagon stroke */
    octPath(FRAME_R2, Math.PI / N);
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 0.7;
    ctx.shadowColor = GOLD2;
    ctx.shadowBlur = 5;
    ctx.globalAlpha = masterAlpha * 0.55;
    ctx.stroke();
    ctx.restore();

    /* 5. radial edge lines vertex→vertex */
    drawFrameEdges(masterAlpha * 0.7);

    /* 6. inner engraving star lines */
    const engShimmer = 0.7 + 0.3 * Math.sin(t * 0.018);
    drawEngravings(masterAlpha * engShimmer);

    /* 7. corner accent diamonds */
    octPoints(FRAME_R, Math.PI / N).forEach((pt, i) => {
      const angle = (i / N) * Math.PI * 2 + Math.PI / N;
      const sh = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.03 + i * 0.78));
      drawCornerAccent(pt.x, pt.y, angle + Math.PI / 2, masterAlpha * 0.9, sh);
    });

    /* 8. rune accents at cardinal points */
    drawRunes(masterAlpha);

    /* 9. innermost thin ring */
    drawCentreJewel(masterAlpha * (0.55 + 0.3 * Math.sin(t * 0.025)));

    /* 10. thread particles */
    threads.forEach(th => {
      th.life++;
      th.x += th.vx;
      th.y += th.vy;
      if (th.life >= th.maxLife) Object.assign(th, makeThread(), { life: 0 });
      drawThread(th);
    });

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
