import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="navbar">
            {/* main nav bar */}
            <div className="navbar-main">
                {/* logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">amazon</span>
                    <span className="logo-in">.in</span>
                </Link>

                {/* delivery location */}
                <div className="navbar-delivery">
                    <FiMapPin className="delivery-icon" />
                    <div className="delivery-text">
                        <span className="delivery-label">Deliver to</span>
                        <span className="delivery-location">
                            {user ? user.name : 'Select address'}
                        </span>
                    </div>
                </div>

                {/* search bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <select className="search-category">
                        <option value="all">All</option>
                    </select>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products, brands and more"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <FiSearch />
                    </button>
                </form>

                {/* account & list */}
                <div className="navbar-account">
                    {user ? (
                        <div className="account-dropdown">
                            <Link to="/account" className="nav-link">
                                <span className="nav-line1">Hello, {user.name}</span>
                                <span className="nav-line2">Account & Lists</span>
                            </Link>
                            <div className="dropdown-content">
                                <Link to="/orders">Your Orders</Link>
                                <Link to="/wishlist">Your Wishlist</Link>
                                <button onClick={logout} className="dropdown-logout">Sign Out</button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link">
                            <span className="nav-line1">Hello, Sign in</span>
                            <span className="nav-line2">Account & Lists</span>
                        </Link>
                    )}
                </div>

                {/* returns & orders */}
                <Link to="/orders" className="nav-link navbar-orders">
                    <span className="nav-line1">Returns</span>
                    <span className="nav-line2">& Orders</span>
                </Link>

                {/* cart */}
                <Link to="/cart" className="navbar-cart">
                    <div className="cart-icon-wrapper">
                        <FiShoppingCart className="cart-icon" />
                        <span className="cart-count">{cartCount}</span>
                    </div>
                    <span className="cart-text">Cart</span>
                </Link>
            </div>

            {/* bottom nav bar with category links */}
            <div className="navbar-bottom">
                <div className="navbar-bottom-links">
                    <Link to="/products" className="bottom-link">All</Link>
                    <Link to="/products?category=electronics" className="bottom-link">Electronics</Link>
                    <Link to="/products?category=clothing" className="bottom-link">Clothing</Link>
                    <Link to="/products?category=books" className="bottom-link">Books</Link>
                    <Link to="/products?category=home-kitchen" className="bottom-link">Home & Kitchen</Link>
                    <Link to="/products?category=sports-fitness" className="bottom-link">Sports</Link>
                    <Link to="/products?category=beauty" className="bottom-link">Beauty</Link>
                    <Link to="/wishlist" className="bottom-link">Wishlist</Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
