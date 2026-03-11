import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import API from '../utils/api';
import './Wishlist.css';

const Wishlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const res = await API.get('/wishlist');
            setItems(res.data.items);
        } catch (err) {
            console.error('failed to fetch wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWishlist(); }, []);

    const handleRemove = async (id) => {
        try {
            await API.delete(`/wishlist/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    const handleMoveToCart = async (id) => {
        try {
            await API.post(`/wishlist/${id}/move-to-cart`);
            setItems(items.filter(item => item.id !== id));
            alert('Moved to cart!');
        } catch (err) {
            alert('Failed to move to cart');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="wishlist-page">
            <h1 className="wishlist-title">Your Wishlist</h1>

            {items.length === 0 ? (
                <div className="wishlist-empty">
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you like by clicking the heart icon on any product.</p>
                    <Link to="/products" className="start-shopping-btn">Discover Products</Link>
                </div>
            ) : (
                <div className="wishlist-list">
                    {items.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <Link to={`/product/${item.product_id}`} className="wishlist-item-image">
                                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                            </Link>

                            <div className="wishlist-item-info">
                                <Link to={`/product/${item.product_id}`} className="wishlist-item-name">
                                    {item.name}
                                </Link>
                                {item.brand && <p className="wishlist-item-brand">by {item.brand}</p>}
                                <div className="wishlist-item-price">
                                    <span className="wi-price">₹{item.price?.toLocaleString()}</span>
                                    {item.original_price && (
                                        <span className="wi-original"><s>₹{item.original_price?.toLocaleString()}</s></span>
                                    )}
                                </div>
                                <p className={`wi-stock ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </p>

                                <div className="wishlist-item-actions">
                                    <button className="wi-move-btn" onClick={() => handleMoveToCart(item.id)}>
                                        <FiShoppingCart /> Move to Cart
                                    </button>
                                    <button className="wi-remove-btn" onClick={() => handleRemove(item.id)}>
                                        <FiTrash2 /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
