// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext'; // <-- 1. Import useCart

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart(); // <-- 2. Get the addToCart function

  // ... (useEffect and loading/error logic is the same) ...
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${slug}/`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // --- 3. Create a handler function ---
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1); // Add 1 of this product
      alert(`${product.name} added to cart!`); // Simple confirmation
    }
  };
  
  // ... (loading, error, and !product checks are the same) ...
  if (loading) return <div className="text-center">Loading product...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product) return <div className="text-center">Product not found.</div>;

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            Sold by: {product.seller_name}
          </p>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <p className="text-3xl font-bold text-gray-900 mb-6">${product.price}</p>
          <p className="text-md text-gray-600 mb-6">
            In Stock: {product.stock}
          </p>
          
          {/* --- 4. Update the button --- */}
          <button 
            onClick={handleAddToCart}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;