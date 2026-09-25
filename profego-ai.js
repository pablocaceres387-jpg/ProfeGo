(()=>{
const originalGenerate=window.generate;
function val(id){return document.getElementById(id)?.value||''}
function text(id){const e=document.getElementById(id);return e?.options?.[e.selectedIndex]?.text||e?.value||''}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function history(){try{return JSON.parse(localStorage.getItem('profego-ai-history')||'[]')}catch{return[]}}
function saveHistory(names){try{const h=[...history(),...names].slice(-160);localStorage.setItem('profego-ai-history',JSON.stringify(h))}catch{}}
function materials(){try{return JSON.parse(localStorage.getItem('profego-resources')||'[]').map(x=>x.name||x.nombre||x).filter(Boolean).slice(0,30)}catch{return[]}}
function icon(){const s=val('sport');return {'Básquetbol':'🏀','Fútbol':'⚽','Handball':'🤾','Vóley':'🏐','Deportes con raqueta':'🎾'}[s]||'🏃'}
function render(plan){
 const group=val('group'),sport=val('sport'),content=text('content');
 document.getElementById('meta').textContent=`${plan.classes.length} clases · IA`;
 document.getElementById('sideGoal').textContent=val('goal');
 document.getElementById('classes').innerHTML=plan.classes.map((cl,ci)=>{
   const games=(cl.games||[]).slice(0,6);
   return `<div class="classbox"><div class="class-title">CLASE ${ci+1} · ${esc(cl.stage||'Desarrollo')} · ${esc(group)}${sport?' · '+esc(sport):''}</div><div style="padding:10px 12px;font-size:12px;font-weight:700;color:#1677ff">Meta: ${esc(cl.goal||'')}</div><div class="games">${games.map((g,i)=>`<article class="game" data-sport="${esc(sport)}"><h4>${i+1} · ${esc(g.name)}</h4><div class="scene">${icon()}</div><p>${esc(g.description)}</p><div class="actions"><button onclick="suggest(this,${ci+1},${i})">↻ Sugerir otro</button><button class="edit" onclick="editGame(this)">✎ Editar</button><button class="choose" onclick="openActivityPicker(this)">🎲 Elegir del banco</button></div></article>`).join('')}</div></div>`
 }).join('');
 saveHistory(plan.classes.flatMap(c=>(c.games||[]).map(g=>g.name)).filter(Boolean));
}
window.generate=async function(){
 const status=document.getElementById('generateStatus');
 const btn=document.querySelector('#new .setup button.save');
 if(btn){btn.disabled=true;btn.textContent='✨ Creando con IA...'}
 if(status){status.textContent='✨ ProfeGo IA está creando una planificación diferente...';status.className='status'}
 try{
   const body={group:val('group'),content:text('content'),sport:val('sport'),goal:val('goal'),count:+val('count')||10,materials:materials(),avoid:history()};
   const r=await fetch('/api/generate-plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
   const data=await r.json();
   if(!r.ok){
     if(data.error==='IA_NO_CONFIGURADA') throw new Error('IA_NO_CONFIGURADA');
     throw new Error(data.error||'Error');
   }
   render(data);
   if(status){status.textContent='✓ Planificación única generada con ProfeGo IA';status.className='status'}
 }catch(e){
   console.warn('ProfeGo IA fallback',e);
   if(status)status.textContent=e.message==='IA_NO_CONFIGURADA'?'IA lista en la app: falta activar la clave del servidor. Usando generador actual por ahora.':'No se pudo conectar con la IA. Usando generador actual.';
   if(originalGenerate) originalGenerate();
 }finally{
   if(btn){btn.disabled=false;btn.textContent='Generar planificación'}
 }
};
})();