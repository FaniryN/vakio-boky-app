import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiUsers,
  FiBook,
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiAward,
  FiShoppingCart,
  FiDatabase,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { apiService } from "../../utils/api";

export default function AdminAnalyticsOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get(`/api/admin/analytics/overview?range=${timeRange}`);
      
      const data = response.data;

      if (data.success) {
        setAnalytics(data.analytics);
        setNote(data.note || "");
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const getRangeLabel = () => {
    switch(timeRange) {
      case '7d': return '7 derniers jours';
      case '30d': return '30 derniers jours';
      case '90d': return '90 derniers jours';
      case '1y': return '1 an';
      default: return '30 derniers jours';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des statistiques réelles...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiBarChart2 className="text-blue-600" />
            Vue d'ensemble de la plateforme
          </h1>
          <p className="text-gray-600 mt-2">
            Métriques clés et santé globale de la plateforme Vakio Boky
          </p>
          {note && (
            <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg inline-flex items-center">
              <FiAlertCircle className="mr-2" />
              <span className="text-sm">{note}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
              <p className="text-sm text-gray-600 mt-1">Données réelles de votre base</p>
            </div>
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
          <div className="mt-4 text-sm text-gray-500">
            <p>📊 Analyse pour: <span className="font-semibold">{getRangeLabel()}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalUsers || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livres Publiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalBooks || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiBook className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.activeEvents || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiCalendar className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Totals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalRevenue || 0}€
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiDollarSign className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAnalytics}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Réessayer le chargement
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FiActivity className="mr-2" />
            Actualiser les statistiques
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Analyse basée sur {getRangeLabel()}
          </p>
        </div>
      </div>
    </div>
  );
}