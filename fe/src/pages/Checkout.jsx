import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, subtotal, fetchCart } = useCart();
    const toast = useToast();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [placing, setPlacing] = useState(false);

    // new address form fields
    const [newAddress, setNewAddress] = useState({
        fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India'
    });

    // fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await API.get('/addresses');
                setAddresses(res.data.addresses);
                // auto select the default address
                const defaultAddr = res.data.addresses.find(a => a.is_default);
                if (defaultAddr) setSelectedAddress(defaultAddr.id);
                else if (res.data.addresses.length > 0) setSelectedAddress(res.data.addresses[0].id);
            } catch (err) {
                console.error('failed to fetch addresses:', err);
            }
        };
        fetchAddresses();
    }, []);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/addresses', newAddress);
            setAddresses([...addresses, res.data.address]);
            setSelectedAddress(res.data.address.id);
            setShowAddressForm(false);
            setNewAddress({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }
        setPlacing(true);
        try {
            const res = await API.post('/orders', {
                addressId: selectedAddress,
                paymentMethod
            });
            await fetchCart();
            navigate(`/order-confirmation/${res.data.order.id}`);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <p>Add some items before checking out.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-container">
                <div className="checkout-left">
                    {/* shipping address */}
                    <div className="checkout-section">
                        <h2 className="section-heading">
                            <span className="step-number">1</span>
                            Shipping address
                        </h2>

                        <div className="address-list">
                            {addresses.map((addr) => (
                                <label key={addr.id} className={`address-option ${selectedAddress === addr.id ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddress === addr.id}
                                        onChange={() => setSelectedAddress(addr.id)}
                                    />
                                    <div className="address-details">
                                        <strong>{addr.full_name}</strong>
                                        <span>{addr.street}, {addr.city}, {addr.state} - {addr.zip_code}</span>
                                        <span>Phone: {addr.phone}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <button className="add-address-btn" onClick={() => setShowAddressForm(!showAddressForm)}>
                            + Add a new address
                        </button>

                        {showAddressForm && (
                            <form className="address-form" onSubmit={handleAddAddress}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input type="text" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>PIN Code</label>
                                        <input type="text" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} required />
                                    </div>
                                </div>
                                <button type="submit" className="save-address-btn">Use this address</button>
                            </form>
                        )}
                    </div>

                    {/* payment method */}
                    <div className="checkout-section">
                        <h2 className="section-heading">
                            <span className="step-number">2</span>
                            Payment method
                        </h2>
                        <div className="payment-options">
                            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Cash on Delivery (COD)
                            </label>
                            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Credit / Debit Card
                            </label>
                            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                UPI
                            </label>
                        </div>
                    </div>

                    {/* order review */}
                    <div className="checkout-section">
                        <h2 className="section-heading">
                            <span className="step-number">3</span>
                            Review items and delivery
                        </h2>
                        <div className="review-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="review-item">
                                    <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                                    <div>
                                        <p className="review-item-name">{item.name}</p>
                                        <p className="review-item-price">₹{item.price?.toLocaleString()} × {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* order summary sidebar */}
                <div className="checkout-right">
                    <div className="order-summary-box">
                        <button
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={placing}
                        >
                            {placing ? 'Placing order...' : 'Place your order'}
                        </button>
                        <p className="order-terms">
                            By placing your order, you agree to Amazon's privacy notice and conditions of use.
                        </p>
                        <div className="summary-divider"></div>
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-row">
                            <span>Items:</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery:</span>
                            <span className="free-delivery">FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Order Total:</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
