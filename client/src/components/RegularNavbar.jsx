import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Helper for scroll navigation across pages
  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
      // Give a tiny timeout for route change before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact Us', id: 'contact' },
    { label: 'Contribute', id: 'contribute' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLoggedIn 
        ? 'bg-[#FAF9F6] border-b-2 border-stone-200' 
        : 'bg-white/95 backdrop-blur-sm border-b-2 border-stone-900'
    }`}>
      <div className="flex items-center justify-between h-14 px-5 sm:px-6 w-full max-w-6xl mx-auto">
        
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2">
            <div className="text-lg font-sans font-black tracking-tight text-stone-950">
              Aspirant
            </div>
            <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest bg-[#FEF5D1] border border-stone-300 px-1.5 py-0.5 rounded hidden sm:inline">
              study os
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600 hover:text-stone-950 transition-colors duration-200 group py-1"
                >
                  {item.label}
                  {/* Underline hover animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-stone-900 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Auth Actions */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-stone-600 text-[10px] font-mono font-bold uppercase tracking-widest">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-700 hover:text-stone-900 border-2 border-stone-300 rounded-lg hover:border-stone-900 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-700 hover:text-stone-900 border-2 border-stone-300 rounded-lg hover:border-stone-900 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-stone-900 rounded-lg border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200"
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
              className="inline-flex items-center justify-center p-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100 border-2 border-stone-300 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="h-4 w-4" />
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {!isLoggedIn && (
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-2 border-stone-900 rounded-2xl mt-1 mx-3 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] absolute left-0 right-0 top-14`}>
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 hover:text-stone-950 block px-3 py-2.5 transition-colors duration-200 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200"
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-2 mt-2 border-t-2 border-stone-200">
            <div className="space-y-2 p-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-700 hover:text-stone-950 transition-colors duration-200 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white bg-stone-900 rounded-xl transition-colors duration-200 text-center border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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