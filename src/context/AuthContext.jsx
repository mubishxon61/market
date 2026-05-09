import React, { createContext, useState, useContext, useEffect } from 'react'
import { authApi } from '../api/api'

const AuthContext = createContext()

function lsGet(key) { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }
function lsRemove(key) { try { localStorage.removeItem(key) } catch {} }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => lsGet('mm_user'))
  const [authLoading, setAuthLoading] = useState(false)

  const saveUser = (u) => { setUser(u); lsSet('mm_user', u) }

  // App ochilganda token bo'lsa, user ma'lumotlarini yangilash
  useEffect(() => {
    const token = localStorage.getItem('mm_token')
    if (token && !user) {
      authApi.me().then(data => {
        if (data?.id || data?.email) saveUser(data)
      }).catch(() => {})
    }
  }, [])

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      // Avval API ga urinib ko'ramiz
      const data = await authApi.login(email, password)
      // API muvaffaqiyatli bo'lsa
      const u = data?.user || data
      if (u?.email || u?.id) {
        saveUser({ ...u, role: u.is_admin || u.role === 'admin' ? 'admin' : 'user' })
        setAuthLoading(false)
        return
      }
    } catch (err) {
      // API ishlamasa yoki 403 bo'lsa — local fallback
      if (email === 'admin@market.com' && password === 'admin123') {
        saveUser({ id: 'admin', email, name: 'Admin', role: 'admin' })
        setAuthLoading(false)
        return
      }
      // Ro'yxatdan o'tgan user bo'lsa localStorage dan tekshirish
      const savedUser = lsGet('mm_user_' + email)
      if (savedUser && savedUser.password === password) {
        saveUser({ id: savedUser.id, email, name: savedUser.name, role: 'user' })
        setAuthLoading(false)
        return
      }
      setAuthLoading(false)
      throw new Error("Email yoki parol noto'g'ri")
    }
    setAuthLoading(false)
  }

  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error("Barcha maydonlarni to'ldiring!")
    setAuthLoading(true)
    try {
      const data = await authApi.register(name, email, password)
      const u = data?.user || data
      if (u?.email || u?.id) {
        saveUser({ ...u, role: 'user' })
        setAuthLoading(false)
        return
      }
    } catch {}
    // Local fallback
    const newUser = { id: Date.now(), email, name, role: 'user', password }
    lsSet('mm_user_' + email, newUser)
    saveUser({ id: newUser.id, email, name, role: 'user' })
    setAuthLoading(false)
  }

  const updateUser = (data) => {
    if (!user) return
    saveUser({ ...user, ...data })
  }

  const logout = () => {
    setUser(null)
    lsRemove('mm_user')
    lsRemove('mm_token')
    authApi.logout()
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
