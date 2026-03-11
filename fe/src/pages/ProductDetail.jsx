import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FiHeart, FiShoppingCart, FiCheck, FiTruck } from 'react-icons/fi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.error('failed to load product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const discount = product?.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.3;
        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`f${i}`} className="star filled" />);
        if (hasHalf) stars.push(<FaStarHalfAlt key="h" className="star filled" />);
        const rem = 5 - stars.length;
        for (let i = 0; i < rem; i++) stars.push(<FaRegStar key={`e${i}`} className="star" />);
        return stars;
    };

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            await addToCart(product.id, quantity);
            alert('Added to cart!');
        } catch (err) {
            alert('Failed to add to cart');
        }
    };

    const handleBuyNow = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            await addToCart(product.id, quantity);
            navigate('/cart');
        } catch (err) {
            alert('Something went wrong');
        }
    };

    const handleWishlist = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            await API.post('/wishlist', { productId: product.id });
            alert('Added to wishlist!');
        } catch (err) {
            alert('Failed to add to wishlist');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!product) return <div className="loading-spinner">Product not found</div>;

    const images = product.images?.length > 0
        ? product.images
        : [{ image_url: 'https://via.placeholder.com/500x500?text=No+Image', id: 0 }];

    return (
        <div className="product-detail">
            <div className="pd-container">
                {/* left - image gallery */}
                <div className="pd-images">
                    <div className="pd-thumbnails">
                        {images.map((img, index) => (
                            <div
                                key={img.id || index}
                                className={`pd-thumb ${index === selectedImage ? 'active' : ''}`}
                                onMouseEnter={() => setSelectedImage(index)}
                            >
                                <img src={img.image_url} alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="pd-main-image">
                        <img
                            src={images[selectedImage]?.image_url}
                            alt={product.name}
                        />
                    </div>
                </div>

                {/* middle - product info */}
                <div className="pd-info">
                    <h1 className="pd-title">{product.name}</h1>

                    <div className="pd-brand">
                        Brand: <span className="brand-link">{product.brand}</span>
                    </div>

                    <div className="pd-rating">
                        <span className="rating-number">{product.rating}</span>
                        <div className="stars">{renderStars(product.rating || 0)}</div>
                        <span className="rating-count">
                            {product.num_reviews?.toLocaleString()} ratings
                        </span>
                    </div>

                    <div className="pd-divider"></div>

                    {/* pricing */}
                    <div className="pd-price-section">
                        {discount > 0 && (
                            <span className="pd-discount">-{discount}%</span>
                        )}
                        <span className="pd-price">
                            <span className="pd-symbol">₹</span>
                            {product.price?.toLocaleString()}
                        </span>
                    </div>
                    {product.original_price && (
                        <p className="pd-mrp">
                            M.R.P.: <s>₹{product.original_price?.toLocaleString()}</s>
                        </p>
                    )}
                    <p className="pd-tax">Inclusive of all taxes</p>

                    <div className="pd-divider"></div>

                    {/* description */}
                    <div className="pd-description">
                        <h3>About this item</h3>
                        <p>{product.description}</p>
                    </div>
                </div>

                {/* right - buy box */}
                <div className="pd-buy-box">
                    <div className="buy-box-card">
                        <p className="buy-price">
                            <span className="pd-symbol">₹</span>
                            {product.price?.toLocaleString()}
                        </p>

                        <div className="buy-delivery">
                            <FiTruck className="delivery-truck" />
                            <div>
                                <p className="delivery-free">FREE delivery</p>
                                <p className="delivery-date"><strong>Tomorrow</strong></p>
                            </div>
                        </div>

                        {/* stock */}
                        <p className={`buy-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? (
                                <><FiCheck /> In stock</>
                            ) : (
                                'Currently unavailable'
                            )}
                        </p>

                        {product.stock > 0 && (
                            <>
                                {/* quantity selector */}
                                <div className="buy-quantity">
                                    <label>Qty:</label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    >
                                        {Array.from(
                                            { length: Math.min(product.stock, 10) },
                                            (_, i) => i + 1
                                        ).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* action buttons */}
                                <button className="buy-add-cart" onClick={handleAddToCart}>
                                    <FiShoppingCart /> Add to Cart
                                </button>
                                <button className="buy-now" onClick={handleBuyNow}>
                                    Buy Now
                                </button>
                            </>
                        )}

                        <button className="buy-wishlist" onClick={handleWishlist}>
                            <FiHeart /> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
