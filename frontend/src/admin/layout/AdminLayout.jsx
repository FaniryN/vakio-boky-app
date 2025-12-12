import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiLogOut,
  FiMenu,
  FiHome,
  FiSettings
} from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const displayName = user?.nom || user?.user?.nom || "Administrateur";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header - Version épurée */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side - Breadcrumb and mobile menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              
              <nav className="flex items-center gap-2 text-sm">
                <Link 
                  to="/"
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <FiHome className="w-4 h-4" />
                  Accueil
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-medium">Administration</span>
              </nav>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-sm font-semibold block leading-tight">
                      {firstName.length > 12 ? firstName.slice(0, 12) + "..." : firstName}
                    </span>
                    <span className="text-xs opacity-90 block leading-tight">
                      Administrateur
                    </span>
                  </div>
                </motion.button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={handleProfile}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <FiUser size={16} className="text-gray-400" />
                      <span className="text-sm font-medium">Mon Profil</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <FiLogOut size={16} />
                      <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {!sidebarCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/10 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* User menu overlay */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}