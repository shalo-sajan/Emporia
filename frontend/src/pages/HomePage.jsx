// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react'
import api from '../utils/api' // <-- Import our new API client

function HomePage() {
  // We'll use state to store our products, loading status, and any errors
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // This 'useEffect' hook will run once when the component
  // first loads, thanks to the empty array [].
  useEffect(() => {
    // We define an async function inside to fetch data
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // --- This is the API call! ---
        // We're using our 'api' instance to send a GET request to
        // the '/api/products/' endpoint we created in Django.
        const response = await api.get('/api/products/')
        
        setProducts(response.data) // Save the products in our state
        setError(null) // Clear any previous errors
      } catch (err) {
        // Handle any errors from the API
        setError('Failed to fetch products. Is the backend server running?')
        console.error(err)
      } finally {
        // This runs whether the request succeeded or failed
        setLoading(false)
      }
    }

    fetchProducts() // Call the function to run it
  }, []) // The empty array [] means "run this effect only once"

  // --- Render logic ---
  if (loading) {
    return <div className="text-center">Loading products...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  // --- Success: Render the products ---
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      
      {products.length === 0 ? (
        <p>No products found. (Try adding some in the Django admin!)</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-lg">
              {/* Note: We'll fix the image URL later.
                  It needs the full backend address. */}
              {product.image && (
                <img 
                  src={`http://127.0.0.1:8000${product.image}`} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700 mt-2">{product.description}</p>
              <p className="text-lg font-bold mt-4">${product.price}</p>
              <p className="text-sm text-gray-500">
                Sold by: {product.seller_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage