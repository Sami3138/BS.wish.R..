// Elements
const gate = document.getElementById('gate');
const form = document.getElementById('access');
const passInput = document.getElementById('pass');
const err = document.getElementById('err');
const main = document.getElementById('main');
const proposal = document.getElementById('proposal');
const confettiCanvas = document.getElementById('confetti');
const heartsRoot = document.querySelector('.hearts');
const celebrateBtn = document.getElementById('celebrate');
const musicBtn = document.getElementById('music');
const nameHover = document.getElementById('nameHover');
const nextBtn = document.getElementById('next');
const yesBtn = document.getElementById('yes');
const thinkingBtn = document.getElementById('thinking');
const proposalNote = document.getElementById('proposalNote');
const playRomanceBtn = document.getElementById('playRomance');
const svgHearts = () => document.getElementById('svgHearts');

// Sketchpad
const fab = document.getElementById('sketchToggle');
const sketch = document.getElementById('sketchPad');
const pad = document.getElementById('pad');
const closeSketch = document.getElementById('closeSketch');
const clearSketch = document.getElementById('clearSketch');

// Case-insensitive gate
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = (passInput.value || '').trim().toLowerCase();
  if (v === 'rafia') {
    err.textContent = '';
    unlock();
  } else {
    err.textContent = 'Oops! Type the correct secret name ♥';
    shake(gate);
    passInput.focus();
    passInput.select();
  }
});

function unlock(){
  gate.classList.remove('show');
  setTimeout(() => {
    gate.classList.add('hidden');
    main.classList.remove('hidden');
    requestAnimationFrame(()=> main.classList.add('show'));
    launchConfetti(200);
    spawnHearts(28); // continues while on page 2
  }, 260);
}

function shake(el){
  el.animate([
    {transform:'translateX(0)'},
    {transform:'translateX(-6px)'},
    {transform:'translateX(6px)'},
    {transform:'translateX(-6px)'},
    {transform:'translateX(0)'}
  ],{duration:380,easing:'ease'});
}

// Confetti (canvas)
const ctx = confettiCanvas.getContext('2d');
let pieces = [];
function launchConfetti(count=160){
  const w = confettiCanvas.width = window.innerWidth;
  const h = confettiCanvas.height = window.innerHeight;
  pieces = Array.from({length:count}).map(()=>({
    x: Math.random()*w,
    y: -20 - Math.random()*h*0.4,
    r: 4 + Math.random()*6,
    c: randomColor(),
    vx: -1.5 + Math.random()*3,
    vy: 2 + Math.random()*3,
    rot: Math.random()*Math.PI,
    vr: -0.05 + Math.random()*0.1,
  }));
  animateConfetti();
}
let confettiAnimating = false;
function animateConfetti(){
  if (confettiAnimating) return;
  confettiAnimating = true;
  const w = confettiCanvas.width = window.innerWidth;
  const h = confettiCanvas.height = window.innerHeight;
  (function frame(){
    ctx.clearRect(0,0,w,h);
    pieces.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      if (p.y>h+20){p.y=-20; p.x=Math.random()*w;}
      drawRect(p.x,p.y,p.r,p.rot,p.c);
    });
    if (pieces.length) requestAnimationFrame(frame); else confettiAnimating=false;
  })();
}
function drawRect(x,y,size,rot,color){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.fillStyle=color; ctx.fillRect(-size/2,-size/2,size,size*.6); ctx.restore();
}
function randomColor(){
  const palette=['#ff69b4','#a78bfa','#60a5fa','#53f3a4','#ffd166'];
  return palette[Math.floor(Math.random()*palette.length)];
}

// Floating hearts
function spawnHearts(n=20){
  const colors=['#ff6ea9','#9aaeff','#6cf1c6','#ffd166','#f486ff'];
  const frag=document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const h=document.createElement('div');
    h.className='heart';
    h.style.left = Math.random()*100 + 'vw';
    h.style.bottom = '-10vh';
    h.style.color = colors[i%colors.length];
    h.style.animationDuration = (10+Math.random()*8)+'s';
    h.style.animationDelay = (Math.random()*6)+'s';
    frag.appendChild(h);
  }
  heartsRoot.appendChild(frag);
}

// Sparkles on name hover
nameHover.addEventListener('mousemove', (e)=>{
  const rect = nameHover.getBoundingClientRect();
  const s = document.createElement('span');
  s.className='spark';
  s.style.left = (e.clientX - rect.left - 4)+'px';
  s.style.top = (e.clientY - rect.top - 4)+'px';
  nameHover.appendChild(s);
  s.animate([{opacity:1, transform:'scale(1)'},{opacity:0, transform:'scale(0)'}],{duration:500,easing:'ease-out'}).onfinish=()=>s.remove();
});

// Celebrate button
celebrateBtn.addEventListener('click',()=>{
  launchConfetti(200);
  spawnHearts(12);
});

// Next Surprise -> Proposal scene
nextBtn.addEventListener('click', ()=>{
  main.classList.remove('show');
  setTimeout(()=>{
    main.classList.add('hidden');
    proposal.classList.remove('hidden');
    requestAnimationFrame(()=> proposal.classList.add('show'));
    animateSVGHearts();
    heartStormStart();
  }, 260);
});

function animateSVGHearts(){
  const g = svgHearts();
  if (!g) return;
  for(let i=0;i<12;i++){
    const heart = document.createElementNS('http://www.w3.org/2000/svg','path');
    heart.setAttribute('d','M10 30 C10 15, 30 15, 30 30 C30 45, 10 55, 10 60 C10 55, -10 45, -10 30 C-10 15, 10 15, 10 30 Z');
    heart.setAttribute('fill', ['#ff6ea9','#f472b6','#fb7185','#facc15','#86efac'][i%5]);
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg','g');
    const x = 280 + Math.random()*40-20; const y = 190 + Math.random()*20-10;
    wrapper.setAttribute('transform', `translate(${x},${y}) scale(${0.6+Math.random()*0.6})`);
    wrapper.appendChild(heart); g.appendChild(wrapper);
    const total = 4000 + Math.random()*2000;
    const start = performance.now();
    const drift = Math.random()*60-30;
    (function step(t){
      const k = Math.min(1,(t-start)/total);
      const ty = y - k*120; const tx = x + k*drift;
      wrapper.setAttribute('transform', `translate(${tx},${ty}) scale(${0.6+Math.random()*0.6})`);
      if (k<1) requestAnimationFrame(step); else wrapper.remove();
    })(start);
  }
}

// Proposal interactions
yesBtn.addEventListener('click', ()=>{
  loveOverlay();
  launchConfetti(320);
  heartStormBurst(28);
});
thinkingBtn.addEventListener('click', ()=>{
  proposalNote.innerHTML = 'It’s okay, I’ll wait for you 💔';
  brokenHeart();
});
function brokenHeart(){
  const x = window.innerWidth/2, y = window.innerHeight/2;
  explodeAt(x,y,["#fb7185","#f43f5e","#ef4444"]);
}

// Romantic WebAudio tune
let romanceCtx;
playRomanceBtn.addEventListener('click', ()=>{
  romanceCtx = romanceCtx || new (window.AudioContext||window.webkitAudioContext)();
  const seq = [293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66];
  const now = romanceCtx.currentTime;
  seq.forEach((f,i)=> toneRomance(f, now + i*0.45, 0.38));
});
function toneRomance(freq, start, dur){
  const o = romanceCtx.createOscillator();
  const g = romanceCtx.createGain();
  o.type='triangle'; o.frequency.value=freq;
  o.connect(g); g.connect(romanceCtx.destination);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(0.16, start+0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, start+dur);
  o.start(start); o.stop(start+dur);
}

// Particle explosion for broken heart
function explodeAt(x, y, palette=['#fff','#ffd166','#f472b6']){
  const n = 28;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.position='fixed';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.width='8px'; s.style.height='8px'; s.style.borderRadius='50%';
    s.style.background = palette[i % palette.length];
    document.body.appendChild(s);
    const angle = (Math.PI * 2 * i) / n;
    const dist = 90 + Math.random() * 80;
    s.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0.6)`, opacity: 0 }
    ], { duration: 900 + Math.random()*400, easing: 'ease-out' }).onfinish = () => s.remove();
  }
}

// Sketchpad logic
let drawing=false, px=0, py=0; const ctxPad = pad.getContext('2d');
ctxPad.lineCap='round'; ctxPad.lineJoin='round'; ctxPad.lineWidth=4; ctxPad.strokeStyle='#ff69b4';
function resizePad(){
  const r = sketch.getBoundingClientRect();
  pad.width = Math.min(900, r.width - 24); pad.height = Math.min(540, r.height - 80);
}
window.addEventListener('resize', ()=> sketch.classList.contains('hidden')?null:resizePad());
fab.addEventListener('click', ()=>{
  sketch.classList.toggle('hidden');
  if (!sketch.classList.contains('hidden')){ resizePad(); }
});
closeSketch.addEventListener('click', ()=> sketch.classList.add('hidden'));
clearSketch.addEventListener('click', ()=>{ ctxPad.clearRect(0,0,pad.width,pad.height); });
pad.addEventListener('mousedown', e=>{ drawing=true; [px,py]=[e.offsetX,e.offsetY]; });
pad.addEventListener('mousemove', e=>{ if(!drawing) return; ctxPad.beginPath(); ctxPad.moveTo(px,py); ctxPad.lineTo(e.offsetX,e.offsetY); ctxPad.stroke(); [px,py]=[e.offsetX,e.offsetY]; });
window.addEventListener('mouseup', ()=> drawing=false);

// Simple WebAudio melody (no external file)
let audioCtx;
musicBtn.addEventListener('click', async ()=>{
  audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
  const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63];
  const now = audioCtx.currentTime;
  notes.forEach((f,i)=>tone(f, now + i*0.35, 0.3));
});
function tone(freq, start, dur){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type='sine'; o.frequency.value=freq;
  o.connect(g); g.connect(audioCtx.destination);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(0.18, start+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start+dur);
  o.start(start); o.stop(start+dur);
}

// Heart-storm animation around proposal
const stormRoot = document.createElement('div');
stormRoot.className = 'storm';
document.body.appendChild(stormRoot);
let stormTimer;
function heartStormStart(){
  clearInterval(stormTimer);
  stormTimer = setInterval(()=> heartStormBurst(12), 1200);
}
function heartStormBurst(n=16){
  const palette=['#ff6ea9','#f472b6','#fb7185','#facc15','#86efac'];
  for(let i=0;i<n;i++){
    const h=document.createElement('div'); h.className='storm-heart';
    h.style.color = palette[i%palette.length];
    const side = Math.floor(Math.random()*4); // 0 top,1 right,2 bottom,3 left
    const vw = window.innerWidth, vh = window.innerHeight;
    let x=0, y=0, dx=0, dy=0;
    if(side===0){ x=Math.random()*vw; y=-20; dx=(Math.random()*2-1)*40; dy=vh+60; }
    if(side===1){ x=vw+20; y=Math.random()*vh; dx=-(vw+60); dy=(Math.random()*2-1)*40; }
    if(side===2){ x=Math.random()*vw; y=vh+20; dx=(Math.random()*2-1)*40; dy=-(vh+60); }
    if(side===3){ x=-20; y=Math.random()*vh; dx=vw+60; dy=(Math.random()*2-1)*40; }
    h.style.left = x+'px'; h.style.top = y+'px';
    stormRoot.appendChild(h);
    h.animate([
      { transform:'translate(0,0) rotate(45deg)', opacity: .9 },
      { transform:`translate(${dx}px, ${dy}px) rotate(45deg)`, opacity: 0 }
    ],{ duration: 2400 + Math.random()*900, easing: 'ease-out' }).onfinish=()=> h.remove();
  }
}

// Full-screen love overlay
const love = document.createElement('div');
love.className = 'love-overlay';
love.innerHTML = '<div class="love-text">I LOVE YOU<br/>MY DIMPLE QUEEN</div>';
document.body.appendChild(love);
function loveOverlay(){ love.classList.add('show'); setTimeout(()=> love.classList.remove('show'), 3000); }

// Focus input on load
window.addEventListener('DOMContentLoaded', ()=> passInput?.focus());


