import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiUserX,
  FiTrash2,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiMessageSquare,
  FiFlag,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

export default function AdminModerationActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActions();
    fetchStats();
  }, [filter]);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`http://localhost:5000/api/admin/moderation/actions?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setActions(data.actions || []);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des actions de modération");
      console.error("❌ Erreur chargement actions modération:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch('http://localhost:5000/api/admin/moderation/actions/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("❌ Erreur chargement stats actions:", err);
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'warn_user': return <FiAlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'remove_content': return <FiTrash2 className="w-5 h-5 text-red-600" />;
      case 'ban_user': return <FiUserX className="w-5 h-5 text-red-800" />;
      case 'suspend_user': return <FiClock className="w-5 h-5 text-orange-600" />;
      case 'approve_content': return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'restore_content': return <FiCheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <FiShield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'warn_user': return 'bg-yellow-100 text-yellow-800';
      case 'remove_content': return 'bg-red-100 text-red-800';
      case 'ban_user': return 'bg-red-200 text-red-900';
      case 'suspend_user': return 'bg-orange-100 text-orange-800';
      case 'approve_content': return 'bg-green-100 text-green-800';
      case 'restore_content': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (actionType) => {
    switch (actionType) {
      case 'warn_user': return 'Avertissement utilisateur';
      case 'remove_content': return 'Suppression contenu';
      case 'ban_user': return 'Bannissement utilisateur';
      case 'suspend_user': return 'Suspension utilisateur';
      case 'approve_content': return 'Approbation contenu';
      case 'restore_content': return 'Restauration contenu';
      default: return actionType;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des actions de modération...
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
            <FiShield className="text-purple-600" />
            Actions de Modération
          </h1>
          <p className="text-gray-600 mt-2">
            Historique et suivi de toutes les actions de modération effectuées
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_actions || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiActivity className="text-blue-500 text-sm mr-1" />
                  <p className="text-sm text-blue-600">
                    Ce mois-ci
                  </p>
                </div>
              </div>
              <FiShield className="text-gray-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avertissements</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.warning_actions || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiAlertTriangle className="text-yellow-500 text-sm mr-1" />
                  <p className="text-sm text-yellow-600">
                    Utilisateurs avertis
                  </p>
                </div>
              </div>
              <FiAlertTriangle className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contenus Supprimés</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.removed_content || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiTrash2 className="text-red-500 text-sm mr-1" />
                  <p className="text-sm text-red-600">
                    Publications/commentaires
                  </p>
                </div>
              </div>
              <FiTrash2 className="text-red-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Bannis</p>
                <p className="text-2xl font-bold text-red-800">
                  {stats.banned_users || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiUserX className="text-red-700 text-sm mr-1" />
                  <p className="text-sm text-red-700">
                    Comptes suspendus
                  </p>
                </div>
              </div>
              <FiUserX className="text-red-800 text-2xl" />
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
              <FiAlertTriangle className="text-yellow-600 text-xl" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Avertir un utilisateur</p>
                <p className="text-sm text-gray-600">Envoyer un avertissement</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
              <FiTrash2 className="text-red-600 text-xl" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Supprimer du contenu</p>
                <p className="text-sm text-gray-600">Retirer publication/commentaire</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
              <FiUserX className="text-red-800 text-xl" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Bannir un utilisateur</p>
                <p className="text-sm text-gray-600">Suspendre définitivement</p>
              </div>
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filtrer les actions</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Toutes les actions</option>
              <option value="warnings">Avertissements</option>
              <option value="removals">Suppressions</option>
              <option value="bans">Bannissements</option>
              <option value="approvals">Approbations</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>

        {/* Actions History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Historique des Actions ({actions.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {actions.length === 0 ? (
              <div className="text-center py-12">
                <FiCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Aucune action de modération trouvée
                </p>
              </div>
            ) : (
              actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getActionIcon(action.action_type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {getActionLabel(action.action_type)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(action.action_type)}`}>
                          {action.action_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Modérateur:</span> {action.moderator_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Utilisateur affecté:</span> {action.affected_user}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Type de contenu:</span> {action.content_type || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span> {new Date(action.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {action.reason && (
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Raison:</span> {action.reason}
                        </p>
                      )}

                      {action.notes && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Notes:</span> {action.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {new Date(action.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        {action.expires_at && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <FiClock className="w-4 h-4" />
                            Expire le {new Date(action.expires_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                        {action.is_reversible && (
                          <span className="flex items-center gap-1 text-green-600">
                            <FiCheckCircle className="w-4 h-4" />
                            Action réversible
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAction(action)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        <FiEye className="w-4 h-4" />
                        Détails
                      </button>
                      {action.is_reversible && (
                        <button className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center gap-1">
                          <FiCheckCircle className="w-4 h-4" />
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiSettings className="text-gray-600" />
            Paramètres de Modération
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seuil d'auto-modération
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Faible (5+ signalements)</option>
                  <option>Moyen (3+ signalements)</option>
                  <option>Élevé (1+ signalement critique)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée des suspensions automatiques
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>24 heures</option>
                  <option>7 jours</option>
                  <option>30 jours</option>
                  <option>Indéfinie</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notifications modérateurs
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Nouveaux signalements critiques</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Actions de modération</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Rapports hebdomadaires</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Detail Modal */}
        {selectedAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de l'Action #{selectedAction.id}
                </h2>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActionIcon(selectedAction.action_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getActionLabel(selectedAction.action_type)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Effectuée le {new Date(selectedAction.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Modérateur:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedAction.moderator_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Utilisateur affecté:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedAction.affected_user}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type de contenu:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedAction.content_type || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">ID du contenu:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedAction.content_id || 'N/A'}</p>
                  </div>
                </div>

                {selectedAction.reason && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Raison:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedAction.reason}</p>
                  </div>
                )}

                {selectedAction.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Notes détaillées:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedAction.notes}
                      </p>
                    </div>
                  </div>
                )}

                {selectedAction.expires_at && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Expiration:</span>
                    <p className="text-sm text-orange-600 mt-1">
                      {new Date(selectedAction.expires_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className={`w-5 h-5 ${selectedAction.is_reversible ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600">
                      {selectedAction.is_reversible ? 'Action réversible' : 'Action irréversible'}
                    </span>
                  </div>
                  {selectedAction.is_reversible && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Annuler l'action
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchActions}
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