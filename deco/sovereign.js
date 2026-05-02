/* ════════════════════════════════════════════════════════
   TuZhi Deco — SOVEREIGN (Premium) v2
   Ornate geometric frame · Rune corners · Gold/Platinum
   Fixed size — tight within canvas bounds
   Canvas: 150×150  |  CX/CY: 75  |  R: 52
   ════════════════════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  /* HiDPI — but keep CSS size exactly 150×150 */
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  cv.width  = W * DPR;
  cv.height = H * DPR;
  cv.style.width  = W + 'px';
  cv.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  /* ── palette ── */
  const GOLD  = '#c9a84c';
  const GOLD2 = '#e8c96d';
  const GOLD3 = '#f5e6a3';
  const PLAT  = '#d4dde8';
  const PLAT2 = '#eef2f7';

  let t = 0;

  /* ── geometry — tighter frame ── */
  const FRAME_R  = R + 7;    /* outer octagon   — was R+13 */
  const FRAME_R2 = R + 2;    /* inner octagon   — was R+7  */
  const FRAME_R3 = R - 1;    /* innermost ring  */
  const N = 8;
  const OFF = Math.PI / N;   /* rotate octagon so flat sides face cardinal */

  function octPoints(r, offset) {
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 + offset;
      return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, a };
    });
  }

  function octPath(r, offset) {
    const pts = octPoints(r, offset);
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
  }

  /* ── gradient stroke helper ── */
  function gradStroke(lw, blur, blurColor, grdFn, alpha) {
    ctx.save();
    ctx.lineWidth = lw;
    ctx.shadowBlur = blur;
    ctx.shadowColor = blurColor;
    ctx.strokeStyle = grdFn();
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.restore();
  }

  /* ── radial edge lines ── */
  function drawFrameEdges(alpha) {
    const outer = octPoints(FRAME_R,  OFF);
    const inner = octPoints(FRAME_R2, OFF);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = GOLD2;
    ctx.lineWidth = 0.65;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 5;
    outer.forEach((op, i) => {
      ctx.beginPath();
      ctx.moveTo(op.x, op.y);
      ctx.lineTo(inner[i].x, inner[i].y);
      ctx.stroke();
    });
    ctx.restore();
  }

  /* ── corner diamond accent ── */
  function drawCornerAccent(px, py, angle, alpha, shimmer) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle + Math.PI / 2);
    ctx.globalAlpha = alpha;

    const sz = 4.2;
    ctx.beginPath();
    ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.5, 0);
    ctx.lineTo(0,  sz); ctx.lineTo(-sz * 0.5, 0);
    ctx.closePath();

    const dg = ctx.createLinearGradient(0, -sz, 0, sz);
    dg.addColorStop(0,   PLAT2);
    dg.addColorStop(0.4, GOLD3);
    dg.addColorStop(1,   GOLD);
    ctx.fillStyle = dg;
    ctx.shadowColor = shimmer > 0.65 ? PLAT2 : GOLD2;
    ctx.shadowBlur  = 7 + shimmer * 9;
    ctx.fill();

    /* tiny fins */
    ctx.strokeStyle = GOLD2;
    ctx.lineWidth   = 0.5;
    ctx.globalAlpha = alpha * 0.55;
    ctx.shadowBlur  = 2;
    [[-sz * 0.5, 0], [sz * 0.5, 0]].forEach(([fx, fy]) => {
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx * 1.8, fy - sz * 0.45); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx * 1.8, fy + sz * 0.45); ctx.stroke();
    });
    ctx.restore();
  }

  /* ── inner engraving star ── */
  function drawEngravings(alpha) {
    const pts = octPoints(FRAME_R2, OFF);
    ctx.save();
    ctx.globalAlpha = alpha * 0.4;
    ctx.strokeStyle = GOLD3;
    ctx.lineWidth   = 0.45;
    ctx.setLineDash([2, 3.5]);
    ctx.shadowColor = GOLD2;
    ctx.shadowBlur  = 3;
    for (let i = 0; i < N; i++) {
      const a = pts[i], b = pts[(i + 3) % N];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  /* ── rune at 4 cardinal vertices (kept inside canvas) ── */
  const RUNES       = ['ᚱ', 'ᛒ', 'ᚹ', 'ᚷ'];
  const RUNE_ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  function drawRunes(alpha) {
    RUNE_ANGLES.forEach((a, i) => {
      /* place runes on FRAME_R2 edge — safely inside canvas */
      const x  = CX + Math.cos(a) * (FRAME_R - 1);
      const y  = CY + Math.sin(a) * (FRAME_R - 1);
      const cx2 = Math.max(6, Math.min(W - 6, x));
      const cy2 = Math.max(6, Math.min(H - 6, y));
      const sh  = 0.45 + 0.55 * Math.sin(t * 0.033 + i * 1.57);
      ctx.save();
      ctx.globalAlpha = alpha * (0.5 + sh * 0.5);
      ctx.font = `bold 6px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle  = sh > 0.6 ? PLAT2 : GOLD3;
      ctx.shadowColor = sh > 0.6 ? PLAT  : GOLD2;
      ctx.shadowBlur  = 5 + sh * 10;
      ctx.fillText(RUNES[i], cx2, cy2);
      ctx.restore();
    });
  }

  /* ── thread particles ── */
  function makeThread() {
    const vi = Math.floor(Math.random() * N);
    const ba = (vi / N) * Math.PI * 2 + OFF;
    const bx = CX + Math.cos(ba) * FRAME_R;
    const by = CY + Math.sin(ba) * FRAME_R;
    return {
      x: bx, y: by,
      vx: Math.cos(ba) * (0.1 + Math.random() * 0.14) + (Math.random() - 0.5) * 0.08,
      vy: Math.sin(ba) * (0.1 + Math.random() * 0.14) + (Math.random() - 0.5) * 0.08,
      len: 3 + Math.random() * 5,
      alpha: 0.55 + Math.random() * 0.4,
      life: 0,
      maxLife: 45 + Math.floor(Math.random() * 55),
      gold: Math.random() < 0.6,
    };
  }
  const threads = Array.from({ length: 16 }, () => {
    const th = makeThread(); th.life = Math.floor(Math.random() * th.maxLife); return th;
  });

  function drawThread(th) {
    const p = th.life / th.maxLife;
    const a = p < 0.2 ? th.alpha*(p/0.2) : p > 0.65 ? th.alpha*(1-(p-0.65)/0.35) : th.alpha;
    if (a < 0.02) return;
    /* clamp within canvas */
    const x = Math.max(1, Math.min(W - 1, th.x));
    const y = Math.max(1, Math.min(H - 1, th.y));
    ctx.save();
    ctx.globalAlpha = a * 0.7;
    ctx.strokeStyle = th.gold ? GOLD2 : PLAT;
    ctx.lineWidth   = 0.55;
    ctx.shadowColor = th.gold ? GOLD : PLAT2;
    ctx.shadowBlur  = 4;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - th.vx * th.len, y - th.vy * th.len);
    ctx.stroke();
    ctx.restore();
  }

  /* ── ambient glow ── */
  function drawAmbient() {
    const g = ctx.createRadialGradient(CX, CY, FRAME_R2, CX, CY, FRAME_R + 6);
    g.addColorStop(0,   'rgba(201,168,76,0.09)');
    g.addColorStop(0.6, 'rgba(201,168,76,0.04)');
    g.addColorStop(1,   'rgba(201,168,76,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, FRAME_R + 6, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  /* ══════════
     MAIN LOOP
  ══════════ */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    /* 1. ambient */
    drawAmbient();

    /* 2. outer octagon */
    octPath(FRAME_R, OFF);
    ctx.save();
    const og = ctx.createLinearGradient(CX - FRAME_R, CY - FRAME_R, CX + FRAME_R, CY + FRAME_R);
    og.addColorStop(0,    PLAT2);
    og.addColorStop(0.25, GOLD3);
    og.addColorStop(0.5,  GOLD);
    og.addColorStop(0.75, GOLD2);
    og.addColorStop(1,    PLAT);
    ctx.strokeStyle = og;
    ctx.lineWidth   = 1.3;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur  = 8 + 3 * Math.sin(t * 0.022);
    ctx.globalAlpha = 0.92;
    ctx.stroke();
    ctx.restore();

    /* 3. inner octagon */
    octPath(FRAME_R2, OFF);
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth   = 0.6;
    ctx.shadowColor = GOLD2;
    ctx.shadowBlur  = 4;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();

    /* 4. radial edge lines */
    drawFrameEdges(0.65);

    /* 5. engravings */
    drawEngravings(0.7 + 0.3 * Math.sin(t * 0.018));

    /* 6. corner diamonds */
    octPoints(FRAME_R, OFF).forEach((pt, i) => {
      const sh = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.03 + i * 0.785));
      drawCornerAccent(pt.x, pt.y, pt.a, 0.88, sh);
    });

    /* 7. runes */
    drawRunes(0.9);

    /* 8. innermost thin ring */
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, FRAME_R3, 0, Math.PI * 2);
    const rg = ctx.createLinearGradient(CX - FRAME_R3, CY, CX + FRAME_R3, CY);
    rg.addColorStop(0,    GOLD);
    rg.addColorStop(0.35, PLAT2);
    rg.addColorStop(0.65, GOLD2);
    rg.addColorStop(1,    PLAT);
    ctx.strokeStyle = rg;
    ctx.lineWidth   = 1.0;
    ctx.shadowColor = GOLD2;
    ctx.shadowBlur  = 6;
    ctx.globalAlpha = 0.5 + 0.28 * Math.sin(t * 0.025);
    ctx.stroke();
    ctx.restore();

    /* 9. threads */
    threads.forEach(th => {
      th.life++;
      th.x += th.vx; th.y += th.vy;
      if (th.life >= th.maxLife) Object.assign(th, makeThread(), { life: 0 });
      drawThread(th);
    });

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
   
