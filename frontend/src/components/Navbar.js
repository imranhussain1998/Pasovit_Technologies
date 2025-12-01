import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">ClothingStore</Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/cart" className="nav-link">
                Cart ({cartItemCount})
              </Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <span className="nav-link">Hello, {user.name}</span>
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;