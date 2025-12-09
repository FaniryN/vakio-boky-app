#!/bin/bash
echo "🚀 Starting Vakio Boky Mock Payment System..."

# Load mock environment
export NODE_ENV=development
source .env.mock

# Start mock payment server
echo "📡 Starting Mock Payment Server..."
node mock-payment-server.js &

# Wait for server to start
sleep 2

echo ""
echo "✅ Mock System Ready!"
echo ""
echo "📊 Dashboard: http://localhost:3002/mock-dashboard"
echo "🔧 Admin: http://localhost:3002/admin/mock-payments"
echo ""
echo "📱 Test Numbers:"
echo "  - Orange Money: 03411111111 (PIN: 1234)"
echo "  - MVola: 03322222222"
echo "  - Airtel Money: 03233333333"
echo ""
echo "🛑 Press Ctrl+C to stop"
echo ""

# Keep script running
wait