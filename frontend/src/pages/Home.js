import React, { useState, useEffect } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

const Home = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    size: '',
    minPrice: '',
    maxPrice: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesSize = !filters.size || product.sizes.includes(filters.size);
      const matchesMinPrice = !filters.minPrice || product.price >= Number(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || product.price <= Number(filters.maxPrice);
      
      return matchesSearch && matchesCategory && matchesSize && matchesMinPrice && matchesMaxPrice;
    });
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="home">
      <div className="container">
        <h1>Products ({filteredProducts.length})</h1>
        <Filters filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="products-grid">
          {currentProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found</p>
            <button onClick={() => setFilters({ search: '', category: '', size: '', minPrice: '', maxPrice: '' })} className="auth-button">
              Clear Filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-button ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;