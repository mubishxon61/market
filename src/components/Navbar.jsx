import React, { useState } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) { navigate(`/shop?q=${encodeURIComponent(q.trim())}`); setQ('') }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        🛍 Mini<span>Market</span>
      </Link>

      <form onSubmit={handleSearch} className="nav-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Mahsulot qidirish..."
        />
      </form>

      <div className="nav-links">
        <NavLink to="/" end className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>🏠 <span className="hide-mobile">Bosh sahifa</span></NavLink>
        <NavLink to="/shop" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>🛍 <span className="hide-mobile">Do'kon</span></NavLink>
        {isAdmin && <NavLink to="/admin" className="nav-link nav-link-admin">⚙️ <span className="hide-mobile">Admin</span></NavLink>}
      </div>

      <Link to="/cart" className="nav-cart">
        🛒
        {totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>}
      </Link>

      <div className="nav-auth">
        {user ? (
          <>
            <Link to="/profile" className="btn btn-ghost btn-sm hide-mobile">👤 {user.name}</Link>
            <button onClick={() => { logout(); navigate('/') }} className="btn btn-outline btn-sm">Chiqish</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Kirish</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Ro'yxat</Link>
          </>
        )}
      </div>
    </nav>
  )
}
