(()=>{
const palettes=[
 {skin:'#f3b27a',skin2:'#d98f55',hair:'#3b2418',shirt:'#2f80ed',shorts:'#184d8b',shoe:'#ffffff',accent:'#ff7a21'},
 {skin:'#c98257',skin2:'#a86443',hair:'#1f1714',shirt:'#18a76f',shorts:'#13684b',shoe:'#f8fafc',accent:'#ffb020'},
 {skin:'#f6c08b',skin2:'#d99a65',hair:'#2d1c16',shirt:'#7a5cff',shorts:'#4937a5',shoe:'#ffffff',accent:'#ff5d74'},
 {skin:'#8f5c3e',skin2:'#70442f',hair:'#17120f',shirt:'#ff884d',shorts:'#9d4b25',shoe:'#f7f7f7',accent:'#41c7d9'}
];
const equipment=['ball','cone','hoop','two','target','zigzag'];
function child(x,y,p,flip=1,pose=0){
 const arm1=pose%3===0?`M${x-9*flip},${y+24} Q${x-24*flip},${y+32} ${x-31*flip},${y+44}`:`M${x-9*flip},${y+24} Q${x-21*flip},${y+17} ${x-28*flip},${y+10}`;
 const arm2=pose%2===0?`M${x+9*flip},${y+24} Q${x+22*flip},${y+29} ${x+30*flip},${y+39}`:`M${x+9*flip},${y+24} Q${x+20*flip},${y+16} ${x+26*flip},${y+8}`;
 const leg1=pose%3===1?`M${x-7},${y+53} Q${x-17},${y+66} ${x-26},${y+74}`:`M${x-7},${y+53} L${x-15},${y+75}`;
 const leg2=pose%3===2?`M${x+7},${y+53} Q${x+18},${y+61} ${x+29},${y+67}`:`M${x+7},${y+53} L${x+16},${y+75}`;
 return `<g class="kid" filter="url(#soft)">
 <ellipse cx="${x}" cy="${y+77}" rx="27" ry="5" fill="#17385a" opacity=".22"/>
 <path d="${leg1}" stroke="${p.skin2}" stroke-width="7" stroke-linecap="round"/><path d="${leg2}" stroke="${p.skin2}" stroke-width="7" stroke-linecap="round"/>
 <path d="${leg1}" stroke="${p.shorts}" stroke-width="12" stroke-linecap="round" stroke-dasharray="18 80"/><path d="${leg2}" stroke="${p.shorts}" stroke-width="12" stroke-linecap="round" stroke-dasharray="18 80"/>
 <path d="M${x-19},${y+76} q12 5 24 0" stroke="${p.shoe}" stroke-width="7" stroke-linecap="round"/><path d="M${x+7},${y+76} q12 5 24 0" stroke="${p.shoe}" stroke-width="7" stroke-linecap="round"/>
 <rect x="${x-15}" y="${y+20}" width="30" height="38" rx="13" fill="${p.shirt}"/><path d="M${x-12},${y+43} q12 7 24 0" stroke="#fff" opacity=".25" stroke-width="3" fill="none"/>
 <path d="${arm1}" stroke="${p.skin}" stroke-width="8" stroke-linecap="round"/><path d="${arm2}" stroke="${p.skin}" stroke-width="8" stroke-linecap="round"/>
 <circle cx="${x}" cy="${y+5}" r="17" fill="${p.skin}"/>
 <path d="M${x-16},${y+3} q2-18 17-18 q13 1 17 15 q-8-7-16-5 q-9 3-18 0z" fill="${p.hair}"/>
 <circle cx="${x-6}" cy="${y+5}" r="1.7" fill="#2b1e18"/><circle cx="${x+6}" cy="${y+5}" r="1.7" fill="#2b1e18"/>
 <path d="M${x-5},${y+12} q5 4 10 0" stroke="#9d573f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
 <circle cx="${x-18}" cy="${y+6}" r="3" fill="${p.skin}"/><circle cx="${x+18}" cy="${y+6}" r="3" fill="${p.skin}"/>
 </g>`;
}
function gear(type,i){
 if(type==='two') return `<circle cx="150" cy="74" r="12" fill="#ff8a1c" stroke="#fff" stroke-width="3"/><circle cx="210" cy="60" r="11" fill="#38bdf8" stroke="#fff" stroke-width="3"/>`;
 if(type==='hoop') return `<ellipse cx="212" cy="92" rx="34" ry="11" fill="none" stroke="#ff6a00" stroke-width="6"/><ellipse cx="212" cy="92" rx="25" ry="7" fill="none" stroke="#ffc38e" stroke-width="2"/>`;
 if(type==='target') return `<g transform="translate(205 48)"><circle r="31" fill="#fff" stroke="#d9e6f2" stroke-width="3"/><circle r="23" fill="#ff6b35"/><circle r="15" fill="#fff"/><circle r="7" fill="#ff6b35"/></g>`;
 if(type==='zigzag') return `<g>${[0,1,2].map((n)=>`<path d="M${190+n*22},104 l8-18 8 18z" fill="${['#ff6b00','#ff9b36','#ffcf57'][n]}"/>`).join('')}</g>`;
 return `<g><circle cx="207" cy="68" r="13" fill="${i%2?'#38bdf8':'#ff8a1c'}" stroke="#fff" stroke-width="3"/><path d="M197 68 q10-9 20 0 q-10 9-20 0" stroke="#ffffffaa" stroke-width="2" fill="none"/></g>`;
}
function scene(card,i){
 const title=(card.querySelector('.game-top')?.innerText||'').toLowerCase();
 let type=equipment[i%equipment.length];
 if(/aro|círculo/.test(title)) type='hoop'; else if(/blanco|objetivo|punter/.test(title)) type='target'; else if(/cono|camino|zigzag|circuito/.test(title)) type='zigzag'; else if(/pareja|equipo|dupla|pase/.test(title)) type='two';
 const p1=palettes[i%palettes.length],p2=palettes[(i+1)%palettes.length];
 const two=type==='two'||/pareja|equipo|dupla/.test(title);
 return `<svg viewBox="0 0 300 130" role="img" aria-label="Ilustración del juego"><defs><linearGradient id="bg${i}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dff3ff"/><stop offset="1" stop-color="#f8fcff"/></linearGradient><filter id="soft"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-opacity=".18"/></filter></defs><rect width="300" height="130" rx="16" fill="url(#bg${i})"/><path d="M0 102 Q75 92 150 101 T300 98 V130 H0z" fill="#d8eee4"/><path d="M0 108 Q75 99 150 107 T300 104" stroke="#b7d6cb" stroke-width="2" fill="none"/>${child(two?92:110,34,p1,1,i)}${two?child(202,36,p2,-1,i+1):''}${gear(type,i)}<g opacity=".35"><circle cx="264" cy="24" r="18" fill="#fff"/><path d="M24 22 h42" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g></svg>`;
}
function enhance(root=document){
 const cards=[...root.querySelectorAll('.game')];
 cards.forEach((card,i)=>{const s=card.querySelector('.scene');if(!s||s.dataset.enhanced==='1')return;s.innerHTML=scene(card,i);s.dataset.enhanced='1';});
}
let t;const obs=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>enhance(),60)});
function init(){enhance();obs.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();