'use client'
import { useEffect, useState } from 'react'

const VAZIO = { data: '', reporter: '', titulo: '', conteudo: '' }

export default function Home() {
  const [pautas, setPautas] = useState([])
  const [form, setForm] = useState(VAZIO)
  const [editando, setEditando] = useState(null)
  const [filtroData, setFiltroData] = useState('')
  const [expandido, setExpandido] = useState(null)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const res = await fetch('/api/pautas')
    const data = await res.json()
    setPautas(data.sort((a, b) => a.data.localeCompare(b.data)))
  }

  async function salvar() {
    if (!form.data || !form.reporter || !form.titulo) return alert('Preencha data, repórter e título.')
    if (editando) {
      await fetch('/api/pautas', { method: 'PUT', body: JSON.stringify({ ...form, id: editando }) })
      setEditando(null)
    } else {
      await fetch('/api/pautas', { method: 'POST', body: JSON.stringify(form) })
    }
    setForm(VAZIO)
    carregar()
  }

  async function deletar(id) {
    if (!confirm('Deletar esta pauta?')) return
    await fetch('/api/pautas', { method: 'DELETE', body: JSON.stringify({ id }) })
    carregar()
  }

  function editar(p) {
    setForm({ data: p.data, reporter: p.reporter, titulo: p.titulo, conteudo: p.conteudo })
    setEditando(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setForm(VAZIO)
    setEditando(null)
  }

  const exibidas = filtroData ? pautas.filter(p => p.data === filtroData) : pautas

  // Agrupar por data
  const porData = exibidas.reduce((acc, p) => {
    acc[p.data] = acc[p.data] || []
    acc[p.data].push(p)
    return acc
  }, {})

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">📋 Pautas CazéTV</h1>

      {/* Formulário */}
      <div className="bg-white border rounded-xl p-5 mb-8 shadow-sm">
        <h2 className="font-semibold mb-4 text-lg">{editando ? '✏️ Editar Pauta' : '➕ Nova Pauta'}</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm text-gray-500">Data</label>
            <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-500">Repórter</label>
            <input type="text" placeholder="Nome do repórter" value={form.reporter}
              onChange={e => setForm({ ...form, reporter: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-sm text-gray-500">Título da Pauta</label>
          <input type="text" placeholder="Título resumido" value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500">Pauta completa</label>
          <textarea placeholder="Descreva a pauta completa..." value={form.conteudo}
            onChange={e => setForm({ ...form, conteudo: e.target.value })}
            rows={5} className="w-full border rounded-lg px-3 py-2 mt-1 resize-y" />
        </div>
        <div className="flex gap-2">
          <button onClick={salvar}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium">
            {editando ? 'Salvar edição' : 'Adicionar pauta'}
          </button>
          {editando && (
            <button onClick={cancelar}
              className="border px-5 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-500 whitespace-nowrap">Filtrar por data:</label>
        <input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)}
          className="border rounded-lg px-3 py-2" />
        {filtroData && (
          <button onClick={() => setFiltroData('')} className="text-sm text-blue-600 hover:underline">
            Limpar
          </button>
        )}
      </div>

      {/* Lista agrupada por data */}
      {Object.keys(porData).length === 0 && (
        <p className="text-center text-gray-400 py-10">Nenhuma pauta cadastrada.</p>
      )}

      {Object.entries(porData).map(([data, grupo]) => (
        <div key={data} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            📅 {new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex flex-col gap-3">
            {grupo.map(p => (
              <div key={p.id} className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{p.titulo}</p>
                    <p className="text-sm text-gray-500">👤 {p.reporter}</p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => editar(p)}
                      className="text-sm text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => deletar(p.id)}
                      className="text-sm text-red-500 hover:underline">Deletar</button>
                  </div>
                </div>
                {p.conteudo && (
                  <div className="mt-2">
                    <button onClick={() => setExpandido(expandido === p.id ? null : p.id)}
                      className="text-sm text-blue-500 hover:underline">
                      {expandido === p.id ? 'Ocultar pauta ▲' : 'Ver pauta completa ▼'}
                    </button>
                    {expandido === p.id && (
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                        {p.conteudo}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
