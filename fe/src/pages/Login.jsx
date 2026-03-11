import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignup) {
                await signup(name, email, password);
            } else {
                await login(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'something went wrong, try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Link to="/" className="login-logo">
                <span className="logo-text-dark">amazon</span>
                <span className="logo-in-dark">.in</span>
            </Link>

            <div className="login-card">
                <h1 className="login-title">{isSignup ? 'Create account' : 'Sign in'}</h1>

                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="form-group">
                            <label>Your name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="First and last name"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                            required
                            minLength={isSignup ? 6 : 1}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isSignup ? 'Create your Amazon account' : 'Sign in')}
                    </button>
                </form>

                {!isSignup && (
                    <p className="login-terms">
                        By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
                    </p>
                )}
            </div>

            <div className="login-divider">
                <span>{isSignup ? 'Already have an account?' : 'New to Amazon?'}</span>
            </div>

            <button
                className="login-toggle-btn"
                onClick={() => { setIsSignup(!isSignup); setError(''); }}
            >
                {isSignup ? 'Sign in to existing account' : 'Create your Amazon account'}
            </button>
        </div>
    );
};

export default Login;
