const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log incoming request with clean format
  const userAgent = req.get('User-Agent');
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: userAgent && userAgent.length > 50 ? userAgent.substring(0, 50) + '...' : userAgent
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Use appropriate log level based on status code
    const logLevel = statusCode >= 500 ? 'error' : 
                    statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel](`${req.method} ${req.url} ${statusCode}`, {
      duration: `${duration}ms`,
      ip: req.ip,
      size: chunk ? Buffer.byteLength(chunk, encoding) : 0
    });
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = requestLogger;

