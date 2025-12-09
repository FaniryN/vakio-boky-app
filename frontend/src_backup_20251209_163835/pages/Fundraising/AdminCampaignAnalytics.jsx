import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiTarget,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";

export default function AdminCampaignAnalytics() {
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
      const response = await fetch(`http://localhost:5000/api/campaigns/admin/analytics?range=${timeRange}`, {
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
      console.error("❌ Erreur chargement statistiques campagnes:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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
            Analytics Campagnes
          </h1>
          <p className="text-gray-600 mt-2">
            Analysez les performances des campagnes de collecte de fonds
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
                <p className="text-sm font-medium text-gray-600">Total Collecté</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics ? formatAmount(analytics.totalRaised) : '0€'}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{analytics?.growth || 0}% vs période précédente
                </p>
              </div>
              <FiDollarSign className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nombre de Dons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalDonations || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  +{analytics?.donationGrowth || 0}% vs période précédente
                </p>
              </div>
              <FiTrendingUp className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Donateurs Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.activeDonors || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  +{analytics?.donorGrowth || 0}% vs période précédente
                </p>
              </div>
              <FiUsers className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.activeCampaigns || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {analytics?.completedCampaigns || 0} terminées
                </p>
              </div>
              <FiTarget className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Top Performing Campaigns */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campagnes les Plus Performantes</h3>
          <div className="space-y-4">
            {analytics?.topCampaigns?.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                    <p className="text-sm text-gray-600">{campaign.donations} dons</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{formatAmount(campaign.amount)}</p>
                  <p className="text-sm text-gray-600">{Math.round((campaign.amount / campaign.target) * 100)}% objectif</p>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Dons Récents</h3>
          <div className="space-y-4">
            {analytics?.recentDonations?.map((donation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FiDollarSign className="text-green-600 text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {donation.anonymous ? 'Don anonyme' : `Don de ${donation.donor_name}`}
                    </p>
                    <p className="text-sm text-gray-600">{donation.campaign_title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatAmount(donation.amount)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(donation.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8">Aucun don récent</p>
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution Mensuelle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics?.monthlyTrends?.map((month, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-600">{month.month}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatAmount(month.amount)}</p>
                <p className="text-sm text-gray-600 mt-1">{month.donations} dons</p>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-8 col-span-3">Aucune donnée mensuelle disponible</p>
            )}
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