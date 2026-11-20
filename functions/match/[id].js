const BASE="https://v3.football.api-sports.io";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const page=(title,desc,body)=>new Response(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow"><link rel="canonical" href="https://pojokbola.web.id${new URL(body.url||"/", "https://pojokbola.web.id").pathname}"><link rel="stylesheet" href="/assets/style.css"></head><body><header class="top"><a class="brand" href="/">POJOK<span>BOLA</span></a><nav><a href="/">Beranda</a><a href="/#live">Live Score</a><a href="/#jadwal">Jadwal</a></nav></header><main class="detail">${body.html}<p><a href="/">← Kembali ke PojokBola</a></p></main><footer>© PojokBola.web.id</footer></body></html>`,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=60, s-maxage=300"}});
export async function onRequest({params,env}) {
 const id=String(params.id||""); if(!/^\\d+$/.test(id)) return new Response("Not found",{status:404});
 if(!env.API_FOOTBALL_KEY)return page("PojokBola","Detail pertandingan sepak bola",{html:"<h1>Konfigurasi API belum selesai</h1>"});
 try{
  const r=await fetch(`${BASE}/fixtures?id=${id}&timezone=Asia%2FJakarta`,{headers:{"x-apisports-key":env.API_FOOTBALL_KEY},cf:{cacheTtl:60}});
  const d=await r.json(),x=d.response?.[0]; if(!x)return new Response("Pertandingan tidak ditemukan",{status:404});
  const h=x.teams.home,a=x.teams.away,g=x.goals||{},f=x.fixture,league=x.league;
  const title=`${h.name} vs ${a.name} - ${league.name} | PojokBola`;
  const desc=`Informasi pertandingan ${h.name} melawan ${a.name}, skor ${g.home??"-"}-${g.away??"-"}, ${league.name}.`;
  const html=`<p class="eyebrow">${esc(league.country)} · ${esc(league.name)}</p><h1>${esc(h.name)} vs ${esc(a.name)}</h1><div class="detail-card"><div class="detail-teams"><div><img src="${h.logo}" alt="${esc(h.name)}"><strong>${esc(h.name)}</strong></div><div><div class="detail-score">${g.home??"-"} : ${g.away??"-"}</div><small>${esc(f.status.long)} ${f.status.elapsed!=null?"· "+f.status.elapsed+"'":""}</small></div><div><img src="${a.logo}" alt="${esc(a.name)}"><strong>${esc(a.name)}</strong></div></div><p>Kick-off: ${new Date(f.date).toLocaleString("id-ID",{dateStyle:"full",timeStyle:"short",timeZone:"Asia/Jakarta"})} WIB</p><p>Stadion: ${esc(f.venue?.name||"Belum tersedia")}</p></div><h2>Informasi pertandingan</h2><p>Wasit: ${esc(f.referee||"Belum tersedia")}</p><p>Skor dan informasi mengikuti pembaruan penyedia data.</p>`;
  return page(title,desc,{html,url:`/match/${id}`});
 }catch(e){return page("Detail pertandingan | PojokBola","Informasi pertandingan",{html:"<h1>Data belum dapat dimuat</h1><p>Silakan coba beberapa saat lagi.</p>",url:`/match/${id}`});}
}