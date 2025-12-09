// PaymentService.mock.js - Version adaptée pour le mock
import axios from 'axios';
import pool from '../config/db.js';

class MockPaymentService extends PaymentService {
  constructor() {
    super();
    
    // Override les URLs pour pointer vers le mock server
    this.providers.orange_money.apiUrl = process.env.MOCK_PAYMENT_SERVER_URL + '/api/orange-money/v1';
    this.providers.mvola.apiUrl = process.env.MOCK_PAYMENT_SERVER_URL + '/api/mvola';
    this.providers.airtel_money.apiUrl = process.env.MOCK_PAYMENT_SERVER_URL + '/api/airtel-money/v1';
    
    // Désactiver les appels réseau pour Stripe/PayPal en dev
    if (process.env.NODE_ENV === 'development') {
      this.providers.stripe.apiKey = 'sk_test_mock';
      this.providers.paypal.clientId = 'mock_paypal_client';
    }
  }

  // Override de la méthode MVola pour utiliser le mock
  async processMVolaPayment(details) {
    console.log('[MOCK] Processing MVola payment:', details);
    
    try {
      const payload = {
        amount: details.amount,
        currency: details.currency || 'MGA',
        descriptionText: details.description || 'Payment for Vakio Boky',
        debitParty: [{
          key: 'msisdn',
          value: details.customerPhone || '03322222222' // Numéro de test MVola
        }],
        creditParty: [{
          key: 'msisdn',
          value: this.providers.mvola.merchantNumber
        }],
        metadata: [{
          key: 'partnerName',
          value: 'Vakio Boky'
        }, {
          key: 'orderId',
          value: details.orderId
        }, {
          key: 'paymentId',
          value: details.paymentId
        }]
      };

      const response = await axios.post(
        `${this.providers.mvola.apiUrl}/mm/transactions/type/merchantpay/1.0.0`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CorrelationID': `VB-MOCK-${Date.now()}`
          }
        }
      );

      return {
        providerPaymentId: response.data.serverCorrelationId,
        status: 'pending',
        provider: 'mvola',
        mock: true,
        statusUrl: response.data.link?.href
      };

    } catch (error) {
      console.error('[MOCK] MVola payment simulation error:', error.message);
      
      // Fallback: simuler une réussite même en cas d'erreur pour le développement
      return {
        providerPaymentId: `MV_MOCK_${Date.now()}`,
        status: 'completed', // Directement completed en mode mock
        provider: 'mvola',
        mock: true,
        message: 'Payment simulated for development'
      };
    }
  }

  // Override pour Orange Money
  async processOrangeMoneyPayment(details) {
    console.log('[MOCK] Processing Orange Money payment:', details);
    
    try {
      const payload = {
        merchantId: this.providers.orange_money.merchantId,
        amount: details.amount,
        currency: details.currency || 'MGA',
        orderId: details.orderId,
        customerPhone: details.customerPhone || '03411111111',
        customerName: details.customerName || 'Test User',
        description: details.description || 'Vakio Boky Purchase'
      };

      const response = await axios.post(
        `${this.providers.orange_money.apiUrl}/payments/initiate`,
        payload
      );

      return {
        providerPaymentId: response.data.paymentId,
        paymentUrl: response.data.validationUrl,
        status: 'pending',
        provider: 'orange_money',
        mock: true
      };

    } catch (error) {
      console.error('[MOCK] Orange Money simulation error:', error.message);
      
      return {
        providerPaymentId: `OM_MOCK_${Date.now()}`,
        status: 'completed',
        provider: 'orange_money',
        mock: true
      };
    }
  }

  // Méthode utilitaire pour tester sans base de données
  async mockInitiatePayment(amount, method, phone = null) {
    const mockOrderId = `MOCK_ORDER_${Date.now()}`;
    const mockPaymentId = `MOCK_PAY_${Date.now()}`;
    
    const paymentData = {
      amount,
      currency: 'MGA',
      orderId: mockOrderId,
      paymentId: mockPaymentId,
      customerName: 'Test Client',
      customerEmail: 'test@vakioboky.mg',
      customerPhone: phone || this.getTestPhone(method),
      description: `Test payment ${amount} MGA via ${method}`
    };
    
    console.log(`[MOCK] Simulating ${method} payment of ${amount} MGA`);
    
    let result;
    switch (method) {
      case 'orange_money':
        result = await this.processOrangeMoneyPayment(paymentData);
        break;
      case 'mvola':
        result = await this.processMVolaPayment(paymentData);
        break;
      case 'airtel_money':
        result = await this.processAirtelMoneyPayment(paymentData);
        break;
      default:
        throw new Error('Unsupported method for mock');
    }
    
    // Simuler validation automatique après 2 secondes
    setTimeout(async () => {
      await this.mockCompletePayment(result.providerPaymentId, method);
    }, 2000);
    
    return {
      success: true,
      mock: true,
      orderId: mockOrderId,
      paymentId: mockPaymentId,
      paymentData: result
    };
  }
  
  getTestPhone(method) {
    const phones = {
      orange_money: '03411111111',
      mvola: '03322222222',
      airtel_money: '03233333333'
    };
    return phones[method] || '03400000000';
  }
  
  async mockCompletePayment(providerPaymentId, method) {
    console.log(`[MOCK] Completing payment ${providerPaymentId} via ${method}`);
    
    // Simuler callback de succès
    const callbackData = {
      paymentId: providerPaymentId,
      status: 'SUCCESS',
      transactionId: `${method.toUpperCase()}_TX_${Date.now()}`,
      amount: 1000,
      timestamp: new Date().toISOString()
    };
    
    return await this.handlePaymentCallback(method, callbackData);
  }
}

export default new MockPaymentService();