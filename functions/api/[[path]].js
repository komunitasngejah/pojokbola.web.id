const BASE = "https://v3.football.api-sports.io";
const ALLOWED = new Set(["live","fixtures","standings","teams","leagues","fixtures/events","fixtures/lineups","fixtures/statistics"]);
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","access-control-allow-origin":"*"}});
export async function onRequest({request,env}) {
  if(request.method!=="GET") return json({error:"Method not allowed"},405);
  if(!env.API_FOOTBALL_KEY) return json({error:"API key belum dipasang. Tambahkan API_FOOTBALL_KEY di Cloudflare Pages Settings > Variables and Secrets."},503);
  const url=new URL(request.url); const path=(url.pathname.replace(/^\/api\/?/,"")||"live").replace(/\/$/,"");
  if(!ALLOWED.has(path)) return json({error:"Endpoint tidak diizinkan"},404);
  const params=new URLSearchParams(url.search);
  if(path==="live" && !params.has("live")) params.set("live","all");
  if(path==="fixtures" && !params.has("timezone")) params.set("timezone","Asia/Jakarta");
  if(path==="live" && !params.has("timezone")) params.set("timezone","Asia/Jakarta");
  const cacheSeconds=path==="live"?45:(path==="standings"?1800:(path==="fixtures/events"||path==="fixtures/statistics"?30:900));
  const target=`${BASE}/${path}?${params.toString()}`;
  try {
    const upstream=await fetch(target,{headers:{"x-apisports-key":env.API_FOOTBALL_KEY},cf:{cacheTtl:cacheSeconds,cacheEverything:true}});
    const body=await upstream.text();
    return new Response(body,{status:upstream.status,headers:{"content-type":"application/json; charset=utf-8","cache-control":`public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`}});
  } catch(e) { return json({error:"Tidak dapat menghubungi penyedia data sepak bola."},502); }
}