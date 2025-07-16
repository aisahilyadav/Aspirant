import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiBookOpen,
  FiClipboard,
  FiFolder,
  FiSettings,
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
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col"
    >
      {/* Navigation Items - No extra header space */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3 py-2 rounded-lg transition-colors duration-200 group relative ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'
              }`}
              title={!sidebarOpen ? item.title : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.title}
                </motion.span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info Section with Dropdown */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'flex-col space-y-2'}`}>
          {/* User Info - Clickable */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 group`}
            >
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </motion.div>
              )}
              
              {/* Tooltip for user info when collapsed */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {user?.username} - Student
                </div>
              )}
            </button>

            {/* User Dropdown Menu - Only show when sidebar is open */}
            {showUserMenu && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}

            {/* Logout option for collapsed state - Show on click */}
            {showUserMenu && !sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute left-full bottom-0 ml-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Collapse Button - Fixed positioning */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${
              !sidebarOpen ? 'w-full flex justify-center' : ''
            }`}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <FiChevronLeft className="h-4 w-4" />
            ) : (
              <FiChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;