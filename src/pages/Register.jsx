import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      register(form.name, form.email, form.password)
      toast('Ro\'yxatdan o\'tdingiz! 🎉')
      navigate('/')
    } catch (err) {
      toast(err.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📝</div>
        <h1 className="auth-title">Ro'yxatdan o'tish</h1>
        <p className="auth-sub">Yangi hisob yarating</p>

        <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { key:'name', label:'👤 Ismingiz', type:'text', placeholder:'Abdulloh' },
            { key:'email', label:'📧 Email', type:'email', placeholder:'you@example.com' },
            { key:'password', label:'🔑 Parol', type:'password', placeholder:'Kamida 6 belgi' },
          ].map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input className="form-input" type={f.type} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm(d => ({...d,[f.key]:e.target.value}))} required />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ marginTop:4 }}>
            {loading ? '⏳...' : 'Ro\'yxatdan o\'tish →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, color:'var(--text2)', fontSize:'0.9rem' }}>
          Akkaunt bor? <Link to="/login" style={{ color:'var(--accent)', fontWeight:700 }}>Kirish →</Link>
        </p>
      </div>
    </div>
  )
}
