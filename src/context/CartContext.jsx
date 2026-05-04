import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_cart')) || [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('mm_cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const clearCart = () => setCart([])

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
