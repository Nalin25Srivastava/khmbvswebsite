import React, { useState, useEffect } from 'react'
import API from '../api/api'
import { ArrowRight, ShoppingCart, Loader2, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/api/products')
        setProducts(data)
        setLoading(false)
      } catch (err) {
        const msg = err.response?.data?.message || err.message
        setError(msg)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="homepage animate-fade-in">
      <header className="hero">
        <h1>Elevate Your Lifestyle</h1>
        <p>Curated collection of premium products designed for the modern lifestyle. Discover the next level of luxury.</p>
      </header>

      <section className="product-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
            <p style={{ color: 'var(--text-muted)' }}>Curating your collection...</p>
          </div>
        ) : error ? (
          <div style={{ gridColumn: '1 / -1', color: '#ef4444', textAlign: 'center', padding: '3rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', background: 'none', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        ) : (
          products.map(product => (
            <Link key={product._id || product.id} to={`/product/${product._id}`} className="product-card glass-morphism" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
              <div className="product-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textTransform: 'uppercase', fontWeight: '700' }}>
                    {product.brand}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="var(--secondary-color)" color="var(--secondary-color)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.rating}</span>
                  </div>
                </div>
                <h3>{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="product-price">₹{product.price}</span>
                  <div className="btn-small">
                    <ShoppingCart size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  )
}

export default HomePage
