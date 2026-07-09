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
    <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 max-w-4xl mx-auto rounded-full ${
      isLoggedIn 
        ? 'bg-[#FAF9F6]/90 border border-stone-200/60 shadow-sm' 
        : 'bg-[#FDFBF6]/80 backdrop-blur-md border border-stone-200/60 shadow-sm'
    }`}>
      <div className="flex items-center justify-between h-14 px-5 sm:px-6 w-full">
        
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center">
            <div className="text-lg font-serif-cormorant font-bold tracking-wider text-stone-900">
              Aspirant
            </div>
            <span className="font-handwritten text-[10px] text-stone-450 ml-1.5 rotate-[-2deg] hidden sm:inline">
              [ study journal ]
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              {['Product', 'Explore', 'Docs', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="relative text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors duration-200 group py-1"
                >
                  {item}
                  {/* Subtle underline indicator */}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-stone-800 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Auth Actions */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-stone-605 text-[10px] font-bold uppercase tracking-wider font-mono">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-700 hover:text-stone-900 border border-stone-300 rounded-full hover:border-stone-850 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 border border-stone-250/70 rounded-full hover:border-stone-800 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-stone-800 hover:bg-stone-900 rounded-full transition-all duration-200 shadow-sm"
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
              className="inline-flex items-center justify-center p-2 rounded-full text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="h-4 w-4" />
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {!isLoggedIn && (
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#FDFBF6]/95 backdrop-blur-md border border-stone-200/60 rounded-3xl mt-2 mx-1 p-3 shadow-md absolute left-0 right-0 top-14`}>
          <div className="space-y-1">
            {['Product', 'Explore', 'Docs', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-[11px] font-bold uppercase tracking-wider text-stone-605 hover:text-stone-950 block px-3 py-2 transition-colors duration-200 rounded-xl hover:bg-stone-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-2 mt-2 border-t border-stone-200">
            <div className="space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-605 hover:text-stone-950 transition-colors duration-200 rounded-xl hover:bg-stone-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white bg-stone-800 hover:bg-stone-900 rounded-full transition-colors duration-200 text-center mt-2 mx-2"
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