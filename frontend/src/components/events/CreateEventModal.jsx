import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { useEvenements } from '@/hooks/useEvenements';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CreateEventModal({ isOpen, onClose, onSuccess }) {
  const { createEvent, loading } = useEvenements();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    max_participants: '',
    price: '',
    image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...formData,
        event_date: `${formData.event_date}T${formData.event_time}:00`,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        price: formData.price ? parseFloat(formData.price) : 0
      };

      await createEvent(eventData);
      onSuccess();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        max_participants: '',
        price: '',
        image_url: ''
      });
    } catch (error) {
      console.error('❌ Erreur création événement:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiPlus />
            Nouvel Événement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'événement *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Rencontre avec l'auteur malgache"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Décrivez l'événement en détail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <Input
                type="date"
                value={formData.event_date}
                onChange={(e) => handleChange('event_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Heure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure *
              </label>
              <Input
                type="time"
                value={formData.event_time}
                onChange={(e) => handleChange('event_time', e.target.value)}
                required
              />
            </div>

            {/* Lieu */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu *
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Adresse complète ou lieu de l'événement"
                icon={<FiMapPin className="text-gray-400" />}
                required
              />
            </div>

            {/* Participants max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants maximum
              </label>
              <Input
                type="number"
                min="1"
                value={formData.max_participants}
                onChange={(e) => handleChange('max_participants', e.target.value)}
                placeholder="Illimité si vide"
                icon={<FiUsers className="text-gray-400" />}
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="Gratuit si 0"
                icon={<FiCalendar className="text-gray-400" />}
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image (optionnel)
              </label>
              <Input
                type="url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://example.com/event-image.jpg"
              />
            </div>

            {/* Aperçu image */}
            {formData.image_url && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu de l'image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <img
                    src={formData.image_url}
                    alt="Aperçu événement"
                    className="max-h-32 mx-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    L'image s'affichera ici si l'URL est valide
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              <FiPlus className="mr-2" />
              Créer l'événement
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}