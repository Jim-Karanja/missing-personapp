require('dotenv').config();
const redis = require('redis');

async function testRedisConnection() {
  console.log('🔄 Testing Redis/Valkey connection...');
  
  try {
    // Create Redis client
    const client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
      // No password needed for local development
    });

    // Connect to Redis
    await client.connect();
    console.log('✅ Connected to Redis/Valkey successfully!');

    // Test basic operations
    await client.set('test_key', 'Hello from Missing Persons System!');
    const value = await client.get('test_key');
    console.log('✅ Test write/read successful:', value);

    // Test with JSON data (like our application will use)
    const testData = {
      userId: '12345',
      sessionId: 'abc123',
      timestamp: new Date().toISOString()
    };
    
    await client.setEx('session:test', 3600, JSON.stringify(testData));
    const sessionData = await client.get('session:test');
    console.log('✅ Session data test:', JSON.parse(sessionData));

    // Clean up test data
    await client.del('test_key');
    await client.del('session:test');
    console.log('✅ Test cleanup completed');

    // Close connection
    await client.quit();
    console.log('\n🎉 Redis/Valkey is ready for the Missing Persons System!');
    console.log('📊 Connection details:');
    console.log(`   Host: ${process.env.REDIS_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.REDIS_PORT || 6379}`);
    console.log(`   Status: Connected and operational`);
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRedisConnection();

