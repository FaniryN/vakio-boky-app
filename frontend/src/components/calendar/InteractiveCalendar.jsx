import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { FiCalendar, FiMapPin, FiUsers, FiVideo } from 'react-icons/fi';
import { useEvenements } from '../../hooks/useEvenements';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const InteractiveCalendar = () => {
  const calendarRef = useRef(null);
  const { events, loading, error, fetchEvents, registerForEvent } = useEvenements();
  const { user } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Transform events for FullCalendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.event_date, // Utilise event_date au lieu de start_date
    end: event.event_date, // À ajuster si vous avez un champ end_date
    extendedProps: {
      description: event.description,
      location: event.location,
      max_participants: event.max_participants,
      registered_count: event.registered_count || 0,
      price: event.price,
      image_url: event.image_url
    },
    backgroundColor: getEventColor(event.type),
    borderColor: getEventColor(event.type),
    textColor: '#ffffff'
  }));

  function getEventColor(type) {
    switch (type) {
      case 'conference': return '#3b82f6';
      case 'workshop': return '#10b981';
      case 'webinar': return '#8b5cf6';
      case 'club_meeting': return '#f59e0b';
      case 'festival': return '#ef4444';
      default: return '#6b7280';
    }
  }

  const handleEventClick = (info) => {
    const event = info.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      ...event.extendedProps
    });
    setShowEventDetails(true);
  };

  const handleRegisterForEvent = async (eventId) => {
    try {
      await registerForEvent(eventId);
      setShowEventDetails(false);
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

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
        <p className="text-red-600 mb-4">Erreur lors du chargement du calendrier: {error}</p>
        <Button onClick={fetchEvents}>Réessayer</Button>
      </div>
    );
  }

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
            Consultez les événements littéraires à venir
          </p>
        </div>
      </div>

      {/* Legend - Maintenue pour la clarté */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Conférence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Atelier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Webinaire</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span>Club</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Festival</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          locale={frLocale}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
        />
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
                  {new Date(selectedEvent.start).toLocaleDateString('fr-FR', {
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
                  {selectedEvent.registered_count || 0} / {selectedEvent.max_participants || '∞'} participants
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
                    onClick={() => handleRegisterForEvent(selectedEvent.id)}
                    className="flex-1"
                    disabled={
                      selectedEvent.registered_count >= selectedEvent.max_participants &&
                      selectedEvent.max_participants > 0
                    }
                  >
                    {selectedEvent.registered_count >= selectedEvent.max_participants &&
                     selectedEvent.max_participants > 0
                      ? 'Complet'
                      : 'S\'inscrire'
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