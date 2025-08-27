const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

async function testConnection() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/youthDb';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log('Available databases:');
    databases.databases.forEach(db => console.log(`- ${db.name}`));
    
    // Check if youthDb exists
    const youthDbExists = databases.databases.some(db => db.name === 'youthDb');
    console.log(`\n🔍 youthDb exists: ${youthDbExists ? '✅' : '❌'}`);
    
    if (youthDbExists) {
      const db = client.db('youthDb');
      const collections = await db.listCollections().toArray();
      console.log('\n📂 Collections in youthDb:');
      console.log(collections.map(c => `- ${c.name}`).join('\n') || 'No collections found');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('\nTroubleshooting tips:');
    console.log('1. Make sure MongoDB is running locally');
    console.log('2. Check if the connection string is correct:', uri);
    console.log('3. If using a remote MongoDB, ensure it\'s accessible');
  } finally {
    await client.close();
  }
}

testConnection();
