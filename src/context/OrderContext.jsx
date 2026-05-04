import React, { createContext, useState, useContext } from 'react'

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_orders')) || [] } catch { return [] }
  })

  const save = (o) => { setOrders(o); localStorage.setItem('mm_orders', JSON.stringify(o)) }

  const createOrder = (cartItems, total, user, delivery, payment) => {
    const order = {
      id: Date.now(),
      items: cartItems,
      total,
      user,
      delivery,
      payment,
      status: 'pending',
      date: new Date().toLocaleDateString('uz-UZ'),
      time: new Date().toLocaleTimeString('uz-UZ'),
    }
    const updated = [...orders, order]
    save(updated)
    return order
  }

  const getUserOrders = (userId) => orders.filter(o => o.user?.id === userId)
  const getAllOrders = () => orders
  const updateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o)
    save(updated)
  }

  return (
    <OrderContext.Provider value={{ orders, createOrder, getUserOrders, getAllOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
