import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');

    // fetch products whenever filters or page changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (currentSearch) params.set('search', currentSearch);
                if (currentCategory) params.set('category', currentCategory);
                params.set('page', currentPage);
                params.set('limit', 12);

                const res = await API.get(`/products?${params.toString()}`);
                setProducts(res.data.products);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error('failed to load products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentSearch, currentCategory, currentPage]);

    // fetch categories for the sidebar filter
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/products/categories');
                setCategories(res.data.categories);
            } catch (err) {
                console.error('failed to load categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (slug) => {
        const params = new URLSearchParams(searchParams);
        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="products-page">
            {/* sidebar category filter */}
            <aside className="products-sidebar">
                <h3 className="sidebar-title">Department</h3>
                <ul className="category-list">
                    <li
                        className={`category-item ${!currentCategory ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('')}
                    >
                        All Categories
                    </li>
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className={`category-item ${currentCategory === cat.slug ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat.slug)}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* main content area */}
            <main className="products-main">
                {/* results header */}
                <div className="results-header">
                    {currentSearch && (
                        <p className="results-info">
                            Showing results for: <strong>"{currentSearch}"</strong>
                        </p>
                    )}
                    {currentCategory && (
                        <p className="results-info">
                            Category: <strong>{categories.find(c => c.slug === currentCategory)?.name || currentCategory}</strong>
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="no-results">
                        <h3>No products found</h3>
                        <p>Try a different search or browse our categories</p>
                    </div>
                ) : (
                    <>
                        {/* product grid */}
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={currentPage <= 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    ← Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`page-btn ${page === currentPage ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="page-btn"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Products;
