import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const PER_PAGE = 8

export default function Home() {
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(products.length / PER_PAGE)
  const shown = products.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="container hero-content">
          <div className="hero-tag">🔥 Yangi kolleksiya 2026</div>
          <h1 className="hero-title">
            Eng yaxshi<br />mahsulotlar — <span>arzon</span>
          </h1>
          <p className="hero-desc">
            Mini Marketda sifatli mahsulotlar qulay narxlarda. Tez yetkazib berish va qaytarish kafolati.
          </p>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">
              🛍 Xarid qilish
            </Link>
            <Link to="/shop" className="btn btn-lg" style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.25)' }}>
              Kategoriyalar →
            </Link>
          </div>
          <div className="hero-stats">
            <div><div className="hero-stat-num">{products.length}+</div><div className="hero-stat-lbl">Mahsulotlar</div></div>
            <div><div className="hero-stat-num">1k+</div><div className="hero-stat-lbl">Mijozlar</div></div>
            <div><div className="hero-stat-num">24h</div><div className="hero-stat-lbl">Yetkazib berish</div></div>
          </div>
        </div>
        <div className="hero-img">🛍</div>
      </div>

      {/* PRODUCTS */}
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h2 className="page-title">Mashhur mahsulotlar</h2>
            <p className="page-subtitle">Eng ko'p sotib olinayotgan mahsulotlar</p>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-title">Mahsulot yo'q</div>
              <p className="empty-text">Admin tomonidan mahsulotlar qo'shilishi kutilmoqda</p>
            </div>
          ) : (
            <>
              <div className="grid-products">
                {shown.map((item, i) => (
                  <div key={item.id} className={`product-card fade-up fade-up-delay-${Math.min(i % 4 + 1, 3)}`}>
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
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                        >🛒 Savatga</button>
                        <Link to={`/product/${item.id}`} className="btn btn-outline btn-sm">Ko'rish</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
