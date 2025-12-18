import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiUsers,
  FiEye,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import { useEvenements } from "@/hooks/useEvenements";
import CreateEventModal from "@/components/events/CreateEventModal";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminEvents() {
  const {
    events,
    loading,
    error,
    fetchAdminEvents,
    approveEvent,
    rejectEvent,
    featureEvent,
    deleteEvent,
  } = useEvenements();

  const { isAdmin, isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAdminEvents();
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
          <p>Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch {
      return "Date invalide";
    }
  };

  const isEventUpcoming = (eventDate) => {
    try {
      return new Date(eventDate) > new Date();
    } catch {
      return false;
    }
  };

  const handleApprove = async (eventId) => {
    setActionLoading(eventId);
    const result = await approveEvent(eventId);
    setActionLoading(null);

    if (result.success) {
      alert("Événement approuvé");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const handleReject = async (eventId) => {
    const reason = prompt("Motif du rejet:");
    if (!reason || reason.trim() === "") {
      alert("Motif requis");
      return;
    }

    setActionLoading(eventId);
    const result = await rejectEvent(eventId, reason);
    setActionLoading(null);

    if (result.success) {
      alert("Événement rejeté");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const handleFeature = async (eventId, featured) => {
    setActionLoading(eventId);
    const result = await featureEvent(eventId, featured);
    setActionLoading(null);

    if (result.success) {
      alert(featured ? "Mis en avant" : "Retiré");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Supprimer cet événement ?")) {
      return;
    }

    setActionLoading(eventId);
    const result = await deleteEvent(eventId);
    setActionLoading(null);

    if (result.success) {
      alert("Événement supprimé");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const getStatusBadge = (status, eventDate) => {
    const statusConfig = {
      active: {
        label: isEventUpcoming(eventDate) ? "À venir" : "Terminé",
        class: isEventUpcoming(eventDate)
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800",
      },
      pending: { label: "En attente", class: "bg-yellow-100 text-yellow-800" },
      rejected: { label: "Rejeté", class: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || {
      label: "Inconnu",
      class: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const stats = {
    total: events.length,
    upcoming: events.filter(
      (event) => isEventUpcoming(event.event_date) && event.status === "active"
    ).length,
    pending: events.filter((event) => event.status === "pending").length,
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Chargement...</span>
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
            <FiCalendar className="text-purple-600" />
            Administration Événements
          </h1>
          <p className="text-gray-600 mt-2">
            {events.length} événement(s) au total
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <FiPlus className="text-lg" />
          Ajouter un événement
        </button>
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <FiCalendar className="text-purple-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À venir</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcoming}
                </p>
              </div>
              <FiEye className="text-green-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <FiCalendar className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">Tous</option>
                  <option value="pending">En attente</option>
                  <option value="active">Actifs</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>
            </div>

            <button
              onClick={fetchAdminEvents}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <strong>Erreur: </strong>
                {error}
              </div>
              <button
                onClick={fetchAdminEvents}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "Aucun événement correspondant"
                  : "Aucun événement"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Événement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Lieu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
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
                  {filteredEvents.map((event) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {event.image_url ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={event.image_url}
                                alt={event.title}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                                <FiCalendar className="text-purple-600 text-lg" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {event.title || "Sans titre"}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {event.description
                                ? event.description.substring(0, 50) + "..."
                                : "Aucune description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(event.event_date)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {event.location || "Non spécifié"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.registered_count || 0} /{" "}
                          {event.max_participants || "∞"}
                        </div>
                        {event.price > 0 && (
                          <div className="text-sm text-green-600">
                            {event.price} €
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(event.status, event.event_date)}
                        {event.featured && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              <FiTrendingUp className="w-3 h-3" />
                              Mis en avant
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {event.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(event.id)}
                                disabled={actionLoading === event.id}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                              >
                                {actionLoading === event.id
                                  ? "..."
                                  : "Approuver"}
                              </button>
                              <button
                                onClick={() => handleReject(event.id)}
                                disabled={actionLoading === event.id}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                              >
                                Rejeter
                              </button>
                            </>
                          )}

                          <button
                            onClick={() =>
                              handleFeature(event.id, !event.featured)
                            }
                            disabled={actionLoading === event.id}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                          >
                            {event.featured ? "Retirer" : "Mettre en avant"}
                          </button>

                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={actionLoading === event.id}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* MODAL DE CRÉATION D'ÉVÉNEMENT */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchAdminEvents(); // Recharge la liste
          }}
        />
      )}
    </div>
  );
}
