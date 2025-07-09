import React from 'react';
import './ProductList.css';

const ProductList = ({ products }) => {
  console.log('Fetched products:', products)
  if (!products.length) return <div>Loading products...</div>;

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image_url || '/default-product.png'} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${Number(product.price).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
