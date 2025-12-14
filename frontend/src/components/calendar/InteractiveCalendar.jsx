import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiExternalLink } from 'react-icons/fi';
import { useEvenements } from '../../hooks/useEvenements';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const InteractiveCalendar = () => {
  // HOOKS
  const { events, loading, error, fetchEvents, registerForEvent } = useEvenements();
  const { user, isAuthenticated } = useAuth();
  
  // ÉTATS
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // CHARGEMENT INITIAL
  useEffect(() => {
    console.log('🔄 InteractiveCalendar - Chargement événements');
    fetchEvents();
  }, []);

  // FILTRES
  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.type === filterType);

  // GROUPEMENT PAR MOIS
  const eventsByMonth = {};
  filteredEvents.forEach(event => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = [];
    }
    eventsByMonth[monthYear].push(event);
  });

  // TYPES D'ÉVÉNEMENTS DISPONIBLES
  const eventTypes = [
    { id: 'all', label: 'Tous', color: 'gray' },
    { id: 'conference', label: 'Conférences', color: 'blue' },
    { id: 'workshop', label: 'Ateliers', color: 'green' },
    { id: 'webinar', label: 'Webinaires', color: 'purple' },
    { id: 'club_meeting', label: 'Clubs', color: 'amber' },
    { id: 'festival', label: 'Festivals', color: 'red' }
  ];

  // AFFICHAGE LOADING/ERROR
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Chargement des événements...</p>
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

  // RENDU PRINCIPAL
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* EN-TÊTE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Calendrier des Événements
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} à venir
          </p>
        </div>
      </div>

      {/* FILTRES */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-3">Filtrer par type :</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === type.id
                  ? `bg-${type.color}-500 text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* LÉGENDE */}
      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        {eventTypes.slice(1).map(type => (
          <div key={type.id} className="flex items-center gap-2">
            <div className={`w-4 h-4 bg-${type.color}-500 rounded`}></div>
            <span>{type.label}</span>
          </div>
        ))}
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      <div className="space-y-10">
        {Object.entries(eventsByMonth).length > 0 ? (
          Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
              </h3>
              
              <div className="space-y-6">
                {monthEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-md border border-gray-200"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDetails(true);
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* INFORMATIONS */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            event.type === 'conference' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'workshop' ? 'bg-green-100 text-green-800' :
                            event.type === 'webinar' ? 'bg-purple-100 text-purple-800' :
                            event.type === 'club_meeting' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        
                        {event.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        {/* MÉTADONNÉES */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FiCalendar size={14} />
                            <span>
                              {new Date(event.event_date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <FiMapPin size={14} />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <FiUsers size={14} />
                            <span>
                              {(event.registered_count || 0)} / {event.max_participants || '∞'} participants
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* ACTIONS */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                          className="flex items-center gap-2"
                        >
                          <FiExternalLink size={14} />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FiCalendar className="text-gray-300 text-4xl mx-auto mb-4" />
            <p className="text-gray-500">Aucun événement à afficher</p>
            <p className="text-gray-400 text-sm mt-2">
              Essayez de changer de filtre ou revenez plus tard
            </p>
          </div>
        )}
      </div>

      {/* MODAL DES DÉTAILS */}
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

            {/* BADGE TYPE */}
            <div className="mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedEvent.type === 'conference' ? 'bg-blue-100 text-blue-800' :
                selectedEvent.type === 'workshop' ? 'bg-green-100 text-green-800' :
                selectedEvent.type === 'webinar' ? 'bg-purple-100 text-purple-800' :
                selectedEvent.type === 'club_meeting' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedEvent.type}
              </span>
            </div>

            <div className="space-y-4">
              {/* DATE */}
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar />
                <span className="font-medium">Date : </span>
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

              {/* LIEU */}
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin />
                  <span className="font-medium">Lieu : </span>
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {/* PARTICIPANTS */}
              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers />
                <span className="font-medium">Participants : </span>
                <span>
                  {(selectedEvent.registered_count || 0)} / {selectedEvent.max_participants || '∞'} inscrits
                </span>
              </div>

              {/* DURÉE */}
              {selectedEvent.duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock />
                  <span className="font-medium">Durée : </span>
                  <span>{selectedEvent.duration}</span>
                </div>
              )}

              {/* DESCRIPTION */}
              {selectedEvent.description && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-6 mt-6 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowEventDetails(false)}
                className="flex-1"
              >
                Fermer
              </Button>

              {isAuthenticated && (
                <Button
                  onClick={async () => {
                    await registerForEvent(selectedEvent.id);
                    setShowEventDetails(false);
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
        </Modal>
      )}
    </div>
  );
};

export default InteractiveCalendar;