(()=>{
const style=document.createElement('style');
style.textContent=`
#classes .games{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;padding:12px!important}
#classes .game{display:flex!important;flex-direction:column!important;min-width:0!important;overflow:hidden!important;position:relative!important}
#classes .game .scene{order:1!important;height:108px!important;min-height:108px!important;position:static!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#eaf7ff!important}
#classes .game .scene svg{width:100%!important;height:100%!important;display:block!important}
#classes .game h4{order:2!important;margin:0!important;padding:9px 10px 4px!important;font-size:12px!important;line-height:1.3!important;background:var(--card)!important;position:static!important;color:var(--ink)!important;min-height:auto!important;z-index:auto!important}
#classes .game p{order:3!important;margin:0!important;padding:5px 10px 9px!important;font-size:10.5px!important;line-height:1.4!important;min-height:58px!important;background:var(--card)!important;color:var(--muted)!important;position:static!important;overflow:visible!important}
#classes .game .actions{order:4!important;padding:0 9px 9px!important;margin-top:auto!important;background:var(--card)!important}
#classes .game::before{content:'JUEGO ' attr(data-game-number);display:block;order:0;padding:6px 10px;background:#0b4f9c;color:white;font-size:10px;font-weight:900;letter-spacing:.05em}
@media(max-width:760px){#classes .games{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;padding:8px!important}#classes .game .scene{height:86px!important;min-height:86px!important}#classes .game h4{font-size:10.5px!important;padding:7px 7px 3px!important}#classes .game p{font-size:9.5px!important;padding:4px 7px 7px!important;min-height:66px!important}#classes .game .actions{grid-template-columns:1fr!important;padding:0 7px 7px!important}#classes .game .actions .choose{grid-column:auto!important}#classes .game::before{font-size:9px;padding:5px 7px}}
`;
document.head.appendChild(style);

function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function activityType(name,desc=''){const t=norm(name+' '+desc);if(/dribl|pique|botar|basquet/.test(t))return'dribble';if(/pase|recib/.test(t))return'pass';if(/lanz|aro|encest/.test(t))return'throw';if(/salto|saltar|valla/.test(t))return'jump';if(/equilibr|linea|banco/.test(t))return'balance';if(/persec|atrap|carrera|relevo|correr/.test(t))return'run';if(/futbol|pate|gol/.test(t))return'football';if(/voley|volei|saque|remate/.test(t))return'volley';if(/cooper|pareja|equipo|espejo/.test(t))return'pair';if(/estatua|postura|cuerpo|corporal/.test(t))return'body';if(/calma|relaj|estir/.test(t))return'calm';return'move'}
function kid(x,y,c='#2788ed',girl=false,flip=false){return `<g transform="translate(${x} ${y}) scale(${flip?-1:1} 1)"><ellipse cy="43" rx="25" ry="5" fill="#234" opacity=".12"/><circle cy="-31" r="18" fill="#f1b37d"/>${girl?'<path d="M-17-39q17-19 34 1v10q-17-11-34 0z" fill="#71391f"/><circle cx="19" cy="-39" r="8" fill="#71391f"/>':'<path d="M-17-39q5-18 13-7q8-14 13 1q10-8 9 9q-17-8-35 2z" fill="#71391f"/>'}<circle cx="-6" cy="-31" r="2.3" fill="#2d241f"/><circle cx="6" cy="-31" r="2.3" fill="#2d241f"/><path d="M-5-23q5 5 10 0" stroke="#a85548" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="-16" y="-10" width="32" height="35" rx="12" fill="white" stroke="${c}" stroke-width="4"/><path d="M-10 24l-13 24M10 24l15 23M-13-4l-19 14M13-4l20 12" stroke="#f1b37d" stroke-width="8" stroke-linecap="round"/><path d="M-25 49h15M20 48h15" stroke="${c}" stroke-width="8" stroke-linecap="round"/></g>`}
function svgFor(name,desc){const type=activityType(name,desc),ball=(x,y,c='#ef7d18')=>`<circle cx="${x}" cy="${y}" r="13" fill="${c}" stroke="#93480d" stroke-width="2"/>`,cone=(x,y)=>`<path d="M${x-10} ${y}h20l-6-27h-8z" fill="#ff6b19"/>`,hoop=(x,y,c)=>`<ellipse cx="${x}" cy="${y}" rx="30" ry="9" fill="none" stroke="${c}" stroke-width="6"/>`;let b='';
if(type==='dribble')b=kid(115,92,'#20a06b')+ball(190,120)+cone(235,141)+cone(280,141);
else if(type==='pass')b=kid(85,92,'#2788ed')+kid(245,92,'#ed4e88',true,true)+ball(165,92);
else if(type==='throw')b=kid(105,92,'#20a06b')+ball(188,50)+'<rect x="246" y="35" width="46" height="29" rx="3" fill="#fff" stroke="#e44" stroke-width="3"/><path d="M269 64v39" stroke="#555" stroke-width="4"/><path d="M255 65q14 25 28 0" fill="none" stroke="#ddd" stroke-width="3"/>';
else if(type==='jump')b=kid(130,72,'#ed4e88',true)+hoop(90,139,'#2d8cf0')+hoop(165,139,'#f04e88')+hoop(240,139,'#25b56d');
else if(type==='balance')b=kid(160,73,'#2788ed')+'<rect x="70" y="127" width="180" height="10" rx="5" fill="#a86b35"/>';
else if(type==='run')b=kid(72,92,'#2788ed')+kid(165,92,'#ed4e88',true)+kid(258,92,'#20a06b')+cone(120,141)+cone(215,141);
else if(type==='football')b=kid(120,92,'#2788ed')+ball(200,130,'#fff')+cone(255,141);
else if(type==='volley')b=kid(75,92,'#ed4e88',true)+kid(255,92,'#2788ed',false,true)+'<path d="M165 48v90" stroke="#526b7a" stroke-width="4"/><path d="M100 70h130" stroke="#526b7a" stroke-width="3"/>'+ball(165,43,'#fff');
else if(type==='pair')b=kid(95,92,'#2788ed')+kid(235,92,'#ed4e88',true,true)+'<path d="M125 55q40-25 80 0" fill="none" stroke="#7c4ce0" stroke-width="3" stroke-dasharray="6 5"/>';
else if(type==='body')b=kid(75,92,'#2788ed')+kid(165,92,'#ed4e88',true)+kid(255,92,'#20a06b');
else if(type==='calm')b=kid(160,99,'#20a06b')+'<rect x="92" y="135" width="136" height="9" rx="5" fill="#4da8ef"/>';
else b=kid(75,92,'#2788ed')+kid(165,92,'#ed4e88',true)+kid(255,92,'#20a06b');
return `<svg viewBox="0 0 330 155" aria-hidden="true"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#dff4ff"/><stop offset="1" stop-color="#fff8ef"/></linearGradient></defs><rect width="330" height="155" fill="url(#sky)"/><rect y="112" width="330" height="43" fill="#edc77d"/><path d="M0 136H330" stroke="#fff7df" stroke-width="3"/>${b}</svg>`}
function gameName(card){return (card.querySelector('h4')?.textContent||'').replace(/^\s*\d+\s*·\s*/,'').replace(/^Juego\s+\d+\s*·\s*/i,'').trim()}
function renderCard(card,index){if(!card)return;card.dataset.gameNumber=String(index+1);const scene=card.querySelector('.scene');if(scene)scene.innerHTML=svgFor(gameName(card),card.querySelector('p')?.textContent||'');const h=card.querySelector('h4');if(h){const name=gameName(card);h.textContent=name}}
function renderAll(){document.querySelectorAll('#classes .classbox').forEach(box=>{box.querySelectorAll('.game').forEach((card,i)=>renderCard(card,i))})}
let timer=0;const classes=document.getElementById('classes');if(classes){new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(renderAll,35)}).observe(classes,{childList:true,subtree:true})}
document.addEventListener('click',e=>{const btn=e.target.closest?.('.game .actions button');if(!btn)return;const text=(btn.textContent||'').toLowerCase();if(text.includes('sugerir'))setTimeout(()=>{const card=btn.closest('.game');const box=card?.closest('.classbox');const idx=box?[...box.querySelectorAll('.game')].indexOf(card):0;renderCard(card,Math.max(0,idx))},30);if(text.includes('elegir'))setTimeout(renderAll,80)},true);
renderAll();
})();