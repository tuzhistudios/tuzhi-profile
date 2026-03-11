/* ═══════════════════════════════════════════════
   TuZhi Deco — spooky-ring  v2
   Evil red-dark creature ring
   • All creatures OUTSIDE avatar circle (r>52)
   • Red/crimson theme, no pink
   • Glow only on eyes & light details
   • No rotation — pulse + flicker only
   ═══════════════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160,H=160,CX=80,CY=80;

  /* ── PALETTE ── */
  const BLK  = '#0a0005';
  const DARK = '#180008';
  const D2   = '#200010';
  const RED  = '#cc0000';
  const RED2 = '#ff2200';
  const RED3 = '#ff6644';
  const BLD  = '#8b0000';   /* blood dark */
  const WH   = '#ffffff';

  /* Safe outer radius — avatar fills r≈50, we start at r=56 */
  const INNER = 56;   /* nothing drawn inside this */
  const OUTER = 76;   /* creatures mostly inside this */

  let t=0, raf;

  /* ── UTILS ── */
  const sv = ctx.save.bind(ctx);
  const rs = ctx.restore.bind(ctx);

  function fill(color, blur, alpha){
    ctx.fillStyle   = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur  || 0;
    ctx.globalAlpha = alpha || 1;
  }
  function stroke(color, lw, blur, alpha){
    ctx.strokeStyle = color;
    ctx.lineWidth   = lw    || 1;
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur  || 0;
    ctx.globalAlpha = alpha || 1;
  }

  /* polar → canvas coords */
  function p2c(angle, r){ return [CX + Math.cos(angle)*r, CY + Math.sin(angle)*r]; }

  /* Draw an evil X-eye at (x,y) radius r */
  function xEye(x,y,r,glow){
    sv();
    /* white eyeball */
    fill(WH, 10*glow, 0.92);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    /* red iris */
    fill(RED2, 6*glow, 0.9);
    ctx.beginPath(); ctx.arc(x,y,r*0.6,0,Math.PI*2); ctx.fill();
    /* dark pupil */
    fill(BLK, 0, 1);
    ctx.beginPath(); ctx.arc(x,y,r*0.28,0,Math.PI*2); ctx.fill();
    /* blood X */
    ctx.strokeStyle=BLD; ctx.lineWidth=r*0.5; ctx.lineCap='round';
    ctx.shadowColor=RED; ctx.shadowBlur=4*glow; ctx.globalAlpha=0.85;
    const o=r*0.52;
    ctx.beginPath(); ctx.moveTo(x-o,y-o); ctx.lineTo(x+o,y+o); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+o,y-o); ctx.lineTo(x-o,y+o); ctx.stroke();
    /* tiny highlight */
    fill(WH,0,0.8);
    ctx.beginPath(); ctx.arc(x-r*0.28,y-r*0.28,r*0.18,0,Math.PI*2); ctx.fill();
    rs();
  }

  /* hollow dot eye */
  function hollowEye(x,y,r,glow){
    sv();
    fill(WH,8*glow,0.85);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    fill(RED2,5*glow,0.8);
    ctx.beginPath(); ctx.arc(x,y,r*0.6,0,Math.PI*2); ctx.fill();
    fill(BLK,0,1);
    ctx.beginPath(); ctx.arc(x,y,r*0.3,0,Math.PI*2); ctx.fill();
    rs();
  }

  /* blood drip */
  function drip(x,y,len,w,glow){
    sv();
    fill(BLD, 3*glow, 0.9);
    ctx.beginPath();
    ctx.moveTo(x-w,y);
    ctx.quadraticCurveTo(x-w*1.8, y+len*0.6, x, y+len);
    ctx.quadraticCurveTo(x+w*1.8, y+len*0.6, x+w, y);
    ctx.closePath(); ctx.fill();
    /* bright tip drop */
    fill(RED2, 5*glow, 0.7);
    ctx.beginPath(); ctx.arc(x, y+len, w*1.1, 0, Math.PI*2); ctx.fill();
    rs();
  }

  /* ═══════════════════════════════════════════
     CREATURES — all strictly outside r=INNER
  ═══════════════════════════════════════════ */

  /* ── TOP: SKULL (11–1 o'clock, y ≈ 4–20) ── */
  function drawSkull(g){
    sv();
    const sx=80, sy=10;   /* sits above avatar */

    /* cranium */
    fill(DARK, 6*g, 1);
    ctx.beginPath(); ctx.arc(sx,sy,11,0,Math.PI*2); ctx.fill();

    /* jawbone */
    fill(DARK,4*g,1);
    ctx.beginPath();
    ctx.moveTo(sx-8,sy+6);
    ctx.bezierCurveTo(sx-9,sy+14,sx-5,sy+18,sx,sy+18);
    ctx.bezierCurveTo(sx+5,sy+18,sx+9,sy+14,sx+8,sy+6);
    ctx.fill();

    /* teeth — blood red */
    fill(BLD,3*g,0.9);
    [-5,-1.5,2,5.5].forEach(ox=>{
      ctx.beginPath();
      ctx.moveTo(sx+ox, sy+11);
      ctx.lineTo(sx+ox+1.5, sy+16);
      ctx.lineTo(sx+ox+3, sy+11);
      ctx.fill();
    });

    /* X eyes */
    xEye(sx-5, sy-1, 3.5, g);
    xEye(sx+5, sy-1, 3.5, g);

    /* cracks */
    sv();
    stroke(RED2, 0.7, 5*g, 0.5);
    ctx.beginPath(); ctx.moveTo(sx,sy-9); ctx.lineTo(sx-2,sy-4); ctx.lineTo(sx+1,sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx+6,sy-7); ctx.lineTo(sx+4,sy-3); ctx.stroke();
    rs();

    /* blood drips */
    drip(sx-3, sy+17, 7, 1.8, g);
    drip(sx+3, sy+17, 5, 1.5, g);

    /* connecting dark mass left */
    fill(DARK,5*g,1);
    ctx.beginPath();
    ctx.moveTo(sx-10,sy+2);
    ctx.bezierCurveTo(sx-22,sy+0, sx-30,sy+8, sx-28,sy+18);
    ctx.bezierCurveTo(sx-24,sy+14, sx-18,sy+10, sx-10,sy+10);
    ctx.fill();

    /* connecting dark mass right */
    fill(DARK,5*g,1);
    ctx.beginPath();
    ctx.moveTo(sx+10,sy+2);
    ctx.bezierCurveTo(sx+22,sy+0, sx+30,sy+8, sx+28,sy+18);
    ctx.bezierCurveTo(sx+24,sy+14, sx+18,sy+10, sx+10,sy+10);
    ctx.fill();

    rs();
  }

  /* ── RIGHT: GHOST (2–4 o'clock) ── */
  function drawGhost(g){
    sv();
    const gx=136, gy=76;

    /* body */
    fill(D2, 7*g, 1);
    ctx.beginPath();
    ctx.moveTo(gx-8, gy-18);
    ctx.bezierCurveTo(gx+6,gy-22, gx+16,gy-12, gx+14,gy+2);
    ctx.bezierCurveTo(gx+14,gy+14, gx+8,gy+22, gx,gy+20);
    ctx.bezierCurveTo(gx-10,gy+20, gx-16,gy+12, gx-14,gy);
    ctx.bezierCurveTo(gx-14,gy-10, gx-8,gy-18, gx-8,gy-18);
    ctx.fill();

    /* wavy skirt bottom */
    fill(D2,4*g,1);
    ctx.beginPath();
    ctx.moveTo(gx-14,gy+12);
    ctx.bezierCurveTo(gx-14,gy+22, gx-8,gy+26, gx-4,gy+22);
    ctx.bezierCurveTo(gx-2,gy+26, gx+4,gy+28, gx+8,gy+24);
    ctx.bezierCurveTo(gx+10,gy+28, gx+14,gy+26, gx+14,gy+20);
    ctx.fill();

    /* X eyes */
    xEye(gx-5, gy-2, 4, g);
    xEye(gx+5, gy-4, 4, g);

    /* blood tears */
    sv();
    stroke(RED2,1,4*g,0.6);
    ctx.beginPath(); ctx.moveTo(gx-5,gy+2); ctx.lineTo(gx-6,gy+10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx+5,gy+0); ctx.lineTo(gx+6,gy+8); ctx.stroke();
    rs();

    /* horns */
    fill(BLD,4*g,1);
    ctx.beginPath(); ctx.moveTo(gx-8,gy-18); ctx.lineTo(gx-12,gy-28); ctx.lineTo(gx-4,gy-20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(gx+2,gy-20); ctx.lineTo(gx+8,gy-30); ctx.lineTo(gx+10,gy-20); ctx.fill();

    rs();
  }

  /* ── BOTTOM-RIGHT: SMALL DEMON (4–5 o'clock) ── */
  function drawDemon(g){
    sv();
    const dx=118, dy=118;

    fill(DARK,6*g,1);
    ctx.beginPath();
    ctx.moveTo(dx,dy-12);
    ctx.bezierCurveTo(dx+12,dy-14,dx+18,dy-4,dx+16,dy+8);
    ctx.bezierCurveTo(dx+14,dy+16,dx+6,dy+18,dx,dy+16);
    ctx.bezierCurveTo(dx-8,dy+16,dx-14,dy+8,dx-12,dy);
    ctx.bezierCurveTo(dx-10,dy-8,dx-4,dy-12,dx,dy-12);
    ctx.fill();

    /* horns */
    fill(BLD,4*g,1);
    ctx.beginPath(); ctx.moveTo(dx-6,dy-12); ctx.lineTo(dx-9,dy-20); ctx.lineTo(dx-2,dy-13); ctx.fill();
    ctx.beginPath(); ctx.moveTo(dx+4,dy-12); ctx.lineTo(dx+8,dy-20); ctx.lineTo(dx+10,dy-12); ctx.fill();

    /* eyes */
    hollowEye(dx-4, dy, 3.5, g);
    hollowEye(dx+4, dy-2, 3.5, g);

    /* mouth */
    sv();
    stroke(RED,1.5,4*g,0.8);
    ctx.beginPath();
    ctx.moveTo(dx-4,dy+8);
    ctx.bezierCurveTo(dx-2,dy+12,dx+2,dy+12,dx+4,dy+8);
    ctx.stroke();
    rs();

    /* blood drip */
    drip(dx, dy+15, 8, 2, g);

    rs();
  }

  /* ── BOTTOM: LARGE DARK MASS (5–7 o'clock) ── */
  function drawBottomMass(g){
    sv();

    fill(DARK,7*g,1);
    ctx.beginPath();
    ctx.moveTo(60,140);
    ctx.bezierCurveTo(50,148,40,146,38,136);
    ctx.bezierCurveTo(36,126,46,120,56,124);
    ctx.bezierCurveTo(60,116,70,114,76,118);
    ctx.bezierCurveTo(84,114,92,116,94,124);
    ctx.bezierCurveTo(102,120,112,126,110,136);
    ctx.bezierCurveTo(108,146,98,148,90,140);
    ctx.bezierCurveTo(82,148,72,150,66,144);
    ctx.bezierCurveTo(64,148,60,148,60,140);
    ctx.fill();

    /* cat ears on mass */
    fill(DARK,4*g,1);
    ctx.beginPath(); ctx.moveTo(56,124); ctx.lineTo(50,112); ctx.lineTo(60,118); ctx.fill();
    fill(BLD,3*g,0.7);
    ctx.beginPath(); ctx.moveTo(56,122); ctx.lineTo(52,114); ctx.lineTo(59,119); ctx.fill();

    fill(DARK,4*g,1);
    ctx.beginPath(); ctx.moveTo(94,124); ctx.lineTo(100,112); ctx.lineTo(90,118); ctx.fill();
    fill(BLD,3*g,0.7);
    ctx.beginPath(); ctx.moveTo(94,122); ctx.lineTo(98,114); ctx.lineTo(91,119); ctx.fill();

    /* hollow eyes */
    hollowEye(67, 128, 5, g);
    hollowEye(83, 128, 5, g);

    /* sharp teeth */
    fill(WH,3*g,0.85);
    [-8,-4,0,4,8].forEach(ox=>{
      ctx.beginPath();
      ctx.moveTo(75+ox,134); ctx.lineTo(74+ox,140); ctx.lineTo(77+ox,134);
      ctx.fill();
    });

    /* blood on teeth */
    fill(RED2,2*g,0.5);
    ctx.beginPath(); ctx.arc(75,140,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(83,140,2,0,Math.PI*2); ctx.fill();

    rs();
  }

  /* ── LEFT: WINGED CREATURE (8–10 o'clock) ── */
  function drawWing(g){
    sv();

    /* wing membrane */
    fill(D2,6*g,1);
    ctx.beginPath();
    ctx.moveTo(24,80);
    ctx.bezierCurveTo(8,70,4,54,12,42);
    ctx.bezierCurveTo(18,32,28,30,34,38);
    ctx.bezierCurveTo(28,46,24,60,28,72);
    ctx.fill();

    /* wing ribs */
    sv();
    stroke(BLD,1,3*g,0.55);
    ctx.beginPath(); ctx.moveTo(12,42); ctx.lineTo(28,60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16,36); ctx.lineTo(30,54); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20,32); ctx.lineTo(32,50); ctx.stroke();
    rs();

    /* wing tip spikes */
    fill(DARK,4*g,1);
    [[6,48],[4,60],[6,72]].forEach(([x,y])=>{
      ctx.beginPath();
      ctx.moveTo(x,y); ctx.lineTo(x-4,y-6); ctx.lineTo(x-4,y+6); ctx.closePath(); ctx.fill();
    });

    /* body bulge */
    fill(DARK,7*g,1);
    ctx.beginPath();
    ctx.moveTo(26,70);
    ctx.bezierCurveTo(20,60,22,46,30,42);
    ctx.bezierCurveTo(38,38,46,44,46,54);
    ctx.bezierCurveTo(46,64,40,72,32,74);
    ctx.bezierCurveTo(28,74,26,72,26,70);
    ctx.fill();

    /* single large eye */
    xEye(36,56,5.5,g);

    /* small secondary eye */
    hollowEye(26,64,3,g);

    /* blood drips from body */
    drip(32,72,10,2,g);
    drip(28,70,7,1.5,g);

    /* connect to skull top-left */
    fill(DARK,4*g,1);
    ctx.beginPath();
    ctx.moveTo(34,38);
    ctx.bezierCurveTo(36,26,48,18,58,20);
    ctx.bezierCurveTo(52,24,44,30,40,38);
    ctx.fill();

    rs();
  }

  /* ── FLOATING EYEBALL (top-right, standalone) ── */
  function drawFloatingEye(g,t){
    sv();
    const pulse = 0.9 + 0.1*Math.sin(t*0.045);
    const ex=120, ey=28;

    /* outer glow */
    fill(RED2, 14*g*pulse, 0.3);
    ctx.beginPath(); ctx.arc(ex,ey,13*pulse,0,Math.PI*2); ctx.fill();

    /* eyeball */
    fill(WH,8*g*pulse,0.9);
    ctx.beginPath(); ctx.arc(ex,ey,10*pulse,0,Math.PI*2); ctx.fill();

    /* red iris */
    fill(RED2,8*g,0.88);
    ctx.beginPath(); ctx.arc(ex,ey,6.5*pulse,0,Math.PI*2); ctx.fill();

    /* slit pupil */
    fill(BLK,0,1);
    ctx.beginPath();
    ctx.ellipse(ex,ey,1.8,5*pulse,0,0,Math.PI*2); ctx.fill();

    /* vein lines */
    sv();
    stroke(RED2,0.8,4*g,0.45);
    ctx.beginPath(); ctx.moveTo(ex-9,ey-2); ctx.lineTo(ex-5,ey+2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+6,ey-6); ctx.lineTo(ex+9,ey); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex,ey-9); ctx.lineTo(ex+2,ey-5); ctx.stroke();
    rs();

    /* highlight */
    fill(WH,0,0.85);
    ctx.beginPath(); ctx.arc(ex-3,ey-3,2.5,0,Math.PI*2); ctx.fill();

    /* dangling stem with drop */
    sv();
    stroke(BLD,1.2,3*g,0.7);
    ctx.beginPath(); ctx.moveTo(ex,ey+10); ctx.lineTo(ex+1,ey+18); ctx.stroke();
    rs();
    fill(RED2,6*g*pulse,0.8);
    ctx.beginPath(); ctx.arc(ex+1,ey+20,2.5,0,Math.PI*2); ctx.fill();

    rs();
  }

  /* ── BLOOD DRIPS from top ring ── */
  function drawRingDrips(g){
    sv();
    /* thin blood arcs at top of creature ring */
    stroke(BLD,1.5,3*g,0.45);
    ctx.beginPath();
    ctx.arc(CX,CY, INNER+1, -Math.PI*0.55, -Math.PI*0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CX,CY, INNER+1, Math.PI*1.25, Math.PI*1.55);
    ctx.stroke();

    /* drip at bottom */
    drip(CX,CY+INNER, 10, 2, g*0.7);
    drip(CX+14,CY+INNER-4, 7, 1.5, g*0.6);
    drip(CX-12,CY+INNER-2, 6, 1.5, g*0.5);
    rs();
  }

  /* ── GLOWING SPARKLE MOTES ── */
  const motes = Array.from({length:14},(_,i)=>({
    a : (i/14)*Math.PI*2,
    r : INNER + 4 + Math.random()*16,
    phase : Math.random()*Math.PI*2,
    speed : 0.008 + Math.random()*0.006,
  }));

  function drawMotes(g){
    motes.forEach((m,i)=>{
      m.a += m.speed;
      const pulse = Math.abs(Math.sin(t*0.05 + m.phase));
      if(pulse < 0.35) return;
      const [x,y] = p2c(m.a, m.r);
      sv();
      fill(RED2, 8, 0.6*pulse*g);
      ctx.beginPath(); ctx.arc(x,y,1.4,0,Math.PI*2); ctx.fill();
      rs();
    });
  }

  /* ══════════════════════════════════════════
     MAIN LOOP
  ═══════════════════════════════════════════ */
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;
    const g  = 0.7  + 0.3 *Math.sin(t*0.032);
    const g2 = 0.65 + 0.35*Math.sin(t*0.027 + 1.8);

    /* dark atmospheric glow ring */
    sv();
    const atm = ctx.createRadialGradient(CX,CY,INNER-4,CX,CY,OUTER+14);
    atm.addColorStop(0,   `rgba(100,0,0,${0.06*g})`);
    atm.addColorStop(0.5, `rgba(60,0,0,${0.12*g})`);
    atm.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(CX,CY,OUTER+14,0,Math.PI*2);
    ctx.fillStyle=atm; ctx.globalAlpha=1; ctx.fill();
    rs();

    /* all creatures */
    drawWing(g);
    drawSkull(g);
    drawFloatingEye(g2, t);
    drawGhost(g);
    drawDemon(g2);
    drawBottomMass(g);
    drawRingDrips(g);
    drawMotes(g2);

    window._decoRaf = raf = requestAnimationFrame(draw);
  }

  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
                      
