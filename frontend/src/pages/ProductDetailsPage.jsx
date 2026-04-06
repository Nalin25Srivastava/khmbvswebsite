import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
// import axios from 'axios';
import { Star, ChevronLeft, ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState('');
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/api/products/${id}`);
                setProduct(data);
                setCurrentImage(data.image);
                if (data.flavors && data.flavors.length > 0) {
                    setSelectedFlavor(data.flavors[0]);
                    setCurrentImage(data.flavors[0].image);
                }
                setSelectedQuantity(1);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleFlavorSelect = (flavor) => {
        setSelectedFlavor(flavor);
        setCurrentImage(flavor.image);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedQuantity, selectedFlavor);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) return <div className="loading-container">Loading details...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;
    if (!product) return <div className="error-container">Product not found</div>;

    return (
        <div className="product-details-page animate-fade-in">
            <button onClick={() => navigate(-1)} className="btn-back">
                <ChevronLeft size={20} /> Back to Shop
            </button>

            <div className="details-grid">
                <div className="image-section">
                    <div className="main-image-wrapper glass-morphism">
                        <img src={currentImage} alt={product.name} className="main-product-image" />
                    </div>
                </div>

                <div className="info-section">
                    <span className="brand-tag">{product.brand}</span>
                    <h1>{product.name}</h1>
                    
                    <div className="rating-row">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "var(--secondary-color)" : "none"} color="var(--secondary-color)" />
                            ))}
                        </div>
                        <span className="reviews-count">({product.numReviews} Reviews)</span>
                    </div>

                    <div className="price-row">
                        <span className="price">₹{product.price}</span>
                        {product.countInStock > 0 ? (
                            <span className="stock-status in-stock">In Stock</span>
                        ) : (
                            <span className="stock-status out-of-stock">Out of Stock</span>
                        )}
                    </div>

                    <p className="description">{product.description}</p>

                    {product.flavors && product.flavors.length > 0 && (
                        <div className="variant-section">
                            <label>Select Flavor</label>
                            <div className="variant-options">
                                {product.flavors.map((flavor) => (
                                    <button
                                        key={flavor.name}
                                        className={`variant-btn ${selectedFlavor?.name === flavor.name ? 'active' : ''}`}
                                        onClick={() => handleFlavorSelect(flavor)}
                                    >
                                        {selectedFlavor?.name === flavor.name && <Check size={14} />}
                                        {flavor.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.quantities && product.quantities.length > 0 && (
                        <div className="variant-section">
                            <label>Pack Size</label>
                            <div className="variant-options">
                                {product.quantities.map((q) => (
                                    <button
                                        key={q}
                                        className={`variant-btn ${selectedQuantity === q ? 'active' : ''}`}
                                        onClick={() => setSelectedQuantity(q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="action-row">
                        <button 
                            className={`btn-premium add-to-cart-btn ${isAdded ? 'success' : ''}`} 
                            disabled={product.countInStock === 0}
                            onClick={handleAddToCart}
                        >
                            {isAdded ? (
                                <><Check size={20} /> Added to Cart</>
                            ) : (
                                <><ShoppingCart size={20} /> Add to Cart</>
                            )}
                        </button>
                    </div>

                    <div className="benefits-row">
                        <div className="benefit">
                            <ShieldCheck size={20} />
                            <span>Safe Payment</span>
                        </div>
                        <div className="benefit">
                            <Truck size={20} />
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
