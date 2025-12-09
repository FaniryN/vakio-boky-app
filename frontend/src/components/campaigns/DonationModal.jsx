import { useState } from 'react';
import { FiHeart, FiX, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { useDonations } from '@/hooks/useDonations';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function DonationModal({ campaign, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createDonation } = useDonations();
  const { user } = useAuth();

  const presetAmounts = [5000, 10000, 20000, 50000, 100000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    if (!user) {
      alert('Veuillez vous connecter pour effectuer un don');
      return;
    }

    setIsSubmitting(true);

    try {
      await createDonation({
        campaign_id: campaign.id,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        message: `Don pour ${campaign.title}`
      });

      onSuccess();
      setAmount('');
      setPaymentMethod('mobile_money');
    } catch (error) {
      console.error('Erreur lors du don:', error);
      alert('Erreur lors du traitement du don. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA'
    }).format(amount);
  };

  if (!campaign) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiHeart className="text-red-500 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Faire un don</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Info campagne */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
          <p className="text-sm text-gray-600">{campaign.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Montant du don */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Montant du don (MGA)
            </label>
            
            {/* Boutons de montant prédéfinis */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => setAmount(presetAmount.toString())}
                  className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                    amount === presetAmount.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {formatCurrency(presetAmount)}
                </button>
              ))}
            </div>

            {/* Champ de saisie personnalisé */}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant personnalisé"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1000"
              step="1000"
            />
          </div>

          {/* Méthode de paiement */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Méthode de paiement
            </label>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile_money"
                  checked={paymentMethod === 'mobile_money'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <FiSmartphone className="text-green-600" />
                <span className="flex-1">Mobile Money</span>
                <span className="text-xs text-gray-500">(Airtel Money, Orange Money, MVola)</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <FiCreditCard className="text-blue-600" />
                <span className="flex-1">Virement bancaire</span>
              </label>
            </div>
          </div>

          {/* Résumé */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Résumé de votre don</h4>
              <div className="flex justify-between text-sm">
                <span>Montant:</span>
                <span className="font-semibold">{formatCurrency(parseFloat(amount) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Méthode:</span>
                <span className="font-semibold capitalize">
                  {paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Virement bancaire'}
                </span>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
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
              type="submit"
              variant="primary"
              disabled={!amount || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FiHeart />
              {isSubmitting ? 'Traitement...' : 'Confirmer le don'}
            </Button>
          </div>
        </form>

        {/* Message de sécurité */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Vos informations de paiement sont sécurisées et cryptées
          </p>
        </div>
      </div>
    </Modal>
  );
}
