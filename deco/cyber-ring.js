/* ═══════════════════════════════════════════════
   TuZhi Deco — cyber-ring  v1
   Neon cyberpunk digital creature ring
   • Eyes BLINK with digital scanline shutters
   • Glitch particles & holographic flicker
   • Data streams pulse along circuit veins
   • Matrix rain inside the core ring
   ═══════════════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80;

  const BLK  = '#00030a';
  const DARK = '#00101a';
  const D2   = '#00182a';
  const CYAN = '#00f0ff';
  const MAG  = '#ff00aa';
  const BLUE = '#0088ff';
  const WH   = '#e0f7ff';

  const INNER = 56;

  let t = 0, raf;

  /* ════════════════════════════════════════
     BLINK SYSTEM  (same independent timers)
  ════════════════════════════════════════ */
  function makeBlinker(interval, dur){
    return { phase: Math.floor(Math.random()*interval), interval, dur };
  }
  function blinkVal(b){
    const f = (t + b.phase) % b.interval;
    if(f > b.dur) return 0;
    const h = b.dur * 0.5;
    return f < h ? f/h : (b.dur-f)/h;
  }

  const BLINK = {
    skull : makeBlinker(130, 6),
    ghost : makeBlinker(180, 7),
    drone : makeBlinker(150, 5),
    wing  : makeBlinker(200, 8),
    core  : makeBlinker(120, 6),
    virus : makeBlinker(170, 7),
  };

  let gGlow = 0.9;

  const sv = ctx.save.bind(ctx);
  const rs = ctx.restore.bind(ctx);

  function fill(color, blur, alpha){
    ctx.fillStyle   = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = Math.max(blur||0, 0);
    ctx.globalAlpha = Math.min(Math.max(alpha||1, 0), 1);
  }
  function stk(color, lw, blur, alpha){
    ctx.strokeStyle = color;
    ctx.lineWidth   = lw   || 1;
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur || 0;
    ctx.globalAlpha = Math.min(Math.max(alpha||1, 0), 1);
  }
  function p2c(a,r){ return [CX+Math.cos(a)*r, CY+Math.sin(a)*r]; }

  /* ── DIGITAL SCANLINE BLINK helper ──
     bv = blink value 0(open)..1(closed)  */
  function drawScanline(x,y,r,bv,colorBody){
    if(bv < 0.02) return;
    sv();
    const lines = 3;
    const maxGap = r * 2.2;
    const gap = maxGap * bv;
    ctx.fillStyle   = colorBody || DARK;
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 0.95;
    for(let i=0;i<lines;i++){
      const ly = y - gap + (gap*2*i/(lines-1));
      ctx.fillRect(x-r-2, ly-1, (r+2)*2, 2);
    }
    ctx.strokeStyle = CYAN;
    ctx.lineWidth   = 0.7;
    ctx.shadowColor = CYAN;
    ctx.shadowBlur  = 5;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(x-r-2, y-gap); ctx.lineTo(x+r+2, y-gap);
    ctx.moveTo(x-r-2, y+gap); ctx.lineTo(x+r+2, y+gap);
    ctx.stroke();
    rs();
  }

  /* ── CYBER EYE with scanline blink ── */
  function cyberEye(x,y,r,blinker,bodyColor){
    const bv = blinkVal(blinker);
    sv();
    fill(CYAN, 14, 0.5);
    ctx.beginPath(); ctx.arc(x,y,r+2,0,Math.PI*2); ctx.fill();
    fill(WH, 0, 1);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    fill(CYAN, 6, 0.9);
    ctx.beginPath(); ctx.arc(x,y,r*0.62,0,Math.PI*2); ctx.fill();
    fill(BLK, 0, 1);
    ctx.beginPath();
    ctx.ellipse(x,y,r*0.22,r*0.42,0,0,Math.PI*2); ctx.fill();
    /* crosshair */
    ctx.strokeStyle = MAG;
    ctx.lineWidth   = 0.5;
    ctx.shadowColor = MAG;
    ctx.shadowBlur  = 3;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(x-r*0.45,y); ctx.lineTo(x+r*0.45,y);
    ctx.moveTo(x,y-r*0.45); ctx.lineTo(x,y+r*0.45);
    ctx.stroke();
    /* highlight */
    fill(WH,0,0.9);
    ctx.beginPath(); ctx.arc(x-r*0.22,y-r*0.22,r*0.16,0,Math.PI*2); ctx.fill();
    rs();
    drawScanline(x,y,r,bv,bodyColor||DARK);
  }

  /* ── SENSOR EYE (mechanical red dot) ── */
  function sensorEye(x,y,r,blinker,bodyColor){
    const bv = blinkVal(blinker);
    sv();
    fill(MAG, 12, 0.5);
    ctx.beginPath(); ctx.arc(x,y,r+1.5,0,Math.PI*2); ctx.fill();
    fill('#ff0044', 8, 0.95);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    fill(BLK, 0, 1);
    ctx.beginPath(); ctx.arc(x,y,r*0.35,0,Math.PI*2); ctx.fill();
    /* lens ring */
    stk(CYAN, 0.6, 3, 0.6);
    ctx.beginPath(); ctx.arc(x,y,r+0.5,0,Math.PI*2); ctx.stroke();
    rs();
    drawScanline(x,y,r,bv,bodyColor||DARK);
  }

  /* ── MATRIX RAIN inside inner ring ── */
  const RAINDROPS = Array.from({length:12},(_,i)=>({
    x : CX + (Math.random()-0.5)*INNER*1.2,
    y : CY + (Math.random()-0.5)*INNER*1.2,
    len : 3 + Math.floor(Math.random()*5),
    speed : 0.3 + Math.random()*0.4,
    chars : ['|','/','\\','-','.','+','0','1'][Math.floor(Math.random()*8)],
    col : Math.random()>0.5 ? CYAN : '#00ff88',
    phase : Math.random()*Math.PI*2,
  }));
  function drawMatrixRain(){
    sv();
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    RAINDROPS.forEach(d=>{
      d.y += d.speed;
      if(d.y > CY+INNER || Math.hypot(d.x-CX,d.y-CY) > INNER-4){
        d.y = CY - INNER + Math.random()*10;
        d.x = CX + (Math.random()-0.5)*INNER*1.2;
      }
      const dist = Math.hypot(d.x-CX,d.y-CY);
      if(dist > INNER-2) return;
      const alpha = 0.3 + 0.5*Math.abs(Math.sin(t*0.08 + d.phase));
      fill(d.col, 0, alpha);
      for(let i=0;i<d.len;i++){
        ctx.globalAlpha = alpha * (1 - i/d.len);
        ctx.fillText(d.chars, d.x, d.y - i*5);
      }
    });
    rs();
  }

  /* ── GLITCH PARTICLES ── */
  const GLITCH = Array.from({length:14},(_,i)=>({
    x : CX + (Math.random()-0.5)*70,
    y : CY + (Math.random()-0.5)*70,
    w : 2 + Math.random()*3,
    h : 1 + Math.random()*2,
    phase : Math.random()*Math.PI*2,
    speed : 0.02 + Math.random()*0.03,
    col : Math.random()>0.5 ? CYAN : MAG,
  }));
  function drawGlitch(){
    GLITCH.forEach(g=>{
      const life = Math.abs(Math.sin(t*g.speed + g.phase));
      if(life < 0.7) return;
      sv();
      ctx.globalAlpha = (life-0.7)*3.3 * 0.7;
      ctx.fillStyle = g.col;
      ctx.shadowColor = g.col;
      ctx.shadowBlur = 4;
      const shift = (life>0.92) ? (Math.random()-0.5)*6 : 0; /* jitter */
      ctx.fillRect(g.x+shift, g.y, g.w, g.h);
      rs();
    });
  }

  /* ═══ CREATURES ═══ */

  function drawCyberSkull(){
    sv();
    const sx=80, sy=10;
    fill(DARK,8,1);
    ctx.beginPath(); ctx.arc(sx,sy,11,0,Math.PI*2); ctx.fill();
    /* angular jaw */
    fill(D2,5,1);
    ctx.beginPath();
    ctx.moveTo(sx-8,sy+6);
    ctx.lineTo(sx-9,sy+14);
    ctx.lineTo(sx-4,sy+17);
    ctx.lineTo(sx,sy+18);
    ctx.lineTo(sx+4,sy+17);
    ctx.lineTo(sx+9,sy+14);
    ctx.lineTo(sx+8,sy+6);
    ctx.closePath(); ctx.fill();
    /* LED teeth */
    fill(CYAN,3,0.9);
    [-5,-1.5,2,5.5].forEach(ox=>{
      ctx.fillRect(sx+ox-0.6,sy+11,1.2,4);
    });
    fill(MAG,3,0.6);
    ctx.beginPath(); ctx.arc(sx-3,sy+15,1.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx+4,sy+15,1.2,0,Math.PI*2); ctx.fill();
    /* eyes */
    cyberEye(sx-5,sy-1,3.5,BLINK.skull,DARK);
    cyberEye(sx+5,sy-1,3.5,BLINK.skull,DARK);
    /* circuit cracks */
    sv(); stk(CYAN,0.7,5,0.65);
    ctx.beginPath(); ctx.moveTo(sx,sy-9); ctx.lineTo(sx-2,sy-4); ctx.lineTo(sx+1,sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx+6,sy-7); ctx.lineTo(sx+4,sy-3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx-5,sy-6); ctx.lineTo(sx-3,sy-2); ctx.stroke();
    rs();
    /* connect left */
    fill(D2,5,1);
    ctx.beginPath();
    ctx.moveTo(sx-10,sy+2);
    ctx.bezierCurveTo(sx-22,sy,sx-30,sy+8,sx-28,sy+18);
    ctx.bezierCurveTo(sx-24,sy+14,sx-18,sy+10,sx-10,sy+10);
    ctx.fill();
    /* connect right */
    fill(D2,5,1);
    ctx.beginPath();
    ctx.moveTo(sx+10,sy+2);
    ctx.bezierCurveTo(sx+22,sy,sx+30,sy+8,sx+28,sy+18);
    ctx.bezierCurveTo(sx+24,sy+14,sx+18,sy+10,sx+10,sy+10);
    ctx.fill();
    rs();
  }

  function drawHoloGhost(){
    sv();
    const gx=136, gy=76;
    const glitchOff = (Math.sin(t*0.35)>0.92) ? (Math.random()-0.5)*5 : 0; /* hologram flicker */
    sv();
    ctx.translate(glitchOff, 0);
    fill(D2,8,0.75);
    ctx.beginPath();
    ctx.moveTo(gx-8,gy-18);
    ctx.bezierCurveTo(gx+6,gy-22,gx+16,gy-12,gx+14,gy+2);
    ctx.bezierCurveTo(gx+14,gy+14,gx+8,gy+22,gx,gy+20);
    ctx.bezierCurveTo(gx-10,gy+20,gx-16,gy+12,gx-14,gy);
    ctx.bezierCurveTo(gx-14,gy-10,gx-8,gy-18,gx-8,gy-18);
    ctx.fill();
    /* tail pixels */
    fill(CYAN,4,0.5);
    ctx.fillRect(gx-6,gy+20,2,2);
    ctx.fillRect(gx-2,gy+23,2,2);
    ctx.fillRect(gx+3,gy+21,2,2);
    /* visor */
    fill(CYAN,6,0.85);
    ctx.fillRect(gx-7,gy-4,14,5);
    fill(MAG,3,0.9);
    ctx.beginPath(); ctx.arc(gx,gy-1.5,2,0,Math.PI*2); ctx.fill();
    /* scanline over visor */
    const bv = blinkVal(BLINK.ghost);
    if(bv > 0.02){
      ctx.fillStyle = DARK;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(gx-8, gy-5, 16, 7*bv);
    }
    rs();
    rs();
  }

  function drawDrone(){
    sv();
    const dx=118, dy=118;
    fill(DARK,7,1);
    ctx.beginPath();
    ctx.moveTo(dx,dy-10);
    ctx.bezierCurveTo(dx+10,dy-12,dx+16,dy-4,dx+14,dy+6);
    ctx.bezierCurveTo(dx+12,dy+14,dx+6,dy+16,dx,dy+14);
    ctx.bezierCurveTo(dx-7,dy+14,dx-12,dy+7,dx-10,dy);
    ctx.bezierCurveTo(dx-8,dy-7,dx-3,dy-10,dx,dy-10);
    ctx.fill();
    /* antenna */
    stk(CYAN,0.8,3,0.7);
    ctx.beginPath(); ctx.moveTo(dx,dy-10); ctx.lineTo(dx,dy-18); ctx.stroke();
    fill(MAG,4,0.9);
    ctx.beginPath(); ctx.arc(dx,dy-18,1.5,0,Math.PI*2); ctx.fill();
    /* propeller */
    const propA = t*0.25;
    sv();
    ctx.translate(dx,dy-10);
    ctx.rotate(propA);
    fill('#444',0,0.6);
    ctx.fillRect(-8,-0.5,16,1);
    ctx.fillRect(-0.5,-8,1,16);
    rs();
    sensorEye(dx-4,dy,3.5,BLINK.drone,DARK);
    sensorEye(dx+4,dy-2,3.5,BLINK.drone,DARK);
    /* mouth grill */
    stk(CYAN,0.6,3,0.5);
    ctx.beginPath(); ctx.moveTo(dx-4,dy+8); ctx.lineTo(dx+4,dy+8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx-3,dy+10); ctx.lineTo(dx+3,dy+10); ctx.stroke();
    rs();
  }

  function drawVirusBlob(){
    sv();
    const bx=75, by=140;
    const pulse = 1 + 0.06*Math.sin(t*0.06);
    fill(DARK,8,1);
    ctx.beginPath();
    ctx.moveTo(60* pulse,140);
    ctx.bezierCurveTo(50*pulse,148,40*pulse,146,38*pulse,136);
    ctx.bezierCurveTo(36*pulse,126,46*pulse,120,56*pulse,124);
    ctx.bezierCurveTo(60*pulse,116,70*pulse,114,76*pulse,118);
    ctx.bezierCurveTo(84*pulse,114,92*pulse,116,94*pulse,124);
    ctx.bezierCurveTo(102*pulse,120,112*pulse,126,110*pulse,136);
    ctx.bezierCurveTo(108*pulse,146,98*pulse,148,90*pulse,140);
    ctx.bezierCurveTo(82*pulse,148,72*pulse,150,66*pulse,144);
    ctx.bezierCurveTo(64*pulse,148,60*pulse,148,60*pulse,140);
    ctx.fill();
    /* circuit veins */
    sv(); stk(CYAN,0.5,4,0.45);
    ctx.beginPath(); ctx.moveTo(bx-10,by-6); ctx.lineTo(bx-4,by); ctx.lineTo(bx+6,by-4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx-6,by+4); ctx.lineTo(bx+2,by+8); ctx.lineTo(bx+10,by+2); ctx.stroke();
    rs();
    /* eyes */
    const bl2 = { ...BLINK.virus, phase: BLINK.virus.phase + 35 };
    cyberEye(67,128,5,BLINK.virus,DARK);
    cyberEye(83,128,5,bl2,DARK);
    /* core mouth */
    fill(MAG,4,0.7);
    ctx.beginPath(); ctx.arc(bx,by+10,3,0,Math.PI*2); ctx.fill();
    fill(CYAN,3,0.9);
    ctx.beginPath(); ctx.arc(bx,by+10,1.5,0,Math.PI*2); ctx.fill();
    rs();
  }

  function drawCyberWing(){
    sv();
    const wx=24, wy=80;
    fill(D2,6,1);
    ctx.beginPath();
    ctx.moveTo(24,80);
    ctx.bezierCurveTo(8,70,4,54,12,42);
    ctx.bezierCurveTo(18,32,28,30,34,38);
    ctx.bezierCurveTo(28,46,24,60,28,72);
    ctx.fill();
    /* neon edge lines */
    sv(); stk(CYAN,0.9,5,0.7);
    ctx.beginPath(); ctx.moveTo(12,42); ctx.lineTo(28,72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16,36); ctx.lineTo(30,54); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20,32); ctx.lineTo(32,50); ctx.stroke();
    rs();
    /* mechanical joints */
    fill(DARK,4,1);
    [[6,48],[4,60],[6,72]].forEach(([x,y])=>{
      ctx.beginPath();
      ctx.moveTo(x,y); ctx.lineTo(x-4,y-6); ctx.lineTo(x-4,y+6); ctx.closePath(); ctx.fill();
    });
    fill(DARK,8,1);
    ctx.beginPath();
    ctx.moveTo(26,70);
    ctx.bezierCurveTo(20,60,22,46,30,42);
    ctx.bezierCurveTo(38,38,46,44,46,54);
    ctx.bezierCurveTo(46,64,40,72,32,74);
    ctx.bezierCurveTo(28,74,26,72,26,70);
    ctx.fill();
    cyberEye(36,56,5.5,BLINK.wing,DARK);
    sensorEye(26,64,3,BLINK.wing,DARK);
    /* upper wing segment */
    fill(D2,5,1);
    ctx.beginPath();
    ctx.moveTo(34,38);
    ctx.bezierCurveTo(36,26,48,18,58,20);
    ctx.bezierCurveTo(52,24,44,30,40,38);
    ctx.fill();
    stk(CYAN,0.6,4,0.6);
    ctx.beginPath(); ctx.moveTo(36,28); ctx.lineTo(48,22); ctx.stroke();
    rs();
  }

  function drawAICore(){
    sv();
    const bv  = blinkVal(BLINK.core);
    const px  = 0.9 + 0.1*Math.sin(t*0.05);
    const ex=120, ey=28;

    /* outer rotating rings */
    sv(); ctx.translate(ex,ey);
    const r1 = t*0.03, r2 = -t*0.02;
    stk(CYAN,0.6,6,0.35);
    ctx.beginPath();
    ctx.ellipse(0,0,14*px,5*px,r1,0,Math.PI*2); ctx.stroke();
    stk(MAG,0.6,6,0.35);
    ctx.beginPath();
    ctx.ellipse(0,0,14*px,5*px,r2,0,Math.PI*2); ctx.stroke();
    rs();

    /* core glow */
    fill(CYAN, 16, 0.45);
    ctx.beginPath(); ctx.arc(ex,ey,11*px,0,Math.PI*2); ctx.fill();

    fill(WH, 0, 0.92);
    ctx.beginPath(); ctx.arc(ex,ey,8*px,0,Math.PI*2); ctx.fill();

    fill(CYAN, 7, 0.9);
    ctx.beginPath(); ctx.arc(ex,ey,5*px,0,Math.PI*2); ctx.fill();

    /* hex pupil */
    fill(BLK,0,1);
    const h = 3.5*px * (bv>0.05 ? 1-bv*0.8 : 1);
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const a = i*Math.PI/3 - Math.PI/2;
      const hx = ex + Math.cos(a)*1.6*px;
      const hy = ey + Math.sin(a)*h;
      if(i===0) ctx.moveTo(hx,hy); else ctx.lineTo(hx,hy);
    }
    ctx.closePath(); ctx.fill();

    /* highlight */
    fill(WH,0,0.88);
    ctx.beginPath(); ctx.arc(ex-2.5,ey-2.5,2,0,Math.PI*2); ctx.fill();

    /* digital shutter blink */
    if(bv > 0.02){
      sv();
      ctx.beginPath(); ctx.arc(ex,ey,9*px,0,Math.PI*2);
      ctx.clip();
      const gap = 9*px*bv;
      ctx.fillStyle=DARK; ctx.shadowBlur=0; ctx.globalAlpha=0.95;
      ctx.fillRect(ex-11,ey-11,22,gap);
      ctx.fillRect(ex-11,ey+11-gap,22,gap);
      ctx.strokeStyle=CYAN; ctx.lineWidth=0.8; ctx.shadowColor=CYAN;
      ctx.shadowBlur=4; ctx.globalAlpha=0.7;
      ctx.beginPath(); ctx.moveTo(ex-10,ey-gap); ctx.lineTo(ex+10,ey-gap); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex-10,ey+gap); ctx.lineTo(ex+10,ey+gap); ctx.stroke();
      rs();
    }

    /* data cable */
    sv(); stk(CYAN,0.9,3,0.6);
    ctx.beginPath(); ctx.moveTo(ex,ey+10*px); ctx.lineTo(ex+1,ey+20); ctx.stroke();
    rs();
    /* pulsing data packet */
    const pkt = (t % 40)/40;
    fill(MAG, 6, 0.85);
    ctx.beginPath(); ctx.arc(ex+1, ey+10*px + 10*pkt, 1.8, 0, Math.PI*2); ctx.fill();

    rs();
  }

  /* ── DATA STREAMS along ring ── */
  const STREAMS = Array.from({length:8},(_,i)=>({
    a : (i/8)*Math.PI*2,
    r : INNER + 1,
    speed : 0.008 + Math.random()*0.008,
    col : Math.random()>0.5 ? CYAN : MAG,
  }));
  function drawStreams(){
    STREAMS.forEach(s=>{
      s.a += s.speed;
      const [x,y] = p2c(s.a, s.r);
      sv();
      fill(s.col, 5, 0.6 + 0.4*Math.sin(t*0.1));
      ctx.fillRect(x-1,y-1,2.5,2.5);
      rs();
    });
  }

  /* ── CIRCUIT RING GLOW ── */
  function drawRingGlow(){
    sv();
    const atm = ctx.createRadialGradient(CX,CY,INNER-6,CX,CY,82);
    atm.addColorStop(0,   'rgba(0,200,255,0.10)');
    atm.addColorStop(0.55,'rgba(200,0,255,0.16)');
    atm.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(CX,CY,82,0,Math.PI*2);
    ctx.fillStyle=atm; ctx.globalAlpha=1; ctx.fill();

    /* circuit trace ring */
    stk(CYAN, 0.8, 4, 0.25 + 0.1*Math.sin(t*0.04));
    ctx.beginPath(); ctx.arc(CX,CY,INNER-2,0,Math.PI*2); ctx.stroke();
    stk(MAG, 0.5, 3, 0.2);
    ctx.beginPath(); ctx.arc(CX,CY,INNER+1,0,Math.PI*2); ctx.stroke();
    rs();
  }

  /* ══ MAIN LOOP ══ */
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;

    gGlow = 0.82 + 0.18*Math.sin(t*0.025);

    drawRingGlow();
    drawMatrixRain();
    drawCyberWing();
    drawCyberSkull();
    drawAICore();
    drawHoloGhost();
    drawDrone();
    drawVirusBlob();
    drawStreams();
    drawGlitch();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }

  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
