(()=>{
  const STORAGE_USER='profego-analytics-user';
  const STORAGE_SESSION='profego-analytics-session';
  const STORAGE_LAST='profego-analytics-last-seen';
  const SESSION_MS=30*60*1000;
  const minuteStarted=Date.now();
  let activeMs=0,lastTick=Date.now();

  function id(prefix){
    try{return prefix+crypto.randomUUID().replaceAll('-','').slice(0,16)}catch(e){return prefix+Math.random().toString(36).slice(2)+Date.now().toString(36)}
  }
  function getUser(){let v=localStorage.getItem(STORAGE_USER);if(!v){v=id('u_');localStorage.setItem(STORAGE_USER,v)}return v}
  function getSession(){
    const now=Date.now();let s=null;try{s=JSON.parse(localStorage.getItem(STORAGE_SESSION)||'null')}catch(e){}
    if(!s||!s.id||now-(s.last||0)>SESSION_MS)s={id:id('s_'),started:now,last:now,isNew:true};else{s.last=now;s.isNew=false}
    localStorage.setItem(STORAGE_SESSION,JSON.stringify(s));return s;
  }
  const user=getUser();
  const session=getSession();
  const previous=Number(localStorage.getItem(STORAGE_LAST)||0);
  const returning=previous>0;
  localStorage.setItem(STORAGE_LAST,String(Date.now()));

  function va(){
    const fn=(window.parent&&window.parent!==window&&window.parent.va)||window.va;
    if(typeof fn==='function')return fn.apply(window.parent||window,arguments);
  }
  function clean(v,max=80){return String(v??'').trim().slice(0,max)}
  function context(extra={}){
    return Object.assign({user,session:session.id,returning:returning?'yes':'no'},extra);
  }
  function track(name,data={}){
    try{va('event',{name,data:context(data)})}catch(e){}
  }
  window.ProfeGoAnalytics={track,user,session:session.id};

  if(session.isNew)track('session_start',{source:document.referrer?'referral':'direct'});
  track('app_open',{viewport:window.innerWidth<760?'mobile':'desktop'});

  document.addEventListener('click',e=>{
    const nav=e.target.closest('.side button');
    if(nav)track('section_view',{section:clean(nav.title||nav.innerText)});
    const quick=e.target.closest('.q');
    if(quick)track('quick_action',{action:clean(quick.innerText)});
    const save=e.target.closest('[onclick*="savePlan"]');
    if(save){
      const group=clean(document.getElementById('group')?.value);
      const content=clean(document.getElementById('content')?.value);
      setTimeout(()=>track('planning_created',{group,content}),250);
    }
    const evalBtn=e.target.closest('[onclick*="eval"], #eval button');
    if(evalBtn)track('evaluation_use',{action:clean(evalBtn.innerText)});
    const resBtn=e.target.closest('#resources button');
    if(resBtn)track('resource_use',{action:clean(resBtn.innerText)});
  },true);

  ['group','content'].forEach(key=>{
    document.addEventListener('change',e=>{
      if(e.target&&e.target.id===key)track('planner_selection',{field:key,value:clean(e.target.value)});
    },true);
  });

  function tick(){
    const now=Date.now();
    if(!document.hidden)activeMs+=Math.min(now-lastTick,65000);
    lastTick=now;
    const s=getSession();s.last=now;localStorage.setItem(STORAGE_SESSION,JSON.stringify(s));
    if(activeMs>=60000){
      const mins=Math.floor(activeMs/60000);activeMs-=mins*60000;
      for(let i=0;i<mins;i++)track('usage_minute',{section:clean(document.querySelector('.page.active')?.id||'unknown')});
    }
  }
  setInterval(tick,60000);
  document.addEventListener('visibilitychange',tick);
  window.addEventListener('pagehide',()=>{
    tick();
    const seconds=Math.max(1,Math.round((Date.now()-minuteStarted)/1000));
    track('session_end',{seconds:Math.min(seconds,7200)});
  });
})();