import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { useEvenements } from '../../hooks/useEvenements';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const InteractiveCalendar = () => {
  const { events, loading, error, fetchEvents, registerForEvent } = useEvenements();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <Button onClick={fetchEvents}>Réessayer</Button>
      </div>
    );
  }

  // Version simplifiée SANS FullCalendar - juste une liste
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Calendrier des Événements
          </h2>
          <p className="text-gray-600 mt-1">
            {events.length} événements à venir
          </p>
        </div>
      </div>

      {/* Liste simple des événements */}
      <div className="space-y-4">
        {events.slice(0, 5).map(event => (
          <div 
            key={event.id} 
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
            onClick={() => {
              setSelectedEvent(event);
              setShowEventDetails(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FiCalendar />
                    {new Date(event.event_date).toLocaleDateString('fr-FR')}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm text-white ${
                event.type === 'conference' ? 'bg-blue-500' :
                event.type === 'workshop' ? 'bg-green-500' :
                event.type === 'webinar' ? 'bg-purple-500' :
                event.type === 'club_meeting' ? 'bg-amber-500' :
                'bg-gray-500'
              }`}>
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <Modal
          isOpen={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          size="lg"
        >
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedEvent.title}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar />
                <span>
                  {new Date(selectedEvent.event_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers />
                <span>
                  {(selectedEvent.registered_count || 0)} / {selectedEvent.max_participants || '∞'} participants
                </span>
              </div>

              {selectedEvent.description && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t">
                <Button
                  variant="secondary"
                  onClick={() => setShowEventDetails(false)}
                  className="flex-1"
                >
                  Fermer
                </Button>

                {user && (
                  <Button
                    onClick={() => {
                      registerForEvent(selectedEvent.id);
                      setShowEventDetails(false);
                      fetchEvents();
                    }}
                    className="flex-1"
                    disabled={
                      selectedEvent.registered_count >= selectedEvent.max_participants &&
                      selectedEvent.max_participants > 0
                    }
                  >
                    {selectedEvent.registered_count >= selectedEvent.max_participants &&
                     selectedEvent.max_participants > 0
                      ? 'Complet'
                      : "S'inscrire"
                    }
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InteractiveCalendar;