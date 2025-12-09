import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiSmartphone, FiDollarSign, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const PaymentModal = ({ isOpen, onClose, orderId, amount, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [step, setStep] = useState('select'); // 'select', 'processing', 'redirect', 'success'
  const { user } = useAuth();

  const paymentMethods = [
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: <FiSmartphone className="text-orange-500" />,
      description: 'Paiement mobile Orange',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: <FiSmartphone className="text-red-500" />,
      description: 'Paiement mobile Airtel',
      color: 'bg-red-50 border-red-200 hover:border-red-300'
    },
    {
      id: 'mvola',
      name: 'MVola',
      icon: <FiSmartphone className="text-blue-500" />,
      description: 'Paiement mobile Telma',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      id: 'stripe',
      name: 'Carte bancaire',
      icon: <FiCreditCard className="text-purple-500" />,
      description: 'Visa, Mastercard, etc.',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <FiDollarSign className="text-blue-600" />,
      description: 'Portefeuille PayPal',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setLoading(true);
    setStep('processing');

    try {
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/marketplace/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_method: selectedMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.payment.paymentUrl) {
          // External payment redirect
          setPaymentUrl(data.payment.paymentUrl);
          setStep('redirect');
        } else {
          // Direct payment completion
          setStep('success');
          onPaymentSuccess && onPaymentSuccess(data.payment);
        }
      } else {
        throw new Error(data.error || 'Erreur de paiement');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du traitement du paiement: ' + error.message);
      setStep('select');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
      // Close modal and show waiting message
      setStep('waiting');
    }
  };

  const resetModal = () => {
    setSelectedMethod('');
    setStep('select');
    setPaymentUrl('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={resetModal} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'select' && 'Choisir un mode de paiement'}
            {step === 'processing' && 'Traitement du paiement...'}
            {step === 'redirect' && 'Redirection vers le paiement'}
            {step === 'waiting' && 'Paiement en cours...'}
            {step === 'success' && 'Paiement réussi !'}
          </h2>
          <button
            onClick={resetModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {step === 'select' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">
                Montant à payer: <span className="text-xl font-bold">{amount}€</span>
              </p>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : method.color
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <FiCheck className="text-blue-500 text-xl" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={resetModal}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={!selectedMethod || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Traitement...
                  </>
                ) : (
                  'Payer maintenant'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <FiLoader className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Initialisation du paiement en cours...</p>
          </div>
        )}

        {step === 'redirect' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-2xl text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Redirection vers {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Vous allez être redirigé vers la plateforme de paiement sécurisée.
            </p>
            <Button onClick={handleRedirect} className="w-full">
              Continuer vers le paiement
            </Button>
          </div>
        )}

        {step === 'waiting' && (
          <div className="text-center py-8">
            <FiLoader className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Paiement en cours
            </h3>
            <p className="text-gray-600 mb-4">
              Veuillez compléter le paiement dans l'onglet ouvert.
            </p>
            <p className="text-sm text-gray-500">
              Cette fenêtre se fermera automatiquement une fois le paiement confirmé.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-2xl text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Paiement réussi !
            </h3>
            <p className="text-gray-600 mb-6">
              Votre commande a été confirmée et vous recevrez bientôt vos produits.
            </p>
            <Button onClick={resetModal} className="w-full">
              Fermer
            </Button>
          </div>
        )}

        {/* Security Notice */}
        {step === 'select' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiCheck className="text-green-600 text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Paiement sécurisé</h4>
                <p className="text-sm text-gray-600">
                  Toutes les transactions sont chiffrées et sécurisées. Vos informations bancaires ne sont jamais stockées sur nos serveurs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;