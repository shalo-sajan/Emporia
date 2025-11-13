// src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import our auth hook
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout, } = useAuth(); // <-- Get user and logout function
  const { getCartCount } = useCart();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };



  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo / Home Link */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Emporia
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
            {/* You can replace 'Cart' with a cart icon */}
            <span>Cart</span>
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          </Link>

          {/* --- This is the key logic --- */}
          {user ? (
            // --- If user is logged in ---
            <>
              {/* We can add a link to a future 'Account' page */}
              <span className="text-gray-700">Hi, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            // --- If user is logged out ---
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;