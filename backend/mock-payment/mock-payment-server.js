// mock-payment-server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Simulation des opérateurs Malagasy
const MOCK_OPERATORS = {
  orange: {
    name: 'Orange Money Madagascar',
    merchantId: 'TEST_MERCHANT_123',
    status: 'active'
  },
  mvola: {
    name: 'MVola by Telma',
    merchantNumber: '03411111111',
    status: 'active'
  },
  airtel: {
    name: 'Airtel Money',
    merchantId: 'TEST_AIRTEL_456',
    status: 'active'
  }
};

// Simulation de comptes utilisateurs de test
const MOCK_USERS = [
  { phone: '03411111111', balance: 100000, pin: '1234', operator: 'orange' },
  { phone: '03322222222', balance: 50000, pin: '5678', operator: 'mvola' },
  { phone: '03233333333', balance: 75000, pin: '9012', operator: 'airtel' }
];

// Routes mock pour Orange Money
app.post('/api/orange-money/v1/payments/initiate', (req, res) => {
  console.log('[MOCK] Orange Money Payment Initiated:', req.body);
  
  const { amount, customerPhone, description } = req.body;
  
  const user = MOCK_USERS.find(u => u.phone === customerPhone);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: 'Numéro non enregistré chez Orange Money'
    });
  }
  
  if (user.balance < amount) {
    return res.status(400).json({
      success: false,
      error: 'Insufficient balance',
      message: 'Solde insuffisant'
    });
  }
  
  const paymentId = `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simuler délai réseau
  setTimeout(() => {
    res.json({
      success: true,
      paymentId,
      status: 'PENDING',
      message: 'Veuillez valider le paiement sur votre téléphone',
      validationUrl: `http://localhost:3002/api/orange-money/validate/${paymentId}`,
      expiresIn: 300 // 5 minutes
    });
  }, 1000);
});

app.post('/api/orange-money/v1/payments/validate', (req, res) => {
  const { paymentId, pin } = req.body;
  
  console.log('[MOCK] Orange Money Validation:', { paymentId, pin });
  
  // Simuler validation
  if (pin === '1234') {
    res.json({
      success: true,
      transactionId: `OM_TX_${Date.now()}`,
      status: 'SUCCESS',
      message: 'Paiement effectué avec succès',
      timestamp: new Date().toISOString(),
      amount: req.body.amount || 1000
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Invalid PIN',
      message: 'Code PIN incorrect'
    });
  }
});

// Routes mock pour MVola
app.post('/api/mvola/mm/transactions/type/merchantpay/1.0.0', (req, res) => {
  console.log('[MOCK] MVola Payment Initiated:', req.body);
  
  const { amount, debitParty } = req.body;
  const customerPhone = debitParty[0]?.value;
  
  const user = MOCK_USERS.find(u => u.phone === customerPhone && u.operator === 'mvola');
  
  if (!user) {
    return res.status(404).json({
      status: {
        code: '404',
        message: 'Abonné non trouvé'
      }
    });
  }
  
  const serverCorrelationId = `MV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    serverCorrelationId,
    status: 'pending',
    notificationMethod: 'callback',
    objectReference: req.body.metadata?.[0]?.value || 'VB_ORDER',
    link: {
      rel: 'status',
      href: `http://localhost:3002/api/mvola/status/${serverCorrelationId}`
    }
  });
});

app.get('/api/mvola/status/:correlationId', (req, res) => {
  const { correlationId } = req.params;
  
  // Simuler transaction réussie 80% du temps
  const success = Math.random() > 0.2;
  
  if (success) {
    res.json({
      transactionId: `MV_TX_${Date.now()}`,
      status: 'completed',
      amount: 1000,
      currency: 'MGA',
      timestamp: new Date().toISOString(),
      message: 'Transaction effectuée avec succès'
    });
  } else {
    res.json({
      status: 'failed',
      errorCode: 'INSUFFICIENT_BALANCE',
      message: 'Solde insuffisant'
    });
  }
});

// Route mock pour Airtel Money
app.post('/api/airtel-money/v1/payments/initiate', (req, res) => {
  console.log('[MOCK] Airtel Money Payment:', req.body);
  
  res.json({
    transactionId: `AM_TX_${Date.now()}`,
    paymentUrl: `http://localhost:3002/mock-airtel-payment/${Date.now()}`,
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 10 * 60000).toISOString()
  });
});

// Webhook de test
app.post('/api/webhook/payment', (req, res) => {
  console.log('[MOCK] Webhook Received:', req.body);
  
  // Simuler réception webhook
  const events = [
    'payment.completed',
    'payment.failed',
    'payment.pending'
  ];
  
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  
  res.json({
    received: true,
    event: randomEvent,
    timestamp: new Date().toISOString(),
    webhookId: `WH_${Date.now()}`
  });
});

// Interface de test administrateur
app.get('/admin/mock-payments', (req, res) => {
  res.json({
    operators: MOCK_OPERATORS,
    testUsers: MOCK_USERS.map(u => ({
      phone: u.phone,
      operator: u.operator,
      balance: u.balance
    })),
    endpoints: [
      { method: 'POST', path: '/api/orange-money/v1/payments/initiate', desc: 'Initier paiement Orange' },
      { method: 'POST', path: '/api/mvola/mm/transactions/type/merchantpay/1.0.0', desc: 'Initier paiement MVola' },
      { method: 'POST', path: '/api/airtel-money/v1/payments/initiate', desc: 'Initier paiement Airtel' }
    ]
  });
});

// Dashboard de simulation
app.get('/mock-dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vakio Boky - Mock Payment Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .card { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .success { background-color: #d4edda; }
        .pending { background-color: #fff3cd; }
        .failed { background-color: #f8d7da; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>📱 Mock Payment System - Vakio Boky</h1>
      
      <div class="card">
        <h3>Test Operators</h3>
        <ul>
          <li><strong>Orange Money:</strong> 03411111111 (PIN: 1234)</li>
          <li><strong>MVola:</strong> 03322222222</li>
          <li><strong>Airtel Money:</strong> 03233333333</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>Simulate Payment</h3>
        <button onclick="simulatePayment('orange')">Test Orange Money (1000 MGA)</button>
        <button onclick="simulatePayment('mvola')">Test MVola (2000 MGA)</button>
        <button onclick="simulatePayment('airtel')">Test Airtel Money (1500 MGA)</button>
      </div>
      
      <div id="result" class="card"></div>
      
      <script>
        async function simulatePayment(operator) {
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '<p>Processing...</p>';
          resultDiv.className = 'card pending';
          
          let url, payload;
          
          if (operator === 'orange') {
            url = '/api/orange-money/v1/payments/initiate';
            payload = {
              amount: 1000,
              customerPhone: '03411111111',
              description: 'Test payment for Vakio Boky',
              merchantId: 'TEST_MERCHANT_123'
            };
          } else if (operator === 'mvola') {
            url = '/api/mvola/mm/transactions/type/merchantpay/1.0.0';
            payload = {
              amount: 2000,
              currency: 'MGA',
              debitParty: [{ key: 'msisdn', value: '03322222222' }],
              creditParty: [{ key: 'msisdn', value: '03400000000' }],
              descriptionText: 'Test MVola payment'
            };
          } else {
            url = '/api/airtel-money/v1/payments/initiate';
            payload = {
              amount: 1500,
              customerPhone: '03233333333',
              merchantId: 'TEST_AIRTEL_456'
            };
          }
          
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            resultDiv.innerHTML = \`
              <h4>\${operator.toUpperCase()} Payment Result</h4>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
              <p><strong>Status:</strong> \${data.success !== false ? 'Initiated' : 'Failed'}</p>
            \`;
            
            resultDiv.className = data.success !== false ? 'card success' : 'card failed';
            
          } catch (error) {
            resultDiv.innerHTML = \`<p class="failed">Error: \${error.message}</p>\`;
            resultDiv.className = 'card failed';
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Mock Payment Server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/mock-dashboard`);
  console.log(`🔧 Admin info: http://localhost:${PORT}/admin/mock-payments`);
});