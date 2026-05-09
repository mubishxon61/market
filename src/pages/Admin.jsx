import React, { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import { useOrders } from '../context/OrderContext'

const EMPTY_PRODUCT = { name:'', price:'', category:'', desc:'', img:'' }
const EMPTY_BRANCH = {
  name:'', city:'', address:'', phone:'',
  hours:'08:00 - 22:00', lat:'', lng:'', tags:'', desc:''
}
const UZBERISTON_CITIES = [
  'Toshkent','Samarqand','Buxoro','Namangan','Andijon',
  "Farg'ona",'Nukus','Qarshi','Termiz','Jizzax',
  'Sirdaryo','Navoiy','Urganch','Guliston'
]

const LS_BRANCHES = 'mm_branches'
const DEFAULT_BRANCHES = [
  { id:1, name:'Mini Market - Chilonzor', city:'Toshkent', address:"Chilonzor tumani, Bunyodkor ko'chasi 12-uy", phone:'+998 71 123 45 67', hours:'08:00 - 22:00', lat:'41.2995', lng:'69.2401', tags:'Asosiy filial,Parking bor', desc:'Eng katta filialimiz. 2000+ mahsulot. Parking, kafe va bolalar zonasi mavjud.' },
  { id:2, name:'Mini Market - Yunusobod', city:'Toshkent', address:"Yunusobod tumani, Amir Temur ko'chasi 7B", phone:'+998 71 234 56 78', hours:'08:00 - 23:00', lat:'41.3265', lng:'69.2826', tags:'Metro yonida', desc:"Yunusobod metrosidan 2 daqiqa yurish masofasida." },
  { id:3, name:'Mini Market - Samarqand', city:'Samarqand', address:"Registon ko'chasi 3", phone:'+998 66 123 45 67', hours:'08:00 - 21:00', lat:'39.6547', lng:'66.9758', tags:'Viloyat markazi', desc:"Samarqand shahrining eng yirik filiali." },
]

function lsGetBranches() {
  try { const d = localStorage.getItem(LS_BRANCHES); return d ? JSON.parse(d) : DEFAULT_BRANCHES } catch { return DEFAULT_BRANCHES }
}
function lsSetBranches(data) {
  try { localStorage.setItem(LS_BRANCHES, JSON.stringify(data)) } catch {}
}

export default function Admin() {
  const { products, categories, addProduct, deleteProduct, addCategory } = useProducts()
  const { getAllOrders, updateOrderStatus } = useOrders()
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [preview, setPreview] = useState(null)
  const [catName, setCatName] = useState('')
  const [submitMsg, setSubmitMsg] = useState('')
  const [branches, setBranches] = useState(lsGetBranches)
  const [branchForm, setBranchForm] = useState(EMPTY_BRANCH)
  const [branchMsg, setBranchMsg] = useState('')
  const [editBranch, setEditBranch] = useState(null)

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
    if (!form.name.trim() || !form.price || !form.category) {
      setSubmitMsg('Iltimos barcha * maydonlarni toldiring')
      return
    }
    const rawPrice = parseInt(String(form.price).replace(/[^0-9]/g,''))
    addProduct({
      name: form.name.trim(),
      price: rawPrice,
      category: form.category,
      desc: form.desc.trim(),
      img: form.img || 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400'
    })
    setForm(EMPTY_PRODUCT); setPreview(null)
    setSubmitMsg('Mahsulot muvaffaqiyatli qoshildi!')
    setTimeout(() => setSubmitMsg(''), 3000)
  }

  const handleAddCat = (e) => {
    e.preventDefault()
    if (!catName.trim()) return
    addCategory(catName.trim()); setCatName('')
  }

  const saveBranch = (e) => {
    e.preventDefault()
    if (!branchForm.name.trim() || !branchForm.city || !branchForm.address.trim() || !branchForm.phone.trim()) {
      setBranchMsg('Iltimos * maydonlarni toldiring'); return
    }
    let updated
    if (editBranch) {
      updated = branches.map(b => b.id === editBranch ? {...branchForm, id:editBranch} : b)
      setEditBranch(null)
      setBranchMsg('Filial yangilandi!')
    } else {
      const newB = {...branchForm, id: Date.now()}
      updated = [...branches, newB]
      setBranchMsg('Yangi filial qoshildi!')
    }
    setBranches(updated); lsSetBranches(updated)
    setBranchForm(EMPTY_BRANCH)
    setTimeout(() => setBranchMsg(''), 3000)
  }

  const deleteBranch = (id) => {
    if (!window.confirm('Filialni ochirmoqchimisiz?')) return
    const updated = branches.filter(b => b.id !== id)
    setBranches(updated); lsSetBranches(updated)
  }

  const startEditBranch = (b) => {
    setEditBranch(b.id)
    setBranchForm({...b})
    setTab('branches')
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const TABS = [
    ['products', `Mahsulotlar (${products.length})`],
    ['categories', 'Kategoriyalar'],
    ['branches', `Filiallar (${branches.length})`],
    ['orders', `Buyurtmalar (${orders.length})`],
  ]

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { icon:'P', label:'Mahsulotlar', val:products.length, c:'var(--accent)' },
            { icon:'B', label:'Buyurtmalar', val:orders.length, c:'var(--success)' },
            { icon:'W', label:'Kutilmoqda', val:orders.filter(o=>o.status==='pending').length, c:'var(--warning)' },
            { icon:'F', label:'Filiallar', val:branches.length, c:'#3b82f6' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card box">
              <div className="admin-stat-num" style={{color:s.c}}>{s.val}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tab-bar">
          {TABS.map(([id,lbl]) => (
            <button key={id} className={'admin-tab' + (tab===id?' active':'')} onClick={() => setTab(id)}>{lbl}</button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div className="admin-two">
            <div className="box">
              <h3 className="admin-section-title">Yangi mahsulot qoshish</h3>
              <form onSubmit={handleAdd} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Nomi *</label>
                  <input className="form-input" placeholder="Masalan: Nike Air Max"
                    value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                </div>
                <div className="admin-form-row">
                  <div className="form-group">
                    <label className="form-label">Narxi (som) *</label>
                    <input className="form-input" type="text" inputMode="numeric" placeholder="250 000"
                      value={form.price}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g,'')
                        const fmt = raw.replace(/\B(?=(\d{3})+(?!\d))/g,' ')
                        setForm(f=>({...f,price:fmt}))
                      }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategoriya *</label>
                    <select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      <option value="">Tanlang</option>
                      {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tavsif</label>
                  <textarea className="form-input" rows={3} placeholder="Mahsulot haqida..."
                    value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rasm URL</label>
                  <input className="form-input" placeholder="https://..."
                    value={form.img} onChange={e=>setForm(f=>({...f,img:e.target.value}))} />
                </div>
                <label className="admin-upload-btn">
                  <span>Rasm yuklash</span>
                  <input type="file" accept="image/*" onChange={handleImg} style={{display:'none'}} />
                </label>
                {preview && (
                  <div className="admin-preview">
                    <img src={preview} alt="preview" />
                    <button type="button" className="admin-preview-remove" onClick={()=>{setPreview(null);setForm(f=>({...f,img:''}));}}>X</button>
                  </div>
                )}
                {submitMsg && <div className={'admin-msg ' + (submitMsg.includes('muvaffaq')?'success':'error')}>{submitMsg}</div>}
                <button type="submit" className="btn btn-primary btn-full">Qoshish</button>
              </form>
            </div>
            <div className="box">
              <h3 className="admin-section-title">Mahsulotlar ({products.length})</h3>
              <div className="admin-list">
                {products.map(p => (
                  <div key={p.id} className="admin-list-item">
                    <img src={p.img} alt={p.name} className="admin-list-img"
                      onError={e=>e.target.src='https://via.placeholder.com/50?text=img'} />
                    <div className="admin-list-info">
                      <div className="admin-list-name">{p.name}</div>
                      <div className="admin-list-meta">{p.category}</div>
                      <div className="admin-list-price">{(p.price||0).toLocaleString()} som</div>
                    </div>
                    <button onClick={()=>{if(window.confirm('Ochirish?')) deleteProduct(p.id)}}
                      className="btn btn-danger btn-sm btn-icon">X</button>
                  </div>
                ))}
                {products.length===0 && <div className="empty-state"><div className="empty-title">Mahsulot yoq</div></div>}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === 'categories' && (
          <div className="admin-two">
            <div className="box">
              <h3 className="admin-section-title">Yangi kategoriya</h3>
              <form onSubmit={handleAddCat} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Kategoriya nomi *</label>
                  <input className="form-input" placeholder="Masalan: Elektronika"
                    value={catName} onChange={e=>setCatName(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Qoshish</button>
              </form>
            </div>
            <div className="box">
              <h3 className="admin-section-title">Kategoriyalar ({categories.length})</h3>
              <div className="admin-cat-list">
                {categories.map(c => (
                  <div key={c.id} className="admin-cat-item">
                    <span className="admin-cat-name">{c.name}</span>
                    <span className="tag tag-gray">{products.filter(p=>p.category===c.name).length} mahsulot</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BRANCHES TAB */}
        {tab === 'branches' && (
          <div className="admin-two">
            <div className="box">
              <h3 className="admin-section-title">{editBranch ? 'Filialni tahrirlash' : 'Yangi filial qoshish'}</h3>
              <form onSubmit={saveBranch} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Filial nomi *</label>
                  <input className="form-input" placeholder="Mini Market - Chilonzor"
                    value={branchForm.name} onChange={e=>setBranchForm(f=>({...f,name:e.target.value}))} />
                </div>
                <div className="admin-form-row">
                  <div className="form-group">
                    <label className="form-label">Shahar *</label>
                    <select className="form-input" value={branchForm.city} onChange={e=>setBranchForm(f=>({...f,city:e.target.value}))}>
                      <option value="">Tanlang</option>
                      {UZBERISTON_CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ish vaqti</label>
                    <input className="form-input" placeholder="08:00 - 22:00"
                      value={branchForm.hours} onChange={e=>setBranchForm(f=>({...f,hours:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Manzil *</label>
                  <input className="form-input" placeholder="Kochasi, uy raqami" autoComplete="off"
                    value={branchForm.address} onChange={e=>setBranchForm(f=>({...f,address:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon *</label>
                  <input className="form-input" placeholder="+998 71 123 45 67" inputMode="tel"
                    value={branchForm.phone}
                    onChange={e=>setBranchForm(f=>({...f,phone:e.target.value.replace(/[^0-9+\s\-()]/g,'')}))} />
                </div>
                <div className="admin-form-row">
                  <div className="form-group">
                    <label className="form-label">Kenglik (lat)</label>
                    <input className="form-input" placeholder="41.2995" inputMode="decimal"
                      value={branchForm.lat} onChange={e=>setBranchForm(f=>({...f,lat:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Uzunlik (lng)</label>
                    <input className="form-input" placeholder="69.2401" inputMode="decimal"
                      value={branchForm.lng} onChange={e=>setBranchForm(f=>({...f,lng:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Teglar (vergul bilan)</label>
                  <input className="form-input" placeholder="Asosiy filial, Parking bor"
                    value={branchForm.tags} onChange={e=>setBranchForm(f=>({...f,tags:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Filial haqida</label>
                  <textarea className="form-input" rows={2} placeholder="Qisqa tavsif..."
                    value={branchForm.desc} onChange={e=>setBranchForm(f=>({...f,desc:e.target.value}))} />
                </div>
                {branchMsg && <div className={'admin-msg ' + (branchMsg.includes('qosh')||branchMsg.includes('yangi')?'success':'error')}>{branchMsg}</div>}
                <div style={{display:'flex',gap:10}}>
                  <button type="submit" className="btn btn-primary" style={{flex:1}}>{editBranch ? 'Saqlash' : 'Qoshish'}</button>
                  {editBranch && <button type="button" className="btn btn-outline" onClick={()=>{setEditBranch(null);setBranchForm(EMPTY_BRANCH)}}>Bekor</button>}
                </div>
              </form>
            </div>
            <div className="box">
              <h3 className="admin-section-title">Filiallar ({branches.length})</h3>
              <div className="admin-list">
                {branches.map(b => (
                  <div key={b.id} className="admin-list-item admin-branch-item">
                    <div className="admin-branch-icon">{b.city[0]}</div>
                    <div className="admin-list-info">
                      <div className="admin-list-name">{b.name}</div>
                      <div className="admin-list-meta">{b.city} | {b.hours}</div>
                      <div className="admin-list-meta">{b.address}</div>
                      <div className="admin-list-meta" style={{color:'var(--accent)'}}>{b.phone}</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
                      <button onClick={()=>startEditBranch(b)} className="btn btn-outline btn-sm">Tahrir</button>
                      <button onClick={()=>deleteBranch(b.id)} className="btn btn-danger btn-sm">Ochir</button>
                    </div>
                  </div>
                ))}
                {branches.length===0 && <div className="empty-state"><div className="empty-title">Filial yoq</div></div>}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="box">
            <h3 className="admin-section-title">Buyurtmalar ({orders.length})</h3>
            {orders.length===0 ? (
              <div className="empty-state"><div className="empty-icon">P</div><div className="empty-title">Buyurtma yoq</div></div>
            ) : (
              <div className="admin-orders-list">
                {[...orders].reverse().map(order => (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-top">
                      <div>
                        <div className="admin-order-id">Buyurtma #{order.id}</div>
                        <div className="admin-order-meta">{order.user?.email} | {order.date}</div>
                        {order.delivery && <div className="admin-order-addr">{order.delivery.city} | {order.delivery.address} | {order.delivery.phone}</div>}
                      </div>
                      <div className="admin-order-right">
                        <div className="admin-order-total">{(order.total||0).toLocaleString()} som</div>
                        <select value={order.status} onChange={e=>updateOrderStatus(order.id,e.target.value)} className="sort-select">
                          <option value="pending">Kutilmoqda</option>
                          <option value="completed">Tugatildi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
