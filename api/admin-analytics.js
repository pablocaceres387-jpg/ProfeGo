export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  const adminKey=req.headers['x-profego-admin-key'];
  if(!process.env.PROFEGO_ADMIN_KEY) return res.status(503).json({error:'admin_not_configured'});
  if(adminKey!==process.env.PROFEGO_ADMIN_KEY) return res.status(401).json({error:'unauthorized'});
  if(!process.env.VERCEL_TOKEN) return res.status(503).json({error:'analytics_not_configured'});
  const projectId=process.env.VERCEL_PROJECT_ID;
  const teamId=process.env.VERCEL_ORG_ID;
  const days=Math.max(1,Math.min(90,Number(req.query.days)||30));
  const until=new Date();
  const since=new Date(until.getTime()-days*86400000);
  async function query(path,extra={}){
    const p=new URLSearchParams({projectId,since:since.toISOString(),until:until.toISOString()});
    if(teamId)p.set('teamId',teamId);
    Object.entries(extra).forEach(([k,v])=>{if(Array.isArray(v))v.forEach(x=>p.append(k,x));else if(v!==undefined&&v!==null)p.set(k,String(v))});
    const r=await fetch('https://api.vercel.com'+path+'?'+p.toString(),{headers:{Authorization:`Bearer ${process.env.VERCEL_TOKEN}`}});
    if(!r.ok){let detail='';try{detail=await r.text()}catch{};console.error('ProfeGo analytics error',r.status,path,detail.slice(0,500));throw new Error('analytics_'+r.status)}
    return r.json();
  }
  try{
    const visits=await query('/v1/query/web-analytics/visits/count');
    const safe=async(path,extra)=>{try{return await query(path,extra)}catch(e){console.warn('Optional analytics query failed',path,e.message);return {data:[]}}};
    const [plans,sessions,minutes,groups,contents,sections,users]=await Promise.all([
      safe('/v1/query/web-analytics/events/count',{filter:"eventName eq 'planning_created'"}),
      safe('/v1/query/web-analytics/events/count',{filter:"eventName eq 'session_start'"}),
      safe('/v1/query/web-analytics/events/count',{filter:"eventName eq 'usage_minute'"}),
      safe('/v1/query/web-analytics/events/aggregate',{by:['eventData/group'],filter:"eventName eq 'planning_created'",limit:20}),
      safe('/v1/query/web-analytics/events/aggregate',{by:['eventData/content'],filter:"eventName eq 'planning_created'",limit:30}),
      safe('/v1/query/web-analytics/events/aggregate',{by:['eventData/section'],filter:"eventName eq 'section_view'",limit:20}),
      safe('/v1/query/web-analytics/events/aggregate',{by:['eventData/user'],filter:"eventName eq 'session_start'",limit:100})
    ]);
    const n=x=>Number(x?.data?.pageviews??x?.data?.events??x?.data?.count??0);
    const visitors=Number(visits?.data?.visitors||0),usage=n(minutes),planCount=n(plans);
    res.status(200).json({range:{days,since,until},summary:{pageviews:n(visits),users:visitors,sessions:n(sessions),plans:planCount,usageMinutes:usage,avgMinutesPerUser:visitors?Math.round(usage/visitors*10)/10:0,plansPerUser:visitors?Math.round(planCount/visitors*100)/100:0},groups:Array.isArray(groups.data)?groups.data:[],contents:Array.isArray(contents.data)?contents.data:[],sections:Array.isArray(sections.data)?sections.data:[],users:Array.isArray(users.data)?users.data:[]});
  }catch(e){res.status(502).json({error:'analytics_query_failed',message:e.message})}
}