import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPlay,
  FiPause,
  FiCalendar,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiFilter,
  FiSearch,
} from "react-icons/fi";

export default function AdminChallengesManagement() {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'reading',
    target_value: 1,
    reward_badge_id: '',
    end_date: '',
    status: 'draft',
  });

  useEffect(() => {
    // Vérifier si connecté
    const token = localStorage.getItem('vakio_token');
    console.log("🔑 Token trouvé:", token ? "OUI" : "NON");
    
    if (!token) {
      setError("❌ Vous n'êtes pas connecté. Veuillez vous connecter d'abord.");
      setLoading(false);
      return;
    }
    
    fetchChallenges();
    fetchBadges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      
      if (!token) {
        setError("❌ Token manquant. Connectez-vous à: http://localhost:5173/login");
        setLoading(false);
        return;
      }

      console.log("📡 Envoi requête à: /api/challenges/admin/all");
      console.log("🔑 Token utilisé:", token.substring(0, 20) + "...");
      
      const response = await fetch('http://localhost:5000/api/challenges/admin/all', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("✅ Réponse status:", response.status);
      
      if (response.status === 401) {
        setError("❌ Session expirée. Reconnectez-vous.");
        localStorage.removeItem('vakio_token');
        setLoading(false);
        return;
      }
      
      if (response.status === 403) {
        setError("❌ Accès interdit. Vous n'êtes pas administrateur.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("📊 Données reçues:", data);

      if (data.success) {
        setChallenges(data.challenges || []);
        setError(null);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur complète:", err);
      setError("Erreur de connexion. Vérifiez que le serveur backend est démarré sur le port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem('vakio_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/challenges/admin/badges/all', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (data.success) {
        setBadges(data.badges || []);
      }
    } catch (err) {
      console.error("❌ Erreur chargement badges:", err);
    }
  };

  // Filtrer les défis
  const filteredChallenges = challenges.filter(challenge => {
    if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !challenge.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.status !== 'all' && challenge.status !== filters.status) {
      return false;
    }
    
    if (filters.type !== 'all' && challenge.type !== filters.type) {
      return false;
    }
    
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('vakio_token');
      if (!token) {
        alert("❌ Vous n'êtes pas connecté.");
        return;
      }

      const url = editingChallenge
        ? `http://localhost:5000/api/challenges/admin/${editingChallenge.id}`
        : 'http://localhost:5000/api/challenges/admin';

      const method = editingChallenge ? 'PUT' : 'POST';

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
        await fetchChallenges();
        setShowCreateModal(false);
        setEditingChallenge(null);
        resetForm();
        alert(editingChallenge ? '✅ Défi modifié avec succès' : '✅ Défi créé avec succès');
      } else {
        alert('❌ ' + (data.error || 'Erreur lors de la sauvegarde'));
      }
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      type: challenge.type,
      target_value: challenge.target_value,
      reward_badge_id: challenge.reward_badge_id || '',
      end_date: challenge.end_date ? new Date(challenge.end_date).toISOString().split('T')[0] : '',
      status: challenge.status,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (challengeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('vakio_token');
      if (!token) {
        alert("❌ Vous n'êtes pas connecté.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/challenges/admin/${challengeId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchChallenges();
        alert('✅ Défi supprimé avec succès');
      } else {
        alert('❌ ' + (data.error || 'Erreur lors de la suppression'));
      }
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (challengeId, newStatus) => {
    try {
      const token = localStorage.getItem('vakio_token');
      if (!token) {
        alert("❌ Vous n'êtes pas connecté.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/challenges/admin/${challengeId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchChallenges();
        alert(`✅ Défi ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`);
      } else {
        alert('❌ ' + (data.error || 'Erreur lors de la mise à jour'));
      }
    } catch (err) {
      console.error('❌ Erreur changement statut:', err);
      alert('❌ Erreur lors de la mise à jour du statut');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'reading',
      target_value: 1,
      reward_badge_id: '',
      end_date: '',
      status: 'draft',
    });
  };

  const getChallengeTypeLabel = (type) => {
    const types = {
      'reading': 'Lecture',
      'writing': 'Écriture',
      'social': 'Social',
    };
    return types[type] || type;
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  // Calcul des statistiques
  const stats = {
    total: challenges.length,
    active: challenges.filter(c => c.status === 'active').length,
    participants: challenges.reduce((sum, c) => sum + (c.participants_count || 0), 0),
    completionRate: challenges.length > 0
      ? Math.round(challenges.reduce((sum, c) => sum + (c.completion_rate || 0), 0) / challenges.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des défis...
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
            <FiTarget className="text-orange-600" />
            Gestion des Défis
          </h1>
          <p className="text-gray-600 mt-2">
            Créez et gérez les défis de lecture pour motiver vos utilisateurs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Défis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FiTarget className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Défis Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <FiPlay className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-purple-600">{stats.participants}</p>
              </div>
              <FiUsers className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux Réussite</p>
                <p className="text-2xl font-bold text-orange-600">{stats.completionRate}%</p>
              </div>
              <FiTrendingUp className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un défi..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="completed">Terminé</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="reading">Lecture</option>
                <option value="writing">Écriture</option>
                <option value="social">Social</option>
              </select>
              
              <button
                onClick={() => setFilters({ search: '', status: 'all', type: 'all' })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiFilter />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Challenges Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Tous les Défis ({filteredChallenges.length})
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setEditingChallenge(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiPlus />
                Nouveau Défi
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Défi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objectif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChallenges.map((challenge) => (
                  <motion.tr
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <FiTarget className="text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {challenge.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {challenge.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getChallengeTypeLabel(challenge.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {challenge.target_value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {challenge.participants_count || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          {challenge.completions_count || 0} terminés
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(challenge.status)}`}>
                        {getStatusLabel(challenge.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {challenge.end_date ? new Date(challenge.end_date).toLocaleDateString('fr-FR') : 'Pas de limite'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(challenge)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Modifier"
                        >
                          <FiEdit />
                        </button>

                        {challenge.status === 'draft' && (
                          <button
                            onClick={() => handleStatusChange(challenge.id, 'active')}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Activer"
                          >
                            <FiPlay />
                          </button>
                        )}

                        {challenge.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(challenge.id, 'draft')}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                            title="Désactiver"
                          >
                            <FiPause />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(challenge.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Supprimer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && !error && (
          <div className="text-center py-12">
            <FiTarget className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {challenges.length === 0 
                ? "Aucun défi trouvé" 
                : "Aucun défi ne correspond aux filtres"}
            </p>
            {challenges.length === 0 ? (
              <button
                onClick={() => {
                  resetForm();
                  setEditingChallenge(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <FiPlus />
                Créer le premier défi
              </button>
            ) : (
              <button
                onClick={() => setFilters({ search: '', status: 'all', type: 'all' })}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingChallenge ? 'Modifier le Défi' : 'Nouveau Défi'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="reading">Lecture</option>
                      <option value="writing">Écriture</option>
                      <option value="social">Social</option>
                    </select>
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
                      Objectif *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.target_value}
                      onChange={(e) => setFormData({ ...formData, target_value: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge Récompense
                    </label>
                    <select
                      value={formData.reward_badge_id}
                      onChange={(e) => setFormData({ ...formData, reward_badge_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Aucun badge</option>
                      {badges.map((badge) => (
                        <option key={badge.id} value={badge.id}>
                          {badge.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="active">Actif</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingChallenge ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingChallenge(null);
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
              <span className="font-bold">{error}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    localStorage.removeItem('vakio_token');
                    window.location.href = '/login';
                  }}
                  className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={fetchChallenges}
                  className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p>Pour vous connecter:</p>
              <ol className="list-decimal ml-4 mt-1">
                <li>Allez sur <a href="http://localhost:5173/login" className="text-blue-600 underline">http://localhost:5173/login</a></li>
                <li>Connectez-vous avec un compte administrateur</li>
                <li>Revenez sur cette page</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}