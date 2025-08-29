import 'dotenv/config';
import { testEmailConfig } from './src/utils/email';

async function runEmailTest() {
  console.log('🧪 Testing email configuration...\n');
  
  console.log('📧 SMTP Configuration:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`Secure: ${process.env.SMTP_SECURE}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`From: ${process.env.SMTP_FROM}`);
  console.log('');
  
  const isValid = await testEmailConfig();
  
  if (isValid) {
    console.log('✅ Email configuration is working correctly!');
    console.log('🚀 Password reset emails should work properly.');
  } else {
    console.log('❌ Email configuration failed!');
    console.log('💡 Please check your SMTP settings in .env file.');
  }
}

runEmailTest().catch(console.error);
