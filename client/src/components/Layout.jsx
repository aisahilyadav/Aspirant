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
  FiSettings
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
    { icon: FiClipboard, title: "Notes", path: "/notes" },
    { icon: FiFolder, title: "Resources", path: "/resources" },
    { icon: FiUser, title: "Profile", path: "/profile" },
    { icon: FiSettings, title: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Fixed Navbar */}
      <RegularNavbar
        isLoggedIn={isLoggedIn}
        user={user}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
        setIsMenuOpen={setIsMenuOpen}
        sidebarItems={sidebarItems}
      />

      {/* Fixed Sidebar */}
      {isLoggedIn && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
          sidebarItems={sidebarItems}
        />
      )}

      {/* Main Content - ONLY handle margins here */}
      <main 
        className={`
          pt-16 
          ${isLoggedIn 
            ? sidebarOpen 
              ? 'ml-[280px]' 
              : 'ml-[80px]'
            : 'ml-0'
          } 
          transition-all duration-300 ease-in-out
          min-h-screen
        `}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;