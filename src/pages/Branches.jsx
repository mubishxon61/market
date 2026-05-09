import React, { useState } from 'react'

const LS_BRANCHES = 'mm_branches'
const DEFAULT_BRANCHES = [
  { id:1, name:'Mini Market - Chilonzor', city:'Toshkent', address:"Chilonzor tumani, Bunyodkor ko'chasi 12-uy", phone:'+998 71 123 45 67', hours:'08:00 - 22:00', lat:'41.2995', lng:'69.2401', tags:'Asosiy filial,Parking bor', desc:'Eng katta filialimiz. 2000+ mahsulot. Parking, kafe va bolalar zonasi mavjud.' },
  { id:2, name:'Mini Market - Yunusobod', city:'Toshkent', address:"Yunusobod tumani, Amir Temur ko'chasi 7B", phone:'+998 71 234 56 78', hours:'08:00 - 23:00', lat:'41.3265', lng:'69.2826', tags:'Metro yonida', desc:"Yunusobod metrosidan 2 daqiqa yurish masofasida." },
  { id:3, name:'Mini Market - Sergeli', city:'Toshkent', address:"Sergeli tumani, Yangi hayot ko'chasi 45", phone:'+998 71 345 67 89', hours:'09:00 - 21:00', lat:'41.2189', lng:'69.2045', tags:'Yangi filial', desc:"2024-yilda ochilgan yangi filialimiz." },
  { id:4, name:'Mini Market - Samarqand', city:'Samarqand', address:"Registon ko'chasi 3, markaziy bozor yonida", phone:'+998 66 123 45 67', hours:'08:00 - 21:00', lat:'39.6547', lng:'66.9758', tags:'Viloyat markazi', desc:"Samarqand shahrining eng yirik mini-market filiali." },
  { id:5, name:'Mini Market - Namangan', city:'Namangan', address:"Mustaqillik ko'chasi 18", phone:'+998 69 234 56 78', hours:'08:00 - 22:00', lat:'41.0011', lng:'71.6727', tags:'Viloyat markazi', desc:"Namangan shahrida asosiy filialimiz." },
  { id:6, name:'Mini Market - Andijon', city:'Andijon', address:"Asaka ko'chasi 22, Andijon markazi", phone:'+998 74 234 56 78', hours:'07:30 - 22:00', lat:'40.7821', lng:'72.3442', tags:'Erta ochiladi', desc:"Andijon shahrida eng erta ishlaydigan filialimiz." },
]

function getBranches() {
  try { const d = localStorage.getItem(LS_BRANCHES); return d ? JSON.parse(d) : DEFAULT_BRANCHES }
  catch { return DEFAULT_BRANCHES }
}

export default function Branches() {
  const [branches] = React.useState(getBranches)
  const [selected, setSelected] = React.useState(null)
  const [cityFilter, setCityFilter] = React.useState('Barchasi')
  const [locating, setLocating] = React.useState(false)
  const [mobileView, setMobileView] = React.useState('list')

  const cities = ['Barchasi', ...[...new Set(branches.map(b=>b.city))]]
  const filtered = cityFilter==='Barchasi' ? branches : branches.filter(b=>b.city===cityFilter)

  const detectLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) { alert("Geolokatsiya qollab-quvvatlanmaydi"); setLocating(false); return }
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      let nearest=null, minDist=Infinity
      branches.forEach(b => {
        const d = Math.sqrt((parseFloat(b.lat)-latitude)**2 + (parseFloat(b.lng)-longitude)**2)
        if(d<minDist){ minDist=d; nearest=b }
      })
      if(nearest){ setSelected(nearest); setCityFilter('Barchasi'); setMobileView('detail') }
      setLocating(false)
    }, () => { alert("Joylashuv aniqlanmadi"); setLocating(false) })
  }

  const selectBranch = (b) => { setSelected(b); setMobileView('detail') }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Filiallarimiz</h1>
            <p className="page-subtitle">{branches.length} ta filial</p>
          </div>
          <button className="btn btn-primary" onClick={detectLocation} disabled={locating}>
            {locating ? 'Aniqlanmoqda...' : 'Eng yaqin filialni topish'}
          </button>
        </div>

        {/* Mobile back button */}
        {mobileView==='detail' && selected && (
          <button className="branches-back-btn" onClick={()=>setMobileView('list')}>
            Orqaga - Barcha filiallar
          </button>
        )}

        {/* City filter */}
        <div className="branches-filter">
          {cities.map(c => (
            <button key={c}
              className={'branch-city-btn' + (cityFilter===c?' active':'')}
              onClick={()=>{ setCityFilter(c); setSelected(null); setMobileView('list') }}
            >{c}</button>
          ))}
        </div>

        <div className="branches-grid">
          {/* List */}
          <div className={'branches-list' + (mobileView==='detail'?' branches-list-hidden':'')}>
            {filtered.map(b => (
              <div key={b.id}
                className={'branch-card' + (selected?.id===b.id?' selected':'')}
                onClick={()=>selectBranch(b)}
              >
                <div className="branch-card-top">
                  <div className="branch-card-icon">{b.city[0]}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="branch-card-name">{b.name}</div>
                    <div className="branch-card-addr">{b.address}</div>
                  </div>
                  {selected?.id===b.id && <div className="branch-selected-dot" />}
                </div>
                <div className="branch-card-tags">
                  {(b.tags||'').split(',').filter(Boolean).map(t=>(
                    <span key={t} className="tag tag-blue branch-tag">{t.trim()}</span>
                  ))}
                </div>
                <div className="branch-card-meta">
                  <span>{b.hours}</span>
                  <span>{b.phone}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className={'branches-detail' + (mobileView==='list'?' branches-detail-hidden':'')}>
            {selected ? (
              <div className="box branches-detail-box">
                <div className="branch-detail-header">
                  <div className="branch-detail-icon">{selected.city[0]}</div>
                  <div>
                    <div className="branch-detail-name">{selected.name}</div>
                    <div className="branch-detail-city">{selected.city}</div>
                  </div>
                </div>

                <div className="branch-detail-rows">
                  <div className="branch-detail-row">
                    <span className="branch-detail-label">Manzil</span>
                    <span className="branch-detail-val">{selected.address}, {selected.city}</span>
                  </div>
                  <div className="branch-detail-row">
                    <span className="branch-detail-label">Telefon</span>
                    <a href={"tel:"+selected.phone} className="branch-detail-phone">{selected.phone}</a>
                  </div>
                  <div className="branch-detail-row">
                    <span className="branch-detail-label">Ish vaqti</span>
                    <span className="branch-detail-val">{selected.hours}</span>
                  </div>
                  {selected.desc && (
                    <div className="branch-detail-desc">{selected.desc}</div>
                  )}
                </div>

                {selected.lat && selected.lng && (
                  <div className="branch-map">
                    <iframe
                      src={"https://yandex.uz/map-widget/v1/?ll="+selected.lng+"%2C"+selected.lat+"&z=15&pt="+selected.lng+","+selected.lat+",pm2rdm"}
                      width="100%" height="200" frameBorder="0" title={selected.name}
                      style={{display:'block',borderRadius:10}}
                    />
                  </div>
                )}

                <div className="branch-detail-actions">
                  <a href={"https://yandex.uz/maps/?rtext=~"+selected.lat+","+selected.lng+"&rtt=auto"}
                    target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{flex:1,textAlign:'center'}}>
                    Yol korsatish
                  </a>
                  <a href={"tel:"+selected.phone} className="btn btn-outline btn-sm" style={{flex:1,textAlign:'center'}}>
                    Qongiroq
                  </a>
                </div>
              </div>
            ) : (
              <div className="box branches-empty-detail">
                <div style={{fontSize:'2.5rem',marginBottom:12}}>M</div>
                <div style={{fontWeight:700,marginBottom:8}}>Filial tanlang</div>
                <div style={{color:'var(--text3)',fontSize:'0.85rem',textAlign:'center'}}>
                  Chapdan filial tanlang yoki yaqin filialni toping
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
