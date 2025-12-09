import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiFlag,
  FiUser,
  FiMessageSquare,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";

export default function AdminModerationReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/moderation/reports?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReports(data.reports || []);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des signalements");
      console.error("❌ Erreur chargement signalements:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/admin/moderation/reports/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("❌ Erreur chargement stats:", err);
    }
  };

  const handleResolveReport = async (reportId, action, notes = '') => {
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/moderation/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, notes }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchReports();
        await fetchStats();
        setSelectedReport(null);
        alert(`Signalement ${action === 'resolved' ? 'résolu' : 'rejeté'} avec succès`);
      } else {
        alert(data.error || 'Erreur lors de la résolution');
      }
    } catch (err) {
      console.error('❌ Erreur résolution signalement:', err);
      alert('Erreur lors de la résolution');
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'harassment': return <FiUser className="w-5 h-5" />;
      case 'spam': return <FiMessageSquare className="w-5 h-5" />;
      case 'inappropriate': return <FiAlertTriangle className="w-5 h-5" />;
      case 'copyright': return <FiFlag className="w-5 h-5" />;
      default: return <FiFlag className="w-5 h-5" />;
    }
  };

  const filteredReports = reports.filter(report =>
    report.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reported_user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des signalements...
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
            <FiFlag className="text-red-600" />
            Gestion des Signalements
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les signalements utilisateurs et suivez leur résolution
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Signalements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_reports || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">
                    +{stats.reports_growth || 0}% ce mois
                  </p>
                </div>
              </div>
              <FiFlag className="text-gray-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending_reports || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiClock className="text-yellow-500 text-sm mr-1" />
                  <p className="text-sm text-yellow-600">
                    Nécessitent attention
                  </p>
                </div>
              </div>
              <FiClock className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.resolved_reports || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiCheckCircle className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">
                    {stats.resolution_rate || 0}% taux de résolution
                  </p>
                </div>
              </div>
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.avg_resolution_time || 0}h
                </p>
                <div className="flex items-center mt-1">
                  <FiBarChart2 className="text-blue-500 text-sm mr-1" />
                  <p className="text-sm text-blue-600">
                    Pour résolution
                  </p>
                </div>
              </div>
              <FiBarChart2 className="text-blue-600 text-2xl" />
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
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tous les signalements</option>
                <option value="pending">En attente</option>
                <option value="in_review">En révision</option>
                <option value="resolved">Résolus</option>
                <option value="critical">Critiques seulement</option>
                <option value="harassment">Harcèlement</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Contenu inapproprié</option>
              </select>
            </div>

            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des signalements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Signalements ({filteredReports.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <FiCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? "Aucun signalement ne correspond à votre recherche" : "Aucun signalement trouvé"}
                </p>
              </div>
            ) : (
              filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg border ${getSeverityColor(report.severity)}`}>
                        {getTypeIcon(report.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Signalement #{report.id}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status === 'pending' && 'En attente'}
                            {report.status === 'in_review' && 'En révision'}
                            {report.status === 'resolved' && 'Résolu'}
                            {report.status === 'dismissed' && 'Rejeté'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                            {report.severity === 'critical' && 'Critique'}
                            {report.severity === 'high' && 'Élevé'}
                            {report.severity === 'medium' && 'Moyen'}
                            {report.severity === 'low' && 'Faible'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Signalé par:</span> {report.reporter_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Utilisateur signalé:</span> {report.reported_user}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Type:</span> {report.type}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Date:</span> {new Date(report.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Raison:</span> {report.reason}
                        </p>

                        {report.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {report.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(report.created_at).toLocaleString('fr-FR')}
                          </span>
                          {report.assigned_moderator && (
                            <span className="flex items-center gap-1">
                              <FiUser className="w-4 h-4" />
                              Modérateur: {report.assigned_moderator}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        <FiEye className="w-4 h-4" />
                        Détails
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolveReport(report.id, 'resolved')}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                            Résoudre
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.id, 'dismissed')}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <FiXCircle className="w-4 h-4" />
                            Rejeter
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails du Signalement #{selectedReport.id}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Informations générales</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Statut:</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                            {selectedReport.status === 'pending' && 'En attente'}
                            {selectedReport.status === 'in_review' && 'En révision'}
                            {selectedReport.status === 'resolved' && 'Résolu'}
                            {selectedReport.status === 'dismissed' && 'Rejeté'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Sévérité:</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedReport.severity)}`}>
                            {selectedReport.severity === 'critical' && 'Critique'}
                            {selectedReport.severity === 'high' && 'Élevé'}
                            {selectedReport.severity === 'medium' && 'Moyen'}
                            {selectedReport.severity === 'low' && 'Faible'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Type de signalement:</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedReport.type}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Signalé par:</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedReport.reporter_name}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Utilisateur signalé:</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedReport.reported_user}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Date du signalement:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(selectedReport.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    {selectedReport.assigned_moderator && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Modérateur assigné:</span>
                        <p className="text-sm text-gray-900 mt-1">{selectedReport.assigned_moderator}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Détails du signalement</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Raison principale:</span>
                      <p className="text-sm text-gray-900 mt-1 font-medium">{selectedReport.reason}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Description détaillée:</span>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {selectedReport.description || 'Aucune description détaillée fournie.'}
                        </p>
                      </div>
                    </div>

                    {selectedReport.evidence && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Preuves/Éléments:</span>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {selectedReport.evidence}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedReport.resolution_notes && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Notes de résolution:</span>
                        <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900 whitespace-pre-wrap">
                            {selectedReport.resolution_notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedReport.status === 'pending' && (
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'resolved', 'Signalement résolu après investigation')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle className="w-5 h-5" />
                    Marquer comme résolu
                  </button>
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'dismissed', 'Signalement rejeté - ne nécessite pas d\'action')}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiXCircle className="w-5 h-5" />
                    Rejeter le signalement
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchReports}
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