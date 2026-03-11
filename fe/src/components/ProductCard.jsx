import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // calculate discount percentage
    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    // render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.3;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="star filled" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star filled" />);
        }
        const remaining = 5 - stars.length;
        for (let i = 0; i < remaining; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
        }
        return stars;
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await addToCart(product.id);
        } catch (err) {
            console.error('add to cart failed:', err);
        }
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await API.post('/wishlist', { productId: product.id });
            alert('Added to wishlist!');
        } catch (err) {
            console.error('wishlist failed:', err);
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            {/* product image */}
            <div className="product-card-image">
                <img
                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={product.name}
                    loading="lazy"
                />
                {discount > 0 && (
                    <span className="product-badge">{discount}% off</span>
                )}
                <button className="wishlist-btn" onClick={handleWishlist} title="Add to wishlist">
                    <FiHeart />
                </button>
            </div>

            {/* product info */}
            <div className="product-card-info">
                <h3 className="product-card-title">{product.name}</h3>

                {/* rating */}
                <div className="product-card-rating">
                    <div className="stars">{renderStars(product.rating || 0)}</div>
                    <span className="review-count">
                        {product.num_reviews ? product.num_reviews.toLocaleString() : 0}
                    </span>
                </div>

                {/* price */}
                <div className="product-card-price">
                    <span className="price-symbol">₹</span>
                    <span className="price-value">{product.price?.toLocaleString()}</span>
                    {product.original_price && (
                        <>
                            <span className="price-original">
                                M.R.P: <s>₹{product.original_price?.toLocaleString()}</s>
                            </span>
                        </>
                    )}
                </div>

                {/* delivery info */}
                <p className="product-card-delivery">
                    FREE delivery by <strong>Tomorrow</strong>
                </p>

                {/* add to cart button */}
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FiShoppingCart /> Add to Cart
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
