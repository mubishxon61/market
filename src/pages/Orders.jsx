import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

export default function Orders() {
  const { user } = useAuth()
  const { getUserOrders } = useOrders()

  if (!user) return (
    <div className="page"><div className="container" style={{ maxWidth:480, textAlign:'center' }}>
      <div style={{ fontSize:'4rem', marginBottom:16 }}>🔐</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, marginBottom:12 }}>Kirish kerak</h2>
      <p style={{ color:'var(--text2)', marginBottom:20 }}>Buyurtmalarni ko'rish uchun profilingizga kiring</p>
      <Link to="/login" className="btn btn-primary">Kirish →</Link>
    </div></div>
  )

  const orders = getUserOrders(user.id)

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:860 }}>
        <div className="page-header">
          <h1 className="page-title">📦 Mening buyurtmalarim</h1>
          <p className="page-subtitle">{orders.length} ta buyurtma</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">Hali buyurtma yo'q</div>
            <p className="empty-text">Birinchi buyurtmangizni bering!</p>
            <Link to="/shop" className="btn btn-primary">Xarid qilish →</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[...orders].reverse().map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-head">
                  <div>
                    <div style={{ fontWeight:800, fontFamily:'var(--font-display)' }}>Buyurtma #{order.id}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text2)', marginTop:3 }}>{order.date} — {order.time}</div>
                  </div>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <span className={`tag ${order.status==='completed'?'tag-green':'tag-yellow'}`} style={{ padding:'5px 14px' }}>
                      {order.status==='completed' ? '✅ Tugatildi' : '⏳ Kutilmoqda'}
                    </span>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'var(--accent)', fontSize:'1.1rem' }}>
                      {order.total.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
                <div className="order-card-body">
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.9rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <img src={item.img} alt={item.name} style={{ width:44, height:44, borderRadius:8, objectFit:'cover' }} />
                          <div>
                            <div style={{ fontWeight:600 }}>{item.name}</div>
                            <div style={{ color:'var(--text3)', fontSize:'0.78rem' }}>×{item.qty}</div>
                          </div>
                        </div>
                        <span style={{ fontWeight:700 }}>{(item.price*item.qty).toLocaleString()} so'm</span>
                      </div>
                    ))}
                  </div>
                  {order.delivery && (
                    <div style={{ marginTop:16, padding:'10px 14px', background:'var(--surface2)', borderRadius:10, fontSize:'0.85rem', color:'var(--text2)' }}>
                      📍 {order.delivery.address}{order.delivery.city ? `, ${order.delivery.city}` : ''} | 📞 {order.delivery.phone}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
