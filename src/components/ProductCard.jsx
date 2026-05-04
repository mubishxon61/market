import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    showToast(`${product.name} savatga qo'shildi!`, '🛒')
  }

  return (
    <div className="card fade-in">
      <Link to={`/product/${product.id}`}>
        <div className="card-img-box">
          <img src={product.img} alt={product.name} loading="lazy" />
        </div>
      </Link>
      <div className="card-body">
        <div style={{ marginBottom: 6 }}>
          <span className="badge badge-cat">{product.category}</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.975rem',
            marginBottom: 4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            color: 'var(--c-primary)',
          }}>
            {product.name}
          </h3>
        </Link>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--c-muted)',
          marginBottom: 10,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.desc}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1rem',
            color: 'var(--c-primary)',
          }}>
            {product.price.toLocaleString()} so'm
          </span>
          <button onClick={handleAdd} className="btn btn-accent btn-sm">
            + Savat
          </button>
        </div>
      </div>
    </div>
  )
}
