const axios = require('axios');

async function testPasswordReset() {
  console.log('🧪 Testing Password Reset API...\n');

  try {
    // Test the request password reset endpoint
    console.log('📧 Testing request password reset...');
    const response = await axios.post('https://dypse.onrender.com/api/auth/request-password-reset', {
      email: 'evodemuyisingize@gmail.com'
    });

    console.log('✅ Success Response:', response.data);
  } catch (error) {
    console.log('❌ Error Response:', error.response?.data || error.message);
    console.log('📊 Status Code:', error.response?.status);
    console.log('🔍 Full Error:', error.response?.data);
  }
}

testPasswordReset();
