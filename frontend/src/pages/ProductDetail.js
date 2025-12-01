import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return navigate('/login');
    if (!selectedSize) return alert('Please select a size');
    addToCart(product._id, selectedSize, quantity);
  };

  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-content">
          <div className="product-image-container">
            <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
          </div>
          
          <div className="product-info-container">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price">${product.price}</p>
            <p className="product-description">{product.description}</p>
            
            <div className="product-options">
              <div className="size-selector">
                <label>Size:</label>
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="size-select"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="quantity-input"
                />
              </div>
            </div>

            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;