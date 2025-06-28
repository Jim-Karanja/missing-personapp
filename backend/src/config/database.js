const knex = require('knex');
const logger = require('./logger');
const knexfile = require('../../knexfile');

// Get the environment (default to development)
const environment = process.env.NODE_ENV || 'development';

// Use the configuration from knexfile
const dbConfig = knexfile[environment];

const db = knex(dbConfig);

const connectDB = async () => {
  try {
    await db.raw('SELECT 1');
    const dbType = dbConfig.client === 'sqlite3' ? 'SQLite' : 'PostgreSQL';
    logger.info(`${dbType} Connected`);
    return db;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = { db, connectDB };

