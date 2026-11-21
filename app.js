const $ = (s) => document.querySelector(s);
$('#year').textContent = new Date().getFullYear();
$('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

const projectGrid = $('#projectGrid');
function projectCard(p) {
  const tags = p.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('');
  const link = p.link ? `<a class="project-link" href="${escapeAttr(p.link)}" target="_blank" rel="noreferrer">Explore project ↗</a>` : `<span class="project-link">${escapeHtml(p.status)}</span>`;
  return `<article class="project glass tilt reveal"><div class="project-visual ${escapeAttr(p.accent)}-visual"><div class="visual-number">${escapeHtml(p.number)} / ${escapeHtml(p.type)}</div>${p.accent==='car'?'<div class="car-shape"><div class="car-wheel wheel-a"></div><div class="car-wheel wheel-b"></div></div>':p.accent==='robot'?'<div class="robot-scene"><div class="robot-body"><i></i><i></i><span></span></div><div class="sensor-line"></div><div class="track-line"></div></div>':'<div class="sign-symbol">✋</div>'}<span class="visual-word">${escapeHtml(p.type)}</span></div><div class="project-body"><div class="project-meta"><span>${escapeHtml(p.category)}</span><span>${escapeHtml(p.number)}</span></div><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p><div class="chips">${tags}</div>${link}</div></article>`;
}
function escapeHtml(v='') { return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(v='') { return escapeHtml(v); }
async function loadProjects() {
  try { const r=await fetch('/api/projects'); if(!r.ok) throw new Error('API unavailable'); const data=await r.json(); projectGrid.innerHTML=data.projects.map(projectCard).join(''); activateEffects(); }
  catch { projectGrid.innerHTML='<div class="loading glass">Projects could not be loaded. Please refresh when the server is running.</div>'; }
}

const form=$('#contactForm');
form.addEventListener('submit', async e => {
  e.preventDefault(); const button=$('#sendBtn'), status=$('#formStatus'); button.disabled=true; button.textContent='Sending…'; status.textContent='';
  const payload=Object.fromEntries(new FormData(form).entries());
  try { const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); const result=await r.json(); if(!r.ok) throw new Error(result.message||'Could not send message.'); status.textContent=result.message; form.reset(); }
  catch(err) { status.textContent=err.message||'Could not send message. Please try again.'; status.style.color='#ffaaa8'; }
  finally { button.disabled=false; button.textContent='Send message ↗'; }
});

function activateEffects() {
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(800px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
}
activateEffects(); loadProjects();
const orb=$('#glassOrb'); $('#heroVisual').addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;orb.style.transform=`rotateX(${-y*16}deg) rotateY(${x*20}deg)`}); $('#heroVisual').addEventListener('pointerleave',()=>orb.style.transform='');
// Lightweight ambient particles, disabled for reduced-motion preferences.
const canvas=$('#particles'),ctx=canvas.getContext('2d');let dots=[];function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);dots=Array.from({length:Math.min(65,Math.floor(innerWidth/20))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.3,v:Math.random()*.18+.04}))}function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);dots.forEach(d=>{d.y-=d.v;if(d.y<0)d.y=innerHeight;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(180,190,255,.42)';ctx.fill()});requestAnimationFrame(draw)}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){resize();addEventListener('resize',resize);draw()}
