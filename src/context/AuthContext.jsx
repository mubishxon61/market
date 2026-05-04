import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mm_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, password) => {
    if (email === 'admin@market.com' && password === 'admin123') {
      const u = { id: 'admin', email, name: 'Admin', role: 'admin' }
      setUser(u); localStorage.setItem('mm_user', JSON.stringify(u))
    } else if (email && password) {
      const u = { id: Date.now(), email, name: email.split('@')[0], role: 'user' }
      setUser(u); localStorage.setItem('mm_user', JSON.stringify(u))
    } else {
      throw new Error('Email va parol kiriting!')
    }
  }

  const register = (name, email, password) => {
    if (!name || !email || !password) throw new Error('Barcha maydonlarni to\'ldiring!')
    const u = { id: Date.now(), email, name, role: 'user' }
    setUser(u); localStorage.setItem('mm_user', JSON.stringify(u))
  }

  const logout = () => { setUser(null); localStorage.removeItem('mm_user') }
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
