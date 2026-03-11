import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, catRes] = await Promise.all([
                    API.get('/products/featured'),
                    API.get('/products/categories'),
                ]);
                setFeaturedProducts(featuredRes.data.products);
                setCategories(catRes.data.categories);
            } catch (err) {
                console.error('failed to load homepage data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // hero banner images
    const bannerImages = [
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=400&fit=crop',
    ];
    const [currentBanner, setCurrentBanner] = useState(0);

    // auto rotate banners
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="home">
                <div className="home-skeleton">
                    <div className="skeleton-banner"></div>
                    <div className="skeleton-cards">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton-card"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home">
            {/* hero banner */}
            <div className="hero-banner">
                <img
                    src={bannerImages[currentBanner]}
                    alt="promotional banner"
                    className="hero-image"
                />
                <div className="hero-gradient"></div>

                <div className="banner-dots">
                    {bannerImages.map((_, index) => (
                        <button
                            key={index}
                            className={`banner-dot ${index === currentBanner ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(index)}
                        />
                    ))}
                </div>

                <button
                    className="banner-arrow left"
                    onClick={() => setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
                >
                    ‹
                </button>
                <button
                    className="banner-arrow right"
                    onClick={() => setCurrentBanner((prev) => (prev + 1) % bannerImages.length)}
                >
                    ›
                </button>
            </div>

            {/* main content overlapping the banner */}
            <div className="home-content">
                {/* category cards + sign in card */}
                <div className="category-grid">
                    {categories.slice(0, 3).map((cat) => (
                        <Link
                            to={`/products?category=${cat.slug}`}
                            key={cat.id}
                            className="category-card"
                        >
                            <h3 className="category-card-title">{cat.name}</h3>
                            <div className="category-card-image">
                                <img src={cat.image_url} alt={cat.name} loading="lazy" />
                            </div>
                            <span className="category-card-link">See more</span>
                        </Link>
                    ))}

                    {/* sign in / welcome card */}
                    {!user ? (
                        <div className="category-card signin-card">
                            <h3 className="category-card-title">Sign in for the best experience</h3>
                            <Link to="/login" className="signin-card-btn">Sign in securely</Link>
                            <p className="signin-card-subtext">
                                <Link to="/login">Create an account</Link>
                            </p>
                        </div>
                    ) : (
                        <div className="category-card welcome-card">
                            <h3 className="category-card-title">Welcome back, {user.name}!</h3>
                            <div className="welcome-links">
                                <Link to="/orders" className="welcome-link-item">
                                    <span className="welcome-emoji">📦</span>
                                    <span>Your Orders</span>
                                </Link>
                                <Link to="/wishlist" className="welcome-link-item">
                                    <span className="welcome-emoji">❤️</span>
                                    <span>Wishlist</span>
                                </Link>
                                <Link to="/cart" className="welcome-link-item">
                                    <span className="welcome-emoji">🛒</span>
                                    <span>Cart</span>
                                </Link>
                                <Link to="/products" className="welcome-link-item">
                                    <span className="welcome-emoji">🔍</span>
                                    <span>Browse</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* more categories */}
                <div className="category-grid">
                    {categories.slice(3).map((cat) => (
                        <Link
                            to={`/products?category=${cat.slug}`}
                            key={cat.id}
                            className="category-card"
                        >
                            <h3 className="category-card-title">{cat.name}</h3>
                            <div className="category-card-image">
                                <img src={cat.image_url} alt={cat.name} loading="lazy" />
                            </div>
                            <span className="category-card-link">Shop now</span>
                        </Link>
                    ))}

                    {/* deals card */}
                    <Link to="/products" className="category-card deals-card">
                        <h3 className="category-card-title">Top Deals</h3>
                        <div className="deals-card-content">
                            <span className="deals-big-text">Up to 70% off</span>
                            <span className="deals-sub-text">Electronics, Fashion & more</span>
                        </div>
                        <span className="category-card-link">See all deals</span>
                    </Link>
                </div>

                {/* today's deals section */}
                <div className="deals-section">
                    <h2 className="section-title">Today's Deals</h2>
                    <div className="deals-scroll">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* best sellers grid */}
                <div className="section-banner">
                    <h2 className="section-title">Best Sellers</h2>
                    <div className="product-grid-home">
                        {featuredProducts.slice(0, 4).map((product) => (
                            <ProductCard key={`bs-${product.id}`} product={product} />
                        ))}
                    </div>
                    <div className="section-see-more">
                        <Link to="/products" className="see-more-link">See all products →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
