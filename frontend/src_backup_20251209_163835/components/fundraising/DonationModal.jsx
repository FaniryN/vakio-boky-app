import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiHeart, FiGift } from 'react-icons/fi';
import { useDonations } from '@/hooks/useDonations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function DonationModal({ campaign, isOpen, onClose, onSuccess }) {
  const { createDonation, loading } = useDonations();
  
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    anonymous: false
  });

  const presetAmounts = [5, 10, 25, 50, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const donationData = {
        campaign_id: campaign.id,
        amount: parseFloat(formData.amount),
        message: formData.message,
        anonymous: formData.anonymous
      };

      await createDonation(donationData);
      onSuccess();
      
      // Reset form
      setFormData({
        amount: '',
        message: '',
        anonymous: false
      });
    } catch (error) {
      console.error('❌ Erreur don:', error);
    }
  };

  const handlePresetAmount = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
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
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiHeart className="text-red-500" />
            Soutenir "{campaign.title}"
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
          {/* Montants prédéfinis */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choisissez un montant
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handlePresetAmount(amount)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    formData.amount === amount.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {amount} €
                </button>
              ))}
            </div>
          </div>

          {/* Montant personnalisé */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou montant personnalisé
            </label>
            <Input
              type="number"
              step="0.01"
              min="1"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Montant en €"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message d'encouragement (optionnel)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Laissez un message de soutien..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>

          {/* Don anonyme */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Faire un don anonyme
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading || !formData.amount}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FiGift />
              Faire un don
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}