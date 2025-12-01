import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleInputChange}
          className="filter-input"
        />
        <select name="category" value={filters.category} onChange={handleInputChange} className="filter-select">
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
        <select name="size" value={filters.size} onChange={handleInputChange} className="filter-select">
          <option value="">All Sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;