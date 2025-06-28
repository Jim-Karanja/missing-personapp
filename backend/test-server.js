require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Missing Persons API is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Missing Persons Database API',
    version: '1.0.0',
    description: 'Centralized Missing Persons Database for Kenya',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      reports: '/api/reports',
      search: '/api/search',
      alerts: '/api/alerts'
    },
    features: [
      'User Authentication',
      'Missing Persons Reports',
      'Real-time Alerts',
      'GPS Location Services',
      'Kenya Police Integration',
      'DCI Integration',
      'M-Pesa Transaction Tracking',
      'Facial Recognition Ready'
    ]
  });
});

// Test endpoints without database
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: ['/health', '/api', '/api/test']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Missing Persons API Server`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`\n✅ Server is ready to accept connections!`);
});

module.exports = app;

