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

function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function svgFor(name){const n=hash(name||'juego')%8;const common=`<svg viewBox="0 0 320 150" aria-hidden="true"><defs><linearGradient id="g${n}" x2="0" y2="1"><stop stop-color="#c9efff"/><stop offset="1" stop-color="#f8fdff"/></linearGradient></defs><rect width="320" height="150" fill="url(#g${n})"/><rect y="96" width="320" height="54" fill="#efc77c"/><path d="M0 118H320" stroke="#fff7df" stroke-width="2"/>`;
const kid=(x,y,c)=>`<g transform="translate(${x} ${y})"><circle cy="-24" r="12" fill="#f2bb86"/><rect x="-11" y="-10" width="22" height="29" rx="8" fill="${c}"/><path d="M-7 18l-10 19M7 18l12 18M-9-3l-15 14M9-3l17 10" stroke="#f2bb86" stroke-width="6" stroke-linecap="round"/><path d="M-17 37h10M17 36h10" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`;
const ball=(x,y,c='#f58220')=>`<circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="#9b4b11" stroke-width="2"/>`;
const cone=(x,y)=>`<path d="M${x-8} ${y}h16l-5-22h-6z" fill="#ff6b19"/>`;
let body='';
if(n===0)body=`${kid(70,82,'#2287ef')}${kid(155,82,'#ef4f88')}${kid(245,82,'#20b86b')}${cone(115,130)}${cone(205,130)}`;
if(n===1)body=`${kid(90,82,'#8554ee')}${kid(230,82,'#20b86b')}${ball(160,63)}<path d="M160 56Q160 34 185 36" stroke="#1d73b8" stroke-width="3" fill="none"/>`;
if(n===2)body=`${kid(85,82,'#ff9621')}${ball(145,116)}${cone(185,131)}${cone(225,131)}${cone(265,131)}`;
if(n===3)body=`${kid(90,82,'#2287ef')}${kid(220,82,'#ef4f88')}${ball(155,112,'#fff')}<rect x="145" y="60" width="20" height="48" fill="none" stroke="#fff" stroke-width="3"/>`;
if(n===4)body=`${kid(62,82,'#20b86b')}${kid(128,82,'#2287ef')}${kid(194,82,'#ff9621')}${kid(260,82,'#8554ee')}${ball(160,114)}`;
if(n===5)body=`${kid(78,82,'#ef4f88')}${kid(160,82,'#2287ef')}${kid(242,82,'#20b86b')}<ellipse cx="78" cy="127" rx="24" ry="7" fill="none" stroke="#2c8cff" stroke-width="5"/><ellipse cx="160" cy="127" rx="24" ry="7" fill="none" stroke="#ff4f88" stroke-width="5"/><ellipse cx="242" cy="127" rx="24" ry="7" fill="none" stroke="#20b86b" stroke-width="5"/>`;
if(n===6)body=`${kid(80,82,'#2287ef')}${kid(240,82,'#ff9621')}<path d="M160 52v70" stroke="#fff" stroke-width="4"/><path d="M126 66h68" stroke="#3b78a8" stroke-width="3"/>${ball(160,48,'#fff')}`;
if(n===7)body=`${kid(105,82,'#8554ee')}${kid(215,82,'#20b86b')}<path d="M130 124q30-42 60 0" fill="none" stroke="#ef4f88" stroke-width="6"/>${cone(60,131)}${cone(270,131)}`;
return common+body+'</svg>'}
function gameName(card){return (card.querySelector('h4')?.textContent||'').replace(/^\s*\d+\s*·\s*/,'').replace(/^Juego\s+\d+\s*·\s*/i,'').trim()}
function renderCard(card,index){if(!card)return;card.dataset.gameNumber=String(index+1);const scene=card.querySelector('.scene');if(scene)scene.innerHTML=svgFor(gameName(card));const h=card.querySelector('h4');if(h){const name=gameName(card);h.textContent=name}}
function renderAll(){document.querySelectorAll('#classes .classbox').forEach(box=>{box.querySelectorAll('.game').forEach((card,i)=>renderCard(card,i))})}
let timer=0;const classes=document.getElementById('classes');if(classes){new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(renderAll,35)}).observe(classes,{childList:true,subtree:true})}
document.addEventListener('click',e=>{const btn=e.target.closest?.('.game .actions button');if(!btn)return;const text=(btn.textContent||'').toLowerCase();if(text.includes('sugerir'))setTimeout(()=>{const card=btn.closest('.game');const box=card?.closest('.classbox');const idx=box?[...box.querySelectorAll('.game')].indexOf(card):0;renderCard(card,Math.max(0,idx))},30);if(text.includes('elegir'))setTimeout(renderAll,80)},true);
renderAll();
})();