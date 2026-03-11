import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            {/* back to top button */}
            <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
            </button>

            {/* links section */}
            <div className="footer-links">
                <div className="footer-column">
                    <h4>Get to Know Us</h4>
                    <Link to="#">About Us</Link>
                    <Link to="#">Careers</Link>
                    <Link to="#">Press Releases</Link>
                    <Link to="#">Amazon Science</Link>
                </div>
                <div className="footer-column">
                    <h4>Connect with Us</h4>
                    <Link to="#">Facebook</Link>
                    <Link to="#">Twitter</Link>
                    <Link to="#">Instagram</Link>
                </div>
                <div className="footer-column">
                    <h4>Make Money with Us</h4>
                    <Link to="#">Sell on Amazon</Link>
                    <Link to="#">Sell under Amazon Accelerator</Link>
                    <Link to="#">Protect and Build Your Brand</Link>
                    <Link to="#">Amazon Global Selling</Link>
                </div>
                <div className="footer-column">
                    <h4>Let Us Help You</h4>
                    <Link to="#">Your Account</Link>
                    <Link to="#">Returns Centre</Link>
                    <Link to="#">100% Purchase Protection</Link>
                    <Link to="#">Amazon App Download</Link>
                    <Link to="#">Help</Link>
                </div>
            </div>

            {/* bottom strip */}
            <div className="footer-bottom">
                <div className="footer-logo-bottom">
                    <span className="logo-text">amazon</span>
                    <span className="logo-in">.in</span>
                </div>
                <p className="footer-copyright">
                    © 2024-2025, Amazon Clone - Educational Project
                </p>
            </div>
        </footer>
    );
};

export default Footer;
