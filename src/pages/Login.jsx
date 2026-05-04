import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      login(email, password)
      toast('Xush kelibsiz! 👋')
      navigate(email === 'admin@market.com' ? '/admin' : '/')
    } catch (err) {
      toast(err.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🔐</div>
        <h1 className="auth-title">Kirish</h1>
        <p className="auth-sub">Hisobingizga kiring</p>

        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">📧 Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">🔑 Parol</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ marginTop:4 }}>
            {loading ? '⏳ Kirish...' : 'Kirish →'}
          </button>
        </form>

        <hr className="divider" />

        <div style={{ background:'var(--surface2)', borderRadius:12, padding:14, fontSize:'0.8rem' }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>🧪 Test akkauntlar:</div>
          <div style={{ color:'var(--text2)', display:'flex', flexDirection:'column', gap:4 }}>
            <span>👤 Oddiy foydalanuvchi: <code style={{ color:'var(--accent)' }}>any@email.com / 123456</code></span>
            <span>⚙️ Admin: <code style={{ color:'var(--accent)' }}>admin@market.com / admin123</code></span>
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:20, color:'var(--text2)', fontSize:'0.9rem' }}>
          Akkaunt yo'qmi? <Link to="/register" style={{ color:'var(--accent)', fontWeight:700 }}>Ro'yxatdan o'ting →</Link>
        </p>
      </div>
    </div>
  )
}
