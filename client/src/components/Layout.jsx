import React, { useState } from 'react';
import { useAuth } from '../store/auth';
import RegularNavbar from './RegularNavbar';
import Sidebar from './Sidebar';
import {
  FiHome,
  FiUser,
  FiBookOpen,
  FiClipboard,
  FiFolder,
  FiSettings,
  FiCheckSquare,
  FiCalendar
} from "react-icons/fi";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isLoggedIn, user, LogoutUser } = useAuth();

  const handleLogout = () => {
    LogoutUser();
    alert("✅ Logged out successfully!");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sidebar navigation items
  const sidebarItems = [
    { icon: FiHome, title: "Home", path: "/home" },
    { icon: FiBookOpen, title: "Quiz", path: "/quiz" },
    { icon: FiCheckSquare, title: "Todos", path: "/todos" },
    { icon: FiCalendar, title: "Calendar", path: "/calendar" },
    { icon: FiClipboard, title: "Notes", path: "/notes" },
    { icon: FiFolder, title: "Files", path: "/files" },
    { icon: FiUser, title: "Profile", path: "/profile" },
    { icon: FiSettings, title: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - only show when logged in */}
      {isLoggedIn && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
          sidebarItems={sidebarItems}
        />
      )}

      {/* Main content area with proper spacing */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        isLoggedIn 
          ? sidebarOpen 
            ? 'ml-[280px]' // Account for expanded sidebar width
            : 'ml-[80px]'  // Account for collapsed sidebar width
          : 'ml-0'
      } transition-all duration-300`}>
        {/* Top Navigation */}
        <RegularNavbar
          isLoggedIn={isLoggedIn}
          user={user}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          handleLogout={handleLogout}
          setIsMenuOpen={setIsMenuOpen}
          sidebarItems={sidebarItems}
        />

        {/* Page Content with proper top margin */}
        <main className={`flex-1 overflow-auto ${
          isLoggedIn ? 'pt-0' : 'pt-16'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;