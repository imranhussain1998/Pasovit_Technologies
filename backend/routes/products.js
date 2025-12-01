const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add products from frontend data
router.post('/seed-from-frontend', async (req, res) => {
  try {
    const { products } = req.body;
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Add new products
    const savedProducts = await Product.insertMany(products);
    
    res.json({ message: 'Products seeded successfully', count: savedProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products with search, filters, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, size, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (size) query.sizes = { $in: [size] };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;