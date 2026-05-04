import React, { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import { useOrders } from '../context/OrderContext'

export default function Admin() {
  const { products, categories, addProduct, deleteProduct, addCategory } = useProducts()
  const { getAllOrders, updateOrderStatus } = useOrders()
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState({ name:'', price:'', category:'', desc:'', img:'' })
  const [preview, setPreview] = useState(null)
  const [catName, setCatName] = useState('')

  const orders = getAllOrders()

  const handleImg = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => { setForm(f => ({...f, img:reader.result})); setPreview(reader.result) }
    reader.readAsDataURL(file)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) return alert('Barcha maydonlarni to\'ldiring!')
    addProduct({
      name: form.name,
      price: parseInt(form.price),
      category: form.category,
      desc: form.desc,
      img: form.img || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`
    })
    setForm({ name:'', price:'', category:'', desc:'', img:'' })
    setPreview(null)
    alert('Mahsulot qo\'shildi ✅')
  }

  const handleAddCat = (e) => {
    e.preventDefault()
    if (!catName.trim()) return
    addCategory(catName.trim())
    setCatName('')
    alert('Kategoriya qo\'shildi ✅')
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">⚙️ Admin Panel</h1>
          <p className="page-subtitle">Sayt boshqaruvi</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
          {[
            { icon:'📦', label:'Mahsulotlar', val:products.length, color:'var(--accent)' },
            { icon:'🛒', label:'Buyurtmalar', val:orders.length, color:'var(--success)' },
            { icon:'⏳', label:'Kutilmoqda', val:orders.filter(o=>o.status==='pending').length, color:'var(--warning)' },
          ].map(s => (
            <div key={s.label} className="box" style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontSize:'2rem' }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:'0.8rem', color:'var(--text2)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="box">
          <div className="admin-tabs">
            {[['products','📦 Mahsulotlar'],['categories','📁 Kategoriyalar'],['orders','🛒 Buyurtmalar']].map(([id,lbl])=>(
              <button key={id} className={`admin-tab ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>
              {/* Add form */}
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>➕ Mahsulot qo'shish</h3>
                <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div className="form-group">
                    <label className="form-label">Mahsulot nomi *</label>
                    <input className="form-input" placeholder="Masalan: Nike Krossovka" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div className="form-group">
                      <label className="form-label">Narxi (so'm) *</label>
                      <input className="form-input" type="number" placeholder="250000" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Kategoriya *</label>
                      <select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} required>
                        <option value="">Tanlang</option>
                        {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tavsif</label>
                    <textarea className="form-input" style={{ minHeight:80, resize:'vertical' }} placeholder="Mahsulot haqida qisqacha..." value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rasm URL (ixtiyoriy)</label>
                    <input className="form-input" placeholder="https://..." value={form.img} onChange={e=>setForm(f=>({...f,img:e.target.value}))} />
                  </div>
                  <div>
                    <label className="btn btn-ghost btn-full" style={{ cursor:'pointer', display:'flex', justifyContent:'center' }}>
                      🖼️ Rasm yuklash
                      <input type="file" accept="image/*" onChange={handleImg} style={{ display:'none' }} />
                    </label>
                    {preview && <img src={preview} alt="preview" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:12, marginTop:10 }} />}
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">✅ Qo'shish</button>
                </form>
              </div>

              {/* Product list */}
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>📋 Mahsulotlar ro'yxati ({products.length})</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:520, overflowY:'auto', paddingRight:4 }}>
                  {products.map(p => (
                    <div key={p.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px', background:'var(--surface2)', borderRadius:12 }}>
                      <img src={p.img} alt={p.name} style={{ width:52, height:52, borderRadius:10, objectFit:'cover', flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'0.9rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize:'0.78rem', color:'var(--text3)' }}>{p.category}</div>
                        <div style={{ fontWeight:800, color:'var(--accent)', fontSize:'0.9rem' }}>{p.price.toLocaleString()} so'm</div>
                      </div>
                      <button onClick={() => { if(window.confirm('O\'chirishni tasdiqlaysizmi?')) deleteProduct(p.id) }}
                        className="btn btn-danger btn-sm btn-icon">🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {tab === 'categories' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>➕ Kategoriya qo'shish</h3>
                <form onSubmit={handleAddCat} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div className="form-group">
                    <label className="form-label">Kategoriya nomi *</label>
                    <input className="form-input" placeholder="Masalan: Elektronika" value={catName} onChange={e=>setCatName(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">✅ Qo'shish</button>
                </form>
              </div>
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>📁 Kategoriyalar</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {categories.map(c => (
                    <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--surface2)', borderRadius:10 }}>
                      <span style={{ fontWeight:600 }}>📁 {c.name}</span>
                      <span className="tag tag-gray">{products.filter(p=>p.category===c.name).length} mahsulot</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>🛒 Barcha buyurtmalar ({orders.length})</h3>
              {orders.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">Buyurtma yo'q</div></div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[...orders].reverse().map(order => (
                    <div key={order.id} style={{ padding:'16px', background:'var(--surface2)', borderRadius:14, border:'1.5px solid var(--border)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                        <div>
                          <div style={{ fontWeight:700 }}>Buyurtma #{order.id}</div>
                          <div style={{ fontSize:'0.8rem', color:'var(--text2)' }}>📧 {order.user?.email} | {order.date}</div>
                        </div>
                        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                          <span style={{ fontWeight:800, color:'var(--accent)' }}>{order.total.toLocaleString()} so'm</span>
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            className="sort-select"
                          >
                            <option value="pending">⏳ Kutilmoqda</option>
                            <option value="completed">✅ Tugatildi</option>
                          </select>
                        </div>
                      </div>
                      {order.delivery && (
                        <div style={{ fontSize:'0.8rem', color:'var(--text3)', marginTop:8 }}>
                          📍 {order.delivery.address} | 📞 {order.delivery.phone}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
