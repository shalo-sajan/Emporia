// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Create a helper hook to use the context
export const useCart = () => {
  return useContext(CartContext);
};

// Create the provider component
export function CartProvider({ children }) {
  // We'll try to load the cart from localStorage on initial load
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data:", error);
      return [];
    }
  });

  // This effect will save the cart to localStorage
  // every time the 'cartItems' state changes.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Add a Product to the Cart ---
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // 1. Check if the item is already in the cart
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // 2. If it is, just update the quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 3. If it's not, add it as a new item
        return [...prevItems, { ...product, quantity: quantity }];
      }
    });
  };

  // --- Remove a Product from the Cart ---
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  // --- Update a Product's Quantity ---
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // --- Clear the Cart ---
  const clearCart = () => {
    setCartItems([]); // Just set the cart to an empty array
  };

  // --- Get Total Cart Cost ---
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };
  
  // --- Get Total Item Count ---
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // The values we provide to the rest of the app
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;