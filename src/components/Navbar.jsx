import React, { useState, useEffect } from 'react'
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // sahifa o'zgarganda menyu yopilsin
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // scroll bo'lsa ham yopilsin
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) { navigate('/shop?q=' + encodeURIComponent(q.trim())); setQ(''); setMenuOpen(false) }
  }

  const navLinks = [
    { to:'/', label:"Bosh sahifa", end:true },
    { to:'/shop', label:"Do'kon" },
    { to:'/branches', label:'Filiallar' },
    ...(isAdmin ? [{ to:'/admin', label:'Admin', admin:true }] : []),
  ]

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          Mini<em>Market</em>
        </Link>

        {/* Search - desktop */}
        <form onSubmit={handleSearch} className="nav-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Mahsulot qidirish..." />
        </form>

        {/* Desktop nav links */}
        <div className="nav-links nav-links-desktop">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({isActive}) => 'nav-link' + (isActive?' active':'') + (l.admin?' nav-link-admin':'')}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-right">
          {/* Cart */}
          <Link to="/cart" className="nav-cart" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>}
          </Link>

          {/* Auth - desktop */}
          <div className="nav-auth nav-auth-desktop">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-ghost btn-sm">
                  {user.name?.split(' ')[0] || 'Profil'}
                </Link>
                <button onClick={() => { logout(); navigate('/') }}
                  className="btn btn-outline btn-sm nav-logout">Chiqish</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm nav-login">Kirish</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Ro'yxat</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={'nav-hamburger' + (menuOpen ? ' open' : '')}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menyu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Mobile drawer */}
      <div className={'nav-drawer' + (menuOpen ? ' open' : '')}>
        <div className="nav-drawer-top">
          <span className="nav-logo">Mini<em>Market</em></span>
          <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="nav-drawer-search">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Mahsulot qidirish..." />
          <button type="submit" className="btn btn-primary btn-sm">Izla</button>
        </form>

        {/* Mobile links */}
        <nav className="nav-drawer-links">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({isActive}) => 'nav-drawer-link' + (isActive?' active':'') + (l.admin?' admin':'')}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className={({isActive}) => 'nav-drawer-link' + (isActive?' active':'')}>
            Savat {totalItems > 0 && <span className="cart-badge cart-badge-inline">{totalItems}</span>}
          </NavLink>
        </nav>

        {/* Mobile auth */}
        <div className="nav-drawer-auth">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline btn-full">
                {user.name?.split(' ')[0] || 'Profil'}
              </Link>
              <button onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}
                className="btn btn-danger btn-full">Chiqish</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-full">Kirish</Link>
              <Link to="/register" className="btn btn-primary btn-full">Ro'yxatdan o'tish</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
