import { useState } from 'react';

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const sendOrderConfirmation = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/emails/order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'email');
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur envoi email confirmation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOrderShipped = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/emails/order-shipped`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'email');
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur envoi email expédition:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOrderCancelled = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/emails/order-cancelled`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'email');
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur envoi email annulation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendOrderConfirmation,
    sendOrderShipped,
    sendOrderCancelled
  };
};