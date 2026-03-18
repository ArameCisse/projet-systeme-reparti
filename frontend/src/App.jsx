import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE || '/api', [])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${apiBase}/products/`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setProducts(data)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur inconnue')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [apiBase])

  return (
    <>
      <h1>Produits</h1>
      <p style={{ opacity: 0.8 }}>Source API: <code>{apiBase}/products/</code></p>
      {loading && <p>Chargement…</p>}
      {error && (
        <p style={{ color: 'crimson' }}>
          Erreur: {error} (vérifie que l’API Django tourne sur <code>localhost:8000</code>)
        </p>
      )}
      {!loading && !error && (
        <ul style={{ textAlign: 'left', maxWidth: 720, margin: '16px auto' }}>
          {products.map((p) => (
            <li key={p.id} style={{ marginBottom: 12 }}>
              <strong>{p.name}</strong> — {Number(p.price).toFixed(2)} €
              {p.description ? <div style={{ opacity: 0.8 }}>{p.description}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default App
