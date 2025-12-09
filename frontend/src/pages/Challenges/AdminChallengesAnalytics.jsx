import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiUsers,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiStar,
} from "react-icons/fi";

export default function AdminChallengesAnalytics() {
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
      if (!token) {
        setError("Token d'authentification manquant. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/challenges/admin/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem('vakio_token');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
        setError(null);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("❌ Erreur chargement statistiques défis:", err);
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
            <FiBarChart2 className="text-orange-600" />
            Analytics Défis
          </h1>
          <p className="text-gray-600 mt-2">
            Analysez les performances et l'engagement des défis de lecture
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <p className="text-sm font-medium text-gray-600">Total Défis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics ? analytics.totalChallenges : 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{analytics?.challengesGrowth || 0}% vs période précédente
                </p>
              </div>
              <FiTarget className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalParticipants || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Utilisateurs actifs
                </p>
              </div>
              <FiUsers className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux Réussite</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.completionRate || 0}%
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Défis terminés
                </p>
              </div>
              <FiCheckCircle className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Badges Décernés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalBadges || 0}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Récompenses distribuées
                </p>
              </div>
              <FiAward className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Challenge Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Participation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Participation Quotidienne</h3>
            <div className="space-y-4">
              {analytics?.dailyParticipation?.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FiUsers className="text-orange-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{day.participants}</p>
                    <p className="text-sm text-gray-600">{day.completions} terminés</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de participation</p>
              )}
            </div>
          </div>

          {/* Challenge Types Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Types de Défis Populaires</h3>
            <div className="space-y-4">
              {analytics?.challengeTypes?.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {type.type}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{type.count}</p>
                    <p className="text-sm text-gray-600">{type.percentage}%</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de type</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Performing Challenges */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Défis les Plus Performants</h3>
          <div className="space-y-4">
            {analytics?.topChallenges?.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">Type: {challenge.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{challenge.participants}</p>
                      <p className="text-sm text-gray-600">Participants</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{challenge.completions}</p>
                      <p className="text-sm text-gray-600">Terminés</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">
                        {challenge.completion_rate}%
                      </p>
                      <p className="text-sm text-gray-600">Taux réussite</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8">Aucun défi trouvé</p>
            )}
          </div>
        </div>

        {/* User Engagement and Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Participants */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Participants</h3>
            <div className="space-y-4">
              {analytics?.topParticipants?.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{participant.challenges_completed}</p>
                    <p className="text-sm text-gray-600">Défis terminés</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucun participant trouvé</p>
              )}
            </div>
          </div>

          {/* Badge Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribution des Badges</h3>
            <div className="space-y-4">
              {analytics?.badgeDistribution?.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FiAward className="text-yellow-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{badge.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">{badge.earned_count}</p>
                    <p className="text-sm text-gray-600">Décernés</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucun badge trouvé</p>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Challenge Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des Défis</h3>
            <div className="space-y-4">
              {analytics?.monthlyTrends?.map((month, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900">{month.month}</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{month.challenges_created}</p>
                    <p className="text-sm text-gray-600">Créés</p>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de tendance</p>
              )}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques d'Engagement</h3>
            <div className="space-y-4">
              {analytics?.engagementMetrics?.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="text-blue-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{metric.value}</p>
                </motion.div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune métrique d'engagement</p>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Statut</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analytics?.statusDistribution?.map((status, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-600 capitalize">{status.status}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{status.count}</p>
                <p className="text-sm text-gray-600 mt-1">{status.percentage}%</p>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8 col-span-4">Aucune donnée de statut</p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={fetchAnalytics}
                className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}