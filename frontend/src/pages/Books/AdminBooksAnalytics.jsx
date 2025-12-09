import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiBook,
  FiUsers,
  FiEye,
  FiDownload,
  FiStar,
  FiBarChart2,
  FiCalendar,
  FiAward,
  FiTarget,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminBooksAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      if (!token) {
        setError("Token d'authentification manquant - Veuillez vous reconnecter");
        setLoading(false);
        return;
      }

      // Par :
const response = await fetch(`http://localhost:5000/api/admin/books/analytics?range=${timeRange}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expirée - Veuillez vous reconnecter");
          localStorage.removeItem("vakio_user");
          return;
        }
        if (response.status === 403) {
          setError("Accès refusé - Droits administrateur requis");
          return;
        }
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur chargement statistiques livres:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRefresh = () => {
    fetchAnalytics();
    showSuccess("Statistiques actualisées");
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
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-green-600" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiBarChart2 className="text-purple-600" />
                Analytics Livres
              </h1>
              <p className="text-gray-600 mt-2">
                Analysez les performances et l'engagement des livres
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  onClick={fetchAnalytics}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Livres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics ? analytics.totalBooks : 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{analytics?.booksGrowth || 0}% vs période précédente
                </p>
              </div>
              <FiBook className="text-blue-600 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lectures Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalReads?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Lectures enregistrées
                </p>
              </div>
              <FiEye className="text-green-600 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Téléchargements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalDownloads?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Livres téléchargés
                </p>
              </div>
              <FiDownload className="text-purple-600 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.averageRating || 0}/5
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Sur {analytics?.totalRatings?.toLocaleString() || 0} avis
                </p>
              </div>
              <FiStar className="text-yellow-600 text-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Reading Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Reading Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité de Lecture Quotidienne</h3>
            <div className="space-y-4">
              {analytics?.dailyActivity?.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiEye className="text-green-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{day.reads}</p>
                    <p className="text-sm text-gray-600">{day.percentage}%</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée d'activité de lecture</p>
              )}
            </div>
          </motion.div>

          {/* Popular Genres */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Genres Populaires</h3>
            <div className="space-y-4">
              {analytics?.popularGenres?.map((genre, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {genre.genre}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{genre.reads?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{genre.percentage}%</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de genre</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Livres les Plus Performants</h3>
          <div className="space-y-4">
            {analytics?.topBooks?.map((book, index) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {book.couverture_url && (
                      <img
                        src={book.couverture_url}
                        alt={book.titre}
                        className="w-10 h-14 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{book.titre}</h4>
                      <p className="text-sm text-gray-600">Par {book.auteur_nom}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{book.reads?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Lectures</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{book.downloads?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Téléchargements</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <p className="text-lg font-bold text-yellow-600">{book.rating}</p>
                      </div>
                      <p className="text-sm text-gray-600">{book.ratings_count} avis</p>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-8">Aucun livre trouvé</p>
            )}
          </div>
        </motion.div>

        {/* Author Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance des Auteurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics?.authorPerformance?.map((author, index) => (
              <div
                key={author.id}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUsers className="text-blue-600 text-xl" />
                </div>
                <p className="text-sm font-medium text-gray-600">{author.name}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{author.total_reads?.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Lectures totales</p>
                <div className="mt-2 text-xs text-gray-500">
                  <p>{author.books_count} livre(s)</p>
                  <p>Note moyenne: {author.avg_rating}/5</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-8 col-span-full">Aucune donnée d'auteur</p>
            )}
          </div>
        </motion.div>

        {/* Reading Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Reading Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des Lectures</h3>
            <div className="space-y-4">
              {analytics?.monthlyTrends?.map((month, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900">{month.month}</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{month.reads?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{month.growth}%</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune donnée de tendance</p>
              )}
            </div>
          </motion.div>

          {/* User Engagement Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques d'Engagement</h3>
            <div className="space-y-4">
              {analytics?.engagementMetrics?.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiTarget className="text-blue-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{metric.value}</p>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">Aucune métrique d'engagement</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Book Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Statut</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analytics?.statusDistribution?.map((status, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-600 capitalize">{status.status}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{status.count}</p>
                <p className="text-sm text-gray-600 mt-1">{status.percentage}%</p>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-8 col-span-4">Aucune donnée de statut</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}