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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLoggedIn 
        ? 'bg-[#030303] border-b border-white/10 shadow-lg shadow-black/10' 
        : 'bg-[#030303]/85 backdrop-blur-md border-b border-white/10'
    }`}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center">
            <div className="text-xl font-black tracking-widest uppercase text-white font-mono">
              aspirant
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {['Product', 'Explore', 'Docs', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Auth Actions */}
        <div className="hidden md:block">
          <div className="ml-4 flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wide">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-300 hover:text-white border border-white/10 rounded-lg hover:border-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-black bg-white rounded-lg hover:bg-gray-150 transition-all duration-200 shadow-md shadow-white/5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        {!isLoggedIn && (
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {!isLoggedIn && (
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#030303] border-t border-white/10`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Product', 'Explore', 'Docs', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 hover:text-white block px-3 py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-3 border-t border-white/10">
            <div className="px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-black bg-white rounded-lg hover:bg-gray-150 transition-colors duration-200 mx-3 mt-2 text-center"
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