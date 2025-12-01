import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: ''
  });

  if (!user) {
    return (
      <div className="checkout-container">
        <div className="container">
          <h2>Please login to checkout</h2>
          <button onClick={() => navigate('/login')} className="auth-button">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="container">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await orderService.checkout(shippingAddress);
      clearCart();
      
      toast.success('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1000);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="container">
        <h2>Checkout</h2>
        
        <div className="checkout-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cart.items.map(item => (
              <div key={`${item.product._id}-${item.size}`} className="checkout-item">
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>Size: {item.size}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="total">
              <h3>Total: ${getCartTotal()}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="shipping-form">
            <h3>Shipping Address</h3>
            
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={shippingAddress.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="place-order-btn">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;