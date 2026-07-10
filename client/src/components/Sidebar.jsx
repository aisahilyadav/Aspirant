import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import {
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  user, 
  handleLogout, 
  sidebarItems 
}) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close user menu when sidebar collapses
  useEffect(() => {
    if (!sidebarOpen) {
      setShowUserMenu(false);
    }
  }, [sidebarOpen]);

  return (
    <motion.nav
      initial={false}
      animate={{
        width: sidebarOpen ? "280px" : "80px",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="fixed top-0 left-0 h-screen bg-[#FDFBF6] border-r border-stone-250/70 shadow-sm z-50 flex flex-col select-none"
    >
      {/* Brand logo in sidebar header */}
      <div className="p-5 border-b border-stone-200 flex items-center justify-between">
        {sidebarOpen ? (
          <Link to="/home" className="flex items-center gap-1">
            <span className="font-serif-cormorant font-bold text-lg text-stone-900 tracking-wider">Aspirant</span>
            <span className="font-handwritten text-[9px] text-stone-450 rotate-[-2deg]">[ logs ]</span>
          </Link>
        ) : (
          <span className="font-serif-cormorant font-bold text-lg text-stone-900 mx-auto">A</span>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-stone-900 text-stone-100 font-extrabold shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              title={!sidebarOpen ? item.title : ''}
            >
              <Icon className="h-4.5 w-4.5 flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.05 }}
                  className="text-[10px] uppercase font-extrabold tracking-widest font-sans-inter"
                >
                  {item.title.replace(' (Dashboard)', '')}
                </motion.span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 border border-stone-850 text-stone-100 text-[9px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info Section */}
      <div className="p-4 border-t border-stone-200 bg-stone-50/40">
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'flex-col space-y-3'}`}>
          {/* User Info Button */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} hover:bg-stone-100 rounded-xl p-1.5 transition-colors duration-200 group`}
            >
              <div className="w-8 h-8 bg-stone-900 text-stone-100 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-sm shadow-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.05 }}
                  className="text-left"
                >
                  <p className="text-[10px] font-extrabold text-stone-900 uppercase tracking-wider whitespace-nowrap truncate max-w-[120px]">
                    {user?.username}
                  </p>
                  <p className="text-[9px] text-stone-450 font-mono">STUDENT</p>
                </motion.div>
              )}
              
              {/* Tooltip for user info when collapsed */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 border border-stone-850 text-stone-100 text-[9px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {user?.username} - Student
                </div>
              )}
            </button>

            {/* Dropdown Menu - Sidebar Open */}
            {showUserMenu && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full left-0 mb-3 w-44 bg-white border border-stone-200 rounded-xl shadow-md py-1.5 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Logout</span>
                </button>
              </motion.div>
            )}

            {/* Dropdown Menu - Sidebar Collapsed */}
            {showUserMenu && !sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute left-full bottom-0 ml-3 w-32 bg-white border border-stone-200 rounded-xl shadow-md py-1.5 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Logout</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl text-stone-450 hover:text-stone-850 hover:bg-stone-100 transition-colors duration-200 ${
              !sidebarOpen ? 'w-full flex justify-center' : ''
            }`}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <FiChevronLeft className="h-4.5 w-4.5" />
            ) : (
              <FiChevronRight className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;