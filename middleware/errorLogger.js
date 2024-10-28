const fs = require('fs');
const path = require('path');

const errorLogger = (err, req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} ${err.message}\n`;
  fs.appendFile(path.join(__dirname, '../logs/errors.log'), logMessage, (error) => {
    if (error) console.error('Error logging failed:', error);
  });
  res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorLogger;
