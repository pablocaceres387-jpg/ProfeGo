(()=>{
const KEY='profego_theme_v1';
const presets={
  cielo:{name:'Cielo',primary:'#2d8cff',secondary:'#18c98b',bg:'#f7fbff',card:'#ffffff',ink:'#12306b',muted:'#6881a3',radius:20,scale:1},
  coral:{name:'Coral',primary:'#ff6b57',secondary:'#ffb13b',bg:'#fff8f5',card:'#ffffff',ink:'#4a2440',muted:'#8d6a7f',radius:22,scale:1},
  menta:{name:'Menta',primary:'#12b886',secondary:'#4dabf7',bg:'#f3fffb',card:'#ffffff',ink:'#153f3a',muted:'#66847f',radius:20,scale:1},
  violeta:{name:'Violeta',primary:'#7c4dff',secondary:'#ef4ca6',bg:'#faf7ff',card:'#ffffff',ink:'#2d245f',muted:'#766f95',radius:22,scale:1},
  noche:{name:'Noche',primary:'#69b7ff',secondary:'#67e8b6',bg:'#091525',card:'#102238',ink:'#f4f8fc',muted:'#a9bed2',radius:20,scale:1}
};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||presets.cielo}catch(e){return presets.cielo}}
function save(t){localStorage.setItem(KEY,JSON.stringify(t))}
function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function tint(hex,alpha=.12){const [r,g,b]=hexToRgb(hex);return `rgba(${r},${g},${b},${alpha})`}
function apply(t){
 const d=document.documentElement;
 const vars={
  '--pf-bg':t.bg,'--pf-card':t.card,'--pf-ink':t.ink,'--pf-muted':t.muted,'--pf-blue':t.primary,'--pf-green':t.secondary,
  '--pf-line':tint(t.ink,.13),'--pf-shadow':`0 10px 30px ${tint(t.ink,.10)}`,'--user-primary':t.primary,'--user-secondary':t.secondary,'--user-bg':t.bg,'--user-card':t.card,'--user-ink':t.ink,'--user-muted':t.muted,'--user-radius':`${t.radius}px`,'--user-scale':t.scale
 };
 Object.entries(vars).forEach(([k,v])=>d.style.setProperty(k,v));
 d.style.fontSize=`${16*t.scale}px`;
 document.body.style.background=t.bg;
 let st=document.getElementById('profego-user-theme');
 if(!st){st=document.createElement('style');st.id='profego-user-theme';document.head.appendChild(st)}
 st.textContent=`
 html,body{background:${t.bg}!important;color:${t.ink}!important}
 .panel,.builder,.sidecard,.home-card,.quick-action,.welcome-card,.group-card,.modalbox,.drive-settings{border-radius:var(--user-radius)!important}
 .panel,.builder,.sidecard,.home-card,.group-card,.modalbox,.drive-settings{background:${t.card}!important}
 h1,h2,h3,b,strong,.title h1,.brandword{color:${t.ink}!important}
 p,label,small,.title p{color:${t.muted}!important}
 .primary,.details-btn{background:linear-gradient(135deg,${t.primary},${t.secondary})!important}
 .sidebar .menu button.active{box-shadow:0 0 0 3px ${tint(t.primary,.25)},0 8px 18px ${tint(t.ink,.15)}!important}
 .field,input,textarea,select{background:${t.card}!important;color:${t.ink}!important;border-color:${tint(t.ink,.14)}!important}
 .ghost{background:${t.card}!important;color:${t.ink}!important;border-color:${tint(t.ink,.14)}!important}
 .saved-badge{background:${tint(t.secondary,.15)}!important;color:${t.secondary}!important}
 .sidebar{background:linear-gradient(180deg,${tint(t.primary,.10)},${t.bg})!important;border-color:${tint(t.ink,.10)}!important}
 .scene{background:linear-gradient(180deg,${tint(t.primary,.08)},${tint(t.secondary,.07)})!important}
 `;
 updateUI(t);
}
function ensureUI(){
 if(document.getElementById('pf-theme-btn'))return;
 const btn=document.createElement('button');btn.id='pf-theme-btn';btn.type='button';btn.setAttribute('aria-label','Personalizar colores');btn.innerHTML='🎨';
 btn.style.cssText='position:fixed;right:18px;bottom:18px;z-index:99999;width:54px;height:54px;border:0;border-radius:17px;background:linear-gradient(135deg,#2d8cff,#7c4dff);color:white;font-size:24px;box-shadow:0 10px 28px rgba(30,70,130,.24);cursor:pointer';
 const panel=document.createElement('div');panel.id='pf-theme-panel';panel.innerHTML=`
 <div class="pf-theme-card">
  <div class="pf-theme-head"><div><b>Tu estilo</b><small>Personalizá ProfeGo a tu gusto</small></div><button id="pf-theme-close">×</button></div>
  <div class="pf-theme-presets">${Object.entries(presets).map(([k,p])=>`<button class="pf-preset" data-preset="${k}" title="${p.name}"><span style="background:${p.primary}"></span><span style="background:${p.secondary}"></span><em>${p.name}</em></button>`).join('')}</div>
  <div class="pf-theme-grid">
   <label>Color principal<input id="pf-primary" type="color"></label>
   <label>Color secundario<input id="pf-secondary" type="color"></label>
   <label>Fondo<input id="pf-bg" type="color"></label>
   <label>Tarjetas<input id="pf-card" type="color"></label>
  </div>
  <label class="pf-range">Esquinas <input id="pf-radius" type="range" min="10" max="30" step="1"></label>
  <label class="pf-range">Tamaño de interfaz <input id="pf-scale" type="range" min="0.9" max="1.12" step="0.02"></label>
  <div class="pf-theme-actions"><button id="pf-reset">Restablecer</button><button id="pf-save">Guardar estilo</button></div>
 </div>`;
 const css=document.createElement('style');css.textContent=`
 #pf-theme-panel{position:fixed;inset:0;z-index:99998;background:rgba(10,28,55,.25);backdrop-filter:blur(5px);display:none;align-items:flex-end;justify-content:flex-end;padding:84px 18px 82px}#pf-theme-panel.show{display:flex}.pf-theme-card{width:min(420px,calc(100vw - 24px));background:#fff;border:1px solid #dce8f6;border-radius:24px;padding:18px;box-shadow:0 22px 70px rgba(26,64,110,.25);color:#12306b}.pf-theme-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:15px}.pf-theme-head b{display:block;font-size:20px}.pf-theme-head small{display:block;margin-top:3px;color:#6881a3}.pf-theme-head button{border:0;background:#eef5fb;border-radius:10px;width:34px;height:34px;font-size:22px;color:#526d90}.pf-theme-presets{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}.pf-preset{border:1px solid #e2ebf4;background:#f9fcff;border-radius:13px;padding:8px 5px;display:grid;grid-template-columns:1fr 1fr;gap:3px;cursor:pointer}.pf-preset span{height:22px;border-radius:7px}.pf-preset em{grid-column:1/3;font-style:normal;font-size:9px;color:#5e7696;margin-top:3px}.pf-theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.pf-theme-grid label,.pf-range{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid #e4edf6;border-radius:13px;padding:10px;font-size:11px;color:#587292}.pf-theme-grid input[type=color]{width:42px;height:30px;border:0;background:transparent}.pf-range{margin-top:10px}.pf-range input{flex:1}.pf-theme-actions{display:flex;gap:9px;margin-top:14px}.pf-theme-actions button{flex:1;border:0;border-radius:13px;padding:12px;font-weight:800;cursor:pointer}.pf-theme-actions #pf-reset{background:#eef4f9;color:#526d90}.pf-theme-actions #pf-save{background:linear-gradient(135deg,#2d8cff,#7c4dff);color:#fff}@media(max-width:600px){#pf-theme-panel{padding:70px 10px 82px}.pf-theme-card{border-radius:22px}.pf-theme-presets{grid-template-columns:repeat(5,1fr);gap:5px}.pf-preset em{font-size:8px}}
 `;document.head.appendChild(css);document.body.appendChild(btn);document.body.appendChild(panel);
 btn.onclick=()=>panel.classList.add('show');panel.querySelector('#pf-theme-close').onclick=()=>panel.classList.remove('show');panel.addEventListener('click',e=>{if(e.target===panel)panel.classList.remove('show')});
 panel.querySelectorAll('.pf-preset').forEach(b=>b.onclick=()=>{const t={...presets[b.dataset.preset]};apply(t);save(t)});
 ['primary','secondary','bg','card','radius','scale'].forEach(id=>{panel.querySelector('#pf-'+id).addEventListener('input',()=>{const t=readUI();apply(t)})});
 panel.querySelector('#pf-save').onclick=()=>{const t=readUI();save(t);apply(t);panel.classList.remove('show')};
 panel.querySelector('#pf-reset').onclick=()=>{const t={...presets.cielo};save(t);apply(t)};
}
function readUI(){const $=id=>document.getElementById('pf-'+id);const old=load();return {...old,primary:$('primary').value,secondary:$('secondary').value,bg:$('bg').value,card:$('card').value,radius:+$('radius').value,scale:+$('scale').value}}
function updateUI(t){if(!document.getElementById('pf-primary'))return;document.getElementById('pf-primary').value=t.primary;document.getElementById('pf-secondary').value=t.secondary;document.getElementById('pf-bg').value=t.bg;document.getElementById('pf-card').value=t.card;document.getElementById('pf-radius').value=t.radius;document.getElementById('pf-scale').value=t.scale}
function init(){ensureUI();apply(load())}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();