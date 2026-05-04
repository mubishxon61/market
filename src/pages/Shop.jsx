import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const PER_PAGE = 9

export default function Shop() {
  const { products, categories } = useProducts()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [cat, setCat] = useState('')
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setQ(searchParams.get('q') || '')
    setPage(1)
  }, [searchParams])

  let filtered = products
  if (cat) filtered = filtered.filter(p => p.category === cat)
  if (q.trim()) {
    const lq = q.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.desc?.toLowerCase().includes(lq) ||
      p.category.toLowerCase().includes(lq)
    )
  }
  if (sort === 'asc') filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sort === 'desc') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sort === 'name') filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name))

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const shown = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const handleCat = (c) => { setCat(c); setPage(1) }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🛍 Do'kon</h1>
          <p className="page-subtitle">Barcha mahsulotlar bir joyda</p>
        </div>

        {/* Search + Sort */}
        <div className="sort-bar">
          <input
            type="text" value={q} onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder="🔍 Mahsulot qidirish..."
            className="form-input" style={{ maxWidth: 320, marginBottom: 0 }}
          />
          <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
            <option value="default">Saralash</option>
            <option value="asc">💰 Arzondan qimmatga</option>
            <option value="desc">💎 Qimmatdan arzonga</option>
            <option value="name">🔤 Nomi bo'yicha</option>
          </select>
          <span className="result-count">{filtered.length} ta mahsulot</span>
        </div>

        {/* Category filter */}
        <div className="cat-filter" style={{ marginBottom: 28 }}>
          <button className={`cat-btn ${cat===''?'active':''}`} onClick={() => handleCat('')}>Hammasi</button>
          {categories.map(c => (
            <button key={c.id} className={`cat-btn ${cat===c.name?'active':''}`} onClick={() => handleCat(c.name)}>
              {c.name}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Mahsulot topilmadi</div>
            <p className="empty-text">Boshqa kalit so'z yoki kategoriya tanlang</p>
            <button className="btn btn-primary" onClick={() => { setQ(''); setCat('') }}>Filterni tozalash</button>
          </div>
        ) : (
          <>
            <div className="grid-products">
              {shown.map(item => (
                <div key={item.id} className="product-card">
                  <div className="card-img-wrap">
                    <img src={item.img} alt={item.name} loading="lazy" />
                    <span className="card-badge">{item.category}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-category">{item.category}</div>
                    <div className="card-name">{item.name}</div>
                    <div className="card-desc">{item.desc}</div>
                    <div className="card-price">{item.price.toLocaleString()} so'm</div>
                    <div className="card-actions">
                      <button
                        onClick={() => { addToCart(item); toast(`${item.name} savatga qo'shildi!`) }}
                        className="btn btn-primary btn-sm" style={{ flex:1 }}
                      >🛒 Savatga</button>
                      <Link to={`/product/${item.id}`} className="btn btn-outline btn-sm">Ko'rish</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>←</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>→</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
