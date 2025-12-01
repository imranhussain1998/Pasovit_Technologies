import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-container">
        <div className="container">
          <h2>Please login to view your cart</h2>
          <button onClick={() => navigate('/login')} className="auth-button">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="container">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(item.product._id, item.size, newQuantity);
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.product._id, item.size);
  };

  return (
    <div className="cart-container">
      <div className="container">
        <h2>Shopping Cart</h2>
        
        <div className="cart-items">
          {cart.items.filter(item => item.product).map(item => (
            <div key={`${item.product._id}-${item.size}`} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
              
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p>Size: {item.size}</p>
                <p>Price: ${item.product.price}</p>
              </div>

              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => handleRemoveItem(item)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>

              <div className="cart-item-total">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <h3>Total: ${getCartTotal()}</h3>
          </div>
          
          <div className="cart-actions">
            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
            <button onClick={() => navigate('/checkout')} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;