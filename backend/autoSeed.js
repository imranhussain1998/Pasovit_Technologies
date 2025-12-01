const Product = require('./models/Product');
const { products } = require('./data/products');

const autoSeed = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      console.log('No products found. Auto-seeding database...');
      await Product.insertMany(products);
      console.log('✅ Database seeded with 25 products');
    } else {
      console.log(`✅ Database already has ${existingProducts} products`);
    }
  } catch (error) {
    console.error('❌ Auto-seed error:', error);
  }
};

module.exports = autoSeed;