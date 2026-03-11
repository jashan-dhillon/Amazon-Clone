import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);

    // fetch cart whenever user changes (login/logout)
    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setCartCount(0);
            setSubtotal(0);
            return;
        }
        try {
            const res = await API.get('/cart');
            setCartItems(res.data.items);
            setCartCount(res.data.items.reduce((sum, item) => sum + item.quantity, 0));
            setSubtotal(res.data.subtotal);
        } catch (err) {
            console.error('failed to fetch cart:', err);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        await API.post('/cart', { productId, quantity });
        await fetchCart();
    };

    const updateQuantity = async (cartItemId, quantity) => {
        await API.put(`/cart/${cartItemId}`, { quantity });
        await fetchCart();
    };

    const removeFromCart = async (cartItemId) => {
        await API.delete(`/cart/${cartItemId}`);
        await fetchCart();
    };

    const clearCart = async () => {
        await API.delete('/cart');
        await fetchCart();
    };

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, subtotal,
            addToCart, updateQuantity, removeFromCart, clearCart, fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
