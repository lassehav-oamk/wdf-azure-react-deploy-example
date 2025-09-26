import React, { useState, useEffect, useMemo } from 'react';
import type { Product, SortOrder } from '../types/product';
import { fetchProducts } from '../services/productService';
import ProductCard from './ProductCard';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data.products);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return ['all', ...uniqueCategories.sort()];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }, [products, searchTerm, sortOrder, selectedCategory]);

  const groupedProducts = useMemo(() => {
    // If "all" categories is selected, don't group by category - show all products together
    if (selectedCategory === 'all') {
      return { 'All Products': filteredAndSortedProducts };
    }

    // Otherwise, group by category
    const grouped: { [key: string]: Product[] } = {};
    filteredAndSortedProducts.forEach(product => {
      const category = product.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });

    return grouped;
  }, [filteredAndSortedProducts, selectedCategory]);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-grid-container">
      <div className="controls">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="sort-select"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-container">
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
              <div className="products-grid">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;