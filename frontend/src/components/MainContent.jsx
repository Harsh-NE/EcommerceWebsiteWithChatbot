import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import Chatbot from './Chatbot';

const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatFeedback, setChatFeedback] = useState('');
  const [chatbotVisible, setChatbotVisible] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading products:', err);
        setLoading(false);
      });
  }, []);

  const normalize = (str) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  const applyFilter = (filter) => {
    console.log('Applying filter from Chatbot:', filter);

    if (!filter || Object.keys(filter).length === 0) {
      setFilteredProducts(products);
      setChatFeedback('Showing all products');
      return;
    }

    const {
      category = '',
      description_keywords = [],
      price_min = null,
      price_max = null,
    } = filter;

    const filtered = products.filter((product) => {
      const productCategory = normalize(product.category || '');
      const inputCategoryWords = normalize(category).split(' ').filter(Boolean);

      const matchesCategory =
        inputCategoryWords.length === 0
          ? true
          : inputCategoryWords.some((word) =>
              productCategory.includes(word) && product.category !== "women's clothing"
            );

      const matchesDescription =
        description_keywords.length === 0
          ? true
          : description_keywords.some((kw) =>
              product.description.toLowerCase().includes(kw.toLowerCase())
            );

      const matchesPrice =
        (price_min === null || product.price >= price_min) &&
        (price_max === null || product.price <= price_max);

      console.log(matchesCategory, matchesDescription, matchesPrice);

      return matchesCategory && matchesDescription && matchesPrice;
    });

    setFilteredProducts(filtered);
    setChatFeedback(
      filtered.length > 0
        ? 'Here are your results:'
        : 'No products matched your request.'
    );
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading products...</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        <button
          onClick={() => setChatbotVisible(!chatbotVisible)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ccc',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {chatbotVisible ? 'Hide Chatbot' : 'Show Chatbot'}
        </button>
      </div>

      <div style={{ display: 'flex', padding: '20px', minHeight: '80vh' }}>
        <div style={{ flex: chatbotVisible ? 2 : 1, marginRight: '20px' }}>
          {chatFeedback && (
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>{chatFeedback}</p>
          )}
          {filteredProducts.length === 0 ? (
            <p>No matching products found. Try refining your request.</p>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </div>

        {chatbotVisible && (
          <div
            style={{
              flex: 1,
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '8px',
            }}
          >
            <Chatbot onFilter={applyFilter} />
          </div>
        )}
      </div>
    </>
  );
};

export default MainContent;
