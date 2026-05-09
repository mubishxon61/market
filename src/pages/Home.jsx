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
  const shown = products.slice((page-1)*PER_PAGE, page*PER_PAGE)

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="container hero-content">
          <div className="hero-tag">🔥 Yangi kolleksiya 2026</div>
          <h1 className="hero-title">
            Eng yaxshi<br />mahsulotlar — <span>arzon</span>
          </h1>
          <p className="hero-desc">Mini Marketda sifatli mahsulotlar qulay narxlarda. Tez yetkazib berish va qaytarish kafolati.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn btn-primary btn-lg">🛍 Xarid qilish</Link>
            <Link to="/shop" className="btn btn-white btn-lg">Katalog →</Link>
          </div>
          <div className="hero-stats">
            <div><div className="hero-stat-num">{products.length}+</div><div className="hero-stat-lbl">Mahsulotlar</div></div>
            <div><div className="hero-stat-num">1k+</div><div className="hero-stat-lbl">Mijozlar</div></div>
            <div><div className="hero-stat-num">24h</div><div className="hero-stat-lbl">Yetkazib berish</div></div>
          </div>
        </div>
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
            </div>
          ) : (
            <>
              <div className="grid-products">
                {shown.map(item => (
                  <div key={item.id} className="product-card fade-up">
                    <div className="card-img-wrap">
                      <img src={item.img} alt={item.name} loading="lazy"
                        onError={e => { e.target.src='https://via.placeholder.com/400x300?text=Rasm+yuklanmadi' }} />
                      <span className="card-badge">{item.category}</span>
                    </div>
                    <div className="card-body">
                      <div className="card-category">{item.category}</div>
                      <div className="card-name">{item.name}</div>
                      <div className="card-desc">{item.desc}</div>
                      <div className="card-price">{item.price.toLocaleString()} so'm</div>
                      <div className="card-actions">
                        <button onClick={() => { addToCart(item); toast(`Savatga qo'shildi!`) }}
                          className="btn btn-primary btn-sm" style={{flex:1}}>🛒 Savatga</button>
                        <Link to={`/product/${item.id}`} className="btn btn-outline btn-sm">Ko'rish</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>←</button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                    <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* WHY US */}
      <div style={{ background:'var(--surface)', padding:'64px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontWeight:900, fontSize:'clamp(1.4rem,3vw,1.8rem)', marginBottom:8 }}>Nima uchun biz?</h2>
            <p style={{ color:'var(--text3)', fontSize:'0.95rem' }}>Mini Market ning afzalliklari</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
            {[
              { icon:'🚚', title:"Tez yetkazib berish", desc:"Toshkent bo'ylab 2-4 soatda, viloyatlarga 1-2 kunda", color:'#3b82f6' },
              { icon:'💯', title:"Sifat kafolati", desc:"Barcha mahsulotlar sertifikatlangan va tekshiruvidan o'tgan", color:'#10b981' },
              { icon:'🔄', title:"Qaytarish imkoni", desc:"14 kun ichida muammosiz qaytarish yoki almashtirish", color:'#f59e0b' },
              { icon:'💳', title:"Qulay to'lov", desc:"Naqd, karta, Click va Payme orqali to'lash mumkin", color:'#e94560' },
            ].map(f=>(
              <div key={f.title} style={{
                background:'var(--surface)',
                border:'1.5px solid var(--border)',
                borderRadius:16,
                padding:'28px 24px',
                textAlign:'center',
                boxShadow:'var(--shadow)',
                transition:'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-lg)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow)'}}
              >
                <div style={{
                  width:56, height:56, borderRadius:14,
                  background: f.color + '15',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.6rem', margin:'0 auto 16px'
                }}>{f.icon}</div>
                <div style={{ fontWeight:800, fontSize:'0.97rem', marginBottom:8 }}>{f.title}</div>
                <div style={{ color:'var(--text3)', fontSize:'0.83rem', lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRANCHES PROMO */}
      <div style={{ background:'var(--primary)', padding:'52px 0' }}>
        <div className="container">
          <div className="branches-promo-cols">
            <div className="branches-promo-text">
              <div className="branches-promo-badge">
                O'zbekiston bo'ylab
              </div>
              <h2 className="branches-promo-title">
                Bizning <span style={{ color:'var(--accent)' }}>6 ta filial</span> sizga yaqin!
              </h2>
              <p className="branches-promo-desc">
                Toshkent, Samarqand, Namangan, Andijon va boshqa shaharlarda xizmat ko'rsatamiz.
              </p>
              <div className="branches-promo-btns">
                <a href="/branches" className="btn btn-primary btn-lg">Filiallarni ko'rish</a>
                <a href="/branches" className="btn btn-white btn-lg" style={{color:'var(--primary)'}}>Yaqinini topish</a>
              </div>
            </div>
            <div className="branches-city-cards">
              {[
                { city:'Toshkent', count:'3 ta filial', icon:'T' },
                { city:'Samarqand', count:'1 ta filial', icon:'S' },
                { city:'Namangan', count:'1 ta filial', icon:'N' },
                { city:'Andijon', count:'1 ta filial', icon:'A' },
              ].map(c=>(
                <a href="/branches" key={c.city} className="branches-city-card">
                  <div className="branches-city-icon">{c.icon}</div>
                  <div className="branches-city-name">{c.city}</div>
                  <div className="branches-city-count">{c.count}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}