const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.json({ items: [] });
    }
    // Filter out items with null products
    cart.items = cart.items.filter(item => item.product);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const Product = require('../models/Product');
    
    // Auto-create product if it doesn't exist
    let product = await Product.findById(productId);
    if (!product) {
      const { products } = require('../data/products');
      const frontendProduct = products.find(p => p._id === productId);
      if (frontendProduct) {
        product = new Product({
          _id: productId,
          name: frontendProduct.name,
          description: frontendProduct.description,
          price: frontendProduct.price,
          imageUrl: frontendProduct.imageUrl,
          category: frontendProduct.category,
          sizes: frontendProduct.sizes
        });
        await product.save();
      }
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(item => 
      item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => 
      item.product.toString() === productId && item.size === size
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove', auth, async (req, res) => {
  try {
    const { productId, size } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => 
      !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;