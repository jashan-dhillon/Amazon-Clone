import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX, FiShoppingCart, FiHeart } from 'react-icons/fi';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // auto remove after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // shorthand methods
    const success = (msg) => addToast(msg, 'success');
    const error = (msg) => addToast(msg, 'error');
    const cartSuccess = (msg) => addToast(msg, 'cart');
    const wishlistSuccess = (msg) => addToast(msg, 'wishlist');

    const getIcon = (type) => {
        switch (type) {
            case 'cart': return <FiShoppingCart />;
            case 'wishlist': return <FiHeart />;
            case 'error': return <FiAlertCircle />;
            default: return <FiCheckCircle />;
        }
    };

    return (
        <ToastContext.Provider value={{ addToast, success, error, cartSuccess, wishlistSuccess }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <span className="toast-icon">{getIcon(toast.type)}</span>
                        <span className="toast-message">{toast.message}</span>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
