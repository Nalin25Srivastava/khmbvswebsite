import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import API from '../api/api'
// import axios from 'axios'
import { MapPin, CreditCard, Banknote, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext)
    const { userInfo } = useContext(AuthContext)
    const navigate = useNavigate()

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('Online')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=checkout')
        }
        if (cartItems.length === 0) {
            navigate('/cart')
        }
    }, [userInfo, cartItems, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }

            const { data } = await API.post(
                '/api/orders',
                {
                    orderItems: cartItems.map(item => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        product: item._id,
                        flavor: item.flavor?.name,
                        quantity: item.quantity
                    })),
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod,
                    totalPrice: cartTotal,
                },
                config
            )

            clearCart()
            alert('Order placed successfully!')
            navigate(`/`)
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="checkout-page animate-fade-in">
            <div className="container">
                <button onClick={() => navigate('/cart')} className="btn-back">
                    <ArrowLeft size={20} /> Back to Cart
                </button>

                <div className="checkout-grid">
                    <div className="checkout-form-section">
                        {/* Delivery Details */}
                        <div className="checkout-card glass-morphism">
                            <h2><MapPin className="text-primary" /> Delivery Details</h2>
                            <form className="auth-form">
                                <div className="form-group">
                                    <label>Shipping Address</label>
                                    <div className="input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder="Enter your full address" 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label>City</label>
                                        <input 
                                            type="text" 
                                            placeholder="City" 
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required 
                                            className="input-wrapper"
                                            style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Postal Code</label>
                                        <input 
                                            type="text" 
                                            placeholder="Postal Code" 
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            required 
                                            className="input-wrapper"
                                            style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input 
                                        type="text" 
                                        placeholder="Country" 
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required 
                                        className="input-wrapper"
                                        style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-card glass-morphism">
                            <h2><CreditCard className="text-primary" /> Payment Method</h2>
                            <div className="payment-options">
                                <div 
                                    className={`payment-method ${paymentMethod === 'Online' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('Online')}
                                >
                                    <div className="radio-circle">
                                        <div className="radio-inner"></div>
                                    </div>
                                    <div className="payment-info">
                                        <h4>Online Payment</h4>
                                        <p>Pay securely via QR Code</p>
                                    </div>
                                </div>

                                <div 
                                    className={`payment-method ${paymentMethod === 'COD' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('COD')}
                                >
                                    <div className="radio-circle">
                                        <div className="radio-inner"></div>
                                    </div>
                                    <div className="payment-info">
                                        <h4>Cash on Delivery</h4>
                                        <p>Pay when your order arrives</p>
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === 'Online' && (
                                <div className="qr-section animate-fade-in">
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Scan QR code to pay via UPI / Wallet</p>
                                    <div className="qr-image">
                                        <img src="/images/qr.jpeg" alt="Payment QR Code" />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600' }}>Scan & Pay Amount: ₹{cartTotal.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary-card glass-morphism">
                        <h2>Order Summary</h2>
                        <div className="order-items-list">
                            {cartItems.map((item, index) => (
                                <div key={index} className="mini-order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <h5>{item.name}</h5>
                                        <p>{item.qty} x ₹{item.price}</p>
                                    </div>
                                    <span className="item-price">₹{(item.qty * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="divider"></div>
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span style={{ color: '#22c55e' }}>FREE</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {error && <div className="error-alert" style={{ marginTop: '1.5rem' }}>{error}</div>}

                        <button 
                            className="btn-premium w-full checkout-btn" 
                            style={{ marginTop: '2rem' }}
                            onClick={submitHandler}
                            disabled={loading || !address || !city || !postalCode || !country}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                <><ShieldCheck size={20} /> Place Order Now</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
