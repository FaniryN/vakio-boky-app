import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiStar,
  FiShield,
  FiZap,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

export default function AdminChallengesBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon_url: '',
    category: 'achievement',
    rarity: 'common',
    points: 10,
  });

  // FONCTION POUR RÉCUPÉRER LE TOKEN
  const getToken = () => {
    const vakioUser = localStorage.getItem('vakio_user');
    if (vakioUser) {
      try {
        const parsed = JSON.parse(vakioUser);
        return parsed?.token;
      } catch (e) {
        console.error('❌ Erreur parsing vakio_user:', e);
      }
    }
    
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed?.token;
      } catch (e) {
        console.error('❌ Erreur parsing user:', e);
      }
    }
    
    return localStorage.getItem('vakio_token');
  };

  useEffect(() => {
    console.log('🔍 [ChallengesBadges] Token:', getToken()?.substring(0, 20) + '...');
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError("Token d'authentification manquant. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const response = await fetch('https://vakio-boky-backend.onrender.com/api/challenges/admin/badges/all', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('📊 [ChallengesBadges] Statut:', response.status);
      
      if (response.status === 401 || response.status === 403) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem('vakio_token');
        localStorage.removeItem('vakio_user');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBadges(data.badges || []);
        setError(null);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur chargement badges:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      
      if (!token) {
        alert("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      const url = editingBadge
        ? `https://vakio-boky-backend.onrender.com/api/challenges/admin/badges/${editingBadge.id}`
        : 'https://vakio-boky-backend.onrender.com/api/challenges/admin/badges';

      const method = editingBadge ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBadges();
        setShowCreateModal(false);
        setEditingBadge(null);
        resetForm();
        alert(editingBadge ? 'Badge modifié avec succès' : 'Badge créé avec succès');
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      icon_url: badge.icon_url || '',
      category: badge.category || 'achievement',
      rarity: badge.rarity || 'common',
      points: badge.points || 10,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (badgeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce badge ?')) {
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        alert("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/challenges/admin/badges/${badgeId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchBadges();
        alert('Badge supprimé avec succès');
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon_url: '',
      category: 'achievement',
      rarity: 'common',
      points: 10,
    });
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return 'Commun';
      case 'uncommon': return 'Peu commun';
      case 'rare': return 'Rare';
      case 'epic': return 'Épique';
      case 'legendary': return 'Légendaire';
      default: return rarity;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'achievement': return <FiStar className="w-5 h-5" />;
      case 'reading': return <FiStar className="w-5 h-5" />;
      case 'social': return <FiUsers className="w-5 h-5" />;
      case 'special': return <FiStar className="w-5 h-5" />;
      default: return <FiAward className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'achievement': return 'Accomplissement';
      case 'reading': return 'Lecture';
      case 'social': return 'Social';
      case 'special': return 'Spécial';
      default: return category;
    }
  };

  const badgeIcons = [
    { name: 'Trophy', icon: '🏆', value: 'trophy' },
    { name: 'Star', icon: '⭐', value: 'star' },
    { name: 'Medal', icon: '🏅', value: 'medal' },
    { name: 'Shield', icon: '🛡️', value: 'shield' },
    { name: 'Crown', icon: '👑', value: 'crown' },
    { name: 'Lightning', icon: '⚡', value: 'lightning' },
    { name: 'Fire', icon: '🔥', value: 'fire' },
    { name: 'Heart', icon: '❤️', value: 'heart' },
    { name: 'Book', icon: '📚', value: 'book' },
    { name: 'Target', icon: '🎯', value: 'target' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des badges...
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
            <FiAward className="text-yellow-600" />
            Gestion des Badges
          </h1>
          <p className="text-gray-600 mt-2">
            Créez et gérez les badges et récompenses pour motiver vos utilisateurs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Badges</p>
                <p className="text-2xl font-bold text-gray-900">{badges.length}</p>
              </div>
              <FiAward className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Badges Décernés</p>
                <p className="text-2xl font-bold text-green-600">
                  {badges.reduce((sum, b) => sum + (b.earned_count || 0), 0)}
                </p>
              </div>
              <FiStar className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Totaux</p>
                <p className="text-2xl font-bold text-purple-600">
                  {badges.reduce((sum, b) => sum + (b.points || 0), 0)}
                </p>
              </div>
              <FiStar className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Badges Légendaires</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {badges.filter(b => b.rarity === 'legendary').length}
                </p>
              </div>
              <FiStar className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Tous les Badges</h2>
              <button
                onClick={() => {
                  resetForm();
                  setEditingBadge(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiPlus />
                Nouveau Badge
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        {badge.icon_url ? (
                          <span className="text-2xl">{badge.icon_url}</span>
                        ) : (
                          <FiAward className="text-yellow-600 text-xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                      {getRarityLabel(badge.rarity)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getCategoryIcon(badge.category)}
                      <span>{getCategoryLabel(badge.category)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiStar className="text-yellow-500" />
                      <span>{badge.points} points</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiUsers className="text-blue-500" />
                      <span>{badge.earned_count || 0} décernés</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(badge)}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiEdit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(badge.id)}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </motion.div>
              ))}

              {badges.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FiAward className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucun badge trouvé</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setEditingBadge(null);
                      setShowCreateModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <FiPlus />
                    Créer le premier badge
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Badge Categories Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Categories Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Catégorie</h3>
            <div className="space-y-4">
              {['achievement', 'reading', 'social', 'special'].map((category) => {
                const count = badges.filter(b => b.category === category).length;
                const percentage = badges.length > 0 ? Math.round((count / badges.length) * 100) : 0;

                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium text-gray-900">
                        {getCategoryLabel(category)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{count}</p>
                      <p className="text-sm text-gray-600">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rarity Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Rareté</h3>
            <div className="space-y-4">
              {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => {
                const count = badges.filter(b => b.rarity === rarity).length;
                const percentage = badges.length > 0 ? Math.round((count / badges.length) * 100) : 0;

                return (
                  <div key={rarity} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(rarity)}`}>
                      {getRarityLabel(rarity)}
                    </span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingBadge ? 'Modifier le Badge' : 'Nouveau Badge'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="achievement">Accomplissement</option>
                      <option value="reading">Lecture</option>
                      <option value="social">Social</option>
                      <option value="special">Spécial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rareté *
                    </label>
                    <select
                      value={formData.rarity}
                      onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="common">Commun</option>
                      <option value="uncommon">Peu commun</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Épique</option>
                      <option value="legendary">Légendaire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icône
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {badgeIcons.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon_url: icon.icon })}
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          formData.icon_url === icon.icon
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{icon.icon}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    placeholder="Ou entrez un emoji personnalisé"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingBadge ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingBadge(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={fetchBadges}
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