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
      className="fixed top-0 left-0 h-screen bg-[var(--bg-sidebar)] border-r-4 border-stone-950 z-50 flex flex-col select-none transition-colors duration-300"
    >
      {/* Brand logo in sidebar header */}
      <div className="p-5 border-b-2 border-[var(--border-sidebar-line)] flex items-center justify-between transition-colors duration-300">
        {sidebarOpen ? (
          <Link to="/home" className="flex items-center gap-1.5">
            <span className="font-sans font-black text-xl text-[var(--text-app)] tracking-wider uppercase">Aspirant</span>
            <span className="text-[8px] font-mono font-black text-[#F26430] uppercase bg-stone-950/10 dark:bg-white/10 px-2 py-0.5 rounded rotate-[-2deg]">[ logs ]</span>
          </Link>
        ) : (
          <span className="font-sans font-black text-xl text-[var(--text-app)] mx-auto">A</span>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2.5 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#F8C537] text-stone-950 font-black border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-[var(--text-app)] hover:bg-[#60a5fa] hover:text-stone-950 border-2 border-transparent hover:border-stone-950 hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] font-bold opacity-80 hover:opacity-100'
              }`}
              title={!sidebarOpen ? item.title : ''}
            >
              <Icon className="h-4.5 w-4.5 flex-shrink-0 stroke-[2.5]" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.05 }}
                  className="text-[9px] uppercase font-black tracking-widest font-mono"
                >
                  {item.title.replace(' (Dashboard)', '')}
                </motion.span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 border-2 border-stone-950 text-white text-[9px] font-black uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info Section */}
      <div className="p-4 border-t-2 border-[var(--border-sidebar-line)] bg-stone-50/5 dark:bg-stone-950/10 transition-colors duration-300">
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'flex-col space-y-3'}`}>
          {/* User Info Button */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} hover:bg-stone-200/50 dark:hover:bg-stone-800/40 rounded-xl p-1.5 transition-colors duration-200 group`}
            >
              <div className="w-8 h-8 bg-stone-900 dark:bg-white text-white dark:text-stone-950 border-2 border-stone-950 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
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
                  <p className="text-[10px] font-black text-[var(--text-app)] uppercase tracking-wider whitespace-nowrap truncate max-w-[120px]">
                    {user?.username}
                  </p>
                  <p className="text-[9px] text-[#F26430] font-mono font-black uppercase">Student</p>
                </motion.div>
              )}
              
              {/* Tooltip for user info when collapsed */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 border-2 border-stone-950 text-white text-[9px] font-black uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
                className="absolute bottom-full left-0 mb-3 w-44 bg-white border-2 border-stone-900 rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] py-1.5 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4 stroke-[2.5]" />
                  <span className="text-[9px] font-black uppercase tracking-wider font-mono">Logout</span>
                </button>
              </motion.div>
            )}

            {/* Dropdown Menu - Sidebar Collapsed */}
            {showUserMenu && !sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute left-full bottom-0 ml-3 w-32 bg-white border-2 border-stone-900 rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] py-1.5 z-50"
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut className="h-4 w-4 stroke-[2.5]" />
                  <span className="text-[9px] font-black uppercase tracking-wider font-mono">Logout</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl text-stone-400 hover:text-[var(--text-app)] hover:bg-stone-200/50 dark:hover:bg-stone-850 transition-colors duration-200 ${
              !sidebarOpen ? 'w-full flex justify-center' : ''
            }`}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <FiChevronLeft className="h-4.5 w-4.5 stroke-[2.5]" />
            ) : (
              <FiChevronRight className="h-4.5 w-4.5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;