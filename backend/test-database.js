require('dotenv').config();
const knex = require('knex');

async function testDatabaseConnection() {
  console.log('🔄 Testing PostgreSQL database connection...');
  
  const dbConfig = {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'missing_persons',
      password: process.env.DB_PASSWORD || 'missing_persons_password_2024',
      database: process.env.DB_NAME || 'missing_persons_db',
    }
  };

  const db = knex(dbConfig);

  try {
    // Test basic connection
    await db.raw('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connected to PostgreSQL successfully!');

    // Get database info
    const result = await db.raw('SELECT current_database(), current_user, version()');
    const dbInfo = result.rows[0];
    
    console.log('✅ Database connection details:');
    console.log(`   Database: ${dbInfo.current_database}`);
    console.log(`   User: ${dbInfo.current_user}`);
    console.log(`   Version: ${dbInfo.version.split(',')[0]}`);

    // Test creating a simple table
    console.log('\n📊 Testing table operations...');
    
    await db.raw('DROP TABLE IF EXISTS connection_test');
    await db.raw(`
      CREATE TABLE connection_test (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Test table created successfully');

    // Insert test data
    await db.raw(`
      INSERT INTO connection_test (test_message) 
      VALUES ('Hello from Missing Persons Database System!')
    `);
    console.log('✅ Test data inserted successfully');

    // Query test data
    const testData = await db.raw('SELECT * FROM connection_test');
    console.log('✅ Test data retrieved:', testData.rows[0]);

    // Clean up
    await db.raw('DROP TABLE connection_test');
    console.log('✅ Test cleanup completed');

    console.log('\n🎉 PostgreSQL is ready for the Missing Persons System!');
    console.log('📊 Connection summary:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'missing_persons_db'}`);
    console.log(`   User: ${process.env.DB_USER || 'missing_persons'}`);
    console.log(`   Status: Connected and operational`);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the test
testDatabaseConnection();

