import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get('/orders');
                setOrders(res.data.orders);
            } catch (err) {
                console.error('failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="orders-page">
            <h1 className="orders-title">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <h3>No orders yet</h3>
                    <p>Looks like you havent placed any orders yet.</p>
                    <Link to="/products" className="start-shopping-btn">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-header-group">
                                    <span className="header-label">ORDER PLACED</span>
                                    <span className="header-value">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="order-header-group">
                                    <span className="header-label">TOTAL</span>
                                    <span className="header-value">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="order-header-group">
                                    <span className="header-label">SHIP TO</span>
                                    <span className="header-value">{order.shipping_name || 'N/A'}</span>
                                </div>
                                <div className="order-header-right">
                                    <span className="header-label">ORDER # {order.id}</span>
                                    <Link to={`/order-confirmation/${order.id}`} className="order-detail-link">
                                        View order details
                                    </Link>
                                </div>
                            </div>

                            <div className="order-card-body">
                                <div className="order-status">
                                    <span className={`status-badge ${order.status}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="order-item-count">{order.item_count} item(s)</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
