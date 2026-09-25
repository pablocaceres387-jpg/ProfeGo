export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Método no permitido'});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'IA_NO_CONFIGURADA'});
  try{
    const {group,content,sport,goal,count=10,materials=[],avoid=[]}=req.body||{};
    const n=Math.max(1,Math.min(12,Number(count)||10));
    const excluded=(Array.isArray(avoid)?avoid:[]).slice(-120).join(' | ');
    const nonce=Math.random().toString(36).slice(2)+Date.now().toString(36);
    const prompt=`Sos la IA pedagógica de ProfeGo, una app para docentes de Educación Física.
Generá una secuencia NUEVA y VARIADA de ${n} clases para:
Grupo: ${group||''}
Contenido: ${content||''}
Deporte específico: ${sport||'no corresponde'}
Meta general: ${goal||''}
Materiales disponibles: ${Array.isArray(materials)?materials.join(', '):''}

Reglas obligatorias:
- Cada clase debe tener exactamente 6 juegos/actividades que permitan cubrir aproximadamente 40 minutos.
- Progresión real entre clases: exploración, desarrollo, aplicación y evaluación.
- Actividades seguras y adecuadas a la edad.
- Evitá ejercicios eliminatorios y tiempos largos de espera.
- La meta de cada clase se redacta con el patrón: "Los niños realizarán [acción] para [objetivo]".
- No repitas nombres ni propuestas dentro de esta secuencia.
- Evitá especialmente estas actividades ya usadas por este usuario: ${excluded||'ninguna registrada'}.
- Inventá variantes nuevas aunque el usuario vuelva a pedir los mismos parámetros.
- Respondé SOLO JSON válido, sin markdown ni comentarios.
- Formato exacto:
{"classes":[{"number":1,"stage":"Exploración","goal":"Los niños realizarán ... para ...","games":[{"name":"Nombre breve","description":"Explicación clara de cómo se juega, organización y variante."}]}]}
Identificador de variación: ${nonce}`;
    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({model:'gpt-5.6-luna',input:prompt,reasoning:{effort:'none'},max_output_tokens:9000})
    });
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||'Error de IA'});
    const raw=data.output_text||data.output?.flatMap(x=>x.content||[]).map(x=>x.text||'').join('')||'';
    const cleaned=raw.replace(/^\s*\`\`\`(?:json)?/i,'').replace(/\`\`\`\s*$/,'').trim();
    const plan=JSON.parse(cleaned);
    if(!Array.isArray(plan.classes)||!plan.classes.length) throw new Error('Respuesta incompleta');
    return res.status(200).json(plan);
  }catch(e){
    console.error('ProfeGo AI',e);
    return res.status(500).json({error:'No se pudo generar la planificación con IA'});
  }
}