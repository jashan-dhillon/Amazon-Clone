import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import API from '../utils/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await API.get(`/orders/${id}`);
                setOrder(res.data.order);
            } catch (err) {
                console.error('failed to fetch order:', err);
            }
        };
        fetchOrder();
    }, [id]);

    if (!order) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="order-confirmation">
            <div className="confirmation-card">
                <FiCheckCircle className="confirmation-icon" />
                <h1 className="confirmation-title">Order placed, thank you!</h1>
                <p className="confirmation-subtitle">
                    Your order <strong>#{order.id}</strong> has been placed successfully.
                </p>

                <div className="confirmation-details">
                    <div className="detail-row">
                        <span>Order ID:</span>
                        <strong>#{order.id}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Order Total:</span>
                        <strong>₹{parseFloat(order.total_amount).toLocaleString()}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Payment Method:</span>
                        <strong>{order.payment_method?.toUpperCase()}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Status:</span>
                        <strong className="status-placed">{order.status}</strong>
                    </div>
                </div>

                {order.items && (
                    <div className="confirmation-items">
                        <h3>Items ordered:</h3>
                        {order.items.map((item) => (
                            <div key={item.id} className="conf-item">
                                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                                <div>
                                    <p>{item.name}</p>
                                    <span>Qty: {item.quantity} | ₹{parseFloat(item.price_at_purchase).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="confirmation-actions">
                    <Link to="/orders" className="view-orders-btn">View Order History</Link>
                    <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
