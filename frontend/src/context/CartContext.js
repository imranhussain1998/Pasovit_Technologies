import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      setCart({ items: [] });
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      throw new Error('Please login to add items to cart');
    }

    try {
      await cartService.addToCart(productId, size, quantity);
      await fetchCart();
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const updateCartItem = async (productId, size, quantity) => {
    if (!user) return;
    
    try {
      await cartService.updateCartItem(productId, size, quantity);
      await fetchCart();
      toast.success('Cart updated!');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (productId, size) => {
    if (!user) return;
    
    try {
      await cartService.removeFromCart(productId, size);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const getCartTotal = () => {
    if (!cart.items) return '0.00';
    return cart.items
      .filter(item => item.product)
      .reduce((total, item) => 
        total + (item.product.price * item.quantity), 0
      ).toFixed(2);
  };

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    fetchCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};