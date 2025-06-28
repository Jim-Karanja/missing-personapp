const redis = require('redis');
const logger = require('./logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
  password: redisConfig.password,
  database: redisConfig.db,
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis Connected Successfully');
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

// Cache utility functions
const cache = {
  get: async (key) => {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },
  
  set: async (key, value, expiry = 3600) => {
    try {
      await redisClient.setEx(key, expiry, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  },
  
  del: async (key) => {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  },
  
  exists: async (key) => {
    try {
      return await redisClient.exists(key);
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  },
  
  // For storing session data
  setSession: async (sessionId, sessionData, expiry = 86400) => {
    try {
      await redisClient.setEx(`session:${sessionId}`, expiry, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      logger.error('Session set error:', error);
      return false;
    }
  },
  
  getSession: async (sessionId) => {
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Session get error:', error);
      return null;
    }
  },
  
  // For rate limiting
  incrementCounter: async (key, expiry = 3600) => {
    try {
      const count = await redisClient.incr(key);
      if (count === 1) {
        await redisClient.expire(key, expiry);
      }
      return count;
    } catch (error) {
      logger.error('Counter increment error:', error);
      return 0;
    }
  }
};

module.exports = { redisClient, connectRedis, cache };

