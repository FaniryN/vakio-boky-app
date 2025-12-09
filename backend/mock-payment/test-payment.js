// test-payment.js
import MockPaymentService from './PaymentService.mock.js';

async function runTests() {
  console.log('🧪 Testing Vakio Boky Mock Payment System\n');
  
  // Test 1: Orange Money
  console.log('1. Testing Orange Money...');
  try {
    const result1 = await MockPaymentService.mockInitiatePayment(1500, 'orange_money');
    console.log('✅ Orange Money Result:', result1);
  } catch (error) {
    console.log('❌ Orange Money Error:', error.message);
  }
  
  // Test 2: MVola
  console.log('\n2. Testing MVola...');
  try {
    const result2 = await MockPaymentService.mockInitiatePayment(2000, 'mvola');
    console.log('✅ MVola Result:', result2);
  } catch (error) {
    console.log('❌ MVola Error:', error.message);
  }
  
  // Test 3: Airtel Money
  console.log('\n3. Testing Airtel Money...');
  try {
    const result3 = await MockPaymentService.mockInitiatePayment(1800, 'airtel_money');
    console.log('✅ Airtel Money Result:', result3);
  } catch (error) {
    console.log('❌ Airtel Money Error:', error.message);
  }
  
  console.log('\n✨ All tests completed!');
}

runTests();