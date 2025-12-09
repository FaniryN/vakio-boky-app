import { useState, useEffect } from "react";

export default function EventModal({ eventId, isOpen, onClose }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (isOpen && eventId) {
      fetchEventDetails();
    }
  }, [isOpen, eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/detail`);
      
      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des détails');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setEvent(data.data);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur détail événement:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: 'long',
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    const priceNum = parseFloat(price);
    return priceNum === 0 ? "Gratuit" : `${priceNum.toFixed(2)} €`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          &times;
        </button>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Erreur: {error}</p>
            <button
              onClick={fetchEventDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {event && !loading && (
          <div className="space-y-6">
            {/* Image de l'événement */}
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            {/* Titre */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {event.title}
            </h2>

            {/* Date et lieu */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">{formatEventDate(event.event_date)}</span>
              </div>

              <div className="flex items-center gap-3 text-lg text-gray-700">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold">{event.location}</span>
              </div>

              <div className="flex items-center gap-3 text-lg text-gray-700">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-semibold">{formatPrice(event.price)}</span>
              </div>

              {event.max_participants && (
                <div className="flex items-center gap-3 text-lg text-gray-700">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold">{event.max_participants} participants maximum</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {event.description || "Aucune description disponible pour cet événement."}
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
              >
                Fermer
              </button>
              <button
                onClick={() => window.location.href = "/login"}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                S'inscrire à l'événement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}