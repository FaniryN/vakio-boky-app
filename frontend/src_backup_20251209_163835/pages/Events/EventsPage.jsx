import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiUsers } from 'react-icons/fi';
import { useEvenements } from '@/hooks/useEvenements';
import { useAuth } from '@/hooks/useAuth';
import EventCard from '@/components/events/EventCard';
import CreateEventModal from '@/components/events/CreateEventModal';
import RegistrationModal from '@/components/events/RegistrationModal';
import Button from '@/components/ui/Button';

export default function EventsPage() {
  const { events, loading, error, fetchEvents, registerForEvent } = useEvenements();
  const { user, isAdmin } = useAuth();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleRegister = async (event) => {
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationConfirm = async () => {
    if (!selectedEvent) return;
    
    try {
      await registerForEvent(selectedEvent.id);
      setIsRegistrationModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Erreur inscription:', error);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchEvents();
  };

  // Séparer événements passés et futurs
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= now);
  const pastEvents = events.filter(event => new Date(event.event_date) < now);

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-900">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiCalendar className="text-4xl text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900 font-mono">
              Événements Vakio Boky
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Découvrez nos événements littéraires, rencontres d'auteurs et ateliers d'écriture. 
            Rejoignez notre communauté passionnée !
          </p>
        </motion.div>

        {/* Bouton création admin */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end mb-6"
          >
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <FiPlus />
              Nouvel Événement
            </Button>
          </motion.div>
        )}

        {/* Erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center"
          >
            ❌ {error}
            <Button
              variant="primary"
              size="sm"
              onClick={fetchEvents}
              className="ml-4"
            >
              Réessayer
            </Button>
          </motion.div>
        )}

        {/* Événements à venir */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 font-mono flex items-center gap-2 mb-6">
            <FiCalendar className="text-green-500" />
            Événements à venir ({upcomingEvents.length})
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                Aucun événement à venir pour le moment
              </p>
              {isAdmin && (
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <FiPlus />
                  Créer le premier événement
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  user={user}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Événements passés */}
        {pastEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 font-mono flex items-center gap-2 mb-6">
              <FiUsers className="text-gray-500" />
              Événements passés ({pastEvents.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  user={user}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal création événement */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal confirmation inscription */}
      <RegistrationModal
        event={selectedEvent}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onConfirm={handleRegistrationConfirm}
      />
    </div>
  );
}