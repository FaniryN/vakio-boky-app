import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiBarChart2,
  FiClock,
  FiCalendar,
  FiActivity,
  FiTarget,
  FiEye,
} from "react-icons/fi";

export default function AdminUserAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`http://localhost:5000/api/admin/users/analytics?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des statistiques");
      console.error("❌ Erreur chargement statistiques utilisateurs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des statistiques...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiBarChart2 className="text-blue-600" />
            Analytics Utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Analysez le comportement et l'engagement des utilisateurs
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics ? analytics.totalUsers : 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{analytics?.userGrowth || 0}% vs période précédente
                </p>
              </div>
              <FiUsers className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.activeUsers || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {analytics?.activeUsersPercentage || 0}% du total
                </p>
              </div>
              <FiUserCheck className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.newUsers || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Cette période
                </p>
              </div>
              <FiTrendingUp className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Rétention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.retentionRate || 0}%
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Utilisateurs revenant
                </p>
              </div>
              <FiTarget className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* User Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Active Users */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité Quotidienne</h3>
            <div className="space-y-4">
              {analytics?.dailyActivity?.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiActivity className="text-blue-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{day.active_users}</p>
                    <p className="text-sm text-gray-600">{day.percentage}%</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée d'activité</p>
              )}
            </div>
          </div>

          {/* User Roles Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Rôle</h3>
            <div className="space-y-4">
              {analytics?.roleDistribution?.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiUsers className="text-purple-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {role.role}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{role.count}</p>
                    <p className="text-sm text-gray-600">{role.percentage}%</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de répartition</p>
              )}
            </div>
          </div>
        </div>

        {/* User Engagement Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques d'Engagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics?.engagementMetrics?.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiEye className="text-blue-600 text-xl" />
                </div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{metric.value}</p>
                <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
              </motion.div>
            )) || (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Aucune métrique d'engagement disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Active Users */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Utilisateurs les Plus Actifs</h3>
          <div className="space-y-4">
            {analytics?.topActiveUsers?.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{user.activity_score}</p>
                  <p className="text-sm text-gray-600">Score d'activité</p>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8">Aucun utilisateur actif trouvé</p>
            )}
          </div>
        </div>

        {/* User Registration Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des Inscriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analytics?.registrationTrends?.map((month, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-600">{month.month}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{month.registrations}</p>
                <p className="text-sm text-gray-600 mt-1">nouvelles inscriptions</p>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8 col-span-4">Aucune donnée d'inscription</p>
            )}
          </div>
        </div>

        {/* User Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gender Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Genre</h3>
            <div className="space-y-4">
              {analytics?.genderDistribution?.map((gender, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {gender.genre || 'Non spécifié'}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-pink-600">{gender.count}</p>
                    <p className="text-sm text-gray-600">{gender.percentage}%</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de genre</p>
              )}
            </div>
          </div>

          {/* Preferred Genres */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Genres Littéraires Préférés</h3>
            <div className="space-y-4">
              {analytics?.preferredGenres?.map((genre, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {genre.genre_prefere || 'Non spécifié'}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">{genre.count}</p>
                    <p className="text-sm text-gray-600">{genre.percentage}%</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de genre préféré</p>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchAnalytics}
              className="ml-4 underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}