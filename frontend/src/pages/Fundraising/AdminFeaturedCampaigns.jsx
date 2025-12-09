import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiStar,
  FiTrendingUp,
  FiCalendar,
  FiEye,
  FiArrowUp,
  FiArrowDown,
  FiSave,
} from "react-icons/fi";

export default function AdminFeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      const response = await fetch('http://localhost:5000/api/campaigns/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const allCampaigns = data.campaigns || [];
        const featured = allCampaigns.filter(c => c.featured).sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));
        const available = allCampaigns.filter(c => !c.featured && c.status === 'active');

        setCampaigns(available);
        setFeaturedCampaigns(featured);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des campagnes");
      console.error("❌ Erreur chargement campagnes:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToFeatured = async (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const newOrder = featuredCampaigns.length;
    const updatedFeatured = [...featuredCampaigns, { ...campaign, featured: true, featured_order: newOrder }];
    const updatedAvailable = campaigns.filter(c => c.id !== campaignId);

    setFeaturedCampaigns(updatedFeatured);
    setCampaigns(updatedAvailable);

    await saveFeaturedOrder(updatedFeatured);
  };

  const removeFromFeatured = async (campaignId) => {
    const campaign = featuredCampaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const updatedFeatured = featuredCampaigns.filter(c => c.id !== campaignId);
    const updatedAvailable = [...campaigns, { ...campaign, featured: false }];

    setFeaturedCampaigns(updatedFeatured);
    setCampaigns(updatedAvailable);

    await saveFeaturedOrder(updatedFeatured);
  };

  const moveCampaign = async (campaignId, direction) => {
    const currentIndex = featuredCampaigns.findIndex(c => c.id === campaignId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= featuredCampaigns.length) return;

    const updatedFeatured = [...featuredCampaigns];
    [updatedFeatured[currentIndex], updatedFeatured[newIndex]] = [updatedFeatured[newIndex], updatedFeatured[currentIndex]];

    // Update order numbers
    updatedFeatured.forEach((campaign, index) => {
      campaign.featured_order = index;
    });

    setFeaturedCampaigns(updatedFeatured);
    await saveFeaturedOrder(updatedFeatured);
  };

  const saveFeaturedOrder = async (featuredList) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('vakio_token');

      const updates = featuredList.map((campaign, index) => ({
        id: campaign.id,
        featured: true,
        featured_order: index,
        featured_until: null, // Could add date picker later
      }));

      const response = await fetch('http://localhost:5000/api/campaigns/admin/featured/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Erreur sauvegarde:', data.error);
        // Revert changes on error
        await fetchCampaigns();
      }
    } catch (err) {
      console.error('❌ Erreur sauvegarde ordre:', err);
      // Revert changes on error
      await fetchCampaigns();
    } finally {
      setSaving(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getProgressPercentage = (campaign) => {
    return Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des campagnes...
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
            <FiStar className="text-yellow-600" />
            Campagnes Mises en Avant
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les campagnes mises en avant sur la plateforme
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes en Avant</p>
                <p className="text-2xl font-bold text-gray-900">{featuredCampaigns.length}</p>
              </div>
              <FiStar className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
              <FiTrendingUp className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collecté</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAmount(featuredCampaigns.reduce((sum, c) => sum + parseFloat(c.current_amount), 0))}
                </p>
              </div>
              <FiEye className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Campaigns */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Campagnes Mises en Avant</h3>
              {saving && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Sauvegarde...</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {featuredCampaigns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune campagne mise en avant</p>
              ) : (
                featuredCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FiStar className="text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Position {index + 1}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{campaign.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{campaign.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            {formatAmount(campaign.current_amount)} collecté
                          </span>
                          <span className="text-gray-500">
                            {getProgressPercentage(campaign).toFixed(1)}% objectif
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveCampaign(campaign.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveCampaign(campaign.id, 'down')}
                            disabled={index === featuredCampaigns.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromFeatured(campaign.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Available Campaigns */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Campagnes Disponibles</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {campaigns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune campagne disponible</p>
              ) : (
                campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{campaign.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{campaign.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            {formatAmount(campaign.current_amount)} collecté
                          </span>
                          <span className="text-gray-500">
                            {getProgressPercentage(campaign).toFixed(1)}% objectif
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToFeatured(campaign.id)}
                        className="ml-4 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchCampaigns}
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