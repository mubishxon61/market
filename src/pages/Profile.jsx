import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { getUserOrders } = useOrders()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', city: user?.city || '' })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [tab, setTab] = useState('info')

  if (!user) return (
    <div className="page"><div className="container" style={{ maxWidth: 440, textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🔐</div>
      <h2 style={{ fontWeight: 800, marginBottom: 10 }}>Kirish kerak</h2>
      <Link to="/login" className="btn btn-primary">Kirish →</Link>
    </div></div>
  )

  const orders = getUserOrders(user.id)
  const completed = orders.filter(o => o.status === 'completed').length
  const initial = (user.name || user.email).charAt(0).toUpperCase()

  const handleSave = () => {
    if (!form.name.trim()) return alert('Ism kiritilishi shart!')
    updateUser(form)
    setEditing(false)
  }

  const handlePwChange = () => {
    if (pwForm.next.length < 6) return alert('Parol kamida 6 ta belgi!')
    if (pwForm.next !== pwForm.confirm) return alert('Parollar mos kelmayapti!')
    alert('Parol o\'zgartirildi ✅')
    setPwForm({ current: '', next: '', confirm: '' })
    setShowPw(false)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">👤 Mening profilim</h1>
        </div>

        <div className="profile-grid">

          {/* ── LEFT: Avatar + actions ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="box" style={{ textAlign: 'center' }}>
              <div className="avatar" style={{ margin: '0 auto 14px' }}>{initial}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user.name || 'Foydalanuvchi'}</div>
              <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginTop: 3 }}>{user.email}</div>
              {user.phone && <div style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: 2 }}>{user.phone}</div>}
              <span className={`tag ${user.role==='admin'?'tag-red':'tag-blue'}`} style={{ marginTop: 10, display: 'inline-flex' }}>
                {user.role==='admin' ? '⚙️ Admin' : '👤 Oddiy foydalanuvchi'}
              </span>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
                {[
                  { n: orders.length, l: "Buyurtma", c: 'var(--accent)' },
                  { n: completed,     l: "Bajarildi", c: 'var(--success)' },
                ].map(s => (
                  <div key={s.l} style={{ background: 'var(--surface2)', borderRadius: 9, padding: '11px 8px' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: s.c, letterSpacing: '-0.5px' }}>{s.n}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text2)', marginTop: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="box" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/orders" className="btn btn-primary btn-full">📦 Buyurtmalarim</Link>
              <Link to="/shop"   className="btn btn-ghost btn-full">🛍 Xarid qilish</Link>
              {user.role === 'admin' && <Link to="/admin" className="btn btn-warning btn-full">⚙️ Admin panel</Link>}
              <button onClick={() => { logout(); navigate('/') }} className="btn btn-danger btn-full">🚪 Chiqish</button>
            </div>
          </div>

          {/* ── RIGHT: Tabs ── */}
          <div className="box" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Tab headers */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--border)' }}>
              {[['info','👤 Ma\'lumotlar'],['password','🔑 Parol'],['orders','📦 Buyurtmalar']].map(([id,lbl]) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{
                    padding: '13px 18px', fontWeight: 700, fontSize: '0.82rem',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: tab===id ? 'var(--accent)' : 'var(--text2)',
                    borderBottom: tab===id ? '3px solid var(--accent)' : '3px solid transparent',
                    marginBottom: '-2px', transition: 'all 0.15s', fontFamily: 'var(--font)',
                    whiteSpace: 'nowrap'
                  }}>
                  {lbl}
                </button>
              ))}
            </div>

            <div style={{ padding: 22 }}>

              {/* ── INFO TAB ── */}
              {tab === 'info' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Shaxsiy ma'lumotlar</h3>
                    <button
                      onClick={() => editing ? handleSave() : setEditing(true)}
                      className={`btn btn-sm ${editing ? 'btn-success' : 'btn-primary'}`}>
                      {editing ? '✅ Saqlash' : '✏️ Tahrirlash'}
                    </button>
                  </div>

                  {editing ? (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {[
                        { key: 'name',  label: 'To\'liq ism',   placeholder: 'Abdulloh Karimov', type: 'text' },
                        { key: 'email', label: 'Email',          placeholder: 'email@example.com', type: 'email' },
                        { key: 'phone', label: 'Telefon raqami', placeholder: '+998 90 123 45 67', type: 'tel' },
                        { key: 'city',  label: 'Shahar',         placeholder: 'Toshkent', type: 'text' },
                      ].map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input className="form-input" type={f.type} placeholder={f.placeholder}
                            value={form[f.key]} onChange={e => setForm(d => ({...d, [f.key]: e.target.value}))} />
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={handleSave} className="btn btn-success" style={{ flex: 1 }}>✅ Saqlash</button>
                        <button onClick={() => setEditing(false)} className="btn btn-ghost">Bekor</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 10 }}>
                      {[
                        { label: '👤 Ism',    val: user.name  || '—' },
                        { label: '📧 Email',  val: user.email },
                        { label: '📞 Telefon',val: user.phone || '—' },
                        { label: '📍 Shahar', val: user.city  || '—' },
                        { label: '🔖 ID',     val: String(user.id) },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface2)', borderRadius: 9, gap: 12 }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text2)', flexShrink: 0 }}>{r.label}</span>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', textAlign: 'right', wordBreak: 'break-all' }}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── PASSWORD TAB ── */}
              {tab === 'password' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Parolni o'zgartirish</h3>
                  {[
                    { key: 'current', label: 'Joriy parol',    placeholder: '••••••••' },
                    { key: 'next',    label: 'Yangi parol',    placeholder: 'Kamida 6 belgi' },
                    { key: 'confirm', label: 'Qayta kiriting', placeholder: 'Takrorlang' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input className="form-input" type={showPw ? 'text' : 'password'} placeholder={f.placeholder}
                        value={pwForm[f.key]} onChange={e => setPwForm(d => ({...d, [f.key]: e.target.value}))} />
                    </div>
                  ))}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} />
                    Parolni ko'rsatish
                  </label>
                  <button onClick={handlePwChange} className="btn btn-primary">🔐 Parolni o'zgartirish</button>
                  <div style={{ background: 'var(--surface2)', borderRadius: 9, padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text2)' }}>
                    💡 Demo rejim: parol localStorage da saqlanmaydi. API ulanganda to'liq ishlaydi.
                  </div>
                </div>
              )}

              {/* ── ORDERS TAB ── */}
              {tab === 'orders' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>So'nggi buyurtmalar</h3>
                    <Link to="/orders" className="btn btn-outline btn-sm">Barchasi →</Link>
                  </div>
                  {orders.length === 0 ? (
                    <div className="empty-state" style={{ padding: '32px 16px' }}>
                      <div className="empty-icon" style={{ fontSize: '2.2rem' }}>📭</div>
                      <div className="empty-title" style={{ fontSize: '0.95rem' }}>Hali buyurtma yo'q</div>
                      <Link to="/shop" className="btn btn-primary btn-sm" style={{ marginTop: 12, display: 'inline-flex' }}>Xarid boshlash</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[...orders].reverse().slice(0, 6).map(order => (
                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'var(--surface2)', borderRadius: 10, gap: 12 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>#{order.id}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{order.date} — {order.items.length} ta</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.88rem', letterSpacing: '-0.3px' }}>{order.total.toLocaleString()} so'm</div>
                            <span className={`tag ${order.status==='completed'?'tag-green':'tag-yellow'}`}>
                              {order.status==='completed'?'✅ Bajarildi':'⏳ Kutilmoqda'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
