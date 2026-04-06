import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, LogIn, User, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
    const { userInfo, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);

    return (
        <nav className="glass-morphism">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    KHMBVS <span>STORE</span>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Shop</Link></li>
                </ul>
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/cart" title="Cart" className="cart-icon-container">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                    
                    {userInfo ? (
                        <div className="nav-user-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className="user-name" style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                                <User size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                {userInfo.name}
                            </span>
                            <button 
                                onClick={logout} 
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/login" title="Login"><LogIn size={20} /></Link>
                            <Link to="/signup" className="btn-premium" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header
