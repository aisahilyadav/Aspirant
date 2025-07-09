import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

function Navbar() {
  const { isLoggedIn, user, LogoutUser } = useAuth();
  const navigate = useNavigate();

  // Debug: Log authentication status
  console.log('Navbar Debug - isLoggedIn:', isLoggedIn, 'user:', user);

  const handleLogout = () => {
    LogoutUser();
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold">ASPIRANT</span>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Home
            </NavLink>
            
            {/* Debug: Show login status */}
            <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
              {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
            </span>
            
            {/* Debug: Always show Quiz link for testing */}
            <NavLink 
              to="/quiz" 
              className={({ isActive }) => 
                `text-white bg-green-600 hover:bg-green-700 px-3 py-2 text-sm font-medium transition-colors rounded ${
                  isActive ? 'bg-green-800' : ''
                }`
              }
            >
              🔥 QUIZ (TEST)
            </NavLink>
            
            {isLoggedIn && (
              <>
                <NavLink 
                  to="/quiz" 
                  className={({ isActive }) => 
                    `text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                    }`
                  }
                >
                  📝 Quiz Normal
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                    }`
                  }
                >
                  👤 Profile
                </NavLink>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.username}</span>
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors"
                >
                 Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1">
            <span className="w-4 h-0.5 bg-gray-600"></span>
            <span className="w-4 h-0.5 bg-gray-600"></span>
            <span className="w-4 h-0.5 bg-gray-600"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
