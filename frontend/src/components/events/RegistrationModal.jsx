import { motion } from 'framer-motion';
import { FiX, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function RegistrationModal({ event, isOpen, onClose, onConfirm }) {
  if (!isOpen || !event) return null;

  const eventDate = new Date(event.event_date);
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSpotsLeft = () => {
    if (!event.max_participants) return 'Illimité';
    const spotsLeft = event.max_participants - (event.registered_count || 0);
    return `${spotsLeft} place${spotsLeft > 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-purple-500" />
            Confirmation d'inscription
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Détails événement */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {event.title}
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiCalendar className="text-purple-500 flex-shrink-0" />
              <span>{formatDate(eventDate)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiMapPin className="text-red-500 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
            
            {event.price > 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {/* <FiEuro className="text-green-500 flex-shrink-0" /> */}
                <span>Prix: {event.price} €</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiUsers className="text-blue-500 flex-shrink-0" />
              <span>
                {event.registered_count || 0} inscrit{event.registered_count !== 1 ? 's' : ''}
                {event.max_participants && ` • ${getSpotsLeft()} disponible${getSpotsLeft() !== '1' ? 's' : ''}`}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Êtes-vous sûr de vouloir vous inscrire à cet événement ?
            {event.price > 0 && (
              <span className="font-semibold text-green-600 block mt-1">
                Montant à payer: {event.price} €
              </span>
            )}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              className="flex-1"
            >
              Confirmer l'inscription
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}