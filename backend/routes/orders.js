const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// Checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );

    const order = new Order({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalPrice,
      shippingAddress
    });

    await order.save();
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;