import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiUser,
  FiPackage,
} from "react-icons/fi";
// import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vakio_token");
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/marketplace/admin/disputes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setDisputes(data.disputes || []);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des litiges");
      console.error("❌ Erreur chargement litiges:", err);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (disputeId, resolution, notes) => {
    try {
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/marketplace/admin/disputes/${disputeId}/resolve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resolution, notes }),
      });

      const data = await response.json();

      if (data.success) {
        setDisputes(disputes.map(dispute =>
          dispute.id === disputeId
            ? { ...dispute, status: 'resolved', resolution, resolution_notes: notes }
            : dispute
        ));
        setShowDisputeModal(false);
        setSelectedDispute(null);
      } else {
        alert(data.error || "Erreur lors de la résolution");
      }
    } catch (err) {
      setError("Erreur lors de la résolution du litige");
      console.error("❌ Erreur résolution litige:", err);
    }
  };

  const addMessage = async (disputeId, message) => {
    try {
      // TODO: Replace with actual API call
      setDisputes(disputes.map(dispute =>
        dispute.id === disputeId
          ? {
              ...dispute,
              messages: [...dispute.messages, {
                from: "admin",
                message,
                date: new Date().toISOString().split('T')[0]
              }]
            }
          : dispute
      ));
    } catch (err) {
      setError("Erreur lors de l'ajout du message");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'resolved':
        return 'Résolu';
      case 'investigating':
        return 'En cours';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des litiges...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* <AdminNav /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiAlertTriangle className="text-orange-600" />
            Gestion des Litiges
          </h1>
          <p className="text-gray-600 mt-2">
            Résoudre les problèmes et réclamations clients
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiAlertTriangle className="text-red-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Litiges ouverts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'open').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiMessageSquare className="text-blue-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'investigating').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiCheck className="text-green-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <Button
              variant="primary"
              size="sm"
              onClick={fetchDisputes}
              className="ml-4"
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Disputes List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {disputes.length === 0 ? (
            <div className="text-center py-12">
              <FiAlertTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun litige trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Litige
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motif
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {disputes.map((dispute) => (
                    <motion.tr
                      key={dispute.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{dispute.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Commande #{dispute.order_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {dispute.customer_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {dispute.reason}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {dispute.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                          {getStatusText(dispute.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowDisputeModal(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <FiMessageSquare />
                            Gérer
                          </Button>
                          {dispute.status === 'open' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => resolveDispute(dispute.id, 'refund', 'Remboursement approuvé')}
                              className="flex items-center gap-1"
                            >
                              <FiCheck />
                              Résoudre
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dispute Details Modal */}
        {showDisputeModal && selectedDispute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Litige #{selectedDispute.id} - Commande #{selectedDispute.order_id}</h3>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dispute Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="text-sm text-gray-900">{selectedDispute.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motif</label>
                    <p className="text-sm text-gray-900">{selectedDispute.reason}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{selectedDispute.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDispute.status)}`}>
                      {getStatusText(selectedDispute.status)}
                    </span>
                  </div>
                  {selectedDispute.resolution && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Résolution</label>
                      <p className="text-sm text-gray-900">{selectedDispute.resolution}</p>
                      {selectedDispute.resolution_notes && (
                        <p className="text-sm text-gray-600 mt-1">{selectedDispute.resolution_notes}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Messages</label>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {selectedDispute.messages.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucun message</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedDispute.messages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              msg.from === 'admin'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900 border'
                            }`}>
                              <p>{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.from === 'admin' ? 'text-blue-200' : 'text-gray-500'}`}>
                                {msg.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Message */}
                  <div className="mt-4">
                    <textarea
                      placeholder="Ajouter un message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const message = e.target.value.trim();
                          if (message) {
                            addMessage(selectedDispute.id, message);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Resolution Actions */}
              {selectedDispute.status === 'open' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Résoudre le litige</label>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => resolveDispute(selectedDispute.id, 'refund', 'Remboursement complet approuvé')}
                    >
                      Approuver le remboursement
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => resolveDispute(selectedDispute.id, 'replacement', 'Remplacement du produit')}
                    >
                      Remplacer le produit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => resolveDispute(selectedDispute.id, 'rejected', 'Réclamation rejetée')}
                    >
                      Rejeter la réclamation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}