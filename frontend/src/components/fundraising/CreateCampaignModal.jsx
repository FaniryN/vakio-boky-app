import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiImage } from 'react-icons/fi';
import { useCampaigns } from '@/hooks/useCampaigns';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }) {
  const { createCampaign, loading } = useCampaigns();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const campaignData = {
        ...formData,
        target_amount: parseFloat(formData.target_amount)
      };

      await createCampaign(campaignData);
      onSuccess();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        target_amount: '',
        start_date: '',
        end_date: '',
        image_url: ''
      });
    } catch (error) {
      console.error('❌ Erreur création campagne:', error);
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
            Nouvelle Campagne de Collecte
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
                Titre de la campagne *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Achat de nouveaux livres pour la bibliothèque"
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
                placeholder="Décrivez l'objectif de cette campagne de collecte..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            {/* Montant cible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant cible (€) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="1"
                value={formData.target_amount}
                onChange={(e) => handleChange('target_amount', e.target.value)}
                placeholder="1000.00"
                required
              />
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
              />
            </div>

            {/* Date de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
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
                placeholder="https://example.com/image.jpg"
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
                    alt="Aperçu campagne"
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
              Créer la campagne
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}