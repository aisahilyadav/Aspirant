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
        ? 'bg-[#FAF9F6] border-b border-stone-200/60 shadow-sm' 
        : 'bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/60'
    }`}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center">
            <div className="text-xl font-serif-book font-black tracking-wider text-stone-850">
              Aspirant
            </div>
            <span className="font-handwritten text-xs text-stone-500 ml-2 mt-1 rotate-[-4deg] hidden sm:inline">
              [ study journal ]
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Product', 'Explore', 'Docs', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="relative text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors duration-250 group py-1"
                >
                  {item}
                  {/* Handwritten-style underline anim */}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-stone-750 transition-all duration-300 group-hover:w-full" />
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
                <span className="text-stone-600 text-xs font-bold uppercase tracking-wider font-mono">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-655 hover:text-stone-900 border border-stone-300 rounded-xl hover:border-stone-900 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-650 hover:text-stone-900 border border-stone-250/70 rounded-xl hover:border-stone-800 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-stone-800 hover:bg-stone-900 rounded-xl transition-all duration-200 shadow-sm"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-colors duration-200"
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
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#FAF9F6] border-t border-stone-200`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Product', 'Explore', 'Docs', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-wider text-stone-605 hover:text-stone-950 block px-3 py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-3 border-t border-stone-200">
            <div className="px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-605 hover:text-stone-950 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-stone-800 hover:bg-stone-900 rounded-xl transition-colors duration-200 mx-3 mt-2 text-center"
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