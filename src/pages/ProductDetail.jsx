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
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0,4)
  const inCart = cart.find(i => i.id === product?.id)

  if (!product) return (
    <div className="page"><div className="container">
      <div className="empty-state">
        <div className="empty-icon">S</div>
        <div className="empty-title">Mahsulot topilmadi</div>
        <Link to="/shop" className="btn btn-primary">Dokonga qaytish</Link>
      </div>
    </div></div>
  )

  return (
    <div className="page">
      <div className="container">

        <div className="breadcrumb">
          <Link to="/" className="bc-link">Bosh sahifa</Link>
          <span className="bc-sep">-</span>
          <Link to="/shop" className="bc-link">Dokon</Link>
          <span className="bc-sep">-</span>
          <span className="bc-cur">{product.name}</span>
        </div>

        <div className="pd-grid">
          <div className="pd-img-col">
            <div className="pd-img-wrap">
              <img
                src={product.img}
                alt={product.name}
                className="pd-img"
                onError={e => e.target.src='https://via.placeholder.com/500x500?text=Rasm'}
              />
            </div>
          </div>

          <div className="pd-info-col">
            <span className="tag tag-blue pd-tag">{product.category}</span>
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-desc">{product.desc}</p>
            <div className="pd-price">{(product.price||0).toLocaleString()} som</div>

            <div className="pd-qty-row">
              <span className="pd-qty-label">Miqdor:</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
                <div className="qty-num">{qty}</div>
                <button className="qty-btn" onClick={()=>setQty(q=>q+1)}>+</button>
              </div>
              {inCart && <span className="tag tag-green">Savatda: {inCart.qty} ta</span>}
            </div>

            <div className="pd-actions">
              <button className="btn btn-primary btn-lg pd-btn-main"
                onClick={()=>{ for(let i=0;i<qty;i++) addToCart(product); toast(qty+' ta mahsulot savatga qoshildi!') }}>
                Savatga qoshish
              </button>
              <Link to="/cart" className="btn btn-dark btn-lg pd-btn-cart">Savatni korish</Link>
            </div>

            <div className="box pd-features-box">
              <div className="pd-features-grid">
                <div className="pd-feature-item">Sifat kafolati</div>
                <div className="pd-feature-item">Tez yetkazib berish</div>
                <div className="pd-feature-item">Qaytarish imkoni</div>
                <div className="pd-feature-item">100% asl mahsulot</div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="pd-related-title">Oxshash mahsulotlar</h2>
            <div className="grid-products">
              {related.map(item => (
                <div key={item.id} className="product-card">
                  <div className="card-img-wrap">
                    <img src={item.img} alt={item.name} loading="lazy"
                      onError={e=>e.target.src='https://via.placeholder.com/400x300?text=Rasm'} />
                  </div>
                  <div className="card-body">
                    <div className="card-name">{item.name}</div>
                    <div className="card-price">{(item.price||0).toLocaleString()} som</div>
                    <div className="card-actions">
                      <button onClick={()=>{addToCart(item);toast('Savatga qoshildi!')}}
                        className="btn btn-primary btn-sm" style={{flex:1}}>Savat</button>
                      <Link to={'/product/'+item.id} className="btn btn-outline btn-sm">Korish</Link>
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
