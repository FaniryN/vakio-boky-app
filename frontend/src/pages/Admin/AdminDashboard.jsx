import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiShoppingCart,
  FiPackage,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiBook,
  FiAward,
  FiSettings,
  FiMessageSquare,
  FiHeart,
  FiRefreshCw
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    donations: 0,
    pendingOrders: 0,
    activeCampaigns: 0,
    publishedBooks: 0,
    activeChallenges: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = user?.token;
      
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      console.log('🔐 Token utilisé depuis useAuth:', token);

      // Récupérer les statistiques
      const statsResponse = await fetch('https://vakio-boky-backend.onrender.com/api/admin/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Statut réponse stats:', statsResponse.status);

      if (statsResponse.status === 403) {
        setError('Accès refusé. Vérifiez vos permissions administrateur.');
        return;
      }

      if (!statsResponse.ok) {
        throw new Error(`Erreur HTTP: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      console.log('📊 Données stats:', statsData);

      if (statsData.success) {
        setStats(statsData.stats);
      } else {
        setError(statsData.error || 'Erreur lors de la récupération des statistiques');
      }

      // Récupérer l'activité récente
      const activityResponse = await fetch('https://vakio-boky-backend.onrender.com/api/admin/dashboard/activity', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Statut réponse activité:', activityResponse.status);

      if (activityResponse.status === 403) {
        if (!error) setError('Accès refusé pour l\'activité récente.');
        return;
      }

      if (!activityResponse.ok) {
        throw new Error(`Erreur HTTP: ${activityResponse.status}`);
      }

      const activityData = await activityResponse.json();
      console.log('📊 Données activité:', activityData);

      if (activityData.success) {
        setRecentActivity(activityData.activity);
      }

    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setError(error.message);
      
      // Fallback vers des données statiques en cas d'erreur
      setStats({
        products: 3,
        orders: 4,
        users: 3,
        donations: 101481,
        pendingOrders: 0,
        activeCampaigns: 2,
        publishedBooks: 2,
        activeChallenges: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setError('');
    fetchDashboardData();
  };

  const adminFeatures = [
    {
      title: 'Gestion Marketplace',
      description: 'Gérer les produits, commandes et inventaire',
      icon: <FiShoppingCart className="w-8 h-8" />,
      path: '/admin/marketplace',
      color: 'bg-blue-500',
      stats: `${stats.products} Produits actifs`
    },
    {
      title: 'Commandes & Ventes',
      description: 'Suivre les commandes et analyser les ventes',
      icon: <FiPackage className="w-8 h-8" />,
      path: '/admin/orders',
      color: 'bg-green-500',
      stats: `${stats.pendingOrders} Commandes en attente`
    },
    {
      title: 'Campagnes de Financement',
      description: 'Gérer les campagnes de dons et collectes',
      icon: <FiHeart className="w-8 h-8" />,
      path: '/admin/campaigns',
      color: 'bg-red-500',
      stats: `${stats.activeCampaigns} Campagnes actives`
    },
    {
      title: 'Événements',
      description: 'Organiser et gérer les événements littéraires',
      icon: <FiCalendar className="w-8 h-8" />,
      path: '/admin/events',
      color: 'bg-purple-500',
      stats: 'Événements à venir'
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes utilisateurs et rôles',
      icon: <FiUsers className="w-8 h-8" />,
      path: '/admin/users',
      color: 'bg-indigo-500',
      stats: `${stats.users} Utilisateurs actifs`
    },
    {
      title: 'Bibliothèque',
      description: 'Approuver et gérer les livres publiés',
      icon: <FiBook className="w-8 h-8" />,
      path: '/admin/books',
      color: 'bg-yellow-500',
      stats: `${stats.publishedBooks} Livres publiés`
    },
    {
      title: 'Défis & Badges',
      description: 'Créer et gérer les challenges de lecture',
      icon: <FiAward className="w-8 h-8" />,
      path: '/admin/challenges',
      color: 'bg-orange-500',
      stats: `${stats.activeChallenges} Défis actifs`
    },
    {
      title: 'Statistiques',
      description: 'Analyser les métriques de la plateforme',
      icon: <FiTrendingUp className="w-8 h-8" />,
      path: '/admin/analytics',
      color: 'bg-teal-500',
      stats: 'Rapports disponibles'
    },
    {
      title: 'Modération',
      description: 'Gérer les commentaires et contenus',
      icon: <FiMessageSquare className="w-8 h-8" />,
      path: '/admin/moderation',
      color: 'bg-pink-500',
      stats: 'Éléments en attente'
    },
    {
      title: 'Paramètres Système',
      description: 'Configuration générale de la plateforme',
      icon: <FiSettings className="w-8 h-8" />,
      path: '/admin/settings',
      color: 'bg-gray-500',
      stats: 'Paramètres actifs'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'user':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'campaign':
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>;
      case 'donation':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          Non authentifié. Veuillez vous connecter.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              👑 Tableau de Bord Administrateur
            </h1>
            <p className="text-blue-100 text-lg">
              Bienvenue, {user?.nom || user?.user?.nom || 'Administrateur'}. Gérez votre plateforme littéraire.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-500/80 rounded-lg">
                <p className="text-white text-sm">{error}</p>
                <button 
                  onClick={logout}
                  className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-medium"
                >
                  Se reconnecter
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">Actualiser</span>
            </button>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-blue-200 text-sm">Connecté en tant que</p>
                <p className="font-semibold text-white">{user?.email || user?.user?.email}</p>
                <p className="text-blue-200 text-sm">Rôle: {user?.role || user?.user?.role}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-xl">
                  {(user?.nom?.charAt(0) || user?.user?.nom?.charAt(0) || 'A')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiHeart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dons</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.donations.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {adminFeatures.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{feature.stats}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="text-sm font-medium">Accéder</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
            >
              <FiRefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <p className="text-sm text-gray-600 flex-1">
                      <span className="font-medium">{activity.title}</span> - {activity.description}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucune activité récente
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}