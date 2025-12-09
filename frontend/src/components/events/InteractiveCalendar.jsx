import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../../hooks/useAuth';
import { FiCalendar, FiMapPin, FiUsers, FiVideo } from 'react-icons/fi';

const InteractiveCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/events', {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });

      const data = await response.json();

      if (data.success) {
        // Transform events for FullCalendar
        const calendarEvents = data.events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.event_date,
          end: event.event_date, // Assuming single-day events
          extendedProps: {
            description: event.description,
            location: event.location,
            maxParticipants: event.max_participants,
            currentParticipants: event.registered_count || 0,
            price: event.price,
            type: event.event_type || 'general',
            clubName: event.club_name,
          },
          backgroundColor: getEventColor(event.event_type),
          borderColor: getEventColor(event.event_type),
        }));

        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'webinar':
      case 'live':
        return '#ef4444'; // red-500
      case 'workshop':
        return '#f59e0b'; // amber-500
      case 'club':
        return '#8b5cf6'; // violet-500
      default:
        return '#3b82f6'; // blue-500
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      ...clickInfo.event.extendedProps,
    });
  };

  const handleDateClick = (arg) => {
    // Could open event creation modal for admins
    console.log('Date clicked:', arg.dateStr);
  };

  const EventContent = ({ event }) => {
    const isLive = event.extendedProps.type === 'webinar' || event.extendedProps.type === 'live';

    return (
      <div className="p-1">
        <div className="flex items-center gap-1">
          {isLive && <FiVideo className="text-xs" />}
          <span className="text-xs font-medium truncate">{event.title}</span>
        </div>
        {event.extendedProps.clubName && (
          <div className="text-xs text-gray-600 truncate">
            {event.extendedProps.clubName}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FiCalendar className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Calendrier Littéraire</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={EventContent}
            height="600px"
            locale="fr"
            buttonText={{
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
            }}
            dayHeaderFormat={{ weekday: 'short' }}
          />
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4">
          {selectedEvent ? (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                {selectedEvent.title}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCalendar className="text-blue-600" />
                  <span>
                    {new Date(selectedEvent.start).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-green-600" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiUsers className="text-purple-600" />
                  <span>
                    {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants || '∞'} participants
                  </span>
                </div>

                {selectedEvent.price > 0 && (
                  <div className="text-sm font-medium text-green-600">
                    {selectedEvent.price}€
                  </div>
                )}

                {selectedEvent.clubName && (
                  <div className="text-sm text-indigo-600 font-medium">
                    Organisé par: {selectedEvent.clubName}
                  </div>
                )}

                {selectedEvent.description && (
                  <p className="text-sm text-gray-700 mt-3">
                    {selectedEvent.description}
                  </p>
                )}

                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Voir les détails
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Cliquez sur un événement pour voir les détails
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Légende</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Événements généraux</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Webinaires & Lives</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-sm">Ateliers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-violet-500 rounded"></div>
                <span className="text-sm">Événements de clubs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCalendar;