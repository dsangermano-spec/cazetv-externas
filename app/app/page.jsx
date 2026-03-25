"use client";
import { useState, useMemo, useEffect, useCallback } from "react";

const THEME = {
  "Futebol Masculino": { color:"#ef4444", light:"rgba(239,68,68,0.08)" },
  "Olímpicos":         { color:"#3b82f6", light:"rgba(59,130,246,0.08)" },
  "Tênis":             { color:"#22c55e", light:"rgba(34,197,94,0.08)"  },
  "Copa do Mundo":     { color:"#f59e0b", light:"rgba(245,158,11,0.08)" },
  "Futebol Feminino":  { color:"#ec4899", light:"rgba(236,72,153,0.08)" },
};

const fmt = n => n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(0)+"K":n?String(n):"—";
const BLANK = {evento:"",data:"",mod:"Futebol Masculino",rep:"",viagem:false,posts:0,nums:0,prog:"",ao:0,bol:0,yt:0,pauta:"",previsto:false};

export default function Page() {
  const [meses, setMeses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mes, setMes] = useState("");
  const [tipo, setTipo] = useState("externas");
  const [view, setView] = useState("lista");
  const [search, setSearch] = useState("");
  const [filterMod, setFilterMod] = useState("Todas");
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [novoMesModal, setNovoMesModal] = useState(false);
  const [novoMesNome, setNovoMesNome] = useState("");

  useEffect(() => {
    fetch("/api/data").then(r=>r.json()).then(d=>{
      setMeses(d); setMes(Object.keys(d).at(-1)||""); setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  const persistir = useCallback(async(novos)=>{
    setSaving(true);
    try { await fetch("/api/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(novos)}); }
    finally { setSaving(false); }
  },[]);

  const updateMeses = n => { setMeses(n); persistir(n); };
  const mesData = meses[mes]||{externas:[],jogos:[]};
  const lista = mesData[tipo]||[];

  const filtered = useMemo(()=>lista.filter(d=>{
    if(filterMod!=="Todas"&&d.mod!==filterMod)return false;
    if(search&&!d.evento.toLowerCase().includes(search.toLowerCase())&&!d.rep.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }),[lista,filterMod,search]);

  const stats = useMemo(()=>{
    const all=[...(mesData.externas||[]),...(mesData.jogos||[])];
    return {
      ext:mesData.externas?.length||0, jog:mesData.jogos?.length||0,
      alcance:all.reduce((s,d)=>s+d.nums,0), posts:all.reduce((s,d)=>s+d.posts,0),
      viagens:all.filter(d=>d.viagem).length, ao:all.reduce((s,d)=>s+d.ao,0),
      bol:all.reduce((s,d)=>s+d.bol,0), yt:all.reduce((s,d)=>s+d.yt,0),
      byMod:Object.keys(THEME).map(m=>({mod:m,cnt:all.filter(d=>d.mod===m).length})).filter(x=>x.cnt>0),
      top5:[...all].sort((a,b)=>b.nums-a.nums).slice(0,5),
    };
  },[mesData]);

  const updateLista = l => updateMeses({...meses,[mes]:{...mesData,[tipo]:l}});
  const salvar = ()=>{ const e={...form,id:editId||Date.now().toString()}; if(editId)updateLista(lista.map(r=>r.id===editId?e:r)); else updateLista([...lista,e]); setModal(null); };
  const deletar = id=>{ updateLista(lista.filter(r=>r.id!==id)); setExpanded(null); };
  const salvarPauta = (id,txt)=>updateLista(lista.map(r=>r.id===id?{...r,pauta:txt}:r));
  const openForm = (row=null)=>{ setEditId(row?.id||null); setForm(row?{...row}:BLANK); setModal({mode:"form"}); };
  const openPauta = row=>setModal({mode:"pauta",data:row});

  const I={width:"100%",background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#eee",outline:"none",boxSizing:"border-box"};

  if(loading) return <div style={{background:"#0f0f0f",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#555",fontFamily:"system-ui"}}>Carregando...</div>;

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#0f0f0f",minHeight:"100vh",color:"#fff",padding:"20px 16px",maxWidth:1200,margin:"0 auto"}}>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#ef4444,#f97316)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📡</div>
          <div>
            <div style={{fontWeight:700,fontSize:18}}>Cazé TV</div>
            <div style={{fontSize:11,color:"#555",marginTop:1}}>Sistema de Externas {saving&&<span style={{color:"#f59e0b"}}>· salvando...</span>}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4,background:"#1a1a1a",borderRadius:10,padding:3}}>
            {Object.keys(meses).map(m=>(
              <button key={m} onClick={()=>setMes(m)} style={{background:mes===m?"#ef4444":"transparent",border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:mes===m?600:400,color:mes===m?"#fff":"#888"}}>{m}</button>
            ))}
            <button onClick={()=>setNovoMesModal(true)} style={{background:"transparent",border:"1px dashed #333",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#555"}}>+ Mês</button>
          </div>
          <button onClick={()=>openForm()} style={{background:"#ef4444",border:"none",borderRadius:9,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#fff"}}>+ Novo registro</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:20}}>
        {[{l:"Externas",v:stats.ext,c:"#ef4444"},{l:"Jogos",v:stats.jog,c:"#22c55e"},{l:"Alcance",v:fmt(stats.alcance),c:"#3b82f6"},{l:"Posts",v:stats.posts,c:"#f59e0b"},{l:"Viagens",v:stats.viagens,c:"#a855f7"},{l:"Ao vivo",v:stats.ao,c:"#ec4899"},{l:"Boletins",v:stats.bol,c:"#14b8a6"},{l:"YouTube",v:fmt(stats.yt),c:"#ef4444"}].map(s=>(
          <div key={s.l} style={{background:"#1a1a1a",borderRadius:10,padding:"12px 10px",textAlign:"center",border:"1px solid #222"}}>
            <div style={{fontSize:20,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:10,color:"#555",marginTop:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:14}}>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#1a1a1a",borderRadius:9,padding:3,gap:2}}>
            {[["externas","Externas"],["jogos","Jogos"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTipo(k)} style={{background:tipo===k?"#222":"transparent",border:tipo===k?"1px solid #333":"1px solid transparent",borderRadius:7,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:tipo===k?600:400,color:tipo===k?"#fff":"#555"}}>
                {l} <span style={{color:tipo===k?"#ef4444":"#444",fontSize:11,marginLeft:3}}>{mesData[k]?.length||0}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",background:"#1a1a1a",borderRadius:9,padding:3,gap:2}}>
            {[["lista","☰"],["painel","⊞"]].map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)} style={{background:view===k?"#222":"transparent",border:view===k?"1px solid #333":"1px solid transparent",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:13,color:view===k?"#fff":"#555"}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{...I,width:160,padding:"6px 12px"}}/>
          <select value={filterMod} onChange={e=>setFilterMod(e.target.value)} style={{...I,width:"auto",padding:"6px 10px"}}>
            <option>Todas</option>
            {Object.keys(THEME).map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {view==="lista"&&(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#444",fontSize:13}}>Nenhum registro encontrado.</div>}
          {filtered.map(row=>{
            const t=THEME[row.mod]||{color:"#888",light:"rgba(136,136,136,0.08)"};
            const isExp=expanded===row.id;
            return (
              <div key={row.id} style={{background:"#141414",border:`1px solid ${isExp?t.color+"44":"#1e1e1e"}`,borderRadius:12,overflow:"hidden"}}>
                <div onClick={()=>setExpanded(isExp?null:row.id)} style={{display:"grid",gridTemplateColumns:"56px 1fr 130px 110px 50px 70px 70px 60px",gap:8,padding:"12px 14px",cursor:"pointer",alignItems:"center"}}>
                  <div style={{fontSize:11,color:"#555"}}>{row.data}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6,color:"#eee"}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:t.color,display:"inline-block",flexShrink:0}}></span>
                      {row.evento}
                      {row.pauta&&<span style={{fontSize:9,background:t.color+"22",color:t.color,border:`1px solid ${t.color}44`,borderRadius:4,padding:"1px 5px",fontWeight:700}}>PAUTA</span>}
                      {row.previsto&&<span style={{fontSize:9,background:"#3b82f622",color:"#3b82f6",border:"1px solid #3b82f644",borderRadius:4,padding:"1px 5px"}}>PREVISTO</span>}
                    </div>
                    <div style={{fontSize:11,color:"#555",marginTop:2}}>{row.rep}</div>
                  </div>
                  <span style={{background:t.light,color:t.color,border:`1px solid ${t.color}33`,borderRadius:20,fontSize:10,padding:"3px 9px",fontWeight:600,whiteSpace:"nowrap",justifySelf:"start"}}>{row.mod}</span>
                  <div style={{fontSize:11,color:row.viagem?"#22c55e":"#444",fontWeight:row.viagem?600:400}}>{row.viagem?"✈ Viagem":"Local"}</div>
                  <div style={{fontSize:12,color:"#666",textAlign:"center"}}>{row.posts||"—"}</div>
                  <div style={{fontSize:12,fontWeight:600,color:row.nums?"#3b82f6":"#444"}}>{fmt(row.nums)}</div>
                  <div style={{fontSize:11,color:"#555",textAlign:"center"}}>{row.ao?`${row.ao}x AO`:"—"}</div>
                  <div style={{fontSize:10,color:"#444"}}>{row.bol?`${row.bol} bol.`:"—"}</div>
                </div>
                {isExp&&(
                  <div style={{borderTop:"1px solid #1e1e1e",padding:"14px 16px",background:"#0f0f0f"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                      <div>
                        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,fontWeight:600}}>Detalhes</div>
                        {[["Programas",row.prog||"—"],["Repórter",row.rep||"—"],["YouTube/VOD",fmt(row.yt)],["Alcance total",row.nums?.toLocaleString("pt-BR")||"—"]].map(([k,v])=>(
                          <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}>
                            <span style={{color:"#555"}}>{k}</span><span style={{color:"#bbb",fontWeight:500}}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,fontWeight:600}}>Pauta</div>
                        {row.pauta?<div style={{fontSize:12,color:"#aaa",background:"#1a1a1a",borderRadius:8,padding:"10px 12px",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{row.pauta}</div>:<div style={{fontSize:12,color:"#444",fontStyle:"italic"}}>Nenhuma pauta cadastrada.</div>}
                        <button onClick={()=>openPauta(row)} style={{marginTop:8,background:"#1a1a1a",border:`1px solid ${t.color}44`,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,color:t.color,fontWeight:600}}>{row.pauta?"Editar pauta":"Adicionar pauta"}</button>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:12,justifyContent:"flex-end"}}>
                      <button onClick={()=>openForm(row)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,color:"#aaa"}}>Editar</button>
                      <button onClick={()=>deletar(row.id)} style={{background:"#1a1a1a",border:"1px solid #ef444433",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,color:"#ef4444"}}>Excluir</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view==="painel"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"#141414",border:"1px solid #1e1e1e",borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14,fontWeight:600}}>Por modalidade</div>
            {stats.byMod.sort((a,b)=>b.cnt-a.cnt).map(({mod,cnt})=>{
              const t=THEME[mod]||{color:"#888"};
              const pct=stats.ext+stats.jog>0?Math.round(cnt/(stats.ext+stats.jog)*100):0;
              return (
                <div key={mod} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                    <span style={{color:"#aaa",display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:t.color,display:"inline-block"}}></span>{mod}</span>
                    <span style={{color:"#666"}}>{cnt} <span style={{color:"#444"}}>({pct}%)</span></span>
                  </div>
                  <div style={{height:4,background:"#1e1e1e",borderRadius:2}}><div style={{height:4,borderRadius:2,width:`${pct}%`,background:t.color,opacity:.8}}></div></div>
                </div>
              );
            })}
          </div>
          <div style={{background:"#141414",border:"1px solid #1e1e1e",borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14,fontWeight:600}}>Top 5 por alcance</div>
            {stats.top5.map((d,i)=>(
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{fontSize:20,fontWeight:700,color:"#2a2a2a",minWidth:24}}>{i+1}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#ccc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.evento}</div>
                  <div style={{fontSize:10,color:"#555"}}>{d.data} · {d.rep}</div>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:"#3b82f6"}}>{fmt(d.nums)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal?.mode==="pauta"&&(()=>{
        const row=lista.find(r=>r.id===modal.data.id)||modal.data;
        const t=THEME[row.mod]||{color:"#888"};
        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setModal(null)}>
            <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:16,padding:"24px",width:"min(520px,92vw)",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
              <div style={{fontWeight:700,fontSize:15,color:"#eee",marginBottom:4}}>{row.evento}</div>
              <div style={{fontSize:11,color:"#555",marginBottom:16}}>{row.data} · {row.rep}</div>
              <textarea id="pautaArea" defaultValue={row.pauta} placeholder="Descreva a pauta, ângulo editorial, entrevistados, objetivos..."
                style={{...I,minHeight:160,resize:"vertical",lineHeight:1.6,border:`1px solid ${t.color}33`}}/>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
                <button onClick={()=>setModal(null)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,color:"#888"}}>Cancelar</button>
                <button onClick={()=>{salvarPauta(row.id,document.getElementById("pautaArea").value);setModal(null);}} style={{background:t.color,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:600}}>Salvar pauta</button>
              </div>
            </div>
          </div>
        );
      })()}

      {modal?.mode==="form"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setModal(null)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:16,padding:"24px",width:"min(520px,92vw)",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700,fontSize:15,color:"#eee",marginBottom:20}}>{editId?"Editar registro":"Novo registro"}</div>
            {[["Evento","evento"],["Data (dd/mm)","data"],["Repórter","rep"],["Programas/Transmissões","prog"]].map(([l,k])=>(
              <div key={k} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"#555",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
                <input style={I} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:"#555",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Modalidade</div>
                <select style={I} value={form.mod} onChange={e=>setForm(f=>({...f,mod:e.target.value}))}>
                  {Object.keys(THEME).map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:11,color:"#555",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Viagem</div>
                <select style={I} value={form.viagem?"Sim":"Não"} onChange={e=>setForm(f=>({...f,viagem:e.target.value==="Sim"}))}>
                  <option>Não</option><option>Sim</option>
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[["Posts","posts"],["Alcance","nums"],["Ao vivo","ao"],["Boletins","bol"],["YouTube","yt"]].map(([l,k])=>(
                <div key={k}>
                  <div style={{fontSize:11,color:"#555",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
                  <input type="number" style={I} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:Number(e.target.value)}))}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <input type="checkbox" id="prev" checked={!!form.previsto} onChange={e=>setForm(f=>({...f,previsto:e.target.checked}))}/>
              <label htmlFor="prev" style={{fontSize:12,color:"#666"}}>Marcar como previsto</label>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(null)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#888"}}>Cancelar</button>
              <button onClick={salvar} style={{background:"#ef4444",border:"none",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {novoMesModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setNovoMesModal(false)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:16,padding:"24px",width:"min(360px,92vw)",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700,fontSize:15,color:"#eee",marginBottom:16}}>Novo mês</div>
            <div style={{fontSize:11,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Nome (ex: Abril 2025)</div>
            <input value={novoMesNome} onChange={e=>setNovoMesNome(e.target.value)} placeholder="Abril 2025" style={I}/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
              <button onClick={()=>setNovoMesModal(false)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#888"}}>Cancelar</button>
              <button onClick={()=>{if(novoMesNome.trim()){const n={...meses,[novoMesNome.trim()]:{externas:[],jogos:[]}};updateMeses(n);setMes(novoMesNome.trim());setNovoMesNome("");setNovoMesModal(false);}}} style={{background:"#ef4444",border:"none",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
