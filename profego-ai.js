(()=>{
const originalGenerate=window.generate;
function val(id){return document.getElementById(id)?.value||''}
function text(id){const e=document.getElementById(id);return e?.options?.[e.selectedIndex]?.text||e?.value||''}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function normalize(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function words(s){return new Set(normalize(s).split(' ').filter(w=>w.length>3))}
function similarity(a,b){const A=words(a),B=words(b);if(!A.size||!B.size)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++});return i/Math.max(A.size,B.size)}
function signature(g){return normalize((g?.name||'')+' '+(g?.description||''))}
function history(){try{return JSON.parse(localStorage.getItem('profego-ai-history-v2')||'[]')}catch{return[]}}
function legacy(){try{return JSON.parse(localStorage.getItem('profego-ai-history')||'[]').map(x=>({name:x,signature:normalize(x)}))}catch{return[]}}
function allHistory(){return [...legacy(),...history()].slice(-240)}
function saveHistory(games){try{const entries=games.filter(Boolean).map(g=>({name:g.name||'',signature:signature(g)}));localStorage.setItem('profego-ai-history-v2',JSON.stringify([...history(),...entries].slice(-240)))}catch{}}
function materials(){try{return JSON.parse(localStorage.getItem('profego-resources')||'[]').map(x=>x.name||x.nombre||x).filter(Boolean).slice(0,30)}catch{return[]}}
function visual(g,i){
 const t=normalize((g?.name||'')+' '+(g?.description||''));
 let pose='🏃',label='Movimiento';
 if(/basquet|dribl|pique|botar/.test(t))pose='⛹️';
 else if(/futbol|pate|gol|pelota con.*pie/.test(t))pose='⚽';
 else if(/voley|volei|saque|remate/.test(t))pose='🏐';
 else if(/handball|lanz|pase|recib/.test(t))pose='🤾';
 else if(/aro|salto|saltar/.test(t))pose='🦘';
 else if(/equilibr|banco|linea/.test(t))pose='🤸';
 else if(/persec|atrap|correr|carrera|relevo/.test(t))pose='🏃';
 else if(/cooper|equipo|pareja/.test(t))pose='🧒🧒';
 else if(/relaj|calma|estir/.test(t))pose='🧘';
 else if(/raqueta|tenis/.test(t))pose='🎾';
 const kid=['🧒🏻','👧🏻','🧒🏼'][i%3];
 return `<div class="pg-visual"><span class="pg-kid">${kid}</span><span class="pg-action">${pose}</span><span class="pg-ground"></span></div>`;
}
function ensureVisualStyles(){
 if(document.getElementById('pg-ai-visual-styles'))return;
 const s=document.createElement('style');s.id='pg-ai-visual-styles';s.textContent=`
 .game{overflow:hidden}.pg-visual{height:128px;margin:8px 10px 10px;border-radius:18px;background:linear-gradient(145deg,#f2f8ff,#fff7ef);position:relative;display:flex;align-items:center;justify-content:center;gap:8px;font-size:55px;box-shadow:inset 0 0 0 1px rgba(20,80,140,.08)}
 .pg-kid{filter:drop-shadow(0 5px 4px rgba(0,0,0,.12));transform:rotate(-5deg)}.pg-action{font-size:48px;filter:drop-shadow(0 4px 3px rgba(0,0,0,.1))}.pg-ground{position:absolute;bottom:15px;width:68%;height:7px;border-radius:50%;background:rgba(30,110,180,.12)}
 @media(max-width:700px){.pg-visual{height:112px;font-size:49px}.pg-action{font-size:43px}}
 `;document.head.appendChild(s);
}
function duplicates(plan){
 const old=allHistory(), seen=[];
 const bad=[];
 (plan.classes||[]).forEach(c=>(c.games||[]).forEach(g=>{
   const sig=signature(g);
   if(seen.some(x=>similarity(sig,x)>.72)||old.some(x=>similarity(sig,x.signature||x.name)>.72)) bad.push(g.name);
   seen.push(sig);
 }));
 return bad;
}
function render(plan){
 ensureVisualStyles();
 const group=val('group'),sport=val('sport');
 document.getElementById('meta').textContent=`${plan.classes.length} clases · IA`;
 document.getElementById('sideGoal').textContent=val('goal');
 document.getElementById('classes').innerHTML=plan.classes.map((cl,ci)=>{
   const games=(cl.games||[]).slice(0,6);
   return `<div class="classbox"><div class="class-title">CLASE ${ci+1} · ${esc(cl.stage||'Desarrollo')} · ${esc(group)}${sport?' · '+esc(sport):''}</div><div style="padding:10px 12px;font-size:12px;font-weight:700;color:#1677ff">Meta: ${esc(cl.goal||'')}</div><div class="games">${games.map((g,i)=>`<article class="game" data-sport="${esc(sport)}"><h4>${i+1} · ${esc(g.name)}</h4>${visual(g,i)}<p>${esc(g.description)}</p><div class="actions"><button onclick="suggest(this,${ci+1},${i})">↻ Sugerir otro</button><button class="edit" onclick="editGame(this)">✎ Editar</button><button class="choose" onclick="openActivityPicker(this)">🎲 Elegir del banco</button></div></article>`).join('')}</div></div>`
 }).join('');
 saveHistory(plan.classes.flatMap(c=>c.games||[]));
}
async function requestPlan(body){
 const r=await fetch('/api/generate-plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await r.json();
 if(!r.ok){if(data.error==='IA_NO_CONFIGURADA')throw new Error('IA_NO_CONFIGURADA');throw new Error(data.error||'Error')}
 return data;
}
window.generate=async function(){
 const status=document.getElementById('generateStatus');
 const btn=document.querySelector('#new .setup button.save');
 if(btn){btn.disabled=true;btn.textContent='✨ Creando con IA...'}
 if(status){status.textContent='✨ ProfeGo IA está creando una planificación diferente...';status.className='status'}
 try{
   const base={group:val('group'),content:text('content'),sport:val('sport'),goal:val('goal'),count:+val('count')||10,materials:materials(),avoid:allHistory().map(x=>x.name).filter(Boolean),avoidSignatures:allHistory().map(x=>x.signature).filter(Boolean)};
   let data=await requestPlan(base), bad=duplicates(data);
   if(bad.length){data=await requestPlan({...base,retry:true,rejected:bad});bad=duplicates(data)}
   render(data);
   if(status){status.textContent=bad.length?'✓ Planificación generada con máxima variedad disponible':'✓ Planificación nueva verificada por ProfeGo IA';status.className='status'}
 }catch(e){
   console.warn('ProfeGo IA fallback',e);
   if(status)status.textContent=e.message==='IA_NO_CONFIGURADA'?'IA lista en la app: falta activar la clave del servidor. Usando generador actual por ahora.':'No se pudo conectar con la IA. Usando generador actual.';
   if(originalGenerate)originalGenerate();
 }finally{if(btn){btn.disabled=false;btn.textContent='Generar planificación'}}
};
})();