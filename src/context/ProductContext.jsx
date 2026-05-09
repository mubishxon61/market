import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { productsApi, categoriesApi } from '../api/api'

const ProductContext = createContext()

const SAMPLE = [
  { id:1, name:'Futbol topi', price:120000, category:'Sport',
    img:'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:'Yuqori sifatli futbol topi, bardoshli material' },
  { id:2, name:'Miss Dior Parfyum', price:890000, category:'Parfyumeriya',
    img:'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:'Mashhur frantsuz brendining nafis atri' },
  { id:3, name:"Qizlar ko'ylagi", price:380000, category:"Ayollar kiyimi",
    img:'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:"Yengil va chiroyli yozgi ko'ylak" },
  { id:4, name:"Erkaklar ko'ylagi", price:210000, category:"Erkaklar kiyimi",
    img:'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:"Qulay va zamonaviy erkaklar ko'ylagi" },
  { id:5, name:"Ayollar sumkasi", price:550000, category:'Aksessuarlar',
    img:'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:'Charm materialdan yasalgan elegant sumka' },
  { id:6, name:'Nike Krossovka', price:750000, category:'Poyabzal',
    img:'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:'Qulay sport krossovkalari, yugurishga ideal' },
  { id:7, name:'Soat (Classic)', price:1200000, category:'Aksessuarlar',
    img:'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:"Metal qo'l soati, zamonaviy dizayn" },
  { id:8, name:"Qo'l sumkasi", price:320000, category:'Aksessuarlar',
    img:'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc:'Kichkina va qulay kundalik sumkasi' },
]

const SAMPLE_CATS = [
  {id:1,name:'Sport'},{id:2,name:'Parfyumeriya'},{id:3,name:"Ayollar kiyimi"},
  {id:4,name:"Erkaklar kiyimi"},{id:5,name:'Aksessuarlar'},{id:6,name:'Poyabzal'},
]

function lsGet(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback }
  catch { return fallback }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => lsGet('mm_products', SAMPLE))
  const [categories, setCategories] = useState(() => lsGet('mm_cats', SAMPLE_CATS))
  const [loading, setLoading] = useState(false)
  const [apiOk, setApiOk] = useState(false)

  // API dan mahsulotlarni yuklash, muvaffaqiyatsiz bo'lsa localStorage ishlatish
  const fetchFromApi = useCallback(async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
      ])
      const pList = Array.isArray(prods) ? prods : prods?.results || prods?.products || []
      const cList = Array.isArray(cats) ? cats : cats?.results || cats?.categories || []

      if (pList.length > 0) {
        setProducts(pList)
        lsSet('mm_products', pList)
        setApiOk(true)
      }
      if (cList.length > 0) {
        setCategories(cList)
        lsSet('mm_cats', cList)
      }
    } catch {
      // API ishlamasa localStorage dan foydalanish
      const cached = lsGet('mm_products', null)
      if (!cached) { setProducts(SAMPLE); lsSet('mm_products', SAMPLE) }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFromApi() }, [fetchFromApi])

  const addProduct = async (p) => {
    try {
      if (apiOk) {
        const data = await productsApi.create(p)
        const newP = data?.product || data
        setProducts(prev => { const u=[...prev,newP]; lsSet('mm_products',u); return u })
        return newP
      }
    } catch {}
    // Fallback: local
    const newP = { ...p, id: Date.now() }
    setProducts(prev => { const u=[...prev,newP]; lsSet('mm_products',u); return u })
    return newP
  }

  const deleteProduct = async (id) => {
    try { if (apiOk) await productsApi.delete(id) } catch {}
    setProducts(prev => { const u=prev.filter(p=>p.id!==id); lsSet('mm_products',u); return u })
  }

  const updateProduct = async (id, data) => {
    try {
      if (apiOk) {
        const res = await productsApi.update(id, data)
        const updated = res?.product || res
        setProducts(prev => { const u=prev.map(p=>p.id===id?updated:p); lsSet('mm_products',u); return u })
        return updated
      }
    } catch {}
    setProducts(prev => { const u=prev.map(p=>p.id===id?{...p,...data}:p); lsSet('mm_products',u); return u })
  }

  const addCategory = async (name) => {
    if (categories.find(c=>c.name.toLowerCase()===name.toLowerCase())) return
    try {
      if (apiOk) {
        const data = await categoriesApi.create ? categoriesApi.create(name) : null
        if (data) { const nc=data?.category||data; setCategories(prev=>{const u=[...prev,nc];lsSet('mm_cats',u);return u}); return }
      }
    } catch {}
    setCategories(prev=>{const u=[...prev,{id:Date.now(),name}];lsSet('mm_cats',u);return u})
  }

  const resetProducts = () => { setProducts(SAMPLE); lsSet('mm_products', SAMPLE) }
  const refreshProducts = () => fetchFromApi()

  return (
    <ProductContext.Provider value={{ products, categories, loading, apiOk, addProduct, deleteProduct, updateProduct, addCategory, resetProducts, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
