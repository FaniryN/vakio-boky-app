import axios from 'axios';
import pool from '../config/db.js';

class PaymentService {
  constructor() {
    this.providers = {
      orange_money: {
        name: 'Orange Money',
        apiUrl: process.env.ORANGE_MONEY_API_URL,
        apiKey: process.env.ORANGE_MONEY_API_KEY,
        merchantId: process.env.ORANGE_MONEY_MERCHANT_ID,
        currency: 'MGA'
      },
      airtel_money: {
        name: 'Airtel Money',
        apiUrl: process.env.AIRTEL_MONEY_API_URL,
        apiKey: process.env.AIRTEL_MONEY_API_KEY,
        merchantId: process.env.AIRTEL_MONEY_MERCHANT_ID,
        currency: 'MGA'
      },
      mvola: {
        name: 'MVola',
        apiUrl: process.env.MVOLA_API_URL,
        consumerKey: process.env.MVOLA_CONSUMER_KEY,
        consumerSecret: process.env.MVOLA_CONSUMER_SECRET,
        merchantNumber: process.env.MVOLA_MERCHANT_NUMBER,
        currency: 'MGA'
      },
      stripe: {
        name: 'Stripe',
        apiKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        currency: 'usd'
      },
      paypal: {
        name: 'PayPal',
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE || 'sandbox',
        currency: 'USD'
      }
    };
  }

  /**
   * Initialize payment for an order
   */
  async initiatePayment(orderId, paymentMethod, amount, currency = 'MGA') {
    try {
      // Get order details
      const orderResult = await pool.query(
        `SELECT o.*, u.nom as user_name, u.email as user_email
         FROM orders o
         JOIN utilisateur u ON o.user_id = u.id
         WHERE o.id = $1`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult.rows[0];

      // Create payment record
      const paymentResult = await pool.query(
        `INSERT INTO payments (order_id, amount, payment_method, status, currency)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [orderId, amount, paymentMethod, 'pending', currency]
      );

      const payment = paymentResult.rows[0];

      // Process payment based on method
      const paymentData = await this.processPayment(paymentMethod, {
        amount,
        currency,
        orderId,
        paymentId: payment.id,
        customerName: order.user_name,
        customerEmail: order.user_email,
        description: `Payment for order #${orderId}`
      });

      // Update payment with provider data
      await pool.query(
        `UPDATE payments
         SET provider_payment_id = $1, provider_data = $2
         WHERE id = $3`,
        [paymentData.providerPaymentId, JSON.stringify(paymentData), payment.id]
      );

      return {
        success: true,
        paymentId: payment.id,
        paymentData
      };

    } catch (error) {
      console.error('Payment initiation error:', error);
      throw new Error(`Payment initiation failed: ${error.message}`);
    }
  }

  /**
   * Process payment with specific provider
   */
  async processPayment(method, paymentDetails) {
    switch (method) {
      case 'orange_money':
        return await this.processOrangeMoneyPayment(paymentDetails);
      case 'airtel_money':
        return await this.processAirtelMoneyPayment(paymentDetails);
      case 'mvola':
        return await this.processMVolaPayment(paymentDetails);
      case 'stripe':
        return await this.processStripePayment(paymentDetails);
      case 'paypal':
        return await this.processPayPalPayment(paymentDetails);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  /**
   * Process Orange Money payment
   */
  async processOrangeMoneyPayment(details) {
    try {
      const config = this.providers.orange_money;

      const payload = {
        merchantId: config.merchantId,
        amount: details.amount,
        currency: details.currency,
        orderId: details.orderId,
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        description: details.description,
        returnUrl: `${process.env.FRONTEND_URL}/payment/callback`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`
      };

      const response = await axios.post(`${config.apiUrl}/payments/initiate`, payload, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        providerPaymentId: response.data.paymentId,
        paymentUrl: response.data.paymentUrl,
        status: 'pending',
        provider: 'orange_money'
      };

    } catch (error) {
      console.error('Orange Money payment error:', error);
      throw new Error('Orange Money payment failed');
    }
  }

  /**
   * Process Airtel Money payment
   */
  async processAirtelMoneyPayment(details) {
    try {
      const config = this.providers.airtel_money;

      const payload = {
        merchantId: config.merchantId,
        amount: details.amount,
        currency: details.currency,
        orderId: details.orderId,
        customerName: details.customerName,
        description: details.description
      };

      const response = await axios.post(`${config.apiUrl}/payments/initiate`, payload, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        providerPaymentId: response.data.transactionId,
        paymentUrl: response.data.paymentUrl,
        status: 'pending',
        provider: 'airtel_money'
      };

    } catch (error) {
      console.error('Airtel Money payment error:', error);
      throw new Error('Airtel Money payment failed');
    }
  }

  /**
   * Process MVola payment
   */
  async processMVolaPayment(details) {
    try {
      const config = this.providers.mvola;

      // Get access token first
      const authResponse = await axios.post(`${config.apiUrl}/token`, {
        grant_type: 'client_credentials'
      }, {
        auth: {
          username: config.consumerKey,
          password: config.consumerSecret
        }
      });

      const accessToken = authResponse.data.access_token;

      const payload = {
        amount: details.amount,
        currency: details.currency,
        descriptionText: details.description,
        requestDate: new Date().toISOString(),
        debitParty: [{
          key: 'msisdn',
          value: details.customerPhone || '261340000000' // Default test number
        }],
        creditParty: [{
          key: 'msisdn',
          value: config.merchantNumber
        }],
        metadata: [{
          key: 'partnerName',
          value: 'Vakio Boky'
        }, {
          key: 'orderId',
          value: details.orderId
        }]
      };

      const response = await axios.post(`${config.apiUrl}/mvola/mm/transactions/type/merchantpay/1.0.0`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-CorrelationID': `VB-${Date.now()}`
        }
      });

      return {
        providerPaymentId: response.data.serverCorrelationId,
        status: 'pending',
        provider: 'mvola'
      };

    } catch (error) {
      console.error('MVola payment error:', error);
      throw new Error('MVola payment failed');
    }
  }

  /**
   * Process Stripe payment
   */
  async processStripePayment(details) {
    try {
      const config = this.providers.stripe;
      const stripe = require('stripe')(config.apiKey);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: details.currency.toLowerCase(),
            product_data: {
              name: details.description,
            },
            unit_amount: Math.round(details.amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          orderId: details.orderId,
          paymentId: details.paymentId
        }
      });

      return {
        providerPaymentId: session.id,
        paymentUrl: session.url,
        status: 'pending',
        provider: 'stripe'
      };

    } catch (error) {
      console.error('Stripe payment error:', error);
      throw new Error('Stripe payment failed');
    }
  }

  /**
   * Process PayPal payment
   */
  async processPayPalPayment(details) {
    try {
      const config = this.providers.paypal;

      // Get access token
      const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
      const tokenResponse = await axios.post(
        `https://api${config.mode === 'sandbox' ? '.sandbox' : ''}.paypal.com/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Create payment
      const paymentPayload = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          amount: {
            total: details.amount.toString(),
            currency: details.currency
          },
          description: details.description
        }],
        redirect_urls: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
        }
      };

      const response = await axios.post(
        `https://api${config.mode === 'sandbox' ? '.sandbox' : ''}.paypal.com/v1/payments/payment`,
        paymentPayload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const approvalUrl = response.data.links.find(link => link.rel === 'approval_url');

      return {
        providerPaymentId: response.data.id,
        paymentUrl: approvalUrl.href,
        status: 'pending',
        provider: 'paypal'
      };

    } catch (error) {
      console.error('PayPal payment error:', error);
      throw new Error('PayPal payment failed');
    }
  }

  /**
   * Handle payment callback/webhook
   */
  async handlePaymentCallback(provider, paymentData) {
    try {
      let paymentId, status, transactionId;

      switch (provider) {
        case 'stripe':
          paymentId = paymentData.metadata.paymentId;
          status = paymentData.payment_status === 'paid' ? 'completed' : 'failed';
          transactionId = paymentData.id;
          break;

        case 'paypal':
          // Extract payment ID from PayPal webhook data
          paymentId = paymentData.resource.id;
          status = paymentData.event_type === 'PAYMENT.CAPTURE.COMPLETED' ? 'completed' : 'failed';
          transactionId = paymentData.resource.id;
          break;

        case 'orange_money':
        case 'airtel_money':
        case 'mvola':
          // Handle mobile money callbacks
          paymentId = paymentData.paymentId;
          status = paymentData.status === 'SUCCESS' ? 'completed' : 'failed';
          transactionId = paymentData.transactionId;
          break;

        default:
          throw new Error('Unknown payment provider');
      }

      // Update payment status
      await pool.query(
        `UPDATE payments
         SET status = $1, transaction_id = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [status, transactionId, paymentId]
      );

      // If payment completed, update order status
      if (status === 'completed') {
        await pool.query(
          `UPDATE orders
           SET payment_status = 'paid', status = 'confirmed', updated_at = CURRENT_TIMESTAMP
           WHERE id = (SELECT order_id FROM payments WHERE id = $1)`,
          [paymentId]
        );
      }

      return { success: true, status };

    } catch (error) {
      console.error('Payment callback error:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      const result = await pool.query(
        'SELECT * FROM payments WHERE id = $1',
        [paymentId]
      );

      if (result.rows.length === 0) {
        throw new Error('Payment not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId, amount = null) {
    try {
      const payment = await this.getPaymentStatus(paymentId);

      if (payment.status !== 'completed') {
        throw new Error('Can only refund completed payments');
      }

      // Process refund based on provider
      const refundData = await this.processRefund(payment.payment_method, {
        providerPaymentId: payment.provider_payment_id,
        amount: amount || payment.amount,
        currency: payment.currency
      });

      // Update payment with refund info
      await pool.query(
        `UPDATE payments
         SET status = 'refunded', refund_id = $1, refund_amount = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [refundData.refundId, amount || payment.amount, paymentId]
      );

      return { success: true, refundData };

    } catch (error) {
      console.error('Refund error:', error);
      throw error;
    }
  }

  /**
   * Process refund with provider
   */
  async processRefund(method, refundDetails) {
    // Implementation for refunds would go here
    // This is a simplified version
    return {
      refundId: `refund_${Date.now()}`,
      status: 'completed'
    };
  }
}

export default new PaymentService();