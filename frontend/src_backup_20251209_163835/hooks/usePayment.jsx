// hooks/usePayment.js
import { useState } from 'react';

export const usePayment = () => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // Simuler un paiement
  const simulatePayment = async (paymentDetails) => {
    setPaymentLoading(true);
    setPaymentError(null);
    
    try {
      // Simulation avec délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulation réussie 90% du temps
      const success = Math.random() < 0.9;
      
      if (success) {
        const mockResponse = {
          success: true,
          paymentId: `MOCK_PAY_${Date.now()}`,
          transactionId: `${paymentDetails.paymentMethod?.toUpperCase() || 'PAY'}_TX_${Date.now()}`,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency || 'MGA',
          status: 'completed',
          provider: paymentDetails.paymentMethod,
          mock: true,
          message: 'Paiement simulé avec succès',
          timestamp: new Date().toISOString()
        };
        
        setPaymentData(mockResponse);
        return mockResponse;
      } else {
        throw new Error('Échec de la simulation de paiement (solde insuffisant)');
      }
    } catch (error) {
      const errorResponse = {
        success: false,
        error: error.message,
        status: 'failed',
        mock: true
      };
      
      setPaymentError(error.message);
      setPaymentData(errorResponse);
      throw error;
    } finally {
      setPaymentLoading(false);
    }
  };

  // Vérifier le statut d'un paiement (pour webhook simulation)
  const checkPaymentStatus = async (paymentId) => {
    // Simulation de vérification
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: paymentId,
          status: 'completed',
          amount: 1000,
          currency: 'MGA',
          mock: true
        });
      }, 1000);
    });
  };

  return {
    paymentLoading,
    paymentError,
    paymentData,
    simulatePayment,
    checkPaymentStatus
  };
};