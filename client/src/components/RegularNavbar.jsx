import React from 'react';
import { Link } from 'react-router-dom';
import { FiX } from "react-icons/fi";

const RegularNavbar = ({ 
  isLoggedIn, 
  user, 
  isMenuOpen, 
  toggleMenu, 
  handleLogout,
  setIsMenuOpen,
  sidebarItems 
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Logo - Better positioning for sidebar alignment */}
        <div className={`flex-shrink-0 transition-all duration-300 ${
          isLoggedIn ? 'ml-0' : 'ml-0'
        }`}>
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center">
            <div className="text-2xl font-black text-black tracking-tight">
              aspirant
            </div>
          </Link>
        </div>

        {/* Desktop Navigation (only show when not logged in) */}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/product"
                className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
              >
                Product
              </Link>
              <Link
                to="/explore"
                className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
              >
                Explore
              </Link>
              <Link
                to="/docs"
                className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
              >
                Docs
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
              >
                About
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">
          <div className="ml-4 flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Welcome, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-lg hover:border-black transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-lg hover:border-black transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button (only show when not logged in) */}
        {!isLoggedIn && (
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu (only show when not logged in) */}
      {!isLoggedIn && (
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium tracking-wide transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/product"
              className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium tracking-wide transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Product
            </Link>
            <Link
              to="/explore"
              className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium tracking-wide transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/docs"
              className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium tracking-wide transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium tracking-wide transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 mx-3 mt-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default RegularNavbar;