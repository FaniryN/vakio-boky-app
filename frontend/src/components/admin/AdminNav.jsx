// // import React from 'react';
// // import { Link, useLocation } from 'react-router-dom';
// // import {
// //   FiHome,
// //   FiShoppingCart,
// //   FiPackage,
// //   FiHeart,
// //   FiCalendar,
// //   FiUsers,
// //   FiBook,
// //   FiAward,
// //   FiTrendingUp,
// //   FiMessageSquare,
// //   FiSettings,
// //   FiTag,
// //   FiAlertTriangle,
// //   FiCheck,
// //   FiStar,
// //   FiFileText,
// //   FiUserCheck,
// //   FiShield,
// //   FiFolder,
// //   FiTarget,
// //   // FiTrophy,
// //   FiBarChart2,
// //   FiGlobe,
// //   FiMail,
// //   FiServer,
// //   FiFlag,
// //   FiActivity
// // } from 'react-icons/fi';

// // export default function AdminNav() {
// //   const location = useLocation();

// //   const navItems = [
// //     {
// //       path: '/admin',
// //       label: 'Tableau de Bord',
// //       icon: <FiHome className="w-5 h-5" />,
// //       description: 'Vue d\'ensemble'
// //     },
// //     {
// //       path: '/admin/marketplace',
// //       label: 'Produits',
// //       icon: <FiShoppingCart className="w-5 h-5" />,
// //       description: 'Gestion des produits'
// //     },
// //     {
// //       path: '/admin/marketplace/categories',
// //       label: 'Catégories',
// //       icon: <FiTag className="w-5 h-5" />,
// //       description: 'Gestion des catégories'
// //     },
// //     {
// //       path: '/admin/marketplace/analytics',
// //       label: 'Statistiques',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Analyses de vente'
// //     },
// //     {
// //       path: '/admin/orders',
// //       label: 'Commandes',
// //       icon: <FiPackage className="w-5 h-5" />,
// //       description: 'Gestion des commandes'
// //     },
// //     {
// //       path: '/admin/orders/disputes',
// //       label: 'Litiges',
// //       icon: <FiAlertTriangle className="w-5 h-5" />,
// //       description: 'Résolution des litiges'
// //     },
// //     {
// //       path: '/admin/campaigns',
// //       label: 'Campagnes',
// //       icon: <FiHeart className="w-5 h-5" />,
// //       description: 'Gestion des campagnes'
// //     },
// //     {
// //       path: '/admin/campaigns/moderation',
// //       label: 'Modération',
// //       icon: <FiCheck className="w-5 h-5" />,
// //       description: 'Approuver les campagnes'
// //     },
// //     {
// //       path: '/admin/campaigns/analytics',
// //       label: 'Analytics',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Statistiques des campagnes'
// //     },
// //     {
// //       path: '/admin/campaigns/featured',
// //       label: 'Mises en Avant',
// //       icon: <FiStar className="w-5 h-5" />,
// //       description: 'Campagnes mises en avant'
// //     },
// //     {
// //       path: '/admin/events',
// //       label: 'Événements',
// //       icon: <FiCalendar className="w-5 h-5" />,
// //       description: 'Gestion des événements'
// //     },
// //     {
// //       path: '/admin/events/moderation',
// //       label: 'Modération',
// //       icon: <FiCheck className="w-5 h-5" />,
// //       description: 'Approuver les événements'
// //     },
// //     {
// //       path: '/admin/events/analytics',
// //       label: 'Analytics',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Statistiques des événements'
// //     },
// //     {
// //       path: '/admin/events/templates',
// //       label: 'Modèles',
// //       icon: <FiFileText className="w-5 h-5" />,
// //       description: 'Modèles d\'événements'
// //     },
// //     {
// //       path: '/admin/users',
// //       label: 'Utilisateurs',
// //       icon: <FiUsers className="w-5 h-5" />,
// //       description: 'Gestion des comptes'
// //     },
// //     {
// //       path: '/admin/users/dashboard',
// //       label: 'Gestion',
// //       icon: <FiUserCheck className="w-5 h-5" />,
// //       description: 'Tableau de bord utilisateurs'
// //     },
// //     {
// //       path: '/admin/users/roles',
// //       label: 'Rôles',
// //       icon: <FiShield className="w-5 h-5" />,
// //       description: 'Gestion des rôles et permissions'
// //     },
// //     {
// //       path: '/admin/users/analytics',
// //       label: 'Analytics',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Statistiques utilisateurs'
// //     },
// //     {
// //       path: '/admin/books',
// //       label: 'Bibliothèque',
// //       icon: <FiBook className="w-5 h-5" />,
// //       description: 'Livres & Publications'
// //     },
// //     {
// //       path: '/admin/books/moderation',
// //       label: 'Modération',
// //       icon: <FiCheck className="w-5 h-5" />,
// //       description: 'Approuver les livres'
// //     },
// //     {
// //       path: '/admin/books/catalog',
// //       label: 'Catalogue',
// //       icon: <FiFolder className="w-5 h-5" />,
// //       description: 'Genres et collections'
// //     },
// //     {
// //       path: '/admin/books/analytics',
// //       label: 'Analytics',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Statistiques des livres'
// //     },
// //     {
// //       path: '/admin/challenges',
// //       label: 'Défis',
// //       icon: <FiAward className="w-5 h-5" />,
// //       description: 'Challenges & Badges'
// //     },
// //     {
// //       path: '/admin/challenges/management',
// //       label: 'Gestion',
// //       icon: <FiTarget className="w-5 h-5" />,
// //       description: 'Créer et gérer les défis'
// //     },
// //     {
// //       path: '/admin/challenges/analytics',
// //       label: 'Analytics',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Statistiques des défis'
// //     },
// //     {
// //       path: '/admin/challenges/badges',
// //       label: 'Badges',
// //       icon: <FiServer className="w-5 h-5" />,
// //       description: 'Gestion des récompenses'
// //     },
// //     {
// //       path: '/admin/analytics',
// //       label: 'Analytics',
// //       icon: <FiBarChart2 className="w-5 h-5" />,
// //       description: 'Tableaux de bord analytics'
// //     },
// //     {
// //       path: '/admin/analytics/overview',
// //       label: 'Vue d\'ensemble',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Métriques générales'
// //     },
// //     {
// //       path: '/admin/analytics/users',
// //       label: 'Utilisateurs',
// //       icon: <FiUsers className="w-5 h-5" />,
// //       description: 'Engagement utilisateurs'
// //     },
// //     {
// //       path: '/admin/analytics/content',
// //       label: 'Contenu',
// //       icon: <FiBook className="w-5 h-5" />,
// //       description: 'Performance contenu'
// //     },
// //     {
// //       path: '/admin/moderation',
// //       label: 'Modération',
// //       icon: <FiShield className="w-5 h-5" />,
// //       description: 'Centre de modération'
// //     },
// //     {
// //       path: '/admin/moderation/queue',
// //       label: 'File d\'attente',
// //       icon: <FiAlertTriangle className="w-5 h-5" />,
// //       description: 'Contenus à modérer'
// //     },
// //     {
// //       path: '/admin/moderation/reports',
// //       label: 'Signalements',
// //       icon: <FiFlag className="w-5 h-5" />,
// //       description: 'Gestion des signalements'
// //     },
// //     {
// //       path: '/admin/moderation/actions',
// //       label: 'Actions',
// //       icon: <FiActivity className="w-5 h-5" />,
// //       description: 'Historique des actions'
// //     },
// //     {
// //       path: '/admin/settings',
// //       label: 'Paramètres',
// //       icon: <FiSettings className="w-5 h-5" />,
// //       description: 'Configuration plateforme'
// //     },
// //     {
// //       path: '/admin/settings/platform',
// //       label: 'Plateforme',
// //       icon: <FiGlobe className="w-5 h-5" />,
// //       description: 'Paramètres généraux'
// //     },
// //     {
// //       path: '/admin/settings/email',
// //       label: 'Emails',
// //       icon: <FiMail className="w-5 h-5" />,
// //       description: 'Templates et notifications'
// //     },
// //     {
// //       path: '/admin/settings/system',
// //       label: 'Système',
// //       icon: <FiServer className="w-5 h-5" />,
// //       description: 'Configuration système'
// //     },
// //     {
// //       path: '/admin/analytics',
// //       label: 'Statistiques',
// //       icon: <FiTrendingUp className="w-5 h-5" />,
// //       description: 'Rapports & Analyses'
// //     },
// //     {
// //       path: '/admin/moderation',
// //       label: 'Modération',
// //       icon: <FiMessageSquare className="w-5 h-5" />,
// //       description: 'Contenus & Commentaires'
// //     },
// //     {
// //       path: '/admin/settings',
// //       label: 'Paramètres',
// //       icon: <FiSettings className="w-5 h-5" />,
// //       description: 'Configuration système'
// //     }
// //   ];

// //   return (
// //     <div className="bg-white shadow-sm border-b border-gray-200">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <nav className="flex space-x-8 overflow-x-auto py-4">
// //           {navItems.map((item) => {
// //             const isActive = location.pathname === item.path;
// //             return (
// //               <Link
// //                 key={item.path}
// //                 to={item.path}
// //                 className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
// //                   isActive
// //                     ? 'bg-blue-100 text-blue-700 border border-blue-200'
// //                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
// //                 }`}
// //                 title={item.description}
// //               >
// //                 <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
// //                   {item.icon}
// //                 </span>
// //                 <span>{item.label}</span>
// //               </Link>
// //             );
// //           })}
// //         </nav>
// //       </div>
// //     </div>
// //   );
// // }
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   FiHome,
//   FiShoppingCart,
//   FiPackage,
//   FiHeart,
//   FiCalendar,
//   FiUsers,
//   FiBook,
//   FiAward,
//   FiTrendingUp,
//   FiMessageSquare,
//   FiSettings,
//   FiTag,
//   FiAlertTriangle,
//   FiCheck,
//   FiStar,
//   FiFileText,
//   FiUserCheck,
//   FiShield,
//   FiFolder,
//   FiTarget,
//   FiBarChart2,
//   FiGlobe,
//   FiMail,
//   FiServer,
//   FiFlag,
//   FiActivity
// } from 'react-icons/fi';

// export default function AdminNav() {
//   const location = useLocation();

//   const navItems = [
//     {
//       path: '/admin',
//       label: 'Tableau de Bord',
//       icon: <FiHome className="w-5 h-5" />,
//       description: 'Vue d\'ensemble'
//     },
//     {
//       path: '/admin/marketplace',
//       label: 'Produits',
//       icon: <FiShoppingCart className="w-5 h-5" />,
//       description: 'Gestion des produits'
//     },
//     {
//       path: '/admin/marketplace/categories',
//       label: 'Catégories',
//       icon: <FiTag className="w-5 h-5" />,
//       description: 'Gestion des catégories'
//     },
//     {
//       path: '/admin/marketplace/analytics',
//       label: 'Statistiques',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Analyses de vente'
//     },
//     {
//       path: '/admin/orders',
//       label: 'Commandes',
//       icon: <FiPackage className="w-5 h-5" />,
//       description: 'Gestion des commandes'
//     },
//     {
//       path: '/admin/orders/disputes',
//       label: 'Litiges',
//       icon: <FiAlertTriangle className="w-5 h-5" />,
//       description: 'Résolution des litiges'
//     },
//     {
//       path: '/admin/campaigns',
//       label: 'Campagnes',
//       icon: <FiHeart className="w-5 h-5" />,
//       description: 'Gestion des campagnes'
//     },
//     {
//       path: '/admin/campaigns/moderation',
//       label: 'Modération',
//       icon: <FiCheck className="w-5 h-5" />,
//       description: 'Approuver les campagnes'
//     },
//     {
//       path: '/admin/campaigns/analytics',
//       label: 'Analytics',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Statistiques des campagnes'
//     },
//     {
//       path: '/admin/campaigns/featured',
//       label: 'Mises en Avant',
//       icon: <FiStar className="w-5 h-5" />,
//       description: 'Campagnes mises en avant'
//     },
//     {
//       path: '/admin/events',
//       label: 'Événements',
//       icon: <FiCalendar className="w-5 h-5" />,
//       description: 'Gestion des événements'
//     },
//     {
//       path: '/admin/events/moderation',
//       label: 'Modération',
//       icon: <FiCheck className="w-5 h-5" />,
//       description: 'Approuver les événements'
//     },
//     {
//       path: '/admin/events/analytics',
//       label: 'Analytics',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Statistiques des événements'
//     },
//     {
//       path: '/admin/events/templates',
//       label: 'Modèles',
//       icon: <FiFileText className="w-5 h-5" />,
//       description: 'Modèles d\'événements'
//     },
//     {
//       path: '/admin/users',
//       label: 'Utilisateurs',
//       icon: <FiUsers className="w-5 h-5" />,
//       description: 'Gestion des comptes'
//     },
//     {
//       path: '/admin/users/dashboard',
//       label: 'Gestion',
//       icon: <FiUserCheck className="w-5 h-5" />,
//       description: 'Tableau de bord utilisateurs'
//     },
//     {
//       path: '/admin/users/roles',
//       label: 'Rôles',
//       icon: <FiShield className="w-5 h-5" />,
//       description: 'Gestion des rôles et permissions'
//     },
//     {
//       path: '/admin/users/analytics',
//       label: 'Analytics',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Statistiques utilisateurs'
//     },
//     {
//       path: '/admin/books',
//       label: 'Bibliothèque',
//       icon: <FiBook className="w-5 h-5" />,
//       description: 'Livres & Publications'
//     },
//     {
//       path: '/admin/books/moderation',
//       label: 'Modération',
//       icon: <FiCheck className="w-5 h-5" />,
//       description: 'Approuver les livres'
//     },
//     {
//       path: '/admin/books/catalog',
//       label: 'Catalogue',
//       icon: <FiFolder className="w-5 h-5" />,
//       description: 'Genres et collections'
//     },
//     {
//       path: '/admin/books/analytics',
//       label: 'Analytics',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Statistiques des livres'
//     },
//     {
//       path: '/admin/challenges',
//       label: 'Défis',
//       icon: <FiAward className="w-5 h-5" />,
//       description: 'Challenges & Badges'
//     },
//     {
//       path: '/admin/challenges/management',
//       label: 'Gestion',
//       icon: <FiTarget className="w-5 h-5" />,
//       description: 'Créer et gérer les défis'
//     },
//     {
//       path: '/admin/challenges/analytics',
//       label: 'Analytics',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Statistiques des défis'
//     },
//     {
//       path: '/admin/challenges/badges',
//       label: 'Badges',
//       icon: <FiServer className="w-5 h-5" />,
//       description: 'Gestion des récompenses'
//     },
//     {
//       path: '/admin/analytics/overview',
//       label: 'Vue d\'ensemble',
//       icon: <FiTrendingUp className="w-5 h-5" />,
//       description: 'Métriques générales'
//     },
//     {
//       path: '/admin/analytics/users',
//       label: 'Utilisateurs',
//       icon: <FiUsers className="w-5 h-5" />,
//       description: 'Engagement utilisateurs'
//     },
//     {
//       path: '/admin/analytics/content',
//       label: 'Contenu',
//       icon: <FiBook className="w-5 h-5" />,
//       description: 'Performance contenu'
//     },
//     {
//       path: '/admin/moderation/queue',
//       label: 'File d\'attente',
//       icon: <FiAlertTriangle className="w-5 h-5" />,
//       description: 'Contenus à modérer'
//     },
//     {
//       path: '/admin/moderation/reports',
//       label: 'Signalements',
//       icon: <FiFlag className="w-5 h-5" />,
//       description: 'Gestion des signalements'
//     },
//     {
//       path: '/admin/moderation/actions',
//       label: 'Actions',
//       icon: <FiActivity className="w-5 h-5" />,
//       description: 'Historique des actions'
//     },
//     {
//       path: '/admin/settings/platform',
//       label: 'Plateforme',
//       icon: <FiGlobe className="w-5 h-5" />,
//       description: 'Paramètres généraux'
//     },
//     {
//       path: '/admin/settings/email',
//       label: 'Emails',
//       icon: <FiMail className="w-5 h-5" />,
//       description: 'Templates et notifications'
//     },
//     {
//       path: '/admin/settings/system',
//       label: 'Système',
//       icon: <FiServer className="w-5 h-5" />,
//       description: 'Configuration système'
//     }
//   ];

//   return (
//     <div className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <nav className="flex space-x-8 overflow-x-auto py-4">
//           {navItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
//                   isActive
//                     ? 'bg-blue-100 text-blue-700 border border-blue-200'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 title={item.description}
//               >
//                 <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
//                   {item.icon}
//                 </span>
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// }
