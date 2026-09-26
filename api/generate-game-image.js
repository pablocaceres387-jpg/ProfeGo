export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'IA_NO_CONFIGURADA'});
  try{
    const {name='',description='',age='niños de primaria'}=req.body||{};
    if(!name) return res.status(400).json({error:'FALTA_JUEGO'});
    const prompt=`Ilustración 3D de alta calidad para una tarjeta de una app de Educación Física infantil. Juego: "${name}". Instrucción: "${description}". Edad: ${age}. Mostrar claramente la acción física descrita, los materiales necesarios y 2 a 4 niños realizándola correctamente. Personajes infantiles 3D simpáticos y consistentes, ropa deportiva blanca con pequeños detalles azul, rosa y verde. Gimnasio o patio escolar luminoso. Composición horizontal, cuerpos completos, ningún niño cortado, acción centrada, sin texto, sin letras, sin logos, sin interfaz, sin marcas de agua. Estilo animación 3D pulida, colores naturales, imagen nítida y detallada.`;
    const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-image-2',prompt,size:'1536x1024',quality:'medium',output_format:'webp',n:1})});
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:'IMAGE_API_ERROR',detail:data?.error?.message||'No se pudo crear la imagen'});
    const b64=data?.data?.[0]?.b64_json;
    if(!b64) return res.status(502).json({error:'SIN_IMAGEN'});
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({image:'data:image/webp;base64,'+b64});
  }catch(e){return res.status(500).json({error:'IMAGE_GENERATION_FAILED',detail:String(e?.message||e)})}
}