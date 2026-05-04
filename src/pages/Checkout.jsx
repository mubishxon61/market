import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { useToast } from '../context/ToastContext'

const SHIPPING = 50000
const DISCOUNT_RATE = 0.05
const PAYMENTS = [
  { id:'cash', icon:'💵', label:"Naqd pul (yetkazib berganda)" },
  { id:'card', icon:'💳', label:"Karta bilan to'lash" },
  { id:'click', icon:'📱', label:"Click / Payme" },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState('cash')
  const [delivery, setDelivery] = useState({ city:'', address:'', phone:'' })

  if (cart.length === 0) return (
    <div className="page"><div className="container" style={{ textAlign:'center', maxWidth:480 }}>
      <div style={{ fontSize:'4rem', marginBottom:16 }}>🛒</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, marginBottom:12 }}>Savat bo'sh</h2>
      <Link to="/shop" className="btn btn-primary">Xarid qilish</Link>
    </div></div>
  )

  const discount = Math.round(total * DISCOUNT_RATE)
  const finalTotal = total + SHIPPING - discount

  const handleOrder = async () => {
    if (!delivery.phone) return toast('Telefon raqam kiriting!', 'error')
    if (!delivery.address) return toast('Manzil kiriting!', 'error')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    createOrder(cart, finalTotal, user, delivery, payment)
    clearCart()
    toast('Buyurtma muvaffaqiyatli qabul qilindi! 🎉')
    navigate('/orders')
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">💳 Buyurtmani tasdiqlash</h1>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:28, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* User info */}
            <div className="box">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>👤 Sizning ma'lumotlaringiz</h3>
              <div style={{ display:'grid', gap:8 }}>
                <div style={{ padding:'10px 14px', background:'var(--surface2)', borderRadius:10 }}>
                  <span style={{ color:'var(--text3)', fontSize:'0.78rem' }}>Email</span>
                  <div style={{ fontWeight:600 }}>{user?.email}</div>
                </div>
                <div style={{ padding:'10px 14px', background:'var(--surface2)', borderRadius:10 }}>
                  <span style={{ color:'var(--text3)', fontSize:'0.78rem' }}>Ism</span>
                  <div style={{ fontWeight:600 }}>{user?.name}</div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="box">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>📍 Yetkazib berish manzili</h3>
              <div style={{ display:'grid', gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Shahar</label>
                  <input className="form-input" placeholder="Toshkent" value={delivery.city} onChange={e => setDelivery(d=>({...d,city:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ko'cha, uy raqami *</label>
                  <input className="form-input" placeholder="Amir Temur ko'chasi, 1-uy" value={delivery.address} onChange={e => setDelivery(d=>({...d,address:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon raqami *</label>
                  <input className="form-input" placeholder="+998 90 123 45 67" value={delivery.phone} onChange={e => setDelivery(d=>({...d,phone:e.target.value}))} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="box">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>💰 To'lov usuli</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {PAYMENTS.map(p => (
                  <label key={p.id} className={`payment-option ${payment===p.id?'selected':''}`} onClick={() => setPayment(p.id)}>
                    <input type="radio" name="pay" value={p.id} checked={payment===p.id} onChange={()=>setPayment(p.id)} style={{ display:'none' }} />
                    <span className="payment-icon">{p.icon}</span>
                    <span style={{ fontWeight:500 }}>{p.label}</span>
                    {payment===p.id && <span style={{ marginLeft:'auto', color:'var(--accent)', fontWeight:700 }}>✓</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Items preview */}
            <div className="box">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>📦 Buyurtma tarkibi</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:240, overflowY:'auto' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.9rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <img src={item.img} alt={item.name} style={{ width:40, height:40, borderRadius:8, objectFit:'cover' }} />
                      <span>{item.name} <span style={{ color:'var(--text3)' }}>×{item.qty}</span></span>
                    </div>
                    <span style={{ fontWeight:700 }}>{(item.price*item.qty).toLocaleString()} so'm</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="order-summary">
            <div className="summary-title">📋 To'lov xulasasi</div>
            <div className="summary-row">
              <span style={{ color:'var(--text2)' }}>Mahsulotlar</span>
              <span style={{ fontWeight:600 }}>{total.toLocaleString()} so'm</span>
            </div>
            <div className="summary-row">
              <span style={{ color:'var(--text2)' }}>🚚 Yetkazib berish</span>
              <span style={{ fontWeight:600 }}>{SHIPPING.toLocaleString()} so'm</span>
            </div>
            <div className="summary-row">
              <span style={{ color:'var(--success)', fontWeight:600 }}>🎁 Chegirma (5%)</span>
              <span style={{ fontWeight:600, color:'var(--success)' }}>−{discount.toLocaleString()} so'm</span>
            </div>
            <div className="summary-row total">
              <span style={{ fontWeight:800 }}>Jami to'lov</span>
              <span className="summary-total">{finalTotal.toLocaleString()} so'm</span>
            </div>
            <button
              onClick={handleOrder}
              disabled={loading}
              className="btn btn-success btn-full btn-lg"
              style={{ marginTop:20 }}
            >
              {loading ? '⏳ Yuklanmoqda...' : '✅ Buyurtmani tasdiqlash'}
            </button>
            <p style={{ fontSize:'0.75rem', color:'var(--text3)', textAlign:'center', marginTop:12 }}>
              Buyurtma tasdiqlangandan so'ng kuryer siz bilan bog'lanadi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
