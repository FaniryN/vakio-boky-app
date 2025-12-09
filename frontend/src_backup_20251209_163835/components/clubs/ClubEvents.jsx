import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ClubEvents() {
  const { id } = useParams();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newEvent, setNewEvent] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    type: "rencontre",
    lieu: "",
    max_participants: "",
    lien_visio: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}/events`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      console.log("📅 Événements reçus:", data);
      if (data.success) setEvents(data.events);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors du chargement des événements");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [id]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!newEvent.titre.trim()) {
      setError("Le titre est requis");
      setLoading(false);
      return;
    }

    if (!newEvent.date_debut) {
      setError("La date de début est requise");
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        titre: newEvent.titre.trim(),
        description: newEvent.description.trim(),
        date_debut: newEvent.date_debut,
        date_fin: newEvent.date_fin || null,
        type: newEvent.type,
        lieu: newEvent.lieu.trim() || null,
        max_participants: newEvent.max_participants
          ? parseInt(newEvent.max_participants)
          : null,
        lien_visio: newEvent.lien_visio.trim() || null,
        club_id: parseInt(id),
      };

      console.log("📤 Envoi données événement:", eventData);

      const res = await fetch(`http://localhost:5000/api/clubs/${id}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      console.log("📥 Réponse création événement:", data);

      if (data.success) {
        setShowCreateModal(false);
        setNewEvent({
          titre: "",
          description: "",
          date_debut: "",
          date_fin: "",
          type: "rencontre",
          lieu: "",
          max_participants: "",
          lien_visio: "",
        });
        fetchEvents();
        alert("Événement créé avec succès !");
      } else {
        setError(data.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur création:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleEventJoin = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchEvents();
        alert("Inscription réussie !");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Erreur lors de l'inscription");
    }
  };

  const handleEventLeave = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${eventId}/leave`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchEvents();
        alert("Désinscription réussie");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Erreur lors de la désinscription");
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-blue-900"
          >
            Événements du club
          </motion.h1>
          <Button onClick={() => setShowCreateModal(true)}>
            Créer un événement
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun événement
              </h3>
              <p className="text-gray-600 mb-4">
                Soyez le premier à créer un événement !
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Créer un événement
              </Button>
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {event.titre}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      event.type === "rencontre"
                        ? "bg-blue-100 text-blue-800"
                        : event.type === "webinar"
                        ? "bg-purple-100 text-purple-800"
                        : event.type === "atelier"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>

                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {new Date(event.date_debut).toLocaleString("fr-FR")}
                    </span>
                  </div>

                  {event.lieu && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{event.lieu}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <span>{event.participants_count} participant(s)</span>
                  </div>

                  {event.createur_nom && (
                    <div className="text-xs text-gray-400 mt-2">
                      Créé par {event.createur_nom}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {event.est_inscrit ? (
                    <Button
                      variant="outline"
                      onClick={() => handleEventLeave(event.id)}
                      className="flex-1"
                    >
                      Se désinscrire
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEventJoin(event.id)}
                      className="flex-1"
                    >
                      S'inscrire
                    </Button>
                  )}

                  {event.lien_visio && (
                    <a
                      href={event.lien_visio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Rejoindre
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Créer un événement"
          size="lg"
        >
          <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l'événement *
              </label>
              <input
                type="text"
                placeholder="Ex: Lecture collective de..."
                value={newEvent.titre}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, titre: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Décrivez votre événement..."
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure de début *
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.date_debut}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date_debut: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure de fin
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.date_fin}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date_fin: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'événement
              </label>
              <select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rencontre">Rencontre littéraire</option>
                <option value="webinar">Webinaire</option>
                <option value="atelier">Atelier d'écriture</option>
                <option value="lecture">Lecture collective</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex: Café littéraire, En ligne..."
                value={newEvent.lieu}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, lieu: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre maximum de participants (optionnel)
              </label>
              <input
                type="number"
                placeholder="Ex: 20"
                min="1"
                value={newEvent.max_participants}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, max_participants: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien visio (optionnel)
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={newEvent.lien_visio}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, lien_visio: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setError(null);
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || !newEvent.titre.trim() || !newEvent.date_debut
                }
              >
                {loading ? "Création..." : "Créer l'événement"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
