import React from 'react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="star half">☆</span>);
    } else {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
  }

  return <div className="rating">{stars} ({rating.toFixed(1)})</div>;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-category">{product.category}</div>
        <StarRating rating={product.rating} />
        <div className="product-price">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ProductCard;