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
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#030303] border-r border-white/10 shadow-2xl z-50 flex flex-col"
    >
      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-1.5">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-white text-black font-extrabold shadow-md shadow-white/5'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title={!sidebarOpen ? item.title : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.05 }}
                  className="text-xs uppercase font-extrabold tracking-widest"
                >
                  {item.title.replace(' (Dashboard)', '')}
                </motion.span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-black border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info Section */}
      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'flex-col space-y-3'}`}>
          {/* User Info Button */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} hover:bg-white/5 rounded-xl p-2 transition-colors duration-200 group`}
            >
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center flex-shrink-0 font-black">
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
                  <p className="text-xs font-extrabold text-white uppercase tracking-wider whitespace-nowrap truncate max-w-[120px]">
                    {user?.username}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">STUDENT</p>
                </motion.div>
              )}
              
              {/* Tooltip for user info when collapsed */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-black border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
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
                className="absolute bottom-full left-0 mb-3 w-48 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl py-2 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-950/20 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                </button>
              </motion.div>
            )}

            {/* Dropdown Menu - Sidebar Collapsed */}
            {showUserMenu && !sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute left-full bottom-0 ml-3 w-36 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl py-2 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-950/20 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors duration-200 ${
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