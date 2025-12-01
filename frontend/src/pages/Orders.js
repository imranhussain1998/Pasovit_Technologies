import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="orders-container">
        <div className="container">
          <h2>Please login to view your orders</h2>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <div className="container">
        <h2>Your Orders</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => window.location = '/'} className="continue-shopping">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="order-status confirmed">
                    Confirmed
                  </span>
                </div>
                
                <div className="order-total">
                  <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
                </div>
                
                <div className="order-items">
                  <p>{order.items.length} item(s) ordered</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;