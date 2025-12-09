import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiHeart,
  FiCalendar,
  FiUsers,
  FiBook,
  FiAward,
  FiTrendingUp,
  FiMessageSquare,
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

export default function AdminSidebar({ isCollapsed, onToggleCollapse }) {
  const location = useLocation();

  const navItems = [
    {
      path: '/admin',
      label: 'Tableau de Bord',
      icon: <FiHome className="w-5 h-5" />,
      description: 'Vue d\'ensemble'
    },
    {
      path: '/admin/marketplace',
      label: 'Marketplace',
      icon: <FiShoppingCart className="w-5 h-5" />,
      description: 'Produits & Catalogue'
    },
    {
      path: '/admin/orders',
      label: 'Commandes',
      icon: <FiPackage className="w-5 h-5" />,
      description: 'Ventes & Commandes'
    },
    {
      path: '/admin/campaigns',
      label: 'Campagnes',
      icon: <FiHeart className="w-5 h-5" />,
      description: 'Financement participatif'
    },
    {
      path: '/admin/events',
      label: 'Événements',
      icon: <FiCalendar className="w-5 h-5" />,
      description: 'Calendrier & Sessions'
    },
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      icon: <FiUsers className="w-5 h-5" />,
      description: 'Gestion des comptes'
    },
    {
      path: '/admin/books',
      label: 'Bibliothèque',
      icon: <FiBook className="w-5 h-5" />,
      description: 'Livres & Publications'
    },
    {
      path: '/admin/challenges',
      label: 'Défis',
      icon: <FiAward className="w-5 h-5" />,
      description: 'Challenges & Badges'
    },
    {
      path: '/admin/analytics',
      label: 'Statistiques',
      icon: <FiTrendingUp className="w-5 h-5" />,
      description: 'Rapports & Analyses'
    },
    {
      path: '/admin/moderation',
      label: 'Modération',
      icon: <FiMessageSquare className="w-5 h-5" />,
      description: 'Contenus & Commentaires'
    },
    {
      path: '/admin/settings',
      label: 'Paramètres',
      icon: <FiSettings className="w-5 h-5" />,
      description: 'Configuration système'
    }
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-200 shadow-lg flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Administration</h2>
                <p className="text-xs text-gray-500">Vakio Boky</p>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <FiChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <FiChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title={isCollapsed ? item.label : item.description}
            >
              <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {item.icon}
              </span>
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 w-2 h-2 bg-white rounded-full"
                />
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              Version 1.0.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2024 Vakio Boky
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}