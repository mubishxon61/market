import React, { createContext, useState, useContext, useEffect } from 'react'

const ProductContext = createContext()

const SAMPLE = [
  { id:1, name:'Futbol topi', price:120000, category:'Sport', img:'https://images.unsplash.com/photo-1551958219-acbc82a21277?w=400&q=80', desc:'Yuqori sifatli futbol topi, bardoshli material' },
  { id:2, name:'Miss Dior Parfyum', price:890000, category:'Parfyumeriya', img:'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80', desc:'Mashhur frantsuz brendining nafis atri' },
  { id:3, name:'Qizlar ko\'ylagi', price:380000, category:'Ayollar kiyimi', img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', desc:'Yengil va chiroyli yozgi ko\'ylak' },
  { id:4, name:'Erkaklar ko\'ylagi', price:210000, category:'Erkaklar kiyimi', img:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', desc:'Qulay va zamonaviy erkaklar ko\'ylagi' },
  { id:5, name:'Ayollar sumkasi', price:550000, category:'Aksessuarlar', img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', desc:'Charm materialdan yasalgan elegantl sumka' },
  { id:6, name:'Nike Krossovka', price:750000, category:'Poyabzal', img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', desc:'Qulay sport krossovkalari, yugurishga ideal' },
  { id:7, name:'Soat (Classic)', price:1200000, category:'Aksessuarlar', img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', desc:'Metal qo\'l soati, zamonaviy dizayn' },
  { id:8, name:'Qo\'l sumkasi', price:320000, category:'Aksessuarlar', img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', desc:'Kichkina va qulay kundalik sumkasi' },
]

const SAMPLE_CATS = [
  {id:1,name:'Sport'},{id:2,name:'Parfyumeriya'},{id:3,name:'Ayollar kiyimi'},
  {id:4,name:'Erkaklar kiyimi'},{id:5,name:'Aksessuarlar'},{id:6,name:'Poyabzal'},
]

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_products')) || SAMPLE } catch { return SAMPLE }
  })
  const [categories, setCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_cats')) || SAMPLE_CATS } catch { return SAMPLE_CATS }
  })

  useEffect(() => { localStorage.setItem('mm_products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('mm_cats', JSON.stringify(categories)) }, [categories])

  const addProduct = (p) => setProducts(prev => [...prev, { ...p, id: Date.now() }])
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id))
  const updateProduct = (id, data) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  const addCategory = (name) => {
    if (!categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      setCategories(prev => [...prev, { id: Date.now(), name }])
    }
  }

  return (
    <ProductContext.Provider value={{ products, categories, addProduct, deleteProduct, updateProduct, addCategory }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
