import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, subtotal, cartCount, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <h2>Your Amazon Cart is empty</h2>
                    <p>Please <Link to="/login">sign in</Link> to see your cart items.</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <h2>Your Amazon Cart is empty</h2>
                    <p>Check out <Link to="/products">today's deals</Link> or browse our products.</p>
                    <Link to="/products" className="cart-shop-btn">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* left side - cart items */}
                <div className="cart-items-section">
                    <h1 className="cart-heading">Shopping Cart</h1>
                    <p className="cart-price-label">Price</p>
                    <div className="cart-divider"></div>

                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <Link to={`/product/${item.product_id}`} className="cart-item-image">
                                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                            </Link>

                            <div className="cart-item-details">
                                <Link to={`/product/${item.product_id}`} className="cart-item-title">
                                    {item.name}
                                </Link>
                                <p className="cart-item-stock">
                                    {item.stock > 0 ? (
                                        <span className="in-stock">In Stock</span>
                                    ) : (
                                        <span className="out-of-stock">Out of Stock</span>
                                    )}
                                </p>
                                {item.brand && <p className="cart-item-brand">by {item.brand}</p>}

                                <div className="cart-item-actions">
                                    <div className="qty-selector">
                                        <label>Qty:</label>
                                        <select
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <span className="action-divider">|</span>
                                    <button
                                        className="cart-remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                    <span className="action-divider">|</span>
                                    <Link to="/wishlist" className="cart-save-btn">
                                        Save for later
                                    </Link>
                                </div>
                            </div>

                            <div className="cart-item-price">
                                <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                {item.original_price && (
                                    <span className="item-original-price">
                                        <s>₹{(item.original_price * item.quantity).toLocaleString()}</s>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="cart-divider"></div>
                    <p className="cart-subtotal-bottom">
                        Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):
                        <strong> ₹{subtotal.toLocaleString()}</strong>
                    </p>
                </div>

                {/* right side - checkout box */}
                <div className="cart-checkout-section">
                    <div className="checkout-box">
                        <p className="checkout-subtotal">
                            Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):
                            <strong> ₹{subtotal.toLocaleString()}</strong>
                        </p>
                        <button
                            className="checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
