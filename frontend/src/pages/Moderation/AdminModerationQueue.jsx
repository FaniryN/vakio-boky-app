import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiFlag,
  FiMessageSquare,
  FiUser,
  FiCalendar,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiEdit,
  FiClock,
  FiAlertCircle,
  FiBook
} from "react-icons/fi";

export default function AdminModerationQueue() {
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    console.log('🔍 [ModerationQueue] Token:', getToken()?.substring(0, 20) + '...');
    fetchModerationQueue();
  }, [filter]);

  const fetchModerationQueue = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError("Token d'authentification manquant. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/moderation/queue?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('📊 [ModerationQueue] Statut:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        setQueueItems(data.items || []);
        setError(null);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur chargement file modération:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId, action, reason = '') => {
    try {
      const token = getToken();
      
      if (!token) {
        alert('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }
      
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/moderation/queue/${itemId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action, reason }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchModerationQueue();
        setSelectedItem(null);
        alert(`Action "${action}" appliquée avec succès`);
      } else {
        alert(data.error || 'Erreur lors de l\'action');
      }
    } catch (err) {
      console.error('❌ Erreur action modération:', err);
      alert('Erreur de connexion au serveur');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post': return <FiMessageSquare className="w-5 h-5" />;
      case 'comment': return <FiMessageSquare className="w-5 h-5" />;
      case 'user': return <FiUser className="w-5 h-5" />;
      case 'book': return <FiBook className="w-5 h-5" />;
      default: return <FiFlag className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = queueItems.filter(item =>
    item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reported_user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement de la file de modération...
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
            <FiAlertTriangle className="text-orange-600" />
            File de Modération
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les contenus signalés et nécessitant une modération
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {queueItems.filter(item => item.status === 'pending').length}
                </p>
              </div>
              <FiClock className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En révision</p>
                <p className="text-2xl font-bold text-blue-600">
                  {queueItems.filter(item => item.status === 'in_review').length}
                </p>
              </div>
              <FiEye className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">
                  {queueItems.filter(item => item.status === 'resolved').length}
                </p>
              </div>
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">
                  {queueItems.filter(item => item.priority === 'critical').length}
                </p>
              </div>
              <FiAlertCircle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Tous les éléments</option>
                <option value="pending">En attente</option>
                <option value="in_review">En révision</option>
                <option value="critical">Critiques seulement</option>
                <option value="posts">Publications</option>
                <option value="comments">Commentaires</option>
                <option value="users">Utilisateurs</option>
              </select>
            </div>

            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Moderation Queue */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Éléments à modérer ({filteredItems.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <FiCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? "Aucun élément ne correspond à votre recherche" : "La file de modération est vide"}
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg border ${getPriorityColor(item.priority)}`}>
                        {getTypeIcon(item.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {item.type === 'post' && 'Publication signalée'}
                            {item.type === 'comment' && 'Commentaire signalé'}
                            {item.type === 'user' && 'Utilisateur signalé'}
                            {item.type === 'book' && 'Livre signalé'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status === 'pending' && 'En attente'}
                            {item.status === 'in_review' && 'En révision'}
                            {item.status === 'resolved' && 'Résolu'}
                            {item.status === 'dismissed' && 'Rejeté'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'critical' && 'Critique'}
                            {item.priority === 'high' && 'Élevé'}
                            {item.priority === 'medium' && 'Moyen'}
                            {item.priority === 'low' && 'Faible'}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {item.content || 'Contenu non disponible'}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            {item.reported_user || 'Utilisateur inconnu'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(item.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiFlag className="w-4 h-4" />
                            {item.reason || 'Raison non spécifiée'}
                          </span>
                          {item.reports_count > 1 && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <FiAlertTriangle className="w-4 h-4" />
                              {item.reports_count} signalements
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        <FiEye className="w-4 h-4" />
                        Voir
                      </button>
                      <button
                        onClick={() => handleAction(item.id, 'approve')}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleAction(item.id, 'reject')}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <FiXCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de l'élément signalé
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informations générales</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <span className="ml-2 text-sm text-gray-900 capitalize">{selectedItem.type}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Utilisateur signalé:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedItem.reported_user}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Signalé par:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedItem.reporter_user}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Date:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(selectedItem.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Raison:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedItem.reason}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Priorité:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedItem.priority)}`}>
                        {selectedItem.priority === 'critical' && 'Critique'}
                        {selectedItem.priority === 'high' && 'Élevé'}
                        {selectedItem.priority === 'medium' && 'Moyen'}
                        {selectedItem.priority === 'low' && 'Faible'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nombre de signalements:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedItem.reports_count || 1}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contenu signalé</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedItem.content || 'Contenu non disponible'}
                    </p>
                  </div>

                  {selectedItem.additional_info && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Informations supplémentaires</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {selectedItem.additional_info}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleAction(selectedItem.id, 'approve')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheckCircle className="w-5 h-5" />
                  Approuver le contenu
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'warn_user')}
                  className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiAlertTriangle className="w-5 h-5" />
                  Avertir l'utilisateur
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'remove_content')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Supprimer le contenu
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, 'ban_user')}
                  className="flex-1 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-2"
                >
                  <FiXCircle className="w-5 h-5" />
                  Bannir l'utilisateur
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchModerationQueue}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
            {!getToken() && (
              <p className="mt-2 text-sm">
                Aucun token trouvé. Veuillez vous <a href="/login" className="underline">reconnecter</a>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}