// components/marketplace/PaymentMethodSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCreditCard, 
  FiSmartphone, 
  FiWifi,
  FiDollarSign,
  FiCheck
} from 'react-icons/fi';

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const paymentMethods = [
    {
      id: 'mvola',
      name: 'MVola',
      icon: FiSmartphone,
      color: 'bg-purple-500',
      description: 'Paiement via MVola (Telma)',
      testPhone: '03322222222'
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: FiSmartphone,
      color: 'bg-orange-500',
      description: 'Paiement via Orange Money',
      testPhone: '03411111111'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: FiSmartphone,
      color: 'bg-red-500',
      description: 'Paiement via Airtel Money',
      testPhone: '03233333333'
    },
    {
      id: 'stripe',
      name: 'Carte Bancaire',
      icon: FiCreditCard,
      color: 'bg-blue-500',
      description: 'Paiement sécurisé par carte',
      testCard: '4242 4242 4242 4242'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FiDollarSign,
      color: 'bg-blue-400',
      description: 'Payer avec votre compte PayPal'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choisissez votre méthode de paiement
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectMethod(method.id)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-200
              ${selectedMethod === method.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                <method.icon className="text-white text-xl" />
              </div>
              
              <span className="font-semibold text-gray-900 mb-1">
                {method.name}
              </span>
              
              <span className="text-xs text-gray-600">
                {method.description}
              </span>
              
              {/* Info de test pour le mode développement */}
              {process.env.NODE_ENV === 'development' && method.testPhone && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Test: {method.testPhone}
                </div>
              )}
              
              {process.env.NODE_ENV === 'development' && method.testCard && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Carte test: {method.testCard}
                </div>
              )}
            </div>
            
            {selectedMethod === method.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <FiCheck className="text-white text-sm" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Note sur le mode simulation */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiWifi className="text-yellow-600" />
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Mode Développement Actif</h4>
            <p className="text-sm text-yellow-700">
              Les paiements sont simulés. Aucun vrai argent ne sera débité.
              Utilisez les numéros de test fournis pour simuler les transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;