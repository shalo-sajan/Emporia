// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <-- Import this
import { AuthProvider } from './context/AuthContext.jsx' // <-- Import AuthProvider
import { CartProvider } from './context/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Wrap your app with AuthProvider */}
      <CartProvider> {/* <-- Wrap your app with CartProvider */}
        <BrowserRouter>  {/* <-- Wrap your App component */}
          <App />
        </BrowserRouter>
      </CartProvider>  
    </AuthProvider>
  </React.StrictMode>,
)