import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

    const shippingPrice = cartTotal > 100 ? 0 : 10;
    const taxPrice = 0.15 * cartTotal;
    const totalPrice = cartTotal + shippingPrice + taxPrice;

    if (cartItems.length === 0) {
        return (
            <div className="cart-page empty animate-fade-in">
                <div className="empty-cart-card glass-morphism">
                    <div className="empty-icon-wrapper">
                        <ShoppingCart size={48} />
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="btn-premium">
                        Start Shopping <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page animate-fade-in">
            <header className="cart-header">
                <h1>Shopping Cart</h1>
                <span className="item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
            </header>

            <div className="cart-grid">
                <div className="cart-items-section">
                    {cartItems.map((item) => (
                        <div key={`${item._id}-${item.flavor?.name}`} className="cart-item-card glass-morphism">
                            <div className="item-image-wrapper">
                                <img src={item.flavor?.image || item.image} alt={item.name} />
                            </div>
                            <div className="item-info">
                                <div className="item-details">
                                    <span className="item-brand">{item.brand}</span>
                                    <h3>{item.name}</h3>
                                    {item.flavor && <span className="item-variant">Flavor: {item.flavor.name}</span>}
                                </div>
                                <div className="item-pricing">
                                    <span className="item-price">₹{item.price}</span>
                                    <div className="quantity-controls glass-morphism">
                                        <button onClick={() => updateQuantity(item._id, item.flavor?.name, item.qty - 1)}>
                                            <Minus size={16} />
                                        </button>
                                        <span className="qty">{item.qty}</span>
                                        <button onClick={() => updateQuantity(item._id, item.flavor?.name, item.qty + 1)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        className="btn-remove" 
                                        onClick={() => removeFromCart(item._id, item.flavor?.name)}
                                        title="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <Link to="/" className="btn-continue">
                        <ChevronLeft size={18} /> Continue Shopping
                    </Link>
                </div>

                <div className="cart-summary-section">
                    <div className="summary-card glass-morphism">
                        <h2>Order Summary</h2>
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (15%)</span>
                                <span>₹{taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="btn-premium w-full checkout-btn">
                            Proceed to Checkout <ArrowRight size={20} />
                        </button>
                        <p className="secure-checkout-text">
                            Secure Checkout Guaranteed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
