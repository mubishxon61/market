import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { products } = useProducts()
  const { addToCart, cart } = useCart()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)

  const product = products.find(p => p.id === parseInt(id))
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)
  const inCart = cart.find(i => i.id === product?.id)

  if (!product) return (
    <div className="page"><div className="container">
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <div className="empty-title">Mahsulot topilmadi</div>
        <Link to="/shop" className="btn btn-primary">Do'konga qaytish</Link>
      </div>
    </div></div>
  )

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:24, fontSize:'0.85rem', color:'var(--text2)' }}>
          <Link to="/" style={{ color:'var(--text3)' }}>Bosh sahifa</Link>
          <span>›</span>
          <Link to="/shop" style={{ color:'var(--text3)' }}>Do'kon</Link>
          <span>›</span>
          <span style={{ color:'var(--text)' }}>{product.name}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>
          {/* Image */}
          <div className="detail-img-wrap fade-up">
            <img src={product.img} alt={product.name} />
          </div>

          {/* Info */}
          <div className="fade-up fade-up-delay-1">
            <div className="tag tag-blue" style={{ marginBottom:14 }}>{product.category}</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, lineHeight:1.2, marginBottom:12 }}>
              {product.name}
            </h1>
            <p style={{ color:'var(--text2)', marginBottom:24, lineHeight:1.7 }}>{product.desc}</p>

            <div className="detail-price" style={{ marginBottom:24 }}>
              {product.price.toLocaleString()} so'm
            </div>

            {/* Qty */}
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <span style={{ fontWeight:600, fontSize:'0.9rem' }}>Miqdor:</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                <div className="qty-num">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
              </div>
              {inCart && <span className="tag tag-green">Savatda: {inCart.qty} ta</span>}
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button
                onClick={() => {
                  for(let i = 0; i < qty; i++) addToCart(product)
                  toast(`${qty} ta ${product.name} savatga qo'shildi!`)
                }}
                className="btn btn-primary btn-lg"
                style={{ flex:1 }}
              >🛒 Savatga qo'shish</button>
              <Link to="/cart" className="btn btn-dark btn-lg">Savatni ko'rish →</Link>
            </div>

            {/* Features */}
            <div className="box" style={{ marginTop:28 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {['✅ Sifat kafolati','🚚 Tez yetkazib berish','🔄 Qaytarish imkoni','💯 100% asl mahsulot'].map(f => (
                  <div key={f} style={{ fontSize:'0.85rem', color:'var(--text2)' }}>{f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop:60 }}>
            <h2 className="page-title" style={{ fontSize:'1.3rem', marginBottom:24 }}>O'xshash mahsulotlar</h2>
            <div className="grid-products">
              {related.map(item => (
                <div key={item.id} className="product-card">
                  <div className="card-img-wrap">
                    <img src={item.img} alt={item.name} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <div className="card-name">{item.name}</div>
                    <div className="card-price">{item.price.toLocaleString()} so'm</div>
                    <div className="card-actions">
                      <button onClick={() => { addToCart(item); toast('Savatga qo\'shildi!') }} className="btn btn-primary btn-sm" style={{flex:1}}>🛒</button>
                      <Link to={`/product/${item.id}`} className="btn btn-outline btn-sm">Ko'rish</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
