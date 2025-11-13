// src/pages/CartPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link 
          to="/" 
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="flex flex-col md:flex-row gap-8">

        {/* --- Cart Items (Left Side) --- */}
        <div className="flex-grow md:w-3/4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Cart ({getCartCount()} items)
            </h2>
            
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <input
                    type="number"
                    min="1"
                    max={item.stock} // Set max to product stock
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 text-center border rounded py-1 px-2"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Order Summary (Right Side) --- */}
        <div className="md:w-1/4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            
            <Link 
              to="/checkout" // We will create this page next
              className="w-full text-center bg-green-600 text-white font-bold py-3 px-6 rounded hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;