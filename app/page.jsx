"use client";
import { useState, useMemo, useEffect } from "react";

const MODS = ["Futebol Masculino","Futebol Feminino","Olímpicos","Tênis","Copa do Mundo","Outro"];
const COR = {"Futebol Masculino":"#ef4444","Futebol Feminino":"#ec4899","Olímpicos":"#3b82f6","Tênis":"#22c55e","Copa do Mundo":"#f59e0b","Outro":"#888"};
const fmt = n => n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(0)+"K":n?String(n):"—";
const BLANK = {evento:"",data:"",mod:"Futebol Masculino",rep:"",local:"",posts:0,nums:0,ao:0,bol:0,yt:0,pauta:""};
const I = {width:"100%",background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#eee",outline:"none",boxSizing:"border-box"};

function App() {
  const [dados, setDados] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mes, setMes] = useState("");
  const [search, setSearch] = useState("");
  const [fMod, setFMod] = useState("Todas");
  const [exp, setExp] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [novoMes, setNovoMes] = useState(false);
  const [novoMesNome, setNovoMesNome] = useState("");

  useEffect(() => {
    fetch("/api/data")
      .then(r => r.json())
      .then(d => { setDados(d); setMes(Object.keys(d).at(-1)||""); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function salvarDados(d) {
    setDados(d);
    setSaving(true);
    fetch("/api/data", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) })
      .finally(() => setSaving(false));
  }

  const lista = dados[mes] || [];

  const filtered = useMemo(() => lista.filter(r => {
    if (fMod !== "Todas" && r.mod !== fMod) return false;
    if (search && !r.evento.toLowerCase().includes(search.toLowerCase()) && !r.rep.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [lista, fMod, search]);

  const stats = useMemo(() => ({
    total: lista.length,
    alcance: lista.reduce((s,r) => s+r.nums, 0),
    posts: lista.reduce((s,r) => s+r.posts, 0),
    ao: lista.reduce((s,r) => s+r.ao, 0),
    bol: lista.reduce((s,r) => s+r.bol, 0),
    yt: lista.reduce((s,r) => s+r.yt, 0),
  }), [lista]);

  function updateLista(l) { salvarDados({...dados, [mes]: l}); }
  function salvar() {
    const e = {...form, id: editId||Date.now().toString()};
    updateLista(editId ? lista.map(r => r.id===editId ? e : r) : [...lista, e]);
    setModal(null);
  }
  function deletar(id) { updateLista(lista.filter(r => r.id!==id)); setExp(null); }
  function salvarPauta(id, txt) { updateLista(lista.map(r => r.id===id ? {...r, pauta:txt} : r)); }
  function openForm(row=null) { setEditId(row?.id||null); setForm(row?{...row}:BLANK); setModal("form"); }
  function openPauta(row) { setModal({type:"pauta", row}); }

  if (loading) return <div style={{background:"#0f0f0f",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#555",fontFamily:"system-ui"}}>Carregando...</div>;

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#0f0f0f",minHeight:"100vh",color:"#fff",padding:"20px 16px",maxWidth:1100,margin:"0 auto"}}>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#ef4444,#f97316)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📡</div>
          <div>
            <div style={{fontWeight:700,fontSize:18}}>Cazé TV</div>
            <div style={{fontSize:11,color:"#555",marginTop:1}}>Sistema de Externas{saving&&<span style={{color:"#f59e0b"}}> · salvando...</span>}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:3,background:"#1a1a1a",borderRadius:10,padding:3}}>
            {Object.keys(dados).map(m => (
              <button key={m} onClick={() => setMes(m)} style={{background:mes===m?"#ef4444":"transparent",border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:mes===m?600:400,color:mes===m?"#fff":"#888"}}>{m}</button>
            ))}
            <button onClick={() => setNovoMes(true)} style={{background:"transparent",border:"1px dashed #333",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#555"}}>+ Mês</button>
          </div>
          <button onClick={() => openForm()} style={{background:"#ef4444",border:"none",borderRadius:9,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600,color:"#fff"}}>+ Nova externa</button>
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:20}}>
        {[{l:"Externas",v:stats.total,c:"#ef4444"},{l:"Alcance",v:fmt(stats.alcance),c:"#3b82f6"},{l:"Posts",v:stats.posts,c:"#f59e0b"},{l:"Ao vivo",v:stats.ao,c:"#ec4899"},{l:"Boletins",v:stats.bol,c:"#14b8a6"},{l:"YouTube",v:fmt(stats.yt),c:"#a855f7"}].map(s => (
          <div key={s.l} style={{background:"#1a1a1a",borderRadius:10,padding:"12px 10px",textAlign:"center",border:"1px solid #222"}}>
            <div style={{fontSize:20,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:10,color:"#555",marginTop:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar evento ou repórter..." style={{...I,width:220,padding:"6px 12px"}}/>
        <select value={fMod} onChange={e => setFMod(e.target.value)} style={{...I,width:"auto",padding:"6px 10px"}}>
          <option>Todas</option>
          {MODS.map(m => <option key={m}>{m}</option>)}
        </select>
        <span style={{fontSize:12,color:"#555",alignSelf:"center"}}>{filtered.length} registro{filtered.length!==1?"s":""}</span>
      </div>

      {/* VAZIO */}
      {Object.keys(dados).length===0 ? (
        <div style={{textAlign:"center",padding:"60px 0",color:"#333"}}>
          <div style={{fontSize:32,marginBottom:12}}>📋</div>
          <div style={{fontSize:15,marginBottom:8,color:"#555"}}>Nenhum mês criado ainda</div>
          <div style={{fontSize:12,color:"#444"}}>Clique em "+ Mês" para começar</div>
        </div>
      ) : filtered.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 0",color:"#333"}}>
          <div style={{fontSize:32,marginBottom:12}}>🔍</div>
          <div style={{fontSize:15,marginBottom:16,color:"#555"}}>Nenhum registro encontrado</div>
          <button onClick={() => openForm()} style={{background:"#ef4444",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:600}}>+ Nova externa</button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {filtered.map(row => {
            const c = COR[row.mod]||"#888";
            const isExp = exp===row.id;
            return (
              <div key={row.id} style={{background:"#141414",border:`1px solid ${isExp?c+"55":"#1e1e1e"}`,borderRadius:12,overflow:"hidden"}}>
                <div onClick={() => setExp(isExp?null:row.id)} style={{display:"grid",gridTemplateColumns:"60px 1fr 140px 100px 55px 80px 65px",gap:8,padding:"12px 14px",cursor:"pointer",alignItems:"center"}}>
                  <div style={{fontSize:11,color:"#555"}}>{row.data||"—"}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6,color:"#eee"}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block",flexShrink:0}}></span>
                      {row.evento}
                      {row.pauta&&<span style={{fontSize:9,background:c+"22",color:c,border:`1px solid ${c}44`,borderRadius:4,padding:"1px 5px",fontWeight:700}}>PAUTA</span>}
                    </div>
                    <div style={{fontSize:11,color:"#555",marginTop:2}}>{row.rep}</div>
                  </div>
                  <span style={{background:c+"15",color:c,border:`1px solid ${c}33`,borderRadius:20,fontSize:10,padding:"3px 9px",fontWeight:600,whiteSpace:"nowrap",justifySelf:"start"}}>{row.mod}</span>
                  <div style={{fontSize:11,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.local||"—"}</div>
                  <div style={{fontSize:12,color:"#666",textAlign:"center"}}>{row.posts||"—"}</div>
                  <div style={{fontSize:12,fontWeight:600,color:row.nums?"#3b82f6":"#444"}}>{fmt(row.nums)}</div>
                  <div style={{fontSize:11,color:"#555",textAlign:"center"}}>{row.ao?`${row.ao}x ao vivo`:"—"}</div>
                </div>
                {isExp&&(
                  <div style={{borderTop:"1px solid #1e1e1e",padding:"14px 16px",background:"#0f0f0f"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                      <div>
                        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,fontWeight:600}}>Detalhes</div>
                        {[["Repórter",row.rep||"—"],["Local",row.local||"—"],["Posts",row.posts||"—"],["Ao vivo",row.ao||"—"],["Boletins",row.bol||"—"],["YouTube",fmt(row.yt)],["Alcance",row.nums?.toLocaleString("pt-BR")||"—"]].map(([k,v])=>(
                          <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                            <span style={{color:"#555"}}>{k}</span>
                            <span style={{color:"#bbb",fontWeight:500}}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,fontWeight:600}}>Pauta / Briefing</div>
                        {row.pauta
                          ?<div style={{fontSize:12,color:"#aaa",background:"#1a1a1a",borderRadius:8,padding:"10px 12px",lineHeight:1.6,whiteSpace:"pre-wrap",maxHeight:140,overflowY:"auto"}}>{row.pauta}</div>
                          :<div style={{fontSize:12,color:"#444",fontStyle:"italic"}}>Nenhuma pauta cadastrada.</div>
                        }
                        <button onClick={()=>openPauta(row)} style={{marginTop:8,background:"#1a1a1a",border:`1px solid ${c}44`,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,color:c,fontWeight:600}}>{row.pauta?"Editar pauta":"Adicionar pauta"}</button>
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

      {/* MODAL PAUTA */}
      {modal?.type==="pauta"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setModal(null)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:16,padding:"24px",width:"min(520px,92vw)",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700,fontSize:15,color:"#eee",marginBottom:4}}>{modal.row.evento}</div>
            <div style={{fontSize:11,color:"#555",marginBottom:14}}>{modal.row.data} · {modal.row.rep}</div>
            <textarea id="pautaArea" defaultValue={modal.row.pauta} placeholder="Descreva a pauta, ângulo editorial, entrevistados, objetivos..." style={{...I,minHeight:180,resize:"vertical",lineHeight:1.6}}/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
              <button onClick={()=>setModal(null)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,color:"#888"}}>Cancelar</button>
              <button onClick={()=>{salvarPauta(modal.row.id,document.getElementById("pautaArea").value);setModal(null);}} style={{background:"#ef4444",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:600}}>Salvar pauta</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {modal==="form"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setModal(null)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:16,padding:"24px",width:"min(500px,92vw)",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700,fontSize:15,color:"#eee",marginBottom:18}}>{editId?"Editar registro":"Nova externa"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div style={{gridColumn:"1/-1"}}>
                <div style={{fontSize:11,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Evento</div>
                <input style={I} value={form.evento} onChange={e=>setForm(f=>({...f,evento:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:11,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Data</div>
                <input style={I} placeholder="dd/mm" value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:11,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Modalidade</div>
                <select style={I} value={form.mod} onChange={e=>setForm(f=>({...f,mod:e.target.value}))}>
                  {MODS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <div style={{fontSize:11,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Repórter</div>
                <input style={I} value={form.rep} onChange={e=>setForm(f=>({...f,rep:e.target.value}))}/>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <div style={{fontSize:11,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Local</div>
                <input style={I} placeholder="Ex: Allianz Parque, São Paulo" value={form.local} onChange={e=>setForm(f=>({...f,local:e.target.value}))}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[["Posts","posts"],["Alcance","nums"],["Ao vivo","ao"],["Boletins","bol"],["YouTube","yt"]].map(([l,k])=>(
                <div key={k}>
                  <div style={{fontSize:11,color:"#555",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
                  <input type="number" style={I} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:Number(e.target.value)}))}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(null)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#888"}}>Cancelar</button>
              <button onClick={salvar} style={{background:"#ef4444",border:"none",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO MÊS */}
      {novoMes&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setNovoMes(false)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:16,padding:"24px",width:"min(340px,92vw)",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700,fontSize:15,color:"#eee",marginBottom:14}}>Novo mês</div>
            <div style={{fontSize:11,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Nome (ex: Abril 2025)</div>
            <input value={novoMesNome} onChange={e=>setNovoMesNome(e.target.value)} placeholder="Abril 2025" style={I} autoFocus/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
              <button onClick={()=>setNovoMes(false)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#888"}}>Cancelar</button>
              <button onClick={()=>{
                if(novoMesNome.trim()){
                  salvarDados({...dados,[novoMesNome.trim()]:[]});
                  setMes(novoMesNome.trim());
                  setNovoMesNome("");
                  setNovoMes(false);
                }
              }} style={{background:"#ef4444",border:"none",borderRadius:8,padding:"9px 20px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
