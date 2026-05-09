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

function formatCard(val) {
  const digits = val.replace(/\D/g,'').slice(0,16)
  return digits.replace(/(\d{4})(?=\d)/g,'$1 ').trim()
}
function formatExpiry(val) {
  const digits = val.replace(/\D/g,'').slice(0,4)
  if (digits.length >= 3) return digits.slice(0,2) + '/' + digits.slice(2)
  return digits
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState('cash')
  const [delivery, setDelivery] = useState({ city:'', address:'', phone:'' })
  const [card, setCard] = useState({ number:'', expiry:'', cvv:'', name:'' })

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
    if (!delivery.phone.trim()) return toast('Telefon raqam kiriting!', 'error')
    if (!delivery.address.trim()) return toast('Manzil kiriting!', 'error')
    if (payment === 'card') {
      if (card.number.replace(/\s/g,'').length < 16) return toast('Karta raqamini to\'liq kiriting!', 'error')
      if (card.expiry.length < 5) return toast('Karta muddatini kiriting!', 'error')
      if (card.cvv.length < 3) return toast('CVV kiriting!', 'error')
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
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
                {[{label:'Email', val:user?.email},{label:'Ism', val:user?.name}].map(({label,val})=>(
                  <div key={label} style={{ padding:'10px 14px', background:'var(--surface2)', borderRadius:10 }}>
                    <span style={{ color:'var(--text3)', fontSize:'0.78rem' }}>{label}</span>
                    <div style={{ fontWeight:600 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="box">
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>📍 Yetkazib berish manzili</h3>
              <div style={{ display:'grid', gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Shahar</label>
                  <select
                    className="form-input"
                    value={delivery.city}
                    onChange={e => setDelivery(d=>({...d, city:e.target.value}))}
                    style={{ cursor:'pointer' }}
                  >
                    <option value="">— Shaharni tanlang —</option>
                    {['Toshkent','Samarqand','Buxoro','Namangan','Andijon','Farg\'ona','Nukus','Qarshi','Termiz','Jizzax','Sirdaryo','Navoiy','Urganch','Guliston'].map(c=>(
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ko'cha, uy raqami *</label>
                  <input
                    className="form-input"
                    placeholder="Amir Temur ko'chasi, 1-uy, 5-xonadon"
                    autoComplete="off"
                    value={delivery.address}
                    onChange={e => setDelivery(d=>({...d, address:e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon raqami *</label>
                  <input
                    className="form-input"
                    placeholder="+998 90 123 45 67"
                    autoComplete="off"
                    inputMode="tel"
                    value={delivery.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9+\s\-()]/g,'')
                      setDelivery(d=>({...d, phone:val}))
                    }}
                  />
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

              {/* Card fields */}
              {payment === 'card' && (
                <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:12, padding:16, background:'var(--surface2)', borderRadius:12, border:'1.5px solid var(--border)' }}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Karta raqami</label>
                    <input
                      className="form-input"
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      autoComplete="off"
                      value={card.number}
                      maxLength={19}
                      onChange={e => setCard(c=>({...c, number:formatCard(e.target.value)}))}
                      style={{ letterSpacing:'0.1em', fontWeight:600, fontSize:'1.05rem' }}
                    />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div className="form-group" style={{margin:0}}>
                      <label className="form-label">Amal qilish muddati</label>
                      <input
                        className="form-input"
                        placeholder="MM/YY"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={5}
                        value={card.expiry}
                        onChange={e => setCard(c=>({...c, expiry:formatExpiry(e.target.value)}))}
                        style={{ fontWeight:600 }}
                      />
                    </div>
                    <div className="form-group" style={{margin:0}}>
                      <label className="form-label">CVV</label>
                      <input
                        className="form-input"
                        placeholder="***"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={3}
                        type="password"
                        value={card.cvv}
                        onChange={e => setCard(c=>({...c, cvv:e.target.value.replace(/\D/g,'').slice(0,3)}))}
                        style={{ fontWeight:600 }}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Karta egasining ismi</label>
                    <input
                      className="form-input"
                      placeholder="JOHN DOE"
                      autoComplete="off"
                      value={card.name}
                      onChange={e => setCard(c=>({...c, name:e.target.value.toUpperCase()}))}
                      style={{ letterSpacing:'0.05em', fontWeight:600 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart items */}
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
