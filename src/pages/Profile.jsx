import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { getUserOrders } = useOrders()
  const navigate = useNavigate()

  if (!user) return (
    <div className="page"><div className="container" style={{ maxWidth:480, textAlign:'center' }}>
      <div style={{ fontSize:'4rem', marginBottom:16 }}>🔐</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, marginBottom:12 }}>Kirish kerak</h2>
      <Link to="/login" className="btn btn-primary">Kirish →</Link>
    </div></div>
  )

  const orders = getUserOrders(user.id)
  const completed = orders.filter(o => o.status === 'completed').length
  const initial = (user.name || user.email).charAt(0).toUpperCase()

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:900 }}>
        <div className="page-header">
          <h1 className="page-title">👤 Mening profilim</h1>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:24, alignItems:'start' }}>
          {/* Left card */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="box" style={{ textAlign:'center' }}>
              <div className="avatar" style={{ margin:'0 auto 16px' }}>{initial}</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.3rem' }}>{user.name || 'Foydalanuvchi'}</h2>
              <p style={{ color:'var(--text2)', fontSize:'0.875rem', marginTop:4 }}>{user.email}</p>
              <span className={`tag ${user.role==='admin'?'tag-red':'tag-blue'}`} style={{ marginTop:10, display:'inline-flex' }}>
                {user.role==='admin' ? '⚙️ Admin' : '👤 Foydalanuvchi'}
              </span>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:20 }}>
                <div style={{ background:'var(--surface2)', borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'var(--accent)' }}>{orders.length}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text2)' }}>Buyurtmalar</div>
                </div>
                <div style={{ background:'var(--surface2)', borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'var(--success)' }}>{completed}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text2)' }}>Bajarildi</div>
                </div>
              </div>
            </div>

            <div className="box" style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <Link to="/orders" className="btn btn-primary btn-full">📦 Buyurtmalarim</Link>
              <Link to="/shop" className="btn btn-ghost btn-full">🛍 Xarid qilish</Link>
              {user.role === 'admin' && <Link to="/admin" className="btn btn-full" style={{ background:'rgba(245,166,35,0.12)', color:'#92400e', border:'1.5px solid #fde68a' }}>⚙️ Admin panel</Link>}
              <button onClick={() => { logout(); navigate('/') }} className="btn btn-danger btn-full">🚪 Chiqish</button>
            </div>
          </div>

          {/* Right — recent orders */}
          <div className="box">
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>📦 So'nggi buyurtmalar</h3>
            {orders.length === 0 ? (
              <div className="empty-state" style={{ padding:'40px 20px' }}>
                <div className="empty-icon" style={{ fontSize:'2.5rem' }}>📭</div>
                <div className="empty-title" style={{ fontSize:'1rem' }}>Hali buyurtma yo'q</div>
                <Link to="/shop" className="btn btn-primary btn-sm" style={{ marginTop:12, display:'inline-flex' }}>Xarid boshlash</Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[...orders].reverse().slice(0,5).map(order => (
                  <div key={order.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'var(--surface2)', borderRadius:12 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.9rem' }}>Buyurtma #{order.id}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text3)' }}>{order.date} — {order.items.length} mahsulot</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:800, color:'var(--accent)', fontSize:'0.95rem' }}>{order.total.toLocaleString()} so'm</div>
                      <span className={`tag ${order.status==='completed'?'tag-green':'tag-yellow'}`} style={{ marginTop:4 }}>
                        {order.status==='completed'?'✅ Bajarildi':'⏳ Kutilmoqda'}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/orders" className="btn btn-outline btn-full" style={{ marginTop:4 }}>
                  Barcha buyurtmalar →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
