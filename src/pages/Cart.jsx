import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const SHIPPING = 50000
const DISCOUNT_RATE = 0.05

export default function Cart() {
  const { cart, updateQty, removeFromCart, total } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  if (cart.length === 0) return (
    <div className="page">
      <div className="container" style={{ maxWidth:520, textAlign:'center' }}>
        <div style={{ fontSize:'5rem', marginBottom:16 }}>🛒</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:800, marginBottom:10 }}>Savat bo'sh</h1>
        <p style={{ color:'var(--text2)', marginBottom:28 }}>Xarid qilishni boshlang va mahsulotlar bu yerda paydo bo'ladi</p>
        <Link to="/shop" className="btn btn-primary btn-lg">🛍 Xarid qilish</Link>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginTop:40 }}>
          {[['✨','Eng yaxshi narxlar'],['🚚','Tez yetkazib berish'],['💯','Sifat kafolati']].map(([icon,lbl])=>(
            <div key={lbl} className="box" style={{ textAlign:'center', padding:16 }}>
              <div style={{ fontSize:'1.6rem', marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:'0.8rem', fontWeight:600 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const discount = Math.round(total * DISCOUNT_RATE)
  const finalTotal = total + SHIPPING - discount

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🛒 Savat</h1>
          <p className="page-subtitle">{cart.length} xil mahsulot</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:28, alignItems:'start' }}>
          {/* Items */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-item-img" />
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-cat">{item.category}</div>
                  <div className="cart-item-price">{item.price.toLocaleString()} so'm</div>
                </div>
                <div className="cart-item-right">
                  <button onClick={() => { removeFromCart(item.id); toast('O\'chirildi','error') }}
                    className="btn btn-ghost btn-sm btn-icon" style={{ color:'var(--danger)' }}>✕</button>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty-1)}>−</button>
                    <div className="qty-num">{item.qty}</div>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty+1)}>+</button>
                  </div>
                  <div className="cart-item-total">{(item.price*item.qty).toLocaleString()} so'm</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="order-summary">
            <div className="summary-title">📋 Buyurtma xulasasi</div>
            <div className="summary-row">
              <span style={{ color:'var(--text2)' }}>Mahsulotlar ({cart.reduce((s,i)=>s+i.qty,0)} dona)</span>
              <span style={{ fontWeight:600 }}>{total.toLocaleString()} so'm</span>
            </div>
            <div className="summary-row">
              <span style={{ color:'var(--text2)' }}>🚚 Yetkazib berish</span>
              <span style={{ fontWeight:600, color:'var(--text)' }}>{SHIPPING.toLocaleString()} so'm</span>
            </div>
            <div className="summary-row">
              <span style={{ color:'var(--success)', fontWeight:600 }}>🎁 Chegirma (5%)</span>
              <span style={{ fontWeight:600, color:'var(--success)' }}>−{discount.toLocaleString()} so'm</span>
            </div>
            <div className="summary-row total">
              <span style={{ fontWeight:800, fontSize:'1.05rem' }}>Jami to'lov</span>
              <span className="summary-total">{finalTotal.toLocaleString()} so'm</span>
            </div>
            {user ? (
              <Link to="/checkout" className="btn btn-primary btn-full btn-lg" style={{ marginTop:20, display:'flex' }}>
                Buyurtma berish →
              </Link>
            ) : (
              <Link to="/login" className="btn btn-dark btn-full btn-lg" style={{ marginTop:20, display:'flex' }}>
                🔐 Kirish (buyurtma uchun)
              </Link>
            )}
            <Link to="/shop" className="btn btn-outline btn-full" style={{ marginTop:10, display:'flex' }}>
              ← Xarid davom ettirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
