// src/App.jsx

import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'

// Import our page components
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      {/* This 'MainLayout' component will be our main site template
          (e.g., with a Navbar and Footer) */}
      <Route path="/" element={<MainLayout />}>
        {/* The 'index' route is the default component shown
            when the path is just "/" */}
        <Route index element={<HomePage />} />
        
        {/* Other pages that use the MainLayout */}
        <Route path="login" element={<LoginPage />} />
        {/* <Route path="register" element={<RegisterPage />} /> */}
        {/* <Route path="product/:slug" element={<ProductDetailPage />} /> */}
      </Route>
    </Routes>
  )
}

// --- Main Layout Component ---
// This component will wrap all our main pages.
// It's the perfect place for a Navbar and Footer.
function MainLayout() {
  return (
    <div className="app">
      {/* We'll add a Navbar component here later */}
      <header className="bg-blue-600 text-white p-4 text-center font-bold">
        EMPORIA NAVBAR
      </header>

      <main className="container mx-auto p-8">
        {/* This <Outlet> is the "magic" part.
            React Router will render the matching page component
            (e.g., HomePage, LoginPage) right here. */}
        <Outlet />
      </main>

      {/* We'll add a Footer component here later */}
      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        Emporia Footer &copy; 2025
      </footer>
    </div>
  )
}

export default App