import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // auto rotate banners every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="home">
            {/* hero banner carousel */}
            <div className="hero-banner">
                <img
                    src={bannerImages[currentBanner]}
                    alt="promotional banner"
                    className="hero-image"
                />
                <div className="hero-gradient"></div>

                {/* banner navigation dots */}
                <div className="banner-dots">
                    {bannerImages.map((_, index) => (
                        <button
                            key={index}
                            className={`banner-dot ${index === currentBanner ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(index)}
                        />
                    ))}
                </div>

                {/* banner arrows */}
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

            {/* category cards overlapping the banner */}
            <div className="home-content">
                <div className="category-grid">
                    {categories.map((cat) => (
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
                </div>

                {/* featured / todays deals */}
                <div className="deals-section">
                    <h2 className="section-title">Today's Deals</h2>
                    <div className="deals-scroll">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* additional product sections */}
                <div className="section-banner">
                    <h2 className="section-title">Best Sellers in Electronics</h2>
                    <div className="product-grid-home">
                        {featuredProducts.slice(0, 4).map((product) => (
                            <ProductCard key={`bs-${product.id}`} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
